#!/usr/bin/env bash
set -xe

if [ "$TRAVIS_BRANCH" != "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo "Not on master branch, skipping latest release"
  exit 0
fi

docker login -u "$DOCKER_USER" -p "$DOCKER_PASS";
docker push prdog/prdog:latest;
