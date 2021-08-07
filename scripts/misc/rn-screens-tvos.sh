#!/bin/bash

## React Native Screens doesn't list tvos as a supported platform, although it does support tvOS.
## This PR has been raised to fix the podspec file: https://github.com/kmagiera/react-native-screens/pull/83
## We need this hack to continue building on tvOS with RN 0.60+ in the mean time.
## TODO: Remove this once the above PR has been merged.
sed -i -- s'/s.platform\(.*\)=\(.*\)/s.platforms    =  { :ios => "7.0", :tvos => "9.0" }/' node_modules/react-native-screens/RNScreens.podspec
sed -i -- s'/s.platform\(.*\)=\(.*\)/s.platforms    =  { :ios => "9.0", :tvos => "9.0" }/' node_modules/react-native-reanimated/RNReanimated.podspec
sed -i -- s'/s.platform\(.*\)=\(.*\)/s.platforms    =  { :ios => "7.0", :tvos => "9.0" }/' node_modules/react-native-orientation-locker/react-native-orientation-locker.podspec
