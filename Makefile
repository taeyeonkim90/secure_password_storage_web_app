build-dev:
	@echo "************ Restoring Dotnet Dependencies for development purpose************"
	cd ./app && dotnet restore

	@echo "************ Restoring NPM Dependencies ************"
	cd ./app && rm -f npm-shrinkwrap.json
	cd ./app && npm install

	@echo "************ Building Docker images ************"
	docker-compose -f docker-compose-dev.yml build

run-dev:
	@echo "************ Running Development Docker container ************"
	docker-compose -f docker-compose-dev.yml up

clean-dev:
	docker-compose -f docker-compose-dev.yml down



build-deploy:
	@echo "************ Building Docker images ************"
	docker-compose -f docker-compose-deploy.yml build

run-deploy:
	@echo "************ Running Production Docker container ************"
	docker-compose -f docker-compose-deploy-image.yml up

clean-deploy:
	docker-compose -f docker-compose-deploy.yml down



migrate-create-script:
	@echo "************ Restoring Dotnet Dependencies ************"
	cd ./app && dotnet restore

	@echo "************ Creating Migrations Scripts ************"
	cd ./app && dotnet ef migrations add $(name)

migrate-perform-migration-dev:
	export ASPNETCORE_ENVIRONMENT=Development

	@echo "************ Restoring Dotnet Dependencies ************"
	cd ./app && dotnet restore

	@echo "************ Executing Migrations Scripts ************"
	cd ./app && dotnet ef database update

migrate-perform-migration-deploy:
	@echo "************ Restoring Dotnet Dependencies ************"
	cd ./app && dotnet restore

	@echo "************ Executing Migrations Scripts ************"
	cd ./app && dotnet ef database update