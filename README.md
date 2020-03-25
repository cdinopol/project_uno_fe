PROJECT UNO MOBILE APP
=====================

## Development Environment Setup

1. Install CocosCreator
	- Tested Version (2.1.1): [Google Drive](https://drive.google.com/open?id=1jdv1s011Emnh65BXGmqTyPUYOZib_SJY)
	- Latest Version (Experimental): [Official Website](https://www.cocos.com/en/creator)

2. Clone this repo

3. Run setup
	1. Copy env template to sh file
	```
	# on project root
	cd scripts/
	cp env.sh.template env.sh
	```
	2. Update variables
	```
	export GOOGLE_APP_ID="xxx"
	export FB_APP_ID="xxx"
	...
	```
	3. Run setup script
	```
	# on project root
	cd scripts
	./setup.sh
	```

4. Open project in CocosCreator


## Android Build Setup
*Full instruction: [Setup Native Development Environment Guide](https://docs.cocos.com/creator/manual/en/publish/setup-native-development.html)*

1. Install Java JDK *(for windows, restart may require after installation)*
	- Tested Version (SE 14): [Google Drive](https://drive.google.com/drive/u/0/folders/1plat00T7mJFdICstNt7g52FCWj1SkSl_)
	- Latest Version (Experimental): [Official Website](https://www.oracle.com/java/technologies/javase-downloads.html)

2. Install Python 2.7.x **(IMPORTANT: Don't download Python 3.x version)**
	- Tested Version (2.7.17): [Google Drive](https://drive.google.com/drive/u/0/folders/1wdtyn-azcibf05x5nUAaSzvyxJVMecta)
	- Latest Version (Experimental): [Official Website](https://www.python.org/downloads/)

3. Install C++ Compiling Environment
	1. **FOR WINDOWS**
		1. Install [Visual Studio 2017 Community Edition](https://visualstudio.microsoft.com/downloads/)
		2. Check the following:
		```
		Desktop development with C++
		Game development with C++
		```
	2. **FOR MAC**
		1. Install [Xcode](https://developer.apple.com/xcode/download/)

4. Install Android Studio
	- Tested Version (3.5.2): [Google Drive](https://drive.google.com/drive/u/0/folders/1ZJ_pZjwW44W81dtTXArxU7l1Ktdjb57D)
	- Latest Version (Experimental): [Official Website](http://www.android-studio.org/)

5. Setup SDK & NDK (Android Studio)
	1. Open SDK Manager: `Configure > SDK Manager`
	2. In the `SDK Platforms` tab, check the recommended api levels:
	```
	23(6.0) - optional
	26(8.0) - optional
	28(9.0) - recommended to use, tested
	29(10.0) - experimental
	```
	3. In the SDK Tools tab, check the following:
	```
	Android SDK Build-Tools - match the api level or select latest version
	Android SDK Platform-Tools 
	Android SDK Tools
	NDK / NDK (side-by-side) - recommended version is r17 - latest
	```
	4. Click Apply and OK (will download install about 4GB)
	5. Copy the Android SDK Location path

6. Configure path in original release environments
	1. Open Cocos Creator
	2. Open Settings: `CocosCreator -> Settings`
		- **Android SDK Root**, choose the `Android SDK Location`
		- **NDK Root**, choose the `ndk-bundle` (or `ndk`) folder in `Android SDK Location`
