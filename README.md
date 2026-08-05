# Eduviewer frontend (eduviewer-frontend)

This repository contains source code for the front end of the Eduviewer

## Dependencies

- Webpack 5.0
- Node 24+ (upgraded due to OpenSSL version change)
- Docker, if need to run/update e2e tests

## Usage

### Development

To install the dependencies run:

`npm install`

`npm run dev` (HMR-enabled build)

The command starts `webpack-dev-server` on port 8080.
Development build uses public Eduviewer api `https://od.helsinki.fi/eduviewer/` as backend.

#### Using mock data

Run `cp .env--example .env` and set `USE_MOCKS=true` to use mock data. If false, app calls the production backend.

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
<div id="eduviewer-root" data-module-code="CODE" data-academic-year="ACADEMIC_YEAR" data-selected-academic-year-only="true|false" data-header="HEADER"></div>
```
All attributes are optional.
* The widget language follows the page language: the nearest ancestor with a standard HTML `lang` attribute (usually `<html lang="...">`). Supported languages are `fi`, `sv` & `en`; region subtags are ignored (`fi-FI` → `fi`), and unsupported languages fall back to `fi`. There is no language configuration attribute.
* `data-academic-year` defaults to the current academic year
  * Example `data-academic-year` exact values: `hy-lv-68`, `hy-lv-69`.
* If `data-module-code` is set, embedded app won't show select for Degree Program
* If `data-module-code` is set `data-selected-academic-year-only` determines visibility of academic year dropdown
  * `data-hide-selections` — hides the whole selection section, including academic year dropdown and select all switch
  * `data-hide-selected-academic-year` — hides academic year title but not the select all switch
  * `data-selected-academic-year-only` — if set to `true`, hides academic year dropdown if it exists and is not explicitly set to false
  * `data-skip-title` — if set to `true`, hides the root module title, showing only the module content
  * `data-internal-course-links` — sets course links as internal, removing the arrow marking an external link
* `data-module-code` is the code of degree program set in Sisu. Valid examples: `KH10_001`, `MH30_004`
* If `data-header` isn't set, Eduviewer page won't have a h2 header on top of selects
* Boolean attributes present without a value (e.g. a bare `data-skip-title`) are treated as `true`; any value other than `false` (case insensitive) is also `true`

#### Backward compatibility

The old unprefixed attribute names (`module-code`, `academic-year`, `hide-selections`, `hide-selected-academic-year`, `skip-title`, `internal-course-links`, `selected-academic-year-only`, `header`) are deprecated but still supported. A `data-` prefixed attribute always takes precedence over its unprefixed counterpart. (Language is not configured with an attribute at all — it follows the page's `lang`; there is no `data-lang`.)

The following deprecated aliases are supported only in their unprefixed legacy form:
* `degree-program-id` — use `data-module-code` instead
* `hide-accordion` — use `data-skip-title` instead
* `only-selected-academic-year` — use `data-selected-academic-year-only` instead (this alias also exists because React treats unknown attributes starting with `on` as event handler attributes)

Language resolution: nearest `lang` attribute in the ancestor chain (usually `<html lang>`, per standard HTML language inheritance) → `fi`. Note that pages that set `<html lang>` but never set a language on the widget now get the page language instead of the previous `fi` default.

You'll also need to include the following `script` tag at the end of your page's `body` tag:

```html
  <script src="address/to/eduviewer.var.js"></script>
```

### Testing

#### Playwright E2E tests

- To run e2e tests, run `npm run test:e2e`
- To update e2e snapshot images, run `npm run test:e2e:update`

# Create secrets from SSL

The stage is QA or PROD. This makes it possible to have different SSL files for different stages.
The "keys" ssl.crt and ssl.key become file names since these are mounted as files.
They must match what is specified in nginx.conf.template.
Also the path in nginx.conf.template must match the path specified in the deployments pod specs volume mount.

```
# or delete + create if it already exists or apply if you make a secret manifest.
oc create secret generic ssl-secret-$STAGE \
--from-file=TLS_KEY=./ssl.key \
--from-file=TLS_CERTIFICATE=./ssl.crt \
--from-file=TLS_CA_CERTIFICATE=./ssl_ca.crt
```

## License
GPL-3.0
