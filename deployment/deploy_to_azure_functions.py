import json
import shutil
import sys
from pathlib import Path
import os
import subprocess
import mimetypes
import argparse

from azure.identity import DefaultAzureCredential, ClientSecretCredential
from azure.storage.blob import ContainerClient, ContentSettings
from msrestazure.azure_active_directory import ServicePrincipalCredentials
import requests

ROOT_DIR = Path(__file__).parent.parent.absolute()
FRONTEND_DIR = ROOT_DIR / "services" / "web" / "frontend"
WEB_DIR = ROOT_DIR / "services" / "web"


def auth():
    credentials = ServicePrincipalCredentials(
        os.environ["AZURE_CLIENT_ID"],
        os.environ["AZURE_CLIENT_SECRET"],
        resource="https://management.azure.com",
        tenant=os.environ["AZURE_TENANT_ID"],
    )
    credentials.set_token()

    return credentials.token["access_token"]


def upload_new_static(credentials, frontend_account_url):
    container_client = ContainerClient(frontend_account_url, "$web", credential=credentials)

    dist = Path() / "dist"
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


def clear_old_static(credentials, frontend_account_url):
    container_client = ContainerClient(frontend_account_url, "$web", credential=credentials)
    for blob in container_client.list_blobs():
        container_client.delete_blobs(blob)


def purge_cache(env):
    if env != "prod":
        return

    subscription = os.environ["AZURE_SUBSCRIPTION_ID"]
    resource_group = "HammergenStatic"
    profile = "HammergenCDN"
    endpoint = "hammergen"

    api_url = (
        f"https://management.azure.com/subscriptions/{subscription}/resourceGroups/"
        f"{resource_group}/providers/Microsoft.Cdn/profiles/{profile}/endpoints/{endpoint}/purge?api-version=2019-12-31"
    )

    headers = {"Authorization": f"Bearer {auth()}"}
    request_body = {"contentPaths": ["/*"]}

    result = requests.post(api_url, headers=headers, json=request_body)
    print(f"Result of cache purge: {result.status_code}")


def build_new_static(env):
    shutil.rmtree("dist", ignore_errors=True)

    if env == "prod":
        output = subprocess.run("npm run-script build_azure_prod", shell=True, capture_output=True)
    else:
        output = subprocess.run("npm run-script build_azure_staging", shell=True, capture_output=True)

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


def deploy_api(api_name, env):
    if "PYCHARM_HOSTED" in os.environ:
        del os.environ["PYCHARM_HOSTED"]

    output = subprocess.run(f"func azure functionapp publish {api_name} --python", shell=True, capture_output=True)

    print(output.stdout.decode())
    print(output.stderr.decode())


def read_deployment_secrets(env):
    with open(ROOT_DIR / f".deployment.{env}.json") as f:
        return json.loads(f.read())


if __name__ == "__main__":
    ARGS = parse_arguments()

    if ARGS.env == "prod":
        print("Are you sure you want to deploy to prod?")
        x = input()
        if x != "yes":
            sys.exit()

    ds = read_deployment_secrets(ARGS.env)

    if ARGS.part in ["frontend", "all"]:
        os.chdir(FRONTEND_DIR)
        build_new_static(ARGS.env)
        CREDENTIALS = ClientSecretCredential(ds["tenant_id"], ds["client_id"], ds["client_secret"])
        clear_old_static(CREDENTIALS, ds["frontend_account_url"])
        upload_new_static(CREDENTIALS, ds["frontend_account_url"])
        purge_cache(ARGS.env)
    if ARGS.part in ["api", "all"]:
        os.chdir(WEB_DIR)
        deploy_api(ds["api_name"], ARGS.env)