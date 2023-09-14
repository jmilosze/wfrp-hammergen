#!/bin/bash

filename=$2
mongorestore --uri="$1" --nsFrom="hammergen-go.*" --nsTo="test-go.*" --archive="$filename" --gzip
