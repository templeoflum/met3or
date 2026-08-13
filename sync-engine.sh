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
if [ "$a" != "$b" ]; then
  echo "MISMATCH — $a != $b" >&2
  exit 1
fi

# Bust the iframe cache. Pages serves everything with cache-control:max-age=600,
# and reloading the parent page does NOT re-fetch a cached iframe source — so an
# engine change can sit invisible for ten minutes. Stamping the content hash into
# the src makes each new engine a new URL, which the browser must fetch.
short=$(printf '%s' "$a" | cut -c1-8)
perl -pi -e "s|src=\"engine\.html(\?v=[0-9a-f]+)?\"|src=\"engine.html?v=$short\"|" index.html

echo "engine synced · md5 $a · cache tag ?v=$short"
