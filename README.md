# Eduviewer frontend (eduviewer-frontend)

This repository contains source code for the front end of the Eduviewer

## Usage

### Development

To install the dependencies run:

`npm install`

`npm run dev` (HMR-enabled build)

The command starts `webpack-dev-server` on port 8080.
Development build uses public Eduviewer api `https://od.helsinki.fi/eduviewer/` as backend.

### Building

`npm run dist`

This will build and optimize all frontend assets under `dist` to be served statically by the deployment server.


