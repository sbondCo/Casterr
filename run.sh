#! /bin/bash

# Publish API into app directory
dotnet publish -c "debug" --output "./Casterr/bin/api" --no-self-contained Casterr.API/Casterr.API.csproj

# Run Electron App
npm run electron:serve --prefix Casterr
