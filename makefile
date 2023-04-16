
start:
	cd app && npm install
	cd api && npm install
	npx concurrently 'make start-db' 'make start-app' 'make start-api'

start-db:
	docker-compose up

start-api:
	sleep 4
	npm start --prefix './api'

start-app:
	npm start --prefix './app'
