<html itemscope itemtype="http://schema.org/Product" prefix="og: http://ogp.me/ns#" xmlns="http://www.w3.org/1999/html">
  <head>
    
    <meta charset="utf-8">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
<base href="https://rendez-vous.renater.fr/" />
<link rel="stylesheet" href="libs/motd.css">
<meta name="robots" content="noindex, nofollow" />
<meta http-equiv="origin-trial" content="Ajg8laFG3Nas1ENd+S5mndeGNVB9XLN6hTYd8cPb8ECaLwhtL6gK6qmxSRsW3lasw9lujllaxuhC+Ia9pwf/gA8AAABweyJvcmlnaW4iOiJodHRwczovL3JlbmRlei12b3VzLnJlbmF0ZXIuZnI6NDQzIiwiZmVhdHVyZSI6IlJUQ0V4dGVuZERlYWRsaW5lRm9yUGxhbkJSZW1vdmFsIiwiZXhwaXJ5IjoxNjQwNzM1OTk5fQ==">

<script src="libs/client_storage.js"></script>
<script src="libs/motd.js"></script>
<script src="libs/cookie.js"></script>
<script src="libs/bowser.js"></script>
<script>

window.app.config.motd = {
  'url' : "https://motd.renater.fr",
  'endpoint' : "/rest.php/Service/4",
  'test' : false
};

function displayNoticeMessageFromUserAgent(){
  if (bowser.osname == "macOS"){
     config.noticeMessage="Pour activer le partage d'écran sous macOS 10.15 et +, aller au paragraphe \"Capture d'écran sous MacOS\" dans la FAQ Rendez-Vous ";
  }
}

/**
 * This function allows to store a cookie.
 *
 * @param {string} cname: The cookie name
 * @param {string} cvalue: The value to store
 * @param {integer} exdays: Cookie duration
 *
 * @todo use jquery cookie
 */
