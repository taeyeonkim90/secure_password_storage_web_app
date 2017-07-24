#!/bin/bash
cd /app
dotnet restore
npm install
node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js
node node_modules/webpack/bin/webpack.js
dotnet watch run