![](https://github.com/cryptomator/cryptomator.github.io/workflows/GitHub%20Pages/badge.svg)

# Usage
## Requirements
* Hugo
* Font Awesome Pro `npm config set "@awesome.me:registry" https://npm.fontawesome.com/ && npm config set "//npm.fontawesome.com/:_authToken" TOKEN`

## Building
1. `npm install`
1. run hugo
  * for production builds simply run `npm run build`
  * for local development run `npm run dev`
  * for local production tests `npm run serve`

## Optional Dependencies for Size Optimizations

### Font Subsets
To create subsets of font files, e.g. when we know only very few characters are required to render the title of the page "CRYPTOMATOR HUB":

1. First install `pip install fonttools brotli`
2. `pyftsubset quicksand-bold.woff2 --text="CRYPTOMATOR HUB" --verbose --flavor=woff2 --output-file=quicksand-bold.reduced.woff2`

### Image Conversions
Using WebP (for smaller images) or AVIF (for >80 kiB due to larger overhead) may yield in better compression. [Here](https://www.reddit.com/r/AV1/comments/aabqdc/lossless_compression_test_png_vs_webp_vs_avif/) is a (rather old) comparison benchmark. However, we need to test the best format ourselves.

* `brew install libavif` (see [GitHub Project Page](https://github.com/AOMediaCodec/libavif?tab=readme-ov-file#installation) for other installation methods)
  * Example (lossless): `avifenc -l input.png output.avif`
  * Example (lossy): `avifenc --qcolor 70 --qalpha 100 --depth 8 input.png output.avif`
* `brew install libwebm`
  * Example (lossless): `cwebp -preset drawing -lossless -z 6 -metadata all input.png -o output.webp`
  * Example (lossy): `cwebp -preset drawing -q 90 -alpha_q 100 -metadata all input.png -o output.webp`
* `brew install optipng`
  * Example: `optipng -o3 image.png`

> [!TIP]
> If you see color banding in lossy conversions, try avif with 10 bit color depth.
