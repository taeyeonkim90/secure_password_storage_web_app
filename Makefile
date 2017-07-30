build:
	docker-compose -f docker-compose-dev.yml build
	cd ./app && dotnet restore && npm install

run:
	docker-compose -f docker-compose-dev.yml up

clean:
	docker-compose -f docker-compose-dev.yml down