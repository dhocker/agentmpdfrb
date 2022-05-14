#!/bin/zsh

while true; do
  npm run build-d
  echo
  echo Waiting...
  echo
  fswatch -o src | xargs -n1 -I{} npm run build-d
done
