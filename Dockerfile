FROM microsoft/aspnetcore-build:1.1.2

COPY ./app /app
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT="Development"

RUN ["dotnet", "restore"]
RUN ["npm", "install"]
RUN ["dotnet", "build"]

EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000

ENTRYPOINT ["dotnet", "run"]