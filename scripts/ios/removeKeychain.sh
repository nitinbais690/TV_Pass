#!/bin/bash

set -e
cur_dir=`dirname $0`

echo "Delete ios-build keychain"
# Create a custom keychain
security delete-keychain ios-build.keychain || true