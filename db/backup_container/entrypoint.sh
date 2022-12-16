#!/bin/bash

name=hammergen_$(date +%d_%m_%Y)
mongodump --archive="$name" --gzip --uri="$MONGODB_URI"
gcloud storage cp "$name" "gs://$BUCKET_NAME"