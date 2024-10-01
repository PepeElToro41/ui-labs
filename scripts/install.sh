#!/bin/sh

set -e

PATCHES=WallyPatches

wally install


if [ -d "$PATCHES" ] && [ "$(ls -A "$PATCHES")" ]; then
   wally-patch-package
fi


rojo sourcemap serve.project.json -o sourcemap.json
wally-package-types --sourcemap sourcemap.json Packages/
