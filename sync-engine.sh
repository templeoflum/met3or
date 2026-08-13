#!/bin/bash
# Resync the site's engine copy from the workbench.
#
# The engine is the only author of the mark (CANON.md), and the workbench
# copy is the original. engine.html here is a byte-identical duplicate —
# never hand-edit it. Change met3or_engine.html in the workbench, then run
# this, then commit.

set -euo pipefail
cd "$(dirname "$0")"

SRC="${1:-../met3or/met3or_engine.html}"

if [ ! -f "$SRC" ]; then
  echo "no engine at $SRC" >&2
  echo "usage: ./sync-engine.sh [path/to/met3or_engine.html]" >&2
  exit 1
fi

cp "$SRC" engine.html

a=$(md5 -q "$SRC")
b=$(md5 -q engine.html)
if [ "$a" = "$b" ]; then
  echo "engine synced · md5 $a"
else
  echo "MISMATCH — $a != $b" >&2
  exit 1
fi
