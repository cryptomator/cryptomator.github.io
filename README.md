![](https://github.com/cryptomator/cryptomator.github.io/workflows/GitHub%20Pages/badge.svg?branch=redesign2020)

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
  * for production simply run `hugo`
  * for local development run `HUGO_ENV=development hugo server`