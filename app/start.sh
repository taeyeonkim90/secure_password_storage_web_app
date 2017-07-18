#!/bin/bash
cd /app
dotnet restore
npm install
dotnet watch run