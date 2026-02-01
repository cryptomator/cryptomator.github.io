/**
 * Detects if the current Mac is running Apple Silicon or Intel.
 * Uses WebGL GPU renderer detection.
 * @returns {'apple-silicon' | 'intel' | 'unknown'}
 */
function detectMacArchitecture() {
  if (navigator.appVersion.indexOf('Mac') === -1) {
    return 'unknown';
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      return 'unknown';
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      const rendererLower = renderer.toLowerCase();

      // Apple Silicon Macs have Apple GPUs, Intel Macs have Intel/AMD GPUs
      if (rendererLower.includes('apple')) {
        return 'apple-silicon';
      }

      // Intel or AMD GPUs indicate Intel Mac
      if (rendererLower.includes('intel') || rendererLower.includes('amd') || rendererLower.includes('radeon')) {
        return 'intel';
      }
    }
  } catch (e) {
    // Detection failed, fall through to unknown
  }

  return 'unknown';
}

/**
 * Detects Linux architecture from navigator.platform.
 * @returns {'x86_64' | 'aarch64' | 'unknown'}
 */
function detectLinuxArchitecture() {
  const platform = navigator.platform.toLowerCase();

  if (!platform.includes('linux')) {
    return 'unknown';
  }

  if (platform.includes('aarch64') || platform.includes('arm')) {
    return 'aarch64';
  }

  if (platform.includes('x86_64') || platform.includes('x86-64') || platform.includes('amd64')) {
    return 'x86_64';
  }

  // Most Linux desktops are x86_64
  return 'x86_64';
}

function guessDownloadTab(locationHash) {
  if (locationHash === '#win' || locationHash === '#mac' || locationHash === '#linux' || locationHash === '#android' || locationHash === '#ios') {
    return locationHash;
  } else if (navigator.appVersion.indexOf('iPhone') !== -1 || navigator.appVersion.indexOf('iPad') !== -1 || navigator.appVersion.indexOf('iPod') !== -1) {
    return '#ios';
  } else if (navigator.appVersion.indexOf('Android') !== -1) {
    return '#android';
  } else if (navigator.appVersion.indexOf('Linux') !== -1 || navigator.appVersion.indexOf('X11') !== -1) {
    return '#linux';
  } else if (navigator.appVersion.indexOf('Mac') !== -1) {
    return '#mac';
  } else {
    return '#win';
  }
}