function setCookie(cname, cvalue, exdays) {
    if (!exdays)
        exdays = app.config.max_cookie_duration;
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function redirectIfNeeded(lang){
  if (lang=="fr"){
    recommendedBrowsers = "static/recommendedBrowsers.html";
    lobbyRejectionMessage = "static/lobbyRejectionMessage.html"
  }
  else{
    recommendedBrowsers = "static/recommendedBrowsers_en.html";
    lobbyRejectionMessage = "static/lobbyRejectionMessage_en.html"
  }
  // Special redirection process for Rendez-vous service
  if (window.location.href.indexOf("authError") !== -1){
    window.location.replace(lobbyRejectionMessage);
    return;
  }

  if (window.location.href.indexOf("?") !== -1){
    window.location.replace("static/404.html");
  }

  if (window.location.pathname){
    var roomName = window.location.pathname.substr(1);
    // (.*[&\?:',\ ]+.*)
    var regex = /[\\/&?:',\ ]/;
    var destPage = "";

    if (roomName.search(regex) > -1 || decodeURIComponent(roomName).search(regex) > -1 ){
        window.location.replace("static/404.html");
    }
  }
  if (!bowser.tablet && !bowser.mobile && (bowser.msie || bowser.safari || bowser.msedge) ){
    window.location.replace("home/");
  }

  if (bowser.firefox && bowser.version < 60 ) {
    window.location.replace(recommendedBrowsers);
  }

  if (bowser.chrome && bowser.version < 72 ) {
    window.location.replace(recommendedBrowsers);
  }
  setCookie('ROOMID',roomName.toLowerCase(),1);
}

function extraConfigSetup(){
        if (bowser.firefox){
                config.disableRtx=true;
                //config.enableTcc=false;
        }
}

window.onload = function(){
  app.motd.startup();
  let lang = localStorage.getItem('language');
  redirectIfNeeded(lang);

  app.cookie.init("home/rest.php/RGPD?lang="+lang);
  //displayNoticeMessageFromUserAgent();
  extraConfigSetup();
};
</script>

<div class="modal" id="overlay-modal">
  <div class="modal-content" id="motd-modal">
      <button class="close" data-close aria-label="Close reveal" type="button">
          <span aria-hidden="true">&times;</span>
      </button>
      <hr />
      <button data-close aria-label="Close modal" data-context="close_modal" id="motd_do_not_show_again" class="button_motd" >J'ai compris</button>
  </div>
</div>

<div id="cookie_footer">
</div>


    <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
    <link rel="stylesheet" href="css/all.css?v=5142-3-5-2">
    <link rel="manifest" href="static/pwa/manifest.json">

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (!JitsiMeetJS.app) {
                return;
            }

            JitsiMeetJS.app.renderEntryPoint({
                Component: JitsiMeetJS.app.entryPoints.APP
            })
        })
    </script>
    <script>
        // IE11 and earlier can be identified via their user agent and be
        // redirected to a page that is known to have no newer js syntax.
        if (window.navigator.userAgent.match(/(MSIE|Trident)/)) {
            var roomName = encodeURIComponent(window.location.pathname);
            window.location.href = "static/recommendedBrowsers.html" + "?room=" + roomName;
        }

        window.indexLoadedTime = window.performance.now();
        console.log("(TIME) index.html loaded:\t", indexLoadedTime);
        // XXX the code below listeners for errors and displays an error message
        // in the document body when any of the required files fails to load.
        // The intention is to prevent from displaying broken page.
        var criticalFiles = [
            "config.js",
            "utils.js",
            "do_external_connect.js",
            "interface_config.js",
            "logging_config.js",
            "lib-jitsi-meet.min.js",
            "app.bundle.min.js",
            "all.css"
        ];
        var loadErrHandler = function(e) {
            var target = e.target;
            // Error on <script> and <link>(CSS)
            // <script> will have .src and <link> .href
            var fileRef = (target.src ? target.src : target.href);
            if (("SCRIPT" === target.tagName || "LINK" === target.tagName)
                && criticalFiles.some(
                    function(file) { return fileRef.indexOf(file) !== -1 })) {
                window.onload = function() {
                    // The whole complex part below implements page reloads with
                    // "exponential backoff". The retry attempt is passes as
                    // "rCounter" query parameter
                    var href = window.location.href;

                    var retryMatch = href.match(/.+(\?|&)rCounter=(\d+)/);
                    var retryCountStr = retryMatch ? retryMatch[2] : "0";
                    var retryCount = Number.parseInt(retryCountStr);

                    if (retryMatch == null) {
                        var separator = href.indexOf("?") === -1 ? "?" : "&";
                        var hashIdx = href.indexOf("#");

                        if (hashIdx === -1) {
                            href += separator + "rCounter=1";
                        } else {
                            var hashPart = href.substr(hashIdx);

                            href = href.substr(0, hashIdx)
                                + separator + "rCounter=1" + hashPart;
                        }
                    } else {
                        var separator = retryMatch[1];

                        href = href.replace(
                            /(\?|&)rCounter=(\d+)/,
                            separator + "rCounter=" + (retryCount + 1));
                    }

                    var delay = Math.pow(2, retryCount) * 2000;
                    if (isNaN(delay) || delay < 2000 || delay > 60000)
                        delay = 10000;

                    var showMoreText = "show more";
                    var showLessText = "show less";

                    document.body.innerHTML
                        = "<div style='"
                        + "position: absolute;top: 50%;left: 50%;"
                        + "text-align: center;"
                        + "font-size: medium;"
                        + "font-weight: 400;"
                        + "transform: translate(-50%, -50%)'>"
                        + "Uh oh! We couldn't fully download everything we needed :("
                        + "<br/> "
                        + "We will try again shortly. In the mean time, check for problems with your Internet connection!"
                        + "<br/><br/> "
                        + "<div id='moreInfo' style='"
                        + "display: none;'>" + "Missing " + fileRef
                        + "<br/><br/></div>"
                        + "<a id='showMore' style='"
                        + "text-decoration: underline;"
                        + "font-size:small;"
                        + "cursor: pointer'>" + showMoreText + "</a>"
                        + "&nbsp;&nbsp;&nbsp;"
                        + "<a id ='reloadLink' style='"
                        + "text-decoration: underline;"
                        + "font-size:small;"
                        + "'>reload now</a>"
                        + "</div>";

                    var reloadLink = document.getElementById('reloadLink');
                    reloadLink.setAttribute('href', href);

                    var showMoreElem = document.getElementById("showMore");
                    showMoreElem.addEventListener('click', function () {
                            var moreInfoElem
                                    = document.getElementById("moreInfo");

                            if (showMoreElem.innerHTML === showMoreText) {
                                moreInfoElem.setAttribute(
                                    "style",
                                    "display: block;"
                                    + "color:#FF991F;"
                                    + "font-size:small;"
                                    + "user-select:text;");
                                showMoreElem.innerHTML = showLessText;
                            }
                            else {
                                moreInfoElem.setAttribute(
                                    "style", "display: none;");
                                showMoreElem.innerHTML = showMoreText;
                            }
                        });

                    window.setTimeout(
                        function () { window.location.replace(href); }, delay);

                    // Call extra handler if defined.
                    if (typeof postLoadErrorHandler === "function") {
                        postLoadErrorHandler(fileRef);
                    }
                };
                window.removeEventListener(
                    'error', loadErrHandler, true /* capture phase */);
            }
        };
        window.addEventListener(
            'error', loadErrHandler, true /* capture phase type of listener */);
    </script>
    <script>/* jshint -W101 */
