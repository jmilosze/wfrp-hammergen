import argparse
import subprocess
from pathlib import Path

import docker

SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent.parent.absolute()
FRONTEND_DIR = ROOT_DIR / "src" / "frontend"
WEB_DIR = ROOT_DIR / "src"

API_IMAGE_FULL_PATH = "dirac1234/hammergen"
DIST_IMAGE_FULL_PATH = "dirac1234/hammergen_dist"


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("env", choices=["prod", "staging"], help="Allowed values: prod, staging.")
    return parser.parse_args()


def build_image(image_full_path, dockerfile, buildargs=None):
    if not buildargs:
        buildargs = {}
    client = docker.from_env()
    _, logs = client.images.build(
        path=str(WEB_DIR),
        tag=image_full_path,
        dockerfile=dockerfile,
        buildargs=buildargs
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

    build_image(API_IMAGE_FULL_PATH, "Dockerfile")
    # push_image(API_IMAGE_FULL_PATH)

    if ARGS.env == "prod":
        buildargs = {"build": "build_container_prod"}
    else:
        buildargs = {"build": "build_container_staging"}
    build_image(DIST_IMAGE_FULL_PATH, "Dockerfile_build_dist", buildargs)
    # push_image(DIST_IMAGE_FULL_PATH)
