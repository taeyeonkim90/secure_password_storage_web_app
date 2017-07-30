#!/bin/bash
cd /app
node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js
node node_modules/webpack/bin/webpack.js
dotnet restore
dotnet watch run