#!/bin/bash

set -e
cur_dir=`dirname $0`

# workaround: https://github.com/fastlane/fastlane/issues/5649
ln -s ~/Library/Keychains/ios-build.keychain-db ~/Library/Keychains/ios-build.keychain || true

#Check if ios-build keychain exists
export keychainCount=`security list-keychains | grep -E 'ios-build' -c`

if [ $keychainCount == 0 ] ; then
 echo "Create ios-build keychain"
 # Create a custom keychain
 security create-keychain -p "ios-build-password" ios-build.keychain || true
fi
# Add it to the list
security list-keychains -d user -s ios-build.keychain

echo "Making the ios-build keychain default, so xcodebuild will use it for signing"
security default-keychain -s ios-build.keychain

echo "Unlocking the ios-build keychain"
security unlock-keychain -p "ios-build-password" ios-build.keychain

# Set keychain timeout to 1 hour for long builds
# see http://www.egeek.me/2013/02/23/jenkins-and-xcode-user-interaction-is-not-allowed/
security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

echo "Importing $IOS_CERTIFICATE to keychain"
security import $cur_dir/certs/$IOS_CERTIFICATE -k ~/Library/Keychains/ios-build.keychain -P $IOS_CERTIFICATE_KEY -T "/usr/bin/codesign" -A

#Mac OS Sierra https://stackoverflow.com/questions/39868578/security-codesign-in-sierra-keychain-ignores-access-control-settings-and-ui-p
security set-key-partition-list -S apple-tool:,apple: -s -k "ios-build-password" ios-build.keychain

# Put the provisioning profile in place
echo "Copying $IOS_PROVISION_PROFILE in place"
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp "$cur_dir/profile/$IOS_PROVISION_PROFILE" ~/Library/MobileDevice/Provisioning\ Profiles/