function guessDownloadTab() {
  // for a list of possible strings, see https://stackoverflow.com/a/19883965/4014509
  // workaround needed for ipad and ipados >= 13, see https://stackoverflow.com/a/57924983/1759462
  let platform = navigator.platform ? navigator.platform.toLowerCase() : '';
  if (platform.indexOf('iphone') != -1 ||
      platform.indexOf('ipod') != -1 ||
      platform.indexOf('ipad') != -1 ||
      platform.indexOf('mac') != -1 && navigator.maxTouchPoints > 1) {
    return 'ios';
  } else if (platform.indexOf('android') != -1) {
    return 'android';
  } else if (platform.indexOf('linux') != -1) {
    return 'linux';
  } else if (platform.indexOf('mac') != -1) {
    return 'mac';
  } else {
    return 'win';
  }
}
