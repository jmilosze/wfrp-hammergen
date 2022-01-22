import json
import shutil
import sys
from pathlib import Path
import os
import subprocess
import argparse

SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent.parent.absolute()
FRONTEND_DIR = ROOT_DIR / "services" / "web" / "frontend"
WEB_DIR = ROOT_DIR / "services" / "web"


def build_new_static(env):
    shutil.rmtree("dist", ignore_errors=True)

    if env == "prod":
        output = subprocess.run("npm run-script build_gcp_prod", shell=True, capture_output=True)
    else:
        output = subprocess.run("npm run-script build_gcp_staging", shell=True, capture_output=True)

    print(output.stdout.decode())
    print(output.stderr.decode())


def deploy_static(env):
    if "PYCHARM_HOSTED" in os.environ:
        del os.environ["PYCHARM_HOSTED"]

    output = subprocess.run(f"firebase deploy --only hosting:{env}", shell=True, capture_output=True)

    print(output.stdout.decode())
    print(output.stderr.decode())


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "env",
        choices=["prod", "staging"],
        help="Allowed values: prod, staging.",
    )
    parser.add_argument(
        "part",
        choices=["frontend", "api", "all"],
        help="Allowed values: frontend, api, all.",
    )
    return parser.parse_args()


def read_deployment_config(env):
    with open(SCRIPT_DIR / f"{env}" / f".config.json") as f:
        return json.loads(f.read())


def run_and_output(command):
    output = subprocess.run(command, shell=True, capture_output=True)
    print(output.stdout.decode())
    print(output.stderr.decode())


def docker_build_and_push(deploy_config):
    image_name = deploy_config["image_name"]
    ar_registry = deploy_config["ar_registry"]
    ar_prefix = deploy_config["project"] + "/" + deploy_config["ar_repository"]

    if "PYCHARM_HOSTED" in os.environ:
        del os.environ["PYCHARM_HOSTED"]

    run_and_output(f"gcloud auth configure-docker {ar_registry} --quiet")
    run_and_output(f"docker build -f Dockerfile_api_only -t {ar_registry}/{ar_prefix}/{image_name} .")
    run_and_output(f"docker push {ar_registry}/{ar_prefix}/{image_name}")


def deploy_to_cloud_run(deploy_config):
    service_name = deploy_config["service_name"]
    region = deploy_config["region"]
    project = deploy_config["project"]
    concurrency = deploy_config["concurrency"]

    image = "/".join(
        [deploy_config["ar_registry"], project, deploy_config["ar_repository"], deploy_config["image_name"]])

    env_vars = ",".join([f"{k}=\"{v}\"" for k, v in deploy_config["env_variables"].items()])

    command = f"gcloud run deploy {service_name} --region={region} --project={project} --image={image} " \
              f"--allow-unauthenticated --concurrency={concurrency} --set-env-vars={env_vars}"

    run_and_output(command)


if __name__ == "__main__":
    ARGS = parse_arguments()

    if ARGS.env == "prod":
        print("Are you sure you want to deploy to prod?")
        x = input()
        if x != "yes":
            sys.exit()

    DEPLOY_CONFIG = read_deployment_config(ARGS.env)

    if ARGS.part in ["frontend", "all"]:
        os.chdir(FRONTEND_DIR)
        build_new_static(ARGS.env)
        os.chdir(WEB_DIR)
        deploy_static(ARGS.env)

    if ARGS.part in ["api", "all"]:
        os.chdir(WEB_DIR)
        docker_build_and_push(DEPLOY_CONFIG)
        deploy_to_cloud_run(DEPLOY_CONFIG)
