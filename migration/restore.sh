#!/bin/bash

mongorestore --archive=hammergen --gzip --uri="$1"
