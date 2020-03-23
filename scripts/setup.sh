#!/bin/sh

source env.sh

#copy files and replace variables
sed "s/__GOOGLE_APP_ID__/$GOOGLE_APP_ID/g; s/__FB_APP_ID__/$FB_APP_ID/g" templates/strings.xml > \
../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/res/values/strings.xml

sed "s/__FB_APP_ID__/$FB_APP_ID/g" templates/AndroidManifest.xml > \
../build/jsb-link/frameworks/runtime-src/proj.android-studio/app/AndroidManifest.xml

sed "s/__XXTEA_KEY__/$XXTEA_KEY/g" builder.json > \
../settings/builder.json