build:
	@echo "************ Restoring Dotnet Dependencies ************"
	cd ./app && dotnet restore

	@echo "************ Creating Migrations Scripts ************"
	rm -rf ./app/Migrations
	cd ./app && dotnet ef migrations add DBMigration

	@echo "************ Restoring NPM Dependencies ************"
	cd ./app && rm -f npm-shrinkwrap.json
	cd ./app && npm install

	@echo "************ Building Docker images ************"
	docker-compose -f docker-compose-dev.yml build

run:
	docker-compose -f docker-compose-dev.yml up

clean:
	docker-compose -f docker-compose-dev.yml down