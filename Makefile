build:
	cd ./app && dotnet restore
	cd ./app && npm install
	docker-compose -f docker-compose-dev.yml build

run:
	docker-compose -f docker-compose-dev.yml up

clean:
	docker-compose -f docker-compose-dev.yml down