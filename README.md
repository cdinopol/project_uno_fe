PROJECT UNO MOBILE APP
=====================

## Dev Environment Setup

1. Install CocosCreator
	- Initial Version (2.1.1): [Google Drive](https://drive.google.com/open?id=1jdv1s011Emnh65BXGmqTyPUYOZib_SJY)
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
	export XXTEA_KEY="xxx"
	...
	```
	3. Run setup script
	```
	# on project root
	cd scripts
	./setup.sh
	```
4. Open project in CocosCreator
5. Build