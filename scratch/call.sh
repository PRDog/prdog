#! /bin/bash 

curl -XPOST -H 'Content-Type: application/json' --data @$1 "localhost:3000/pull_request"
