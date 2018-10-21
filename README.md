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

Webpack will ouput following different build files inside the `dist` folder:
* eduviewer.var.js
* eduviewer.commonjs2.js
* eduviewer.umd.js
* eduviewer.amd.js

### How to use

Eduviewer frontend can be embedded to any web page using the following `div` tag:

```html
<div id="eduviewer-root" degree-program-id="DEGREE_PROGRAM_ID" academic-year="ACADEMIC_YEAR" lang="LANG" header="HEADER"></div>
```
All attributes are optional.
* `lang` defaults to `fi`, other valid values are: `sv` & `en`
* `academic-year` defaults to the current academic year
* Example `acedemic-year` exact values: `hy-lv-68`, `hy-lv-69`.  
* If `degree-program-id` is set, embedded app won't show select for Degree Program
* If `degree-program-id` and `academic-year` are set, embedded app won't show selects for Degree Program or Academic Year
* `degree-program-id` is id set by Oodi. Valid examples: `KH10_001`, `MH30_004`  
* If `header` isn't set, Eduviewer page won't have a h2 header on top of selects


You'll also need to include the following `script` tag at the end of your page's `body` tag:

```html
  <script src="address/to/eduviewer.var.js"></script>
```

## License
GPL-3.0
