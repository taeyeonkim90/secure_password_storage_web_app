#!/bin/bash

node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js
node node_modules/webpack/bin/webpack.js

dotnet restore
dotnet ef migrations add DBMigration
dotnet ef database update
dotnet watch run