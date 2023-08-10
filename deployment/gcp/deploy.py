import json
import shutil
import sys
from pathlib import Path
import os
import subprocess
import argparse

SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent.parent.absolute()
FRONTEND_DIR = ROOT_DIR / "src" / "frontend"
SRC_DIR = ROOT_DIR / "src"
CONFIG_JSON = "config.json"


def build_new_static(env):
    shutil.rmtree("dist", ignore_errors=True)
    os.mkdir("dist")

    if env == "production":
        build = "build_gcp_prod"
    else:
        build = "build_gcp_staging"

    build_command = f"docker build -t build_dist -f Dockerfile_build_dist --build-arg build={build} ."
    run_command = "docker run -v ./dist:/dist -u $(id -u ${USER}):$(id -g ${USER}) build_dist"
    delete_command = "docker rmi -f build_dist"

    output = subprocess.run(build_command + " && " + run_command + " && " + delete_command, shell=True, capture_output=True)

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
        choices=["production", "staging"],
        help="Allowed values: production, staging.",
    )
    parser.add_argument(
        "part",
        choices=["frontend", "api", "all"],
        help="Allowed values: frontend, api, all.",
    )
    return parser.parse_args()


def read_deployment_config(env):
    with open(SCRIPT_DIR / f"{env}" / CONFIG_JSON) as f:
        return json.loads(f.read())


def run_and_output(command):
    output = subprocess.run(command, shell=True, capture_output=True)
    print(output.stdout.decode())
    print(output.stderr.decode())
    if output.returncode != 0:
        raise subprocess.CalledProcessError(returncode=output.returncode, cmd=output.args, stderr=output.stderr)


def docker_build_and_push(env, deploy_config):
    image_name = deploy_config["image_name"]
    ar_registry = deploy_config["ar_registry"]
    ar_prefix = deploy_config["project"] + "/" + deploy_config["ar_repository"]

    if "PYCHARM_HOSTED" in os.environ:
        del os.environ["PYCHARM_HOSTED"]

    run_and_output(f"gcloud auth configure-docker {ar_registry} --quiet")
    run_and_output(f"docker build -f Dockerfile -t {ar_registry}/{ar_prefix}/{image_name}:{env} .")
    run_and_output(f"docker push {ar_registry}/{ar_prefix}/{image_name}:{env}")


def deploy_to_cloud_run(env, deploy_config):
    service_name = deploy_config["service_name"]
    region = deploy_config["region"]
    project = deploy_config["project"]
    concurrency = deploy_config["concurrency"]

    image = "/".join(
        [deploy_config["ar_registry"], project, deploy_config["ar_repository"], deploy_config["image_name"]]
    )

    env_vars = ",".join([f'{k}="{v}"' for k, v in deploy_config["env_variables"].items()])

    command = (
        f"gcloud run deploy {service_name} --region={region} --project={project} --image={image}:{env} "
        f"--allow-unauthenticated --concurrency={concurrency} --set-env-vars={env_vars}"
    )

    run_and_output(command)


if __name__ == "__main__":
    ARGS = parse_arguments()

    if ARGS.env == "production":
        print("Are you sure you want to deploy to production?")
        x = input()
        if x != "yes":
            sys.exit()

    DEPLOY_CONFIG = read_deployment_config(ARGS.env)

    if ARGS.part in ["api", "all"]:
        os.chdir(SRC_DIR)
        docker_build_and_push(ARGS.env, DEPLOY_CONFIG)
        deploy_to_cloud_run(ARGS.env, DEPLOY_CONFIG)

    if ARGS.part in ["frontend", "all"]:
        os.chdir(SRC_DIR)
        build_new_static(ARGS.env)
        deploy_static(ARGS.env)
