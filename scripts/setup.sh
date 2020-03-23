#!/bin/sh

source env.sh

#copy files and replace variables
cd $ROOT_DIR/build/jsb-link/frameworks/runtime-src/proj.android-studio/app/res/values && 
sed "s/__GOOGLE_APP_ID__/$GOOGLE_APP_ID/g; s/__FB_APP_ID__/$FB_APP_ID/g" strings.xml.template > strings.xml

cd $ROOT_DIR/build/jsb-link/frameworks/runtime-src/proj.android-studio/app &&
sed "s/__FB_APP_ID__/$FB_APP_ID/g" AndroidManifest.xml.template > AndroidManifest.xml

cd $ROOT_DIR/settings &&
sed "s/__XXTEA_KEY__/$XXTEA_KEY/g" builder.json.template > builder.json