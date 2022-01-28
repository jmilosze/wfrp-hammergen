import argparse
import json
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent.parent.absolute()
FRONTEND_DIR = ROOT_DIR / "services" / "web" / "frontend"
WEB_DIR = ROOT_DIR / "services" / "web"


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "env",
        choices=["prod", "staging"],
        help="Allowed values: prod, staging.",
    )
    return parser.parse_args()


def read_deployment_config(env):
    with open(SCRIPT_DIR / env / f"config.json") as f:
        return json.loads(f.read())


def create_secrets(env, web_env_variables):
    hydrate_template("secrets.yaml", env, web_env_variables)


def hydrate_template(name, env, values):
    jinja_env = Environment(loader=FileSystemLoader("templates"), trim_blocks=True, lstrip_blocks=True)
    template = jinja_env.get_template(name)

    with open(SCRIPT_DIR / env / name, "w") as f:
        f.write(template.render(values))


if __name__ == "__main__":
    ARGS = parse_arguments()
    DEPLOY_CONFIG = read_deployment_config(ARGS.env)
    # create secrets yaml
    hydrate_template("secrets.yaml", ARGS.env, DEPLOY_CONFIG["web_env_variables"])
