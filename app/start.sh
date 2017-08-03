#!/bin/bash

echo "************ Building Webpack Bundled Scripts ************"
node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js
node node_modules/webpack/bin/webpack.js

echo "************ Restoring Dotnet Dependencies (inside Docker container) ************"
dotnet restore

echo "************ Migrating Database ************"
dotnet ef database update

echo "************ Running ASP.net Core App ************"
dotnet watch run