![](https://github.com/cryptomator/cryptomator.github.io/workflows/GitHub%20Pages/badge.svg)

# Usage
## Requirements
* Hugo
* NPM
  * postcss-cli (`npm install -g postcss-cli`)
  * autoprefixer (`npm install -g autoprefixer`)
* Fontawesome Pro `npm config set "@skymatic:registry" https://npm.pkg.github.com/ && npm config set "//npm.pkg.github.com/:_authToken" TOKEN`

## Building
1. `npm install`
1. run hugo
  * for production builds simply run `npm run build`
  * for local development run `npm run dev`
  * for local production tests `npm run serve`
