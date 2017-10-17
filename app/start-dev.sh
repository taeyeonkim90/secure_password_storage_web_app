#!/bin/bash

echo "************ Generate CSS typings file ************"
node node_modules/typed-css-modules/lib/cli ClientApp -w &

echo "************ Building Webpack Bundled Scripts ************"
node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js
node node_modules/webpack/bin/webpack.js

echo "************ Restoring Dotnet Dependencies (inside Docker container) ************"
dotnet restore

echo "************ Running ASP.net Core App ************"
dotnet watch run
