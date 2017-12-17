#!/usr/bin/env bash
set -xe

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "Not on PR, skipping docker push"
  exit 0
fi

docker login -u "$DOCKER_USER" -p "$DOCKER_PASS";
docker push prdog/prdog:latest;
