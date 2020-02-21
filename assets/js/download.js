function guessDownloadTab() {
  // for a list of possible strings, see https://stackoverflow.com/a/19883965/4014509
  let platform = navigator.platform ? navigator.platform.toLowerCase() : '';
  if (platform.indexOf('win') != -1) {
    return 'win';
  } else if (platform.indexOf('mac') != -1) {
    return 'mac';
  } else if (platform.indexOf('linux') != -1) {
    return 'linux';
  } else if (platform.indexOf('android') != -1) {
    return 'android';
  } else if (platform.indexOf('iphone') != -1) {
    return 'ios';
  } else if (platform.indexOf('ipad') != -1) {
    return 'ios';
  } else if (platform.indexOf('ipod') != -1) {
    return 'ios';
  } else {
    return 'win';
  }
}
