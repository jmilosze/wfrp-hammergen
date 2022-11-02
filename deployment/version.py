import argparse
from pathlib import Path

import git

SCRIPT_DIR = Path(__file__).parent.absolute()
ROOT_DIR = SCRIPT_DIR.parent.absolute()


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "version",
        choices=["major", "minor", "patch"],
        help="Allowed values: major, minor, patch.",
    )
    return parser.parse_args()


def parse_version(version: str) -> tuple[int, int, int]:
    ver = version.replace("v", "")
    numbers = ver.split(".")
    if len(numbers) != 3:
        raise Exception("invalid version tag")

    major = int(numbers[0])
    minor = int(numbers[1])
    patch = int(numbers[2])

    return major, minor, patch


def update_version(previous_version: str, version_type: str) -> str:
    prev = list(parse_version(previous_version))

    if version_type == "major":
        ver = [prev[0] + 1, 0, 0]
    elif version_type == "minor":
        ver = [prev[0], prev[1] + 1, 0]
    elif version_type == "patch":
        ver = [prev[0], prev[1], prev[2] + 1]
    else:
        raise Exception("invalid version type")

    return f"v{ver[0]}.{ver[1]}.{ver[2]}"


def new_tag(version_type: str):
    repo = git.Repo(ROOT_DIR)
    latest_commit = repo.heads["main"].commit

    if len(repo.tags) == 0:
        print("No tags found. Creating initial v0.0.0 tag.")
        tag = repo.create_tag("v0.0.0")
        repo.remote().push(tag.path)
        return

    latest_tag = repo.tags[-1]

    if latest_commit == latest_tag.commit:
        print("Latest commit is already tagged, no new tag added.")
        return

    new_version = update_version(latest_tag.name, version_type)
    print(f"Creating tag {new_version}")

    tag = repo.create_tag(new_version)
    repo.remote().push(tag.path)


if __name__ == "__main__":
    ARGS = parse_arguments()
    new_tag(ARGS.version)
