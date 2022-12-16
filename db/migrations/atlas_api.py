import argparse
import json

import requests
from requests.auth import HTTPDigestAuth

PROJECT_ID = '5c3a00fc55385501d1df9fad'
BASE_URL = 'https://cloud.mongodb.com/api/atlas/v1.0'
URL = f'/groups/{PROJECT_ID}/whitelist'


def parse_input():
    parser = argparse.ArgumentParser()
    parser.add_argument('public_key', help="API private key")
    parser.add_argument('private_key', help="API private key")
    parser.add_argument('ip_list', help="API private key")
    return parser.parse_args()


def main(ip_list_file, public_key, private_key):
    with open(ip_list_file, 'rt') as file:
        file_data = json.loads(file.read())
    post_data = [{"ipAddress": x, 'comment': file_data['comment']} for x in file_data['ip_list']]
    resp = requests.post(BASE_URL + URL, auth=HTTPDigestAuth(public_key, private_key), json=post_data)
    # ret = requests.get(BASE_URL + URL, auth=HTTPDigestAuth(public_key, private_key))
    return resp.content.decode()


if __name__ == '__main__':
    ARGS = parse_input()
    http_ret = main(ARGS.ip_list, ARGS.public_key, ARGS.private_key)
    http_ret_json = json.loads(http_ret)
    print(json.dumps(http_ret_json, indent=2, sort_keys=True))
