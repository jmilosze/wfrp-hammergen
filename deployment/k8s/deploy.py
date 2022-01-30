import argparse
import base64
import json
import subprocess
from pathlib import Path

from jinja2 import Environment, FileSystemLoader
import docker

SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent.parent.absolute()
FRONTEND_DIR = ROOT_DIR / "src" / "frontend"
WEB_DIR = ROOT_DIR / "src"


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("env", choices=["prod", "staging"], help="Allowed values: prod, staging.")
    parser.add_argument("--build", help="Build docker image.", action="store_true")
    return parser.parse_args()


def read_deployment_config(env):
    with open(SCRIPT_DIR / env / f"config.json") as f:
        return json.loads(f.read(), parse_int=str, parse_float=str, parse_constant=str)


def create_secrets(env, web_env_variables):
    hydrate_template("secrets.yaml", env, web_env_variables)


def hydrate_template(name, env, values=None):
    if values is None:
        values = {}
    values["ENV"] = env

    jinja_env = Environment(loader=FileSystemLoader("templates"), trim_blocks=True, lstrip_blocks=True)
    template = jinja_env.get_template(name)

    with open(SCRIPT_DIR / env / name, "w") as f:
        f.write(template.render(values))


def encode64(x):
    return {k: base64.b64encode(v.encode()).decode() for k, v in x.items()}


def build_image(image_full_path):
    client = docker.from_env()
    _, logs = client.images.build(
        path=str(WEB_DIR),
        tag=image_full_path,
        dockerfile="Dockerfile"
    )

    for log in logs:
        for k, v in log.items():
            print(v, end="") if k == "stream" else print(v)


def push_image(image_full_path):
    run_and_output(f"docker push {image_full_path}")


def run_and_output(command):
    output = subprocess.run(command, shell=True, capture_output=True)
    print(output.stdout.decode())
    print(output.stderr.decode())


def apply(yaml_file):
    run_and_output(f"kubectl apply -f {yaml_file}")


if __name__ == "__main__":
    ARGS = parse_arguments()

    DEPLOY_CONFIG = read_deployment_config(ARGS.env)

    if ARGS.build:
        build_image(DEPLOY_CONFIG["image_full_path"])
        push_image(DEPLOY_CONFIG["image_full_path"])

    hydrate_template("namespace.yaml", ARGS.env)
    hydrate_template("configmap.yaml", ARGS.env, DEPLOY_CONFIG["web_env_vars"])
    hydrate_template("secret.yaml", ARGS.env, encode64(DEPLOY_CONFIG["web_env_vars"]))
    hydrate_template("deployment.yaml", ARGS.env, {"IMAGE_FULL_PATH": DEPLOY_CONFIG["image_full_path"]})
    hydrate_template("service.yaml", ARGS.env)
    hydrate_template("ingress.yaml", ARGS.env)

    apply(SCRIPT_DIR / ARGS.env / "namespace.yaml")
    apply(SCRIPT_DIR / ARGS.env / "configmap.yaml")
    apply(SCRIPT_DIR / ARGS.env / "secret.yaml")
    apply(SCRIPT_DIR / ARGS.env / "deployment.yaml")
    apply(SCRIPT_DIR / ARGS.env / "service.yaml")
    apply(SCRIPT_DIR / ARGS.env / "ingress.yaml")
