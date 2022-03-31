#!/bin/zsh

while true; do
  echo
  echo Waiting...
  echo
  fswatch -o src | xargs -n1 -I{} npm run build-d
done
