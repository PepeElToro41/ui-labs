#!/bin/sh

set -e

SERVE_DIR=serve
DARKLUA_CONFIG=.darklua.json
SOURCEMAP=darklua-sourcemap.json
PACKAGES=Packages

# Installing packages
if [ ! -d $PACKAGES ]; then
   sh scripts/install.sh
fi

rm -f $SOURCEMAP
rm -rf $SERVE_DIR
mkdir -p $SERVE_DIR

cp build.project.json $SERVE_DIR/build.project.json
cp serve.project.json $SERVE_DIR/serve.project.json

cp -r src $SERVE_DIR/src
cp -rL $PACKAGES $SERVE_DIR/$PACKAGES

rojo sourcemap serve.project.json -o $SOURCEMAP

rojo sourcemap --watch serve.project.json -o $SOURCEMAP &
darklua process -w --config $DARKLUA_CONFIG src $SERVE_DIR/src &

rojo serve $SERVE_DIR/serve.project.json