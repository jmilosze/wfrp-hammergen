#!/bin/bash

name=hammergen_$(date +%d_%m_%Y)
mongodump --archive=$name --gzip --uri="$1"
