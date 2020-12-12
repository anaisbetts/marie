#!/bin/sh

set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/.."

pushd .
cd $ROOT/worker-env
files=$(ls *.js)
popd

mkdir -p "$ROOT/worker"
for f in $files
do
  $ROOT/node_modules/.bin/loose-envify "$ROOT/worker-env/$f" > "$ROOT/worker/$f"
done