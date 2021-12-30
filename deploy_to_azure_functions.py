import sys
from pathlib import Path
import os
import subprocess
import mimetypes
import argparse

from azure.identity import DefaultAzureCredential
from azure.storage.blob import ContainerClient, ContentSettings
from msrestazure.azure_active_directory import ServicePrincipalCredentials
import requests

FRONTEND_DIR = Path(__file__).parent / "services" / "web" / "frontend"
WEB_DIR = Path(__file__).parent / "services" / "web"


def auth():
    credentials = ServicePrincipalCredentials(
        os.environ["AZURE_CLIENT_ID"],
        os.environ["AZURE_CLIENT_SECRET"],
        resource="https://management.azure.com",
        tenant=os.environ["AZURE_TENANT_ID"],
    )
    credentials.set_token()

    return credentials.token["access_token"]


def upload_new_static():
    dist = Path() / "dist"

    container_client = ContainerClient(os.environ["FRONTEND_BLOB_URL"], "$web", credential=DefaultAzureCredential())

    for obj in dist.glob("**/*"):
        if obj.is_file():
            print(f"Uploading {str(obj.relative_to(dist))}")
            mime_type = mimetypes.guess_type(obj)[0]
            with open(obj.absolute(), "rb") as f:
                container_client.upload_blob(
                    str(obj.relative_to(dist)),
                    f,
                    content_settings=ContentSettings(content_type=mime_type),
                )


def clear_old_static():
    container_client = ContainerClient(os.environ["FRONTEND_BLOB_URL"], "$web", credential=DefaultAzureCredential())
    blob_list = [b.name for b in list(container_client.list_blobs())]
    container_client.delete_blobs(*blob_list)


def purge_cache(auth_token):
    subscription = os.environ["AZURE_SUBSCRIPTION_ID"]
    resource_group = "HammergenStatic"
    profile = "HammergenCDN"
    endpoint = "hammergen"

    api_url = (
        f"https://management.azure.com/subscriptions/{subscription}/resourceGroups/"
        f"{resource_group}/providers/Microsoft.Cdn/profiles/{profile}/endpoints/{endpoint}/purge?api-version=2019-12-31"
    )

    headers = {"Authorization": f"Bearer {auth_token}"}
    request_body = {"contentPaths": ["/*"]}

    result = requests.post(api_url, headers=headers, json=request_body)
    print(f"Result of cache purge: {result.status_code}")


def build_new_static():
    output = subprocess.run("npm run-script build_azure", shell=True, capture_output=True)

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


def deploy_api(env):
    if "PYCHARM_HOSTED" in os.environ:
        del os.environ["PYCHARM_HOSTED"]

    if env == "prod":
        app = "hammergenapi"
    elif env == "staging":
        app = "hammergenstaging"
    else:
        raise Exception(f"invalid environment {env}")
    output = subprocess.run(f"func azure functionapp publish {app} --python", shell=True, capture_output=True)

    print(output.stdout.decode())
    print(output.stderr.decode())


if __name__ == "__main__":
    ARGS = parse_arguments()

    if ARGS.env == "prod":
        print("Are you sure you want to deploy to prod?")
        x = input()
        if x != "yes":
            sys.exit()

    AUTH_TOKEN = auth()
    if ARGS.part in ["frontend", "all"]:
        if ARGS.env == "prod":
            os.chdir(FRONTEND_DIR)
            build_new_static()
            clear_old_static()
            upload_new_static()
            purge_cache(AUTH_TOKEN)
    if ARGS.part in ["api", "all"]:
        os.chdir(WEB_DIR)
        deploy_api(ARGS.env)
