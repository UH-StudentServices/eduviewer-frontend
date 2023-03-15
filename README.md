# Eduviewer frontend (eduviewer-frontend)

This repository contains source code for the front end of the Eduviewer

## Dependencies

- Webpack 5.0
- css-loader 3.6.0 (loading breaks in 4.x version, fix later)
- Node 17+ (upgraded due to OpenSSL version change)

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
<div id="eduviewer-root" module-code="CODE" academic-year="ACADEMIC_YEAR" only-selected-academic-year="true|false" lang="LANG" header="HEADER" disable-global-style></div>
```
All attributes are optional.
* `lang` defaults to `fi`, other valid values are: `sv` & `en`
* `academic-year` defaults to the current academic year
  * Example `acedemic-year` exact values: `hy-lv-68`, `hy-lv-69`.
* If `module-code` or `degree-program-id` is set, embedded app won't show select for Degree Program
* If `module-code` or `degree-program-id` is set `only-selected-academic-year` determines visibility of academic year dropdown
  * `only-selected-academic-year` hides academic year dropdown if exists and is not explicitly set to false
  * `selected-academic-year-only` is a fallback value for React-components
* `module-code` or `degree-program-id` is the code of degree program set in Sisu. Valid examples: `KH10_001`, `MH30_004`
* If `header` isn't set, Eduviewer page won't have a h2 header on top of selects
* `disable-global-style` disables usage of uh-living-styleguide in eduviewer. Use this only if embedding app already uses uh-living-styleguide.



You'll also need to include the following `script` tag at the end of your page's `body` tag:

```html
  <script src="address/to/eduviewer.var.js"></script>
```

## License
GPL-3.0
