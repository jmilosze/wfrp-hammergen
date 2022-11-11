#!/bin/bash

mongodump --archive=hammergen --gzip --uri="$1"
