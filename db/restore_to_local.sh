#!/bin/bash

filename=$1
mongorestore --uri="mongodb://admin:admin@localhost:27017" --nsFrom="hammergen-go.*" --nsTo="hammergenGo.*" --archive="$filename" --gzip
