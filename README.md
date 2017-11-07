# Guardmykey


## Summary
This project is to develop a web application to allow users to store their passwords in a secure manner. All user password data are encrypted/decrypted with the user's login password. Since encryption/decryption happens on the client's side, developers do not have the access to the users' raw data. The web application is currently hosted on AWS at the central Canada region.


## Development Requirements
* Docker
* Docker-compose
* Visual Studio Code or Visual Studio
* ASP.net core v1.1
* Node


## Running Development Environment
1. `make build-dev`
    * This will download all ASP.net requirements, and React requirements to your local directory.
    * This is only to link all dependencies in Visual Studio Code for your development efficiency.
2. `make run-dev`
    * This will start a docker container which will run the web application at `localhost:8080`
    * Inside this docker container, ASP.net requirements are restored once again. Unlike npm dependencies, ASP.net requirements are stored in a separate cached directory. Due to this reason, you cannot simply copy ASP.net dependency resolved directory into the docker conatiner.
3. `make clean-dev`
    * This will permanently shutdown the development docker container.


## Architecture
1. Backend
    * ASP.net core v1.1
        * running on AWS EC2
        * REST api for authentication, and user data manipulation
        * Serves server-rendered React application
    * PostgreSQL
        * running on AWS RDS
    * Docker
2. Frontend
    * React.js v15.6.2
        * Redux centered view application
    * Typescript
    * Webpack