#!/bin/sh
APPIUM_PID=`ps -ef | grep ".bin/appium" | grep -v grep | awk '{print $2}'`
[[ ! -z "${APPIUM_PID}" ]] && kill -9 $APPIUM_PID || echo 'Appium is not running.'