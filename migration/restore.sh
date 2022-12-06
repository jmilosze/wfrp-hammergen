#!/bin/bash

name=hammergen_$(date +%d_%m_%Y)
mongorestore --uri="$1" --nsFrom="hammergen.*" --nsTo="test.*" --archive="$name" --gzip