var config = {
    hosts: {
        domain: 'rendez-vous.renater.fr',
        muc: 'conference.rendez-vous.renater.fr', // FIXME: use XEP-0030
        bridge: 'videobridge.rendez-vous.renater.fr' // FIXME: use XEP-0030
    },
    useStunTurn: true, // use XEP-0215 to fetch STUN and TURN server
    useNicks: false,
    bosh: '//rendez-vous.renater.fr/http-bind', // FIXME: use xep-0156 for that
    clientNode: 'http://jitsi.org/jitsimeet', // The name of client node advertised in XEP-0115 'c' stanza
    etherpad_base: 'https://rendez-vous.renater.fr/etherpad/p/',
        websocket: 'wss://rendez-vous.renater.fr/xmpp-websocket',
        desktopSharingChromeMethod: 'ext',
    desktopSharingChromeExtId: 'jdihdakdhkognlecpefdalpkhdmkdgmk',
    desktopSharingChromeSources: ['screen', 'window','tab'],
    desktopSharingChromeMinExtVersion: '0.1',
    desktopSharingFirefoxExtId: 'jitsidesktopsharing@rendez-vous.renater.fr',
    desktopSharingFirefoxDisabled: false,
    desktopSharingFirefoxMaxVersionExtRequired: 51,
    desktopSharingFirefoxExtensionURL: 'https://rendez-vous.renater.fr/jidesha.xpi',
    disableStats: false,
    enableRecording: false,
    enableWelcomePage: true,
    disableSimulcast: false,
    enableLipSync: false,
    disableAudioLevels: false,
    channelLastN: 9,
    lastNLimits: {
      5: 9,
      30: 9,
      50: 5,
      70: 2,
      90: 1
    },
    // Video Quality settings to limit bitrate
    videoQuality: {
        maxBitratesVideo: {
            low: 200000,
            standard: 500000,
            high: 1500000
        }
    },
    constraints: {
        video: {
           height: {
               ideal: 480,
               max: 720,
               min: 180
           },
           width: {
               ideal: 640,
               max: 1280,
               min: 320
           }
       }
    },
    enableTalkWhileMuted: true,
    enableNoAudioDetection: true,
    enableNoisyMicDetection: true,
    startVideoMuted: 9,
    enableLayerSuspension: true,
    openBridgeChannel:'websocket',
    logStats: true, // Enable logging of PeerConnection stats via the focus
    defaultLanguage: "fr",
    analyticsScriptUrls: ["libs/analytics-custom.js"],
    noticeMessage:'',
    enableUserRolesBasedOnToken: false,
    disableSuspendVideo: true,
    disableRtx: false,
    disableThirdPartyRequests: false,
    minHDHeight: 540,
    enableRemb: true,
    enableTcc: true,
    enablePopupExternalAuth:false,
    disableH264: true,
    p2p: {
        enabled: true,
        useStunTurn: true,
        stunServers: [],
        preferH264: true,
        disableH264: true
     },
    testing: {
        capScreenshareBitrate: 1,
        p2pTestMode: false,
    },
    e2eping: {
     pingInterval: -1,
     analyticsInterval: 60000,
    },
    deploymentUrls: {
        // If specified a 'Help' button will be displayed in the overflow menu with a link to the specified URL for
        // user documentation.
        userDocumentationURL: 'https://rendez-vous.renater.fr/home/user_guide',
        termsURL : 'https://rendez-vous.renater.fr/home/terms'
    //    // If specified a 'Download our apps' button will be displayed in the overflow menu with a link
    //    // to the specified URL for an app download page.
    //    downloadAppsUrl: 'https://docs.example.com/our-apps.html'
    }
};
</script><!-- adapt to your needs, i.e. set hosts and bosh path -->
    
    <script src="libs/do_external_connect.min.js?v=1"></script>
    <script>/* eslint-disable no-unused-vars, no-var, max-len */
