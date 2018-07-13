#!/bin/bash

realpath() {
  [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

ROOT_PATH=$(realpath $(dirname $0))
docker run --rm -p 5040:80 -v $ROOT_PATH:/www fnichol/uhttpd
