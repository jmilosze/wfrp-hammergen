import shutil
import sys
from pathlib import Path
import os
import subprocess
import argparse

ROOT_DIR = Path(__file__).parent.absolute()
TOP_DIR = ROOT_DIR.parent.parent.absolute()
FRONTEND_DIR = TOP_DIR / "services" / "web" / "frontend"
WEB_DIR = TOP_DIR / "services" / "web"


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


if __name__ == "__main__":
    ARGS = parse_arguments()

    if ARGS.env == "prod":
        print("Are you sure you want to deploy to prod?")
        x = input()
        if x != "yes":
            sys.exit()

    if ARGS.part in ["frontend", "all"]:
        os.chdir(FRONTEND_DIR)
        build_new_static(ARGS.env)
        os.chdir(WEB_DIR)
        deploy_static(ARGS.env)

    if ARGS.part in ["api", "all"]:
        pass
