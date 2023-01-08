#!/bin/bash

filename=$2
mongorestore --uri="$1" --nsFrom="hammergen.*" --nsTo="test.*" --archive="$filename" --gzip
