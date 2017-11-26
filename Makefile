clean:
	rm -Rf node_modules/


install:
	clear
	npm install


build:
	clear
	node scripts/build

serve:
	make build
	http-server