/* eslint sort-keys: ["error", "asc", {"caseSensitive": false}] */

var interfaceConfig = {
    APP_NAME: 'RENdez-vous',
    AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
    AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',

    /**
     * A UX mode where the last screen share participant is automatically
     * pinned. Valid values are the string "remote-only" so remote participants
     * get pinned but not local, otherwise any truthy value for all participants,
     * and any falsy value to disable the feature.
     *
     * Note: this mode is experimental and subject to breakage.
     */
    AUTO_PIN_LATEST_SCREEN_SHARE: 'remote-only',
    BRAND_WATERMARK_LINK: '',

    CLOSE_PAGE_GUEST_HINT: false, // A html text to be shown to guests on the close page, false disables it
    /**
     * Whether the connection indicator icon should hide itself based on
     * connection strength. If true, the connection indicator will remain
     * displayed while the participant has a weak connection and will hide
     * itself after the CONNECTION_INDICATOR_HIDE_TIMEOUT when the connection is
     * strong.
     *
     * @type {boolean}
     */
    CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,

    /**
     * How long the connection indicator should remain displayed before hiding.
     * Used in conjunction with CONNECTION_INDICATOR_AUTOHIDE_ENABLED.
     *
     * @type {number}
     */
    CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,

    /**
     * If true, hides the connection indicators completely.
     *
     * @type {boolean}
     */
    CONNECTION_INDICATOR_DISABLED: false,

    DEFAULT_BACKGROUND: '#474747',
    DEFAULT_LOCAL_DISPLAY_NAME: 'me',
    DEFAULT_LOGO_URL: 'images/watermark.png',
    DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Jitster',
    DEFAULT_WELCOME_PAGE_LOGO_URL: 'images/watermark.png',

    DISABLE_DOMINANT_SPEAKER_INDICATOR: false,

    DISABLE_FOCUS_INDICATOR: false,

    /**
     * If true, notifications regarding joining/leaving are no longer displayed.
     */
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,

    /**
     * If true, presence status: busy, calling, connected etc. is not displayed.
     */
    DISABLE_PRESENCE_STATUS: false,

    /**
     * Whether the ringing sound in the call/ring overlay is disabled. If
     * {@code undefined}, defaults to {@code false}.
     *
     * @type {boolean}
     */
    DISABLE_RINGING: false,

    /**
     * Whether the speech to text transcription subtitles panel is disabled.
     * If {@code undefined}, defaults to {@code false}.
     *
     * @type {boolean}
     */
    DISABLE_TRANSCRIPTION_SUBTITLES: false,

    /**
     * Whether or not the blurred video background for large video should be
     * displayed on browsers that can support it.
     */
    DISABLE_VIDEO_BACKGROUND: true,

    DISPLAY_WELCOME_PAGE_CONTENT: true,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,

    ENABLE_DIAL_OUT: true,

    ENABLE_FEEDBACK_ANIMATION: false, // Enables feedback star animation.

    FILM_STRIP_MAX_HEIGHT: 120,

    /**
     * Whether to only show the filmstrip (and hide the toolbar).
     */
    filmStripOnly: false,

    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: true,

    /**
     * Hide the logo on the deep linking pages.
     */
    HIDE_DEEP_LINKING_LOGO: false,

    /**
     * Hide the invite prompt in the header when alone in the meeting.
     */
    HIDE_INVITE_MORE_HEADER: false,

    INITIAL_TOOLBAR_TIMEOUT: 20000,
    JITSI_WATERMARK_LINK: 'https://rendez-vous.renater.fr',

    LANG_DETECTION: true, // Allow i18n to detect the system language
    LIVE_STREAMING_HELP_LINK: 'https://jitsi.org/live', // Documentation reference for the live streaming feature.
    LOCAL_THUMBNAIL_RATIO: 16 / 9, // 16:9

    /**
     * Maximum coefficient of the ratio of the large video to the visible area
     * after the large video is scaled to fit the window.
     *
     * @type {number}
     */
    MAXIMUM_ZOOMING_COEFFICIENT: 1.3,

    /**
     * Whether the mobile app Jitsi Meet is to be promoted to participants
     * attempting to join a conference in a mobile Web browser. If
     * {@code undefined}, defaults to {@code true}.
     *
     * @type {boolean}
     */
    MOBILE_APP_PROMO: true,

    NATIVE_APP_NAME: 'RENdez-vous',

    // Names of browsers which should show a warning stating the current browser
    // has a suboptimal experience. Browsers which are not listed as optimal or
    // unsupported are considered suboptimal. Valid values are:
    // chrome, chromium, edge, electron, firefox, nwjs, opera, safari
    OPTIMAL_BROWSERS: [ 'chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari' ],

    POLICY_LOGO: null,
    PROVIDER_NAME: 'Jitsi',

    /**
     * If true, will display recent list
     *
     * @type {boolean}
     */
    RECENT_LIST_ENABLED: true,
    REMOTE_THUMBNAIL_RATIO: 1, // 1:1

    SETTINGS_SECTIONS: [ 'devices', 'language', 'moderator', 'profile', 'calendar' ],
    SHOW_BRAND_WATERMARK: false,

    /**
    * Decides whether the chrome extension banner should be rendered on the landing page and during the meeting.
    * If this is set to false, the banner will not be rendered at all. If set to true, the check for extension(s)
    * being already installed is done before rendering.
    */
    SHOW_CHROME_EXTENSION_BANNER: false,

    SHOW_DEEP_LINKING_IMAGE: false,
    SHOW_JITSI_WATERMARK: true,
    SHOW_POWERED_BY: false,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    SHOW_WATERMARK_FOR_GUESTS: true, // if watermark is disabled by default, it can be shown only for guests

    /*
     * If indicated some of the error dialogs may point to the support URL for
     * help.
     */
    SUPPORT_URL: 'https://assistance.renater.fr',

    TOOLBAR_ALWAYS_VISIBLE: false,

    /**
     * The name of the toolbar buttons to display in the toolbar, including the
     * "More actions" menu. If present, the button will display. Exceptions are
     * "livestreaming" and "recording" which also require being a moderator and
     * some values in config.js to be enabled. Also, the "profile" button will
     * not display for users with a JWT.
     * Notes:
     * - it's impossible to choose which buttons go in the "More actions" menu
     * - it's impossible to control the placement of buttons
     * - 'desktop' controls the "Share your screen" button
     */
    TOOLBAR_BUTTONS: [
        'microphone', 'camera',   'desktop', 'embedmeeting', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat' ,
         , 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview','help','terms' , 'download', 'help', 'mute-everyone', 'security'
    ],

    TOOLBAR_TIMEOUT: 4000,

    // Browsers, in addition to those which do not fully support WebRTC, that
    // are not supported and should show the unsupported browser page.
    UNSUPPORTED_BROWSERS: [],

    /**
     * Whether to show thumbnails in filmstrip as a column instead of as a row.
     */
    VERTICAL_FILMSTRIP: true,

    // Determines how the video would fit the screen. 'both' would fit the whole
    // screen, 'height' would fit the original video height to the height of the
    // screen, 'width' would fit the original video width to the width of the
    // screen respecting ratio.
    VIDEO_LAYOUT_FIT: 'both',

    /**
     * If true, hides the video quality label indicating the resolution status
     * of the current large video.
     *
     * @type {boolean}
     */
    VIDEO_QUALITY_LABEL_DISABLED: false,

    /**
     * When enabled, the kick participant button will not be presented for users without a JWT
     */
    // HIDE_KICK_BUTTON_FOR_GUESTS: false,

    /**
     * How many columns the tile view can expand to. The respected range is
     * between 1 and 5.
     */
    // TILE_VIEW_MAX_COLUMNS: 5,

    /**
     * Specify custom URL for downloading android mobile app.
     */
    // MOBILE_DOWNLOAD_LINK_ANDROID: 'https://play.google.com/store/apps/details?id=org.jitsi.meet',

    /**
     * Specify URL for downloading ios mobile app.
     */
    // MOBILE_DOWNLOAD_LINK_IOS: 'https://itunes.apple.com/us/app/jitsi-meet/id1165103905',

    /**
     * Specify Firebase dynamic link properties for the mobile apps.
     */
    // MOBILE_DYNAMIC_LINK: {
    //    APN: 'org.jitsi.meet',
    //    APP_CODE: 'w2atb',
    //    CUSTOM_DOMAIN: undefined,
    //    IBI: 'com.atlassian.JitsiMeet.ios',
    //    ISI: '1165103905'
    // },

    /**
     * Specify mobile app scheme for opening the app from the mobile browser.
     */
    // APP_SCHEME: 'org.jitsi.meet',

    /**
     * Specify the Android app package name.
     */
    // ANDROID_APP_PACKAGE: 'org.jitsi.meet',

    /**
     * Override the behavior of some notifications to remain displayed until
     * explicitly dismissed through a user action. The value is how long, in
     * milliseconds, those notifications should remain displayed.
     */
    // ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,

    // List of undocumented settings
    /**
     INDICATOR_FONT_SIZES
     PHONE_NUMBER_REGEX
    */

    // Allow all above example options to include a trailing comma and
    // prevent fear when commenting out the last value.
    // eslint-disable-next-line sort-keys
    makeJsonParserHappy: 'even if last key had a trailing comma'

    // No configuration value should follow this line.
};

/* eslint-enable no-unused-vars, no-var, max-len */
</script>
    <script>/* eslint-disable no-unused-vars, no-var */

// Logging configuration
var loggingConfig = {
    // default log level for the app and lib-jitsi-meet
    defaultLogLevel: 'trace',

    // Option to disable LogCollector (which stores the logs on CallStats)
    // disableLogCollector: true,

    // The following are too verbose in their logging with the
    // {@link #defaultLogLevel}:
    'modules/RTC/TraceablePeerConnection.js': 'info',
    'modules/statistics/CallStats.js': 'info',
    'modules/xmpp/strophe.util.js': 'log'
};

/* eslint-enable no-unused-vars, no-var */

// XXX Web/React server-includes logging_config.js into index.html.
// Mobile/react-native requires it in react/features/base/logging. For the
// purposes of the latter, (try to) export loggingConfig. The following
// detection of a module system is inspired by webpack.
typeof module === 'object'
    && typeof exports === 'object'
    && (module.exports = loggingConfig);
</script>
    <script src="libs/lib-jitsi-meet.min.js?v=5142-3-5-2"></script>
    <script src="libs/app.bundle.min.js?v=5142-3-5-2"></script>
    <script src="static/pwa/registrator.js" async></script>
    <title>Jitsi Meet</title>
<meta property="og:title" content="Jitsi Meet"/>
<meta property="og:image" content="images/jitsilogo.png?v=1"/>
<meta property="og:description" content="Join a WebRTC video conference powered by the Jitsi Videobridge"/>
<meta description="Join a WebRTC video conference powered by the Jitsi Videobridge"/>
<meta itemprop="name" content="Jitsi Meet"/>
<meta itemprop="description" content="Join a WebRTC video conference powered by the Jitsi Videobridge"/>
<meta itemprop="image" content="images/jitsilogo.png?v=1"/>
<link rel="icon" type="image/png" href="images/favicon.ico?v=1"/>

    <!-- Custom CSS for mobile page redirection logo customisation -->
<style>
   .unsupported-mobile-browser__logo {
       height: 77px;
       width: 250px;
   }
</style>

    <template id = "welcome-page-additional-content-template"></template>

    <template id="settings-toolbar-additional-content-template"></template>

  </head>
  <body>
    
    <div id="react"></div>
  </body>
</html>
