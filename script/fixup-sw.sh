#!/bin/sh

set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/.."

files=$(ls $ROOT/public/worker-*.js)

for f in $files
do
  $ROOT/node_modules/.bin/loose-envify "$f" > /tmp/envjs
  rm "$f"
  mv /tmp/envjs "$f"
done