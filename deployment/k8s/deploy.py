import argparse
import base64
import json
from pathlib import Path

from jinja2 import Environment, FileSystemLoader
import docker

SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent.parent.absolute()
FRONTEND_DIR = ROOT_DIR / "services" / "web" / "frontend"
WEB_DIR = ROOT_DIR / "services" / "web"


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


def build_image():
    client = docker.from_env()
    _, logs = client.images.build(
        path=str(WEB_DIR),
        tag="hammergen",
        dockerfile="Dockerfile"
    )

    for log in logs:
        for k, v in log.items():
            print(v, end="") if k == "stream" else print(v)


if __name__ == "__main__":
    ARGS = parse_arguments()

    if ARGS.build:
        build_image()

    DEPLOY_CONFIG = read_deployment_config(ARGS.env)

    hydrate_template("namespace.yaml", ARGS.env)
    hydrate_template("configmap.yaml", ARGS.env, DEPLOY_CONFIG["web_env_vars"])
    hydrate_template("secret.yaml", ARGS.env, encode64(DEPLOY_CONFIG["web_env_vars"]))
    hydrate_template("deployment.yaml", ARGS.env)
