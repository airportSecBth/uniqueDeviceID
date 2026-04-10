var DeviceUUIDModule = (function (exports) {
  'use strict';

  // src/constants/index.ts
  var BOTS = [
    "\\+https:\\/\\/developers.google.com\\/\\+\\/web\\/snippet\\/",
    "googlebot",
    "baiduspider",
    "gurujibot",
    "yandexbot",
    "slurp",
    "msnbot",
    "bingbot",
    "facebookexternalhit",
    "linkedinbot",
    "twitterbot",
    "slackbot",
    "telegrambot",
    "applebot",
    "pingdom",
    "tumblr ",
    "Embedly",
    "spbot"
  ];
  var IS_BOT_REGEXP = new RegExp(`^.*(${BOTS.join("|")}).*$`);
  var VERSION_PATTERNS = {
    Edge: /(?:Edge|Edg)\/([\d\w.-]+)/i,
    Firefox: /firefox\/([\d\w.-]+)/i,
    IE: /msie\s([\d.]+[\d])|trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i,
    Chrome: /chrome\/([\d\w.-]+)/i,
    Chromium: /(?:chromium|crios)\/([\d\w.-]+)/i,
    Safari: /version\/([\d\w.-]+)/i,
    Opera: /version\/([\d\w.-]+)|OPR\/([\d\w.-]+)/i,
    Ps3: /([\d\w.-]+)\)\s*$/i,
    Psp: /([\d\w.-]+)\)?\s*$/i,
    Amaya: /amaya\/([\d\w.-]+)/i,
    SeaMonkey: /seamonkey\/([\d\w.-]+)/i,
    OmniWeb: /omniweb\/v([\d\w.-]+)/i,
    Flock: /flock\/([\d\w.-]+)/i,
    Epiphany: /epiphany\/([\d\w.-]+)/i,
    WinJs: /msapphost\/([\d\w.-]+)/i,
    PhantomJS: /phantomjs\/([\d\w.-]+)/i,
    UC: /UCBrowser\/([\d\w.]+)/i
  };
  var BROWSER_PATTERNS = {
    Edge: /edge|edg\//i,
    Amaya: /amaya/i,
    Konqueror: /konqueror/i,
    Epiphany: /epiphany/i,
    SeaMonkey: /seamonkey/i,
    Flock: /flock/i,
    OmniWeb: /omniweb/i,
    Chromium: /chromium|crios/i,
    Chrome: /chrome/i,
    Safari: /safari/i,
    IE: /msie|trident/i,
    Opera: /opera|OPR/i,
    PS3: /playstation 3/i,
    PSP: /playstation portable/i,
    Firefox: /firefox/i,
    WinJs: /msapphost/i,
    PhantomJS: /phantomjs/i,
    UC: /UCBrowser/i
  };
  var OS_PATTERNS = {
    Windows11: /windows nt 10\.0.*(?:; win64; x64|; wow64).*(?:rv:|edg\/|chrome\/).*?(\d+)/i,
    Windows10: /windows nt 10\.0/i,
    Windows81: /windows nt 6\.3/i,
    Windows8: /windows nt 6\.2/i,
    Windows7: /windows nt 6\.1/i,
    UnknownWindows: /windows nt 6\.\d+/i,
    WindowsVista: /windows nt 6\.0/i,
    Windows2003: /windows nt 5\.2/i,
    WindowsXP: /windows nt 5\.1/i,
    Windows2000: /windows nt 5\.0/i,
    WindowsPhone8: /windows phone 8\./,
    OSXCheetah: /os x 10[._]0/i,
    OSXPuma: /os x 10[._]1(\D|$)/i,
    OSXJaguar: /os x 10[._]2/i,
    OSXPanther: /os x 10[._]3/i,
    OSXTiger: /os x 10[._]4/i,
    OSXLeopard: /os x 10[._]5/i,
    OSXSnowLeopard: /os x 10[._]6/i,
    OSXLion: /os x 10[._]7/i,
    OSXMountainLion: /os x 10[._]8/i,
    OSXMavericks: /os x 10[._]9/i,
    OSXYosemite: /os x 10[._]10/i,
    OSXElCapitan: /os x 10[._]11/i,
    OSXSierra: /os x 10[._]12/i,
    OSXHighSierra: /os x 10[._]13/i,
    OSXMojave: /os x 10[._]14/i,
    OSXCatalina: /os x 10[._]15/i,
    MacOSBigSur: /mac os x 1[01][._](?:16|[6-9]|\d{2})|os x 10[._]16/i,
    MacOSMonterey: /mac os x 12[._]/i,
    MacOSVentura: /mac os x 13[._]/i,
    MacOSSonoma: /mac os x 14[._]/i,
    MacOSSequoia: /mac os x 15[._]/i,
    Mac: /os x|mac os/i,
    Linux: /linux/i,
    Linux64: /linux x86_64/i,
    ChromeOS: /cros/i,
    Wii: /wii/i,
    PS3: /playstation 3/i,
    PSP: /playstation portable/i,
    iPad: /\(iPad.*os (\d+)[._](\d+)/i,
    iPhone: /\(iPhone.*os (\d+)[._](\d+)/i,
    Bada: /Bada\/(\d+)\.(\d+)/i,
    Curl: /curl\/(\d+)\.(\d+)\.(\d+)/i
  };
  var PLATFORM_PATTERNS = {
    Windows: /windows nt/i,
    WindowsPhone: /windows phone/i,
    Mac: /macintosh/i,
    Linux: /linux/i,
    Wii: /wii/i,
    Playstation: /playstation/i,
    iPad: /ipad/i,
    iPod: /ipod/i,
    iPhone: /iphone/i,
    Android: /android/i,
    Blackberry: /blackberry/i,
    Samsung: /samsung/i,
    Curl: /curl/i
  };
  var DEFAULT_OPTIONS = {
    version: false,
    language: false,
    platform: true,
    os: true,
    pixelDepth: true,
    colorDepth: true,
    resolution: false,
    isAuthoritative: true,
    silkAccelerated: true,
    isKindleFire: true,
    isDesktop: true,
    isMobile: true,
    isTablet: true,
    isWindows: true,
    isLinux: true,
    isLinux64: true,
    isChromeOS: true,
    isMac: true,
    isiPad: true,
    isiPhone: true,
    isiPod: true,
    isAndroid: true,
    isSamsung: true,
    isSmartTV: true,
    isRaspberry: true,
    isBlackberry: true,
    isTouchScreen: true,
    isOpera: false,
    isIE: false,
    isEdge: false,
    isIECompatibilityMode: false,
    isSafari: false,
    isFirefox: false,
    isWebkit: false,
    isChrome: false,
    isKonqueror: false,
    isOmniWeb: false,
    isSeaMonkey: false,
    isFlock: false,
    isAmaya: false,
    isPhantomJS: false,
    isEpiphany: false,
    source: false,
    cpuCores: false
  };
  var DEFAULT_AGENT = {
    isAuthoritative: true,
    isMobile: false,
    isTablet: false,
    isiPad: false,
    isiPod: false,
    isiPhone: false,
    isAndroid: false,
    isBlackberry: false,
    isOpera: false,
    isIE: false,
    isEdge: false,
    isIECompatibilityMode: false,
    isSafari: false,
    isFirefox: false,
    isWebkit: false,
    isChrome: false,
    isKonqueror: false,
    isOmniWeb: false,
    isSeaMonkey: false,
    isFlock: false,
    isAmaya: false,
    isPhantomJS: false,
    isEpiphany: false,
    isDesktop: false,
    isWindows: false,
    isLinux: false,
    isLinux64: false,
    isMac: false,
    isChromeOS: false,
    isBada: false,
    isSamsung: false,
    isRaspberry: false,
    isBot: false,
    isCurl: false,
    isAndroidTablet: false,
    isWinJs: false,
    isKindleFire: false,
    isSilk: false,
    isCaptive: false,
    isSmartTV: false,
    isUC: false,
    isTouchScreen: false,
    silkAccelerated: false,
    colorDepth: -1,
    pixelDepth: -1,
    resolution: [0, 0],
    cpuCores: -1,
    language: "unknown",
    browser: "unknown",
    version: "unknown",
    os: "unknown",
    platform: "unknown",
    geoIp: {},
    source: ""
  };

  // src/utils/md5.ts
  var rotateLeft = (value, shiftBits) => {
    return value << shiftBits | value >>> 32 - shiftBits;
  };
  var addUnsigned = (x, y) => {
    const x8 = x & 2147483648;
    const y8 = y & 2147483648;
    const x4 = x & 1073741824;
    const y4 = y & 1073741824;
    const result = (x & 1073741823) + (y & 1073741823);
    if (x4 & y4) {
      return result ^ 2147483648 ^ x8 ^ y8;
    }
    if (x4 | y4) {
      if (result & 1073741824) {
        return result ^ 3221225472 ^ x8 ^ y8;
      } else {
        return result ^ 1073741824 ^ x8 ^ y8;
      }
    } else {
      return result ^ x8 ^ y8;
    }
  };
  var f = (x, y, z) => {
    return x & y | ~x & z;
  };
  var g = (x, y, z) => {
    return x & z | y & ~z;
  };
  var h = (x, y, z) => {
    return x ^ y ^ z;
  };
  var i = (x, y, z) => {
    return y ^ (x | ~z);
  };
  var ff = (a, b, c, d, x, s, ac) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var gg = (a, b, c, d, x, s, ac) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var hh = (a, b, c, d, x, s, ac) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var ii = (a, b, c, d, x, s, ac) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var convertToWordArray = (str) => {
    const messageLength = str.length;
    const numberOfWordsTemp1 = messageLength + 8;
    const numberOfWordsTemp2 = (numberOfWordsTemp1 - numberOfWordsTemp1 % 64) / 64;
    const numberOfWords = (numberOfWordsTemp2 + 1) * 16;
    const wordArray = new Array(numberOfWords - 1);
    let bytePosition = 0;
    let byteCount = 0;
    while (byteCount < messageLength) {
      const wordCount2 = (byteCount - byteCount % 4) / 4;
      bytePosition = byteCount % 4 * 8;
      wordArray[wordCount2] = wordArray[wordCount2] | str.charCodeAt(byteCount) << bytePosition;
      byteCount++;
    }
    const wordCount = (byteCount - byteCount % 4) / 4;
    bytePosition = byteCount % 4 * 8;
    wordArray[wordCount] = wordArray[wordCount] | 128 << bytePosition;
    wordArray[numberOfWords - 2] = messageLength << 3;
    wordArray[numberOfWords - 1] = messageLength >>> 29;
    return wordArray;
  };
  var wordToHex = (value) => {
    let wordToHexValue = "";
    let wordToHexValueTemp = "";
    for (let count = 0; count <= 3; count++) {
      const byte = value >>> count * 8 & 255;
      wordToHexValueTemp = "0" + byte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }
    return wordToHexValue;
  };
  var utf8Encode = (str) => {
    str = str.replace(/\r\n/g, "\n");
    let utftext = "";
    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode(c >> 6 | 192);
        utftext += String.fromCharCode(c & 63 | 128);
      } else {
        utftext += String.fromCharCode(c >> 12 | 224);
        utftext += String.fromCharCode(c >> 6 & 63 | 128);
        utftext += String.fromCharCode(c & 63 | 128);
      }
    }
    return utftext;
  };
  var hashMD5 = (str) => {
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    str = utf8Encode(str);
    const x = convertToWordArray(str);
    let a = 1732584193;
    let b = 4023233417;
    let c = 2562383102;
    let d = 271733878;
    for (let k = 0; k < x.length; k += 16) {
      const AA = a;
      const BB = b;
      const CC = c;
      const DD = d;
      a = ff(a, b, c, d, x[k + 0], S11, 3614090360);
      d = ff(d, a, b, c, x[k + 1], S12, 3905402710);
      c = ff(c, d, a, b, x[k + 2], S13, 606105819);
      b = ff(b, c, d, a, x[k + 3], S14, 3250441966);
      a = ff(a, b, c, d, x[k + 4], S11, 4118548399);
      d = ff(d, a, b, c, x[k + 5], S12, 1200080426);
      c = ff(c, d, a, b, x[k + 6], S13, 2821735955);
      b = ff(b, c, d, a, x[k + 7], S14, 4249261313);
      a = ff(a, b, c, d, x[k + 8], S11, 1770035416);
      d = ff(d, a, b, c, x[k + 9], S12, 2336552879);
      c = ff(c, d, a, b, x[k + 10], S13, 4294925233);
      b = ff(b, c, d, a, x[k + 11], S14, 2304563134);
      a = ff(a, b, c, d, x[k + 12], S11, 1804603682);
      d = ff(d, a, b, c, x[k + 13], S12, 4254626195);
      c = ff(c, d, a, b, x[k + 14], S13, 2792965006);
      b = ff(b, c, d, a, x[k + 15], S14, 1236535329);
      a = gg(a, b, c, d, x[k + 1], S21, 4129170786);
      d = gg(d, a, b, c, x[k + 6], S22, 3225465664);
      c = gg(c, d, a, b, x[k + 11], S23, 643717713);
      b = gg(b, c, d, a, x[k + 0], S24, 3921069994);
      a = gg(a, b, c, d, x[k + 5], S21, 3593408605);
      d = gg(d, a, b, c, x[k + 10], S22, 38016083);
      c = gg(c, d, a, b, x[k + 15], S23, 3634488961);
      b = gg(b, c, d, a, x[k + 4], S24, 3889429448);
      a = gg(a, b, c, d, x[k + 9], S21, 568446438);
      d = gg(d, a, b, c, x[k + 14], S22, 3275163606);
      c = gg(c, d, a, b, x[k + 3], S23, 4107603335);
      b = gg(b, c, d, a, x[k + 8], S24, 1163531501);
      a = gg(a, b, c, d, x[k + 13], S21, 2850285829);
      d = gg(d, a, b, c, x[k + 2], S22, 4243563512);
      c = gg(c, d, a, b, x[k + 7], S23, 1735328473);
      b = gg(b, c, d, a, x[k + 12], S24, 2368359562);
      a = hh(a, b, c, d, x[k + 5], S31, 4294588738);
      d = hh(d, a, b, c, x[k + 8], S32, 2272392833);
      c = hh(c, d, a, b, x[k + 11], S33, 1839030562);
      b = hh(b, c, d, a, x[k + 14], S34, 4259657740);
      a = hh(a, b, c, d, x[k + 1], S31, 2763975236);
      d = hh(d, a, b, c, x[k + 4], S32, 1272893353);
      c = hh(c, d, a, b, x[k + 7], S33, 4139469664);
      b = hh(b, c, d, a, x[k + 10], S34, 3200236656);
      a = hh(a, b, c, d, x[k + 13], S31, 681279174);
      d = hh(d, a, b, c, x[k + 0], S32, 3936430074);
      c = hh(c, d, a, b, x[k + 3], S33, 3572445317);
      b = hh(b, c, d, a, x[k + 6], S34, 76029189);
      a = hh(a, b, c, d, x[k + 9], S31, 3654602809);
      d = hh(d, a, b, c, x[k + 12], S32, 3873151461);
      c = hh(c, d, a, b, x[k + 15], S33, 530742520);
      b = hh(b, c, d, a, x[k + 2], S34, 3299628645);
      a = ii(a, b, c, d, x[k + 0], S41, 4096336452);
      d = ii(d, a, b, c, x[k + 7], S42, 1126891415);
      c = ii(c, d, a, b, x[k + 14], S43, 2878612391);
      b = ii(b, c, d, a, x[k + 5], S44, 4237533241);
      a = ii(a, b, c, d, x[k + 12], S41, 1700485571);
      d = ii(d, a, b, c, x[k + 3], S42, 2399980690);
      c = ii(c, d, a, b, x[k + 10], S43, 4293915773);
      b = ii(b, c, d, a, x[k + 1], S44, 2240044497);
      a = ii(a, b, c, d, x[k + 8], S41, 1873313359);
      d = ii(d, a, b, c, x[k + 15], S42, 4264355552);
      c = ii(c, d, a, b, x[k + 6], S43, 2734768916);
      b = ii(b, c, d, a, x[k + 13], S44, 1309151649);
      a = ii(a, b, c, d, x[k + 4], S41, 4149444226);
      d = ii(d, a, b, c, x[k + 11], S42, 3174756917);
      c = ii(c, d, a, b, x[k + 2], S43, 718787259);
      b = ii(b, c, d, a, x[k + 9], S44, 3951481745);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }
    const temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
  };
  var hashInt = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i2 = 0; i2 < str.length; i2++) {
      const chr = str.charCodeAt(i2);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  };

  // src/utils/environment.ts
  var isBrowser = () => {
    return typeof window !== "undefined" && typeof window.document !== "undefined";
  };
  var getNavigator = () => {
    if (isBrowser() && typeof navigator !== "undefined") {
      return navigator;
    }
    return void 0;
  };
  var getScreen = () => {
    if (isBrowser() && typeof screen !== "undefined") {
      return screen;
    }
    return void 0;
  };
  var getWindow = () => {
    if (isBrowser() && typeof window !== "undefined") {
      return window;
    }
    return void 0;
  };
  var getUserAgent = () => {
    const nav = getNavigator();
    return nav?.userAgent || "";
  };
  var getLanguage = () => {
    const nav = getNavigator();
    if (!nav) return "unknown";
    return (nav.language || nav.userLanguage || nav.browserLanguage || nav.systemLanguage || "").toLowerCase() || "unknown";
  };
  var getColorDepth = () => {
    const scr = getScreen();
    return scr?.colorDepth ?? -1;
  };
  var getPixelDepth = () => {
    const scr = getScreen();
    return scr?.pixelDepth ?? -1;
  };
  var getScreenResolution = () => {
    const scr = getScreen();
    if (scr) {
      return [scr.availWidth || 0, scr.availHeight || 0];
    }
    return [0, 0];
  };
  var getCPUCores = () => {
    const nav = getNavigator();
    return nav?.hardwareConcurrency ?? -1;
  };
  var isTouchScreen = () => {
    const win = getWindow();
    const nav = getNavigator();
    if (!win || !nav) return false;
    return "ontouchstart" in win || nav.maxTouchPoints !== void 0 && nav.maxTouchPoints > 0 || nav.msMaxTouchPoints !== void 0 && nav.msMaxTouchPoints > 0;
  };

  // src/utils/fingerprint.ts
  var DEFAULT_FINGERPRINT_OPTIONS = {
    canvas: false,
    webgl: false,
    audio: false,
    fonts: false,
    mediaDevices: false,
    networkInfo: false,
    timezone: false,
    incognitoDetection: false,
    timeout: 5e3,
    methodTimeout: 1e3
  };
  var FINGERPRINT_PRESETS = {
    /** Minimal - only basic device info, no advanced fingerprinting */
    minimal: {
      canvas: false,
      webgl: false,
      audio: false,
      fonts: false,
      mediaDevices: false,
      networkInfo: false,
      timezone: false,
      incognitoDetection: false,
      timeout: 5e3,
      methodTimeout: 1e3
    },
    /** Standard - canvas and webgl for good uniqueness */
    standard: {
      canvas: true,
      webgl: true,
      audio: false,
      fonts: false,
      mediaDevices: false,
      networkInfo: false,
      timezone: true,
      incognitoDetection: false,
      timeout: 5e3,
      methodTimeout: 1e3
    },
    /** Comprehensive - all fingerprinting methods enabled */
    comprehensive: {
      canvas: true,
      webgl: true,
      audio: true,
      fonts: true,
      mediaDevices: true,
      networkInfo: true,
      timezone: true,
      incognitoDetection: true,
      timeout: 1e4,
      methodTimeout: 2e3
    }
  };
  var mergeOptions = (options) => {
    if (!options) return { ...DEFAULT_FINGERPRINT_OPTIONS };
    return { ...DEFAULT_FINGERPRINT_OPTIONS, ...options };
  };
  var getPresetOptions = (preset) => {
    return { ...FINGERPRINT_PRESETS[preset] };
  };
  var isFeatureSupported = (feature) => {
    if (!isBrowser()) return false;
    const nav = getNavigator();
    const win = getWindow();
    switch (feature) {
      case "canvas": {
        try {
          const canvas = document.createElement("canvas");
          return !!(canvas.getContext && canvas.getContext("2d"));
        } catch {
          return false;
        }
      }
      case "webgl": {
        try {
          const canvas = document.createElement("canvas");
          return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
        } catch {
          return false;
        }
      }
      case "audio": {
        return !!(win && (typeof AudioContext !== "undefined" || typeof win.webkitAudioContext !== "undefined"));
      }
      case "fonts": {
        return isBrowser() && !!document.createElement;
      }
      case "mediaDevices": {
        return !!(nav && nav.mediaDevices && typeof nav.mediaDevices.enumerateDevices === "function");
      }
      case "networkInfo": {
        return !!(nav && "connection" in nav);
      }
      case "timezone": {
        return typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function";
      }
      case "incognitoDetection": {
        return !!(nav && "storage" in nav && typeof nav.storage?.estimate === "function");
      }
      default:
        return false;
    }
  };
  var withTimeout = (promise, ms, fallback) => {
    return Promise.race([
      promise,
      new Promise((resolve) => {
        setTimeout(() => resolve(fallback), ms);
      })
    ]);
  };
  var combineHashes = (hashes, separator = ":") => {
    return hashes.filter((h2) => h2 !== null && h2 !== "").join(separator);
  };
  var calculateConfidence = (totalComponents, successfulComponents, weights) => {
    if (totalComponents === 0) return 0;
    const baseConfidence = successfulComponents / totalComponents;
    return baseConfidence;
  };
  var getTimestamp = () => {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }
    return Date.now();
  };
  var measureAsync = async (fn) => {
    const start = getTimestamp();
    const result = await fn();
    const duration = getTimestamp() - start;
    return { result, duration };
  };
  var ErrorLogger = class {
    constructor(config) {
      this.errors = [];
      this.config = {
        enabled: config?.enabled ?? false,
        maxErrors: config?.maxErrors ?? 50,
        onError: config?.onError
      };
    }
    /**
     * Log an error
     * @param component - Component that caused the error
     * @param error - Error object or message
     */
    log(component, error) {
      if (!this.config.enabled) return;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const entry = {
        component,
        error: errorMessage,
        timestamp: Date.now()
      };
      this.errors.push(entry);
      if (this.errors.length > this.config.maxErrors) {
        this.errors.shift();
      }
      if (this.config.onError) {
        try {
          this.config.onError(entry);
        } catch {
        }
      }
    }
    /**
     * Get all logged errors
     * @returns Array of error entries
     */
    getErrors() {
      return this.errors;
    }
    /**
     * Clear all logged errors
     */
    clear() {
      this.errors = [];
    }
    /**
     * Enable or disable logging
     * @param enabled - Whether to enable logging
     */
    setEnabled(enabled) {
      this.config.enabled = enabled;
    }
    /**
     * Check if logging is enabled
     * @returns Whether logging is enabled
     */
    isEnabled() {
      return this.config.enabled;
    }
  };
  var globalErrorLogger = null;
  var getErrorLogger = (config) => {
    if (!globalErrorLogger) {
      globalErrorLogger = new ErrorLogger(config);
    } else if (config) {
      if (config.enabled !== void 0) {
        globalErrorLogger.setEnabled(config.enabled);
      }
    }
    return globalErrorLogger;
  };
  var logError = (component, error) => {
    if (globalErrorLogger) {
      globalErrorLogger.log(component, error);
    }
  };

  // src/fingerprints/canvas.ts
  var createOffscreenCanvas = (width, height) => {
    if (!isBrowser()) return null;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.style.display = "none";
      return canvas;
    } catch {
      return null;
    }
  };
  var renderText = (ctx) => {
    const fonts = ["serif", "sans-serif", "monospace", "cursive", "fantasy"];
    const testText = "Cwm fjordbank glyphs vext quiz, \u{1F603}\u{1F3A8}";
    ctx.textBaseline = "top";
    fonts.forEach((font, index) => {
      ctx.font = `14px ${font}`;
      ctx.fillStyle = `hsl(${index * 72}, 70%, 50%)`;
      ctx.fillText(testText, 2, 2 + index * 18);
    });
  };
  var renderShapes = (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)");
    gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.5)");
    gradient.addColorStop(1, "rgba(0, 0, 255, 0.5)");
    ctx.fillStyle = gradient;
    ctx.fillRect(10, 100, 80, 50);
    ctx.beginPath();
    ctx.arc(150, 125, 30, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 165, 0, 0.7)";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(200, 100);
    ctx.bezierCurveTo(220, 80, 260, 160, 280, 120);
    ctx.strokeStyle = "rgba(128, 0, 128, 0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.moveTo(310, 150);
    ctx.lineTo(340, 100);
    ctx.lineTo(370, 150);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 128, 128, 0.8)";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };
  var renderEmoji = (ctx) => {
    ctx.font = "30px Arial";
    ctx.fillText("\u{1F525}\u{1F4A7}\u{1F33F}\u26A1\u{1F3AD}", 10, 180);
  };
  var isCanvasBlocked = (canvas) => {
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return true;
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.fillRect(0, 0, 1, 1);
      const imageData = ctx.getImageData(0, 0, 1, 1);
      const pixel = imageData.data;
      return pixel[0] !== 255 || pixel[1] !== 0 || pixel[2] !== 0;
    } catch {
      return true;
    }
  };
  var getCanvasFingerprint = async (options) => {
    const timeout = options?.timeout ?? 1e3;
    const generateFingerprint = async () => {
      if (!isBrowser()) return null;
      try {
        const width = 400;
        const height = 200;
        const canvas = createOffscreenCanvas(width, height);
        if (!canvas) return null;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        if (isCanvasBlocked(canvas)) {
          return null;
        }
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, width, height);
        renderText(ctx);
        renderShapes(ctx, width, height);
        renderEmoji(ctx);
        const dataUrl = canvas.toDataURL("image/png");
        return hashMD5(dataUrl);
      } catch {
        return null;
      }
    };
    return withTimeout(generateFingerprint(), timeout, null);
  };
  var isCanvasSupported = () => {
    if (!isBrowser()) return false;
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext && canvas.getContext("2d"));
    } catch {
      return false;
    }
  };

  // src/fingerprints/webgl.ts
  var WEBGL_PARAMS = [
    "MAX_TEXTURE_SIZE",
    "MAX_VERTEX_UNIFORM_VECTORS",
    "MAX_FRAGMENT_UNIFORM_VECTORS",
    "MAX_VARYING_VECTORS",
    "MAX_VERTEX_ATTRIBS",
    "MAX_RENDERBUFFER_SIZE",
    "MAX_CUBE_MAP_TEXTURE_SIZE",
    "MAX_TEXTURE_IMAGE_UNITS",
    "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
    "MAX_COMBINED_TEXTURE_IMAGE_UNITS"
  ];
  var WEBGL_RANGE_PARAMS = ["ALIASED_LINE_WIDTH_RANGE", "ALIASED_POINT_SIZE_RANGE"];
  var createWebGLContext = (canvas) => {
    const contextOptions = {
      preserveDrawingBuffer: true,
      failIfMajorPerformanceCaveat: false
    };
    try {
      const gl2 = canvas.getContext("webgl2", contextOptions);
      if (gl2) return gl2;
    } catch {
    }
    try {
      const gl = canvas.getContext("webgl", contextOptions);
      if (gl) return gl;
    } catch {
    }
    try {
      const glExp = canvas.getContext(
        "experimental-webgl",
        contextOptions
      );
      if (glExp) return glExp;
    } catch {
    }
    return null;
  };
  var getGPUInfo = (gl) => {
    try {
      const debugInfo = gl.getExtension(
        "WEBGL_debug_renderer_info"
      );
      if (!debugInfo) return null;
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return { vendor, renderer };
    } catch {
      return null;
    }
  };
  var collectParameters = (gl) => {
    const params = [];
    for (const param of WEBGL_PARAMS) {
      try {
        const glParam = gl[param];
        if (glParam !== void 0) {
          const value = gl.getParameter(glParam);
          params.push(`${param}:${value}`);
        }
      } catch {
      }
    }
    for (const param of WEBGL_RANGE_PARAMS) {
      try {
        const glParam = gl[param];
        if (glParam !== void 0) {
          const range = gl.getParameter(glParam);
          if (range) {
            params.push(`${param}:${range[0]}-${range[1]}`);
          }
        }
      } catch {
      }
    }
    return params;
  };
  var getExtensions = (gl) => {
    try {
      const extensions = gl.getSupportedExtensions();
      return extensions ? extensions.sort() : [];
    } catch {
      return [];
    }
  };
  var collectWebGL2Parameters = (gl) => {
    const params = [];
    const webgl2Params = [
      "MAX_3D_TEXTURE_SIZE",
      "MAX_ARRAY_TEXTURE_LAYERS",
      "MAX_DRAW_BUFFERS",
      "MAX_SAMPLES",
      "MAX_UNIFORM_BUFFER_BINDINGS"
    ];
    for (const param of webgl2Params) {
      try {
        const glParam = gl[param];
        if (glParam !== void 0) {
          const value = gl.getParameter(glParam);
          params.push(`${param}:${value}`);
        }
      } catch {
      }
    }
    return params;
  };
  var getWebGLFingerprint = async (options) => {
    const timeout = options?.timeout ?? 1e3;
    const generateFingerprint = async () => {
      if (!isBrowser()) return null;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const gl = createWebGLContext(canvas);
        if (!gl) return null;
        const parts = [];
        const gpuInfo = getGPUInfo(gl);
        if (gpuInfo) {
          parts.push(`vendor:${gpuInfo.vendor}`);
          parts.push(`renderer:${gpuInfo.renderer}`);
        }
        const params = collectParameters(gl);
        parts.push(...params);
        if ("MAX_3D_TEXTURE_SIZE" in gl) {
          const webgl2Params = collectWebGL2Parameters(gl);
          parts.push(...webgl2Params);
          parts.push("webgl2:true");
        } else {
          parts.push("webgl2:false");
        }
        const extensions = getExtensions(gl);
        parts.push(`extensions:${extensions.length}`);
        parts.push(`ext_hash:${hashMD5(extensions.join(","))}`);
        const loseContext = gl.getExtension("WEBGL_lose_context");
        if (loseContext) {
          loseContext.loseContext();
        }
        return hashMD5(parts.join("|"));
      } catch {
        return null;
      }
    };
    return withTimeout(generateFingerprint(), timeout, null);
  };
  var isWebGLSupported = () => {
    if (!isBrowser()) return false;
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  };
  var isDebugInfoSupported = () => {
    if (!isBrowser()) return false;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      if (!gl) return false;
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return debugInfo !== null;
    } catch {
      return false;
    }
  };

  // src/fingerprints/audio.ts
  var getAudioContextConstructor = () => {
    const win = getWindow();
    if (!win) return null;
    return win.AudioContext || win.webkitAudioContext || null;
  };
  var getOfflineAudioContextConstructor = () => {
    const win = getWindow();
    if (!win) return null;
    return win.OfflineAudioContext || win.webkitOfflineAudioContext || null;
  };
  var generateOfflineFingerprint = async (timeout) => {
    const OfflineCtx = getOfflineAudioContextConstructor();
    if (!OfflineCtx) return null;
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => resolve(null), timeout);
      try {
        const context = new OfflineCtx(1, 5e3, 44100);
        const oscillator = context.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(1e4, context.currentTime);
        const compressor = context.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-50, context.currentTime);
        compressor.knee.setValueAtTime(40, context.currentTime);
        compressor.ratio.setValueAtTime(12, context.currentTime);
        compressor.attack.setValueAtTime(0, context.currentTime);
        compressor.release.setValueAtTime(0.25, context.currentTime);
        oscillator.connect(compressor);
        compressor.connect(context.destination);
        oscillator.start(0);
        context.startRendering().then((renderedBuffer) => {
          clearTimeout(timeoutId);
          try {
            const channelData = renderedBuffer.getChannelData(0);
            const samples = [];
            const sampleIndices = [500, 1e3, 2e3, 3e3, 4e3, 4500];
            for (const idx of sampleIndices) {
              if (idx < channelData.length) {
                samples.push(channelData[idx]);
              }
            }
            let sum = 0;
            let max = -Infinity;
            let min = Infinity;
            for (let i2 = 0; i2 < channelData.length; i2++) {
              const val = channelData[i2];
              sum += val;
              if (val > max) max = val;
              if (val < min) min = val;
            }
            const fingerprint = [
              ...samples.map((s) => s.toString()),
              `sum:${sum}`,
              `max:${max}`,
              `min:${min}`,
              `sampleRate:${renderedBuffer.sampleRate}`
            ].join("|");
            resolve(hashMD5(fingerprint));
          } catch {
            resolve(null);
          }
        }).catch(() => {
          clearTimeout(timeoutId);
          resolve(null);
        });
      } catch {
        clearTimeout(timeoutId);
        resolve(null);
      }
    });
  };
  var generateFallbackFingerprint = () => {
    const AudioCtx = getAudioContextConstructor();
    if (!AudioCtx) return null;
    try {
      const context = new AudioCtx();
      const parts = [];
      parts.push(`sampleRate:${context.sampleRate}`);
      parts.push(`state:${context.state}`);
      parts.push(`baseLatency:${context.baseLatency || "unknown"}`);
      parts.push(`maxChannels:${context.destination.maxChannelCount}`);
      parts.push(`channelCount:${context.destination.channelCount}`);
      parts.push(`channelInterpretation:${context.destination.channelInterpretation}`);
      context.close().catch(() => {
      });
      return hashMD5(parts.join("|"));
    } catch {
      return null;
    }
  };
  var getAudioFingerprint = async (options) => {
    const timeout = options?.timeout ?? 1e3;
    if (!isBrowser()) return null;
    const offlineResult = await withTimeout(generateOfflineFingerprint(timeout), timeout, null);
    if (offlineResult) return offlineResult;
    return generateFallbackFingerprint();
  };
  var isAudioSupported = () => {
    return getAudioContextConstructor() !== null;
  };
  var isOfflineAudioSupported = () => {
    return getOfflineAudioContextConstructor() !== null;
  };

  // src/fingerprints/fonts.ts
  var DEFAULT_FONTS = [
    // Windows fonts
    "Arial",
    "Arial Black",
    "Calibri",
    "Cambria",
    "Comic Sans MS",
    "Consolas",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Segoe UI",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    // Mac fonts
    "Helvetica",
    "Helvetica Neue",
    "Monaco",
    "Menlo",
    "SF Pro",
    // Linux fonts
    "Ubuntu",
    "DejaVu Sans",
    "Liberation Sans",
    "Noto Sans",
    // Common fonts
    "Roboto",
    "Open Sans",
    "Lato",
    "Source Code Pro",
    "Fira Code",
    "Inconsolata"
  ];
  var FALLBACK_FONTS = ["monospace", "sans-serif", "serif"];
  var TEST_STRING = "mmmmmmmmmmlli";
  var TEST_SIZE = "72px";
  var createMeasurementSpan = () => {
    if (!isBrowser()) return null;
    try {
      const span = document.createElement("span");
      span.style.position = "absolute";
      span.style.left = "-9999px";
      span.style.top = "-9999px";
      span.style.fontSize = TEST_SIZE;
      span.style.fontStyle = "normal";
      span.style.fontWeight = "normal";
      span.style.letterSpacing = "normal";
      span.style.lineHeight = "normal";
      span.style.textTransform = "none";
      span.style.textAlign = "left";
      span.style.textDecoration = "none";
      span.style.whiteSpace = "nowrap";
      span.textContent = TEST_STRING;
      return span;
    } catch {
      return null;
    }
  };
  var measureFont = (span, font, fallback) => {
    span.style.fontFamily = `'${font}', ${fallback}`;
    return {
      width: span.offsetWidth,
      height: span.offsetHeight
    };
  };
  var isFontAvailable = (span, font, baselines) => {
    for (const fallback of FALLBACK_FONTS) {
      const baseline = baselines.get(fallback);
      if (!baseline) continue;
      const measurement = measureFont(span, font, fallback);
      if (measurement.width !== baseline.width || measurement.height !== baseline.height) {
        return true;
      }
    }
    return false;
  };
  var detectFontsDOM = (fonts) => {
    if (!isBrowser()) return [];
    const span = createMeasurementSpan();
    if (!span) return [];
    const detected = [];
    try {
      document.body.appendChild(span);
      const baselines = /* @__PURE__ */ new Map();
      for (const fallback of FALLBACK_FONTS) {
        span.style.fontFamily = fallback;
        baselines.set(fallback, {
          width: span.offsetWidth,
          height: span.offsetHeight
        });
      }
      for (const font of fonts) {
        if (isFontAvailable(span, font, baselines)) {
          detected.push(font);
        }
      }
    } finally {
      if (span.parentNode) {
        span.parentNode.removeChild(span);
      }
    }
    return detected;
  };
  var detectFontsCanvas = (fonts) => {
    if (!isBrowser()) return [];
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return [];
      canvas.width = 500;
      canvas.height = 100;
      const detected = [];
      const baselines = /* @__PURE__ */ new Map();
      for (const fallback of FALLBACK_FONTS) {
        ctx.font = `${TEST_SIZE} ${fallback}`;
        baselines.set(fallback, ctx.measureText(TEST_STRING).width);
      }
      for (const font of fonts) {
        for (const fallback of FALLBACK_FONTS) {
          const baseline = baselines.get(fallback);
          if (baseline === void 0) continue;
          ctx.font = `${TEST_SIZE} '${font}', ${fallback}`;
          const width = ctx.measureText(TEST_STRING).width;
          if (width !== baseline) {
            detected.push(font);
            break;
          }
        }
      }
      return detected;
    } catch {
      return [];
    }
  };
  var getFontFingerprint = async (options) => {
    const timeout = options?.timeout ?? 2e3;
    const fonts = options?.fonts ?? DEFAULT_FONTS;
    const generateFingerprint = async () => {
      if (!isBrowser()) return null;
      try {
        let detected = detectFontsDOM(fonts);
        if (detected.length === 0) {
          detected = detectFontsCanvas(fonts);
        }
        if (detected.length === 0) return null;
        detected.sort();
        return hashMD5(detected.join(","));
      } catch {
        return null;
      }
    };
    return withTimeout(generateFingerprint(), timeout, null);
  };
  var getDetectedFonts = (fonts) => {
    const fontList = fonts ?? [...DEFAULT_FONTS];
    return detectFontsDOM(fontList);
  };
  var getDefaultFontList = () => {
    return [...DEFAULT_FONTS];
  };
  var isFontDetectionSupported = () => {
    return isBrowser() && typeof document !== "undefined" && !!document.createElement;
  };
  var DEFAULT_CACHE_KEY = "device-uuid-fonts";
  var getCachedFonts = (cacheKey) => {
    if (!isBrowser()) return null;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
    }
    return null;
  };
  var setCachedFonts = (cacheKey, fonts) => {
    if (!isBrowser()) return;
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(fonts));
    } catch {
    }
  };
  var getDetectedFontsAsync = async (fonts, options) => {
    const fontList = fonts ?? [...DEFAULT_FONTS];
    const chunkSize = options?.chunkSize ?? 10;
    const chunkDelay = options?.chunkDelay ?? 0;
    const cacheKey = options?.cacheKey ?? DEFAULT_CACHE_KEY;
    const useCache = options?.useCache ?? true;
    if (useCache) {
      const cached = getCachedFonts(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }
    if (!isBrowser()) return [];
    const span = createMeasurementSpan();
    if (!span) return [];
    const detected = [];
    try {
      document.body.appendChild(span);
      const baselines = /* @__PURE__ */ new Map();
      for (const fallback of FALLBACK_FONTS) {
        span.style.fontFamily = fallback;
        baselines.set(fallback, {
          width: span.offsetWidth,
          height: span.offsetHeight
        });
      }
      for (let i2 = 0; i2 < fontList.length; i2 += chunkSize) {
        const chunk = fontList.slice(i2, i2 + chunkSize);
        for (const font of chunk) {
          if (isFontAvailable(span, font, baselines)) {
            detected.push(font);
          }
        }
        if (i2 + chunkSize < fontList.length && chunkDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, chunkDelay));
        } else if (i2 + chunkSize < fontList.length) {
          await Promise.resolve();
        }
      }
      if (useCache) {
        setCachedFonts(cacheKey, detected);
      }
    } finally {
      if (span.parentNode) {
        span.parentNode.removeChild(span);
      }
    }
    return detected;
  };
  var getFontFingerprintAsync = async (options) => {
    const timeout = options?.timeout ?? 3e3;
    const fonts = options?.fonts ?? DEFAULT_FONTS;
    const generateFingerprint = async () => {
      if (!isBrowser()) return null;
      try {
        const detected = await getDetectedFontsAsync(fonts, {
          cacheKey: options?.cacheKey,
          useCache: options?.useCache,
          chunkSize: options?.chunkSize ?? 10,
          chunkDelay: options?.chunkDelay ?? 0
        });
        if (detected.length === 0) return null;
        detected.sort();
        return hashMD5(detected.join(","));
      } catch {
        return null;
      }
    };
    return withTimeout(generateFingerprint(), timeout, null);
  };

  // src/core/DeviceUUID.ts
  var DeviceUUID = class _DeviceUUID {
    /**
     * Create a new DeviceUUID instance
     * @param options - Configuration options
     */
    constructor(options = {}) {
      this.versionPatterns = VERSION_PATTERNS;
      this.browserPatterns = BROWSER_PATTERNS;
      this.osPatterns = OS_PATTERNS;
      this.platformPatterns = PLATFORM_PATTERNS;
      this.options = { ...DEFAULT_OPTIONS, ...options };
      this.agent = {
        ...DEFAULT_AGENT,
        hashInt,
        hashMD5
      };
    }
    /**
     * Get or set the user agent string
     */
    get userAgent() {
      return this.agent.source;
    }
    set userAgent(value) {
      this.agent.source = value;
    }
    /**
     * Get browser name from user agent string
     */
    getBrowser(source) {
      if (this.browserPatterns.Edge.test(source)) {
        this.agent.isEdge = true;
        return "Edge";
      }
      if (this.browserPatterns.PhantomJS.test(source)) {
        this.agent.isPhantomJS = true;
        return "PhantomJS";
      }
      if (this.browserPatterns.Konqueror.test(source)) {
        this.agent.isKonqueror = true;
        return "Konqueror";
      }
      if (this.browserPatterns.Amaya.test(source)) {
        this.agent.isAmaya = true;
        return "Amaya";
      }
      if (this.browserPatterns.Epiphany.test(source)) {
        this.agent.isEpiphany = true;
        return "Epiphany";
      }
      if (this.browserPatterns.SeaMonkey.test(source)) {
        this.agent.isSeaMonkey = true;
        return "SeaMonkey";
      }
      if (this.browserPatterns.Flock.test(source)) {
        this.agent.isFlock = true;
        return "Flock";
      }
      if (this.browserPatterns.OmniWeb.test(source)) {
        this.agent.isOmniWeb = true;
        return "OmniWeb";
      }
      if (this.browserPatterns.Opera.test(source)) {
        this.agent.isOpera = true;
        return "Opera";
      }
      if (this.browserPatterns.Chromium.test(source)) {
        this.agent.isChrome = true;
        return "Chromium";
      }
      if (this.browserPatterns.Chrome.test(source)) {
        this.agent.isChrome = true;
        return "Chrome";
      }
      if (this.browserPatterns.Safari.test(source)) {
        this.agent.isSafari = true;
        return "Safari";
      }
      if (this.browserPatterns.WinJs.test(source)) {
        this.agent.isWinJs = true;
        return "WinJs";
      }
      if (this.browserPatterns.IE.test(source)) {
        this.agent.isIE = true;
        return "IE";
      }
      if (this.browserPatterns.PS3.test(source)) {
        return "ps3";
      }
      if (this.browserPatterns.PSP.test(source)) {
        return "psp";
      }
      if (this.browserPatterns.Firefox.test(source)) {
        this.agent.isFirefox = true;
        return "Firefox";
      }
      if (this.browserPatterns.UC.test(source)) {
        this.agent.isUC = true;
        return "UCBrowser";
      }
      if (source.indexOf("Mozilla") !== 0 && /^([\d\w-.]+)\/[\d\w.-]+/i.test(source)) {
        this.agent.isAuthoritative = false;
        return RegExp.$1;
      }
      return "unknown";
    }
    /**
     * Get browser version from user agent string
     */
    getBrowserVersion(source) {
      const browser = this.agent.browser;
      const versionMap = {
        Edge: this.versionPatterns.Edge,
        PhantomJS: this.versionPatterns.PhantomJS,
        Chrome: this.versionPatterns.Chrome,
        Chromium: this.versionPatterns.Chromium,
        Safari: this.versionPatterns.Safari,
        Opera: this.versionPatterns.Opera,
        Firefox: this.versionPatterns.Firefox,
        WinJs: this.versionPatterns.WinJs,
        IE: this.versionPatterns.IE,
        ps3: this.versionPatterns.Ps3,
        psp: this.versionPatterns.Psp,
        Amaya: this.versionPatterns.Amaya,
        Epiphany: this.versionPatterns.Epiphany,
        SeaMonkey: this.versionPatterns.SeaMonkey,
        Flock: this.versionPatterns.Flock,
        OmniWeb: this.versionPatterns.OmniWeb,
        UCBrowser: this.versionPatterns.UC
      };
      const pattern = versionMap[browser];
      if (pattern && pattern.test(source)) {
        if (browser === "IE" || browser === "Opera") {
          return RegExp.$2 || RegExp.$1 || "unknown";
        }
        return RegExp.$1 || "unknown";
      }
      if (browser !== "unknown") {
        const regex = new RegExp(`${browser}[\\/ ]([\\d\\w.\\-]+)`, "i");
        if (regex.test(source)) {
          return RegExp.$1 || "unknown";
        }
      }
      return "unknown";
    }
    /**
     * Get operating system from user agent string
     */
    getOS(source) {
      if (this.osPatterns.Windows11.test(source)) {
        const match = source.match(this.osPatterns.Windows11);
        if (match && match[1]) {
          const version = parseInt(match[1]);
          if (version >= 96) {
            this.agent.isWindows = true;
            return "Windows 11";
          }
        }
      }
      if (this.osPatterns.Windows10.test(source)) {
        this.agent.isWindows = true;
        return "Windows 10.0";
      }
      if (this.osPatterns.WindowsVista.test(source)) {
        this.agent.isWindows = true;
        return "Windows Vista";
      }
      if (this.osPatterns.Windows7.test(source)) {
        this.agent.isWindows = true;
        return "Windows 7";
      }
      if (this.osPatterns.Windows8.test(source)) {
        this.agent.isWindows = true;
        return "Windows 8";
      }
      if (this.osPatterns.Windows81.test(source)) {
        this.agent.isWindows = true;
        return "Windows 8.1";
      }
      if (this.osPatterns.Windows2003.test(source)) {
        this.agent.isWindows = true;
        return "Windows 2003";
      }
      if (this.osPatterns.WindowsXP.test(source)) {
        this.agent.isWindows = true;
        return "Windows XP";
      }
      if (this.osPatterns.Windows2000.test(source)) {
        this.agent.isWindows = true;
        return "Windows 2000";
      }
      if (this.osPatterns.WindowsPhone8.test(source)) {
        return "Windows Phone 8";
      }
      if (this.osPatterns.Linux64.test(source)) {
        this.agent.isLinux = true;
        this.agent.isLinux64 = true;
        return "Linux 64";
      }
      if (this.osPatterns.Linux.test(source)) {
        this.agent.isLinux = true;
        return "Linux";
      }
      if (this.osPatterns.ChromeOS.test(source)) {
        this.agent.isChromeOS = true;
        return "Chrome OS";
      }
      if (this.osPatterns.Wii.test(source)) {
        return "Wii";
      }
      if (this.osPatterns.PS3.test(source)) {
        return "Playstation";
      }
      if (this.osPatterns.PSP.test(source)) {
        return "Playstation";
      }
      if (this.osPatterns.OSXCheetah.test(source)) {
        this.agent.isMac = true;
        return "OS X Cheetah";
      }
      if (this.osPatterns.OSXPuma.test(source)) {
        this.agent.isMac = true;
        return "OS X Puma";
      }
      if (this.osPatterns.OSXJaguar.test(source)) {
        this.agent.isMac = true;
        return "OS X Jaguar";
      }
      if (this.osPatterns.OSXPanther.test(source)) {
        this.agent.isMac = true;
        return "OS X Panther";
      }
      if (this.osPatterns.OSXTiger.test(source)) {
        this.agent.isMac = true;
        return "OS X Tiger";
      }
      if (this.osPatterns.OSXLeopard.test(source)) {
        this.agent.isMac = true;
        return "OS X Leopard";
      }
      if (this.osPatterns.OSXSnowLeopard.test(source)) {
        this.agent.isMac = true;
        return "OS X Snow Leopard";
      }
      if (this.osPatterns.OSXLion.test(source)) {
        this.agent.isMac = true;
        return "OS X Lion";
      }
      if (this.osPatterns.OSXMountainLion.test(source)) {
        this.agent.isMac = true;
        return "OS X Mountain Lion";
      }
      if (this.osPatterns.OSXMavericks.test(source)) {
        this.agent.isMac = true;
        return "OS X Mavericks";
      }
      if (this.osPatterns.OSXYosemite.test(source)) {
        this.agent.isMac = true;
        return "OS X Yosemite";
      }
      if (this.osPatterns.OSXElCapitan.test(source)) {
        this.agent.isMac = true;
        return "OS X El Capitan";
      }
      if (this.osPatterns.OSXSierra.test(source)) {
        this.agent.isMac = true;
        return "macOS Sierra";
      }
      if (this.osPatterns.OSXHighSierra.test(source)) {
        this.agent.isMac = true;
        return "macOS High Sierra";
      }
      if (this.osPatterns.OSXMojave.test(source)) {
        this.agent.isMac = true;
        return "macOS Mojave";
      }
      if (this.osPatterns.OSXCatalina.test(source)) {
        this.agent.isMac = true;
        return "macOS Catalina";
      }
      if (this.osPatterns.MacOSBigSur.test(source)) {
        this.agent.isMac = true;
        return "macOS Big Sur";
      }
      if (this.osPatterns.MacOSMonterey.test(source)) {
        this.agent.isMac = true;
        return "macOS Monterey";
      }
      if (this.osPatterns.MacOSVentura.test(source)) {
        this.agent.isMac = true;
        return "macOS Ventura";
      }
      if (this.osPatterns.MacOSSonoma.test(source)) {
        this.agent.isMac = true;
        return "macOS Sonoma";
      }
      if (this.osPatterns.MacOSSequoia.test(source)) {
        this.agent.isMac = true;
        return "macOS Sequoia";
      }
      if (this.osPatterns.iPad.test(source)) {
        this.agent.isiPad = true;
        return "iOS";
      }
      if (this.osPatterns.iPhone.test(source)) {
        this.agent.isiPhone = true;
        return "iOS";
      }
      if (this.osPatterns.Mac.test(source)) {
        this.agent.isMac = true;
        return "Mac OS";
      }
      if (this.osPatterns.Bada.test(source)) {
        this.agent.isBada = true;
        return "Bada";
      }
      if (this.osPatterns.Curl.test(source)) {
        this.agent.isCurl = true;
        return "Curl";
      }
      return "unknown";
    }
    /**
     * Get platform from user agent string
     */
    getPlatform(source) {
      if (this.platformPatterns.Windows.test(source)) {
        return "Microsoft Windows";
      }
      if (this.platformPatterns.WindowsPhone.test(source)) {
        this.agent.isWindowsPhone = true;
        return "Microsoft Windows Phone";
      }
      if (this.platformPatterns.Mac.test(source)) {
        return "Apple Mac";
      }
      if (this.platformPatterns.Curl.test(source)) {
        return "Curl";
      }
      if (this.platformPatterns.Android.test(source)) {
        this.agent.isAndroid = true;
        return "Android";
      }
      if (this.platformPatterns.Blackberry.test(source)) {
        this.agent.isBlackberry = true;
        return "Blackberry";
      }
      if (this.platformPatterns.Linux.test(source)) {
        return "Linux";
      }
      if (this.platformPatterns.Wii.test(source)) {
        return "Wii";
      }
      if (this.platformPatterns.Playstation.test(source)) {
        return "Playstation";
      }
      if (this.platformPatterns.iPad.test(source)) {
        this.agent.isiPad = true;
        return "iPad";
      }
      if (this.platformPatterns.iPod.test(source)) {
        this.agent.isiPod = true;
        return "iPod";
      }
      if (this.platformPatterns.iPhone.test(source)) {
        this.agent.isiPhone = true;
        return "iPhone";
      }
      if (this.platformPatterns.Samsung.test(source)) {
        this.agent.isSamsung = true;
        return "Samsung";
      }
      return "unknown";
    }
    /**
     * Test for bot/crawler
     */
    testBot() {
      const isBot = IS_BOT_REGEXP.exec(this.agent.source.toLowerCase());
      if (isBot) {
        this.agent.isBot = isBot[1];
      } else if (!this.agent.isAuthoritative) {
        this.agent.isBot = /bot/i.test(this.agent.source);
      }
    }
    /**
     * Test for Smart TV
     */
    testSmartTV() {
      const isSmartTV = /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv/gi.exec(
        this.agent.source.toLowerCase()
      );
      if (isSmartTV) {
        this.agent.isSmartTV = isSmartTV[1] || true;
      }
    }
    /**
     * Test for mobile device
     */
    testMobile() {
      if (this.agent.isSmartTV) {
        this.agent.isMobile = false;
        this.agent.isDesktop = false;
        return;
      }
      if (this.agent.isAndroid || this.agent.isSamsung || this.agent.isiPhone || this.agent.isiPod || this.agent.isBada || this.agent.isBlackberry || this.agent.isWindowsPhone) {
        this.agent.isMobile = true;
        this.agent.isDesktop = false;
        return;
      }
      if (this.agent.isiPad) {
        this.agent.isMobile = false;
        this.agent.isDesktop = false;
        return;
      }
      if (this.agent.isWindows || this.agent.isLinux || this.agent.isMac || this.agent.isChromeOS) {
        this.agent.isDesktop = true;
        return;
      }
      if (/mobile/i.test(this.agent.source)) {
        this.agent.isMobile = true;
        this.agent.isDesktop = false;
      }
    }
    /**
     * Test for Android tablet
     */
    testAndroidTablet() {
      if (this.agent.isAndroid && !/mobile/i.test(this.agent.source)) {
        this.agent.isAndroidTablet = true;
        this.agent.isMobile = false;
      }
    }
    /**
     * Test for tablet device
     */
    testTablet() {
      if (this.agent.isiPad || this.agent.isAndroidTablet || this.agent.isKindleFire) {
        this.agent.isTablet = true;
      }
      if (/tablet/i.test(this.agent.source)) {
        this.agent.isTablet = true;
      }
    }
    /**
     * Test for IE compatibility mode
     */
    testCompatibilityMode() {
      if (this.agent.isIE) {
        const tridentMatch = /Trident\/(\d)\.0/i.exec(this.agent.source);
        if (tridentMatch) {
          const tridentVersion = parseInt(tridentMatch[1], 10);
          const version = parseFloat(this.agent.version);
          if (version === 7 && tridentVersion === 7) {
            this.agent.isIECompatibilityMode = true;
            this.agent.version = "11.0";
          } else if (version === 7 && tridentVersion === 6) {
            this.agent.isIECompatibilityMode = true;
            this.agent.version = "10.0";
          } else if (version === 7 && tridentVersion === 5) {
            this.agent.isIECompatibilityMode = true;
            this.agent.version = "9.0";
          } else if (version === 7 && tridentVersion === 4) {
            this.agent.isIECompatibilityMode = true;
            this.agent.version = "8.0";
          }
        }
      }
    }
    /**
     * Test for Amazon Silk browser
     */
    testSilk() {
      if (/silk/gi.test(this.agent.source)) {
        this.agent.isSilk = true;
      }
      if (/Silk-Accelerated=true/gi.test(this.agent.source)) {
        this.agent.silkAccelerated = true;
      }
    }
    /**
     * Test for Kindle Fire device
     */
    testKindleFire() {
      const kindleTests = [
        [/KFOT/gi, "Kindle Fire"],
        [/KFTT/gi, "Kindle Fire HD"],
        [/KFJWI/gi, "Kindle Fire HD 8.9"],
        [/KFJWA/gi, "Kindle Fire HD 8.9 4G"],
        [/KFSOWI/gi, "Kindle Fire HD 7"],
        [/KFTHWI/gi, "Kindle Fire HDX 7"],
        [/KFTHWA/gi, "Kindle Fire HDX 7 4G"],
        [/KFAPWI/gi, "Kindle Fire HDX 8.9"],
        [/KFAPWA/gi, "Kindle Fire HDX 8.9 4G"],
        [/KFMAWI/gi, "Kindle Fire HD 10"]
      ];
      for (const [pattern] of kindleTests) {
        if (pattern.test(this.agent.source)) {
          this.agent.isKindleFire = true;
          return;
        }
      }
    }
    /**
     * Test for Captive Network Assistant
     */
    testCaptiveNetwork() {
      if (/CaptiveNetwork/gi.test(this.agent.source)) {
        this.agent.isCaptive = true;
        this.agent.isMac = true;
        this.agent.platform = "Apple Mac";
      }
    }
    /**
     * Test for touch screen support
     */
    testTouchSupport() {
      this.agent.isTouchScreen = isTouchScreen();
    }
    /**
     * Get language from browser
     */
    getLanguageInfo() {
      this.agent.language = getLanguage();
    }
    /**
     * Get color depth
     */
    getColorDepthInfo() {
      this.agent.colorDepth = getColorDepth();
    }
    /**
     * Get pixel depth
     */
    getPixelDepthInfo() {
      this.agent.pixelDepth = getPixelDepth();
    }
    /**
     * Get screen resolution
     */
    getScreenResolutionInfo() {
      this.agent.resolution = getScreenResolution();
    }
    /**
     * Get CPU core count
     */
    getCPUInfo() {
      this.agent.cpuCores = getCPUCores();
    }
    /**
     * Reset agent to default state
     */
    reset() {
      this.agent = {
        ...DEFAULT_AGENT,
        hashInt,
        hashMD5
      };
      return this;
    }
    /**
     * Parse user agent and collect device information
     * @param source - User agent string (defaults to navigator.userAgent)
     * @returns AgentInfo object with device details
     */
    parse(source) {
      const ua = new _DeviceUUID();
      const userAgent = source || getUserAgent();
      ua.agent.source = userAgent.replace(/^\s*/, "").replace(/\s*$/, "");
      ua.agent.os = ua.getOS(ua.agent.source);
      ua.agent.platform = ua.getPlatform(ua.agent.source);
      ua.agent.browser = ua.getBrowser(ua.agent.source);
      ua.agent.version = ua.getBrowserVersion(ua.agent.source);
      ua.testBot();
      ua.testSmartTV();
      ua.testMobile();
      ua.testAndroidTablet();
      ua.testTablet();
      ua.testCompatibilityMode();
      ua.testSilk();
      ua.testKindleFire();
      ua.testCaptiveNetwork();
      ua.testTouchSupport();
      ua.getLanguageInfo();
      ua.getColorDepthInfo();
      ua.getPixelDepthInfo();
      ua.getScreenResolutionInfo();
      ua.getCPUInfo();
      return ua.agent;
    }
    /**
     * Generate a UUID based on device characteristics
     * @param customData - Optional custom data to include in UUID generation
     * @returns UUID string in v4 format
     */
    get(customData) {
      const du = this.parse();
      const dataArray = [];
      for (const key in this.options) {
        if (Object.prototype.hasOwnProperty.call(this.options, key)) {
          const value = du[key];
          dataArray.push(value);
        }
      }
      if (customData) {
        dataArray.push(customData);
      }
      if (!this.options.resolution && du.isMobile) {
        dataArray.push(du.resolution);
      }
      const pref = "b";
      const tmpUuid = hashMD5(dataArray.join(":"));
      const uuid = [
        tmpUuid.slice(0, 8),
        tmpUuid.slice(8, 12),
        "4" + tmpUuid.slice(12, 15),
        // Version 4
        pref + tmpUuid.slice(15, 18),
        // Variant bits
        tmpUuid.slice(20)
      ];
      return uuid.join("-");
    }
    /**
     * Generate a UUID asynchronously with advanced fingerprinting methods
     * @param options - Fingerprint options or preset name
     * @returns Promise resolving to UUID string
     */
    async getAsync(options) {
      const details = await this.getDetailedAsync(options);
      return details.uuid;
    }
    /**
     * Generate detailed fingerprint with all component information
     * @param options - Fingerprint options or preset name
     * @returns Promise resolving to detailed fingerprint result
     */
    async getDetailedAsync(options) {
      const startTime = getTimestamp();
      const resolvedOptions = typeof options === "string" ? getPresetOptions(options) : mergeOptions(options);
      const components = {
        basic: { name: "basic", value: null, success: false }
      };
      const basicHash = this.get();
      components.basic = {
        name: "basic",
        value: basicHash,
        success: true
      };
      const hashes = [basicHash];
      let successCount = 1;
      let totalCount = 1;
      const tasks = [];
      if (resolvedOptions.canvas) {
        totalCount++;
        tasks.push(
          (async () => {
            const { result, duration } = await measureAsync(
              () => getCanvasFingerprint({ timeout: resolvedOptions.methodTimeout })
            );
            components.canvas = {
              name: "canvas",
              value: result,
              success: result !== null,
              duration
            };
            if (result) {
              hashes.push(result);
              successCount++;
            }
          })()
        );
      }
      if (resolvedOptions.webgl) {
        totalCount++;
        tasks.push(
          (async () => {
            const { result, duration } = await measureAsync(
              () => getWebGLFingerprint({ timeout: resolvedOptions.methodTimeout })
            );
            components.webgl = {
              name: "webgl",
              value: result,
              success: result !== null,
              duration
            };
            if (result) {
              hashes.push(result);
              successCount++;
            }
          })()
        );
      }
      if (resolvedOptions.audio) {
        totalCount++;
        tasks.push(
          (async () => {
            const { result, duration } = await measureAsync(
              () => getAudioFingerprint({ timeout: resolvedOptions.methodTimeout })
            );
            components.audio = {
              name: "audio",
              value: result,
              success: result !== null,
              duration
            };
            if (result) {
              hashes.push(result);
              successCount++;
            }
          })()
        );
      }
      if (resolvedOptions.fonts) {
        totalCount++;
        const fontList = Array.isArray(resolvedOptions.fonts) ? resolvedOptions.fonts : void 0;
        tasks.push(
          (async () => {
            const { result, duration } = await measureAsync(
              () => getFontFingerprint({ timeout: resolvedOptions.methodTimeout, fonts: fontList })
            );
            components.fonts = {
              name: "fonts",
              value: result,
              success: result !== null,
              duration
            };
            if (result) {
              hashes.push(result);
              successCount++;
            }
          })()
        );
      }
      if (resolvedOptions.mediaDevices) {
        totalCount++;
        tasks.push(
          (async () => {
            const { result, duration } = await measureAsync(() => this.getMediaDevicesHash());
            components.mediaDevices = {
              name: "mediaDevices",
              value: result,
              success: result !== null,
              duration
            };
            if (result) {
              hashes.push(result);
              successCount++;
            }
          })()
        );
      }
      if (resolvedOptions.networkInfo) {
        totalCount++;
        const { result, duration } = await measureAsync(
          () => Promise.resolve(this.getNetworkInfoHash())
        );
        components.networkInfo = {
          name: "networkInfo",
          value: result,
          success: result !== null,
          duration
        };
        if (result) {
          hashes.push(result);
          successCount++;
        }
      }
      if (resolvedOptions.timezone) {
        totalCount++;
        const { result, duration } = await measureAsync(
          () => Promise.resolve(this.getTimezoneHash())
        );
        components.timezone = {
          name: "timezone",
          value: result,
          success: result !== null,
          duration
        };
        if (result) {
          hashes.push(result);
          successCount++;
        }
      }
      if (resolvedOptions.incognitoDetection) {
        totalCount++;
        tasks.push(
          (async () => {
            const { result, duration } = await measureAsync(() => this.detectIncognito());
            components.incognito = {
              name: "incognito",
              value: result,
              success: result !== null,
              duration
            };
            if (result) {
              hashes.push(result);
              successCount++;
            }
          })()
        );
      }
      await withTimeout(Promise.all(tasks), resolvedOptions.timeout ?? 5e3, []);
      const combinedData = combineHashes(hashes);
      const finalHash = hashMD5(combinedData);
      const uuid = [
        finalHash.slice(0, 8),
        finalHash.slice(8, 12),
        "4" + finalHash.slice(12, 15),
        "b" + finalHash.slice(15, 18),
        finalHash.slice(20)
      ].join("-");
      const endTime = getTimestamp();
      return {
        uuid,
        components,
        confidence: calculateConfidence(totalCount, successCount),
        duration: endTime - startTime,
        timestamp: Date.now()
      };
    }
    /**
     * Get individual fingerprint components (synchronous basic components only)
     * @returns Object with component hashes
     */
    getComponents() {
      const du = this.parse();
      return {
        userAgent: hashMD5(du.source),
        platform: hashMD5(du.platform),
        os: hashMD5(du.os),
        browser: hashMD5(`${du.browser}:${du.version}`),
        screen: hashMD5(`${du.resolution[0]}x${du.resolution[1]}:${du.colorDepth}:${du.pixelDepth}`),
        hardware: hashMD5(`${du.cpuCores}:${du.isTouchScreen}`),
        language: hashMD5(du.language)
      };
    }
    /**
     * Check if a fingerprinting feature is supported
     * @param feature - Feature to check
     * @returns Whether the feature is supported
     */
    static isFeatureSupported(feature) {
      return isFeatureSupported(feature);
    }
    /**
     * Get media devices fingerprint hash
     * @returns Promise resolving to hash or null
     */
    async getMediaDevicesHash() {
      if (!isBrowser()) return null;
      const nav = getNavigator();
      if (!nav?.mediaDevices?.enumerateDevices) return null;
      try {
        const devices = await nav.mediaDevices.enumerateDevices();
        const counts = {
          audioinput: 0,
          audiooutput: 0,
          videoinput: 0
        };
        for (const device of devices) {
          if (device.kind in counts) {
            counts[device.kind]++;
          }
        }
        return hashMD5(`${counts.audioinput}:${counts.audiooutput}:${counts.videoinput}`);
      } catch {
        return null;
      }
    }
    /**
     * Get network information fingerprint hash
     * @returns Hash or null
     */
    getNetworkInfoHash() {
      if (!isBrowser()) return null;
      const nav = getNavigator();
      if (!nav?.connection) return null;
      try {
        const conn = nav.connection;
        const parts = [
          conn.effectiveType ?? "unknown",
          conn.downlink?.toString() ?? "unknown",
          conn.rtt?.toString() ?? "unknown"
        ];
        return hashMD5(parts.join(":"));
      } catch {
        return null;
      }
    }
    /**
     * Get timezone fingerprint hash
     * @returns Hash or null
     */
    getTimezoneHash() {
      try {
        const parts = [];
        parts.push(`offset:${(/* @__PURE__ */ new Date()).getTimezoneOffset()}`);
        if (typeof Intl !== "undefined") {
          const options = Intl.DateTimeFormat().resolvedOptions();
          parts.push(`tz:${options.timeZone ?? "unknown"}`);
          parts.push(`locale:${options.locale ?? "unknown"}`);
        }
        const nav = getNavigator();
        if (nav?.languages) {
          parts.push(`langs:${nav.languages.join(",")}`);
        }
        return hashMD5(parts.join("|"));
      } catch {
        return null;
      }
    }
    /**
     * Detect incognito/private browsing mode
     * @returns Promise resolving to hash or null
     */
    async detectIncognito() {
      if (!isBrowser()) return null;
      try {
        const indicators = [];
        if (navigator.storage?.estimate) {
          const estimate = await navigator.storage.estimate();
          const quota = estimate.quota ?? 0;
          indicators.push(`quota:${quota < 12e7 ? "low" : "normal"}`);
        }
        try {
          const db = indexedDB.open("test");
          db.onerror = () => indicators.push("idb:blocked");
          await new Promise((resolve) => {
            db.onsuccess = () => {
              indicators.push("idb:available");
              resolve();
            };
            db.onerror = () => {
              indicators.push("idb:blocked");
              resolve();
            };
            setTimeout(resolve, 100);
          });
        } catch {
          indicators.push("idb:error");
        }
        if ("showOpenFilePicker" in window) {
          indicators.push("fsapi:available");
        } else {
          indicators.push("fsapi:unavailable");
        }
        indicators.push(`cookies:${navigator.cookieEnabled ? "enabled" : "disabled"}`);
        return hashMD5(indicators.join("|"));
      } catch {
        return null;
      }
    }
  };

  // src/browser.ts
  if (typeof window !== "undefined") {
    window.DeviceUUID = Object.assign(DeviceUUID, { isFeatureSupported });
  }
  /**
   * device-uuid v2.0.0
   * Fast browser device UUID generation library
   *
   * @author Alexey Gordeyev
   * @license MIT
   */

  exports.BOTS = BOTS;
  exports.BROWSER_PATTERNS = BROWSER_PATTERNS;
  exports.DEFAULT_FINGERPRINT_OPTIONS = DEFAULT_FINGERPRINT_OPTIONS;
  exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
  exports.DeviceUUID = DeviceUUID;
  exports.FINGERPRINT_PRESETS = FINGERPRINT_PRESETS;
  exports.OS_PATTERNS = OS_PATTERNS;
  exports.PLATFORM_PATTERNS = PLATFORM_PATTERNS;
  exports.VERSION_PATTERNS = VERSION_PATTERNS;
  exports.getAudioFingerprint = getAudioFingerprint;
  exports.getCanvasFingerprint = getCanvasFingerprint;
  exports.getDefaultFontList = getDefaultFontList;
  exports.getDetectedFonts = getDetectedFonts;
  exports.getDetectedFontsAsync = getDetectedFontsAsync;
  exports.getErrorLogger = getErrorLogger;
  exports.getFontFingerprint = getFontFingerprint;
  exports.getFontFingerprintAsync = getFontFingerprintAsync;
  exports.getPresetOptions = getPresetOptions;
  exports.getWebGLFingerprint = getWebGLFingerprint;
  exports.hashInt = hashInt;
  exports.hashMD5 = hashMD5;
  exports.isAudioSupported = isAudioSupported;
  exports.isCanvasSupported = isCanvasSupported;
  exports.isDebugInfoSupported = isDebugInfoSupported;
  exports.isFeatureSupported = isFeatureSupported;
  exports.isFontDetectionSupported = isFontDetectionSupported;
  exports.isOfflineAudioSupported = isOfflineAudioSupported;
  exports.isWebGLSupported = isWebGLSupported;
  exports.logError = logError;
  exports.mergeOptions = mergeOptions;

  return exports;

})({});
//# sourceMappingURL=index.browser.js.map
//# sourceMappingURL=index.browser.js.map