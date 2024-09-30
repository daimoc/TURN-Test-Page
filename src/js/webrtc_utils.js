/**
* global peerconnection objects
*/
var pc1 ;
var pc2 ;

/**
* global local media stream object
*/
var localStreamGlobal;

/**
* global peerconnection stats objects
*/
var getStatsTime = 5000;
var startTime = -1;
var stateEnabled = false;
var timestampPrev = 0;
var bytesPrev = 0;

var packetLostPrev = 0;
var packetReceivedPrev = 0;

var byteRate = 0 ;
var packetLost = 0;
var fractionLost = 0;
var jitter = 0;

var connectionTime = 3*60*60*1000;

//var connectionTime = 3*1000;

/**
* Turn media relay informations
*/

var serverRestHosts = [

];
var protocol = [
  'udp',
  'tcp'
];

var stunPort = [
  '80',
  '3478',
  '3479'
];

var turnPort = [
 // '80',
 // '443',
  '3478',
 // '3479'
];

var turnsPort = [
   '443'
//   '5349',
//  '5350'
];


function generateServerUri(){
  var uris = [];
  serverRestHosts.forEach((host) => {
    protocol.forEach((proto) =>{
      turnPort.forEach((port) =>{
        console.log("TURN:"+host+","+port+","+proto);

        uris.push("turn:"+host+":"+port+"?transport="+proto);
      });
      turnsPort.forEach((port) =>{
        console.log("TURNS:"+host+","+port+","+proto);

        uris.push("turns:"+host+":"+port+"?transport="+proto);
      });
    });
  });
  return uris;
}

function getServerUri(serverIndex){
  if (serverIndex<getServerIndexNumber())
    return iceServer[0].uris[serverIndex];
  return null;
}

function getServerIndexNumber(){
  if (iceServer && iceServer[0] && iceServer[0].uris)
    return iceServer[0].uris.length;
  return 0;
}

/**
 * Test if mediadevice API is present
 * @returns {boolean}
 */
function isGetUserMediaSupported(){
  if (navigator.mediaDevices === undefined){
    return false;
  }
  return true;
}

/**
 * Test if RTCPeerConnection API is present
 * @returns {boolean}
 */
function isPeerConnectionSupported(){
  var rtcConfig={};
  try {
    var pc =   new RTCPeerConnection(rtcConfig);
    if ( pc === undefined ){
      return false;
    }
    return true;
  }
  catch(err){
    return false;
  }
}

/**
 * Test if DataChannel API is present
 * @returns {boolean}
 */
function isDataChannelSupported(){
  var rtcConfig={};
  const dcInitOptions = {
    ordered: true,
    maxRetransmits: 65535,
    priority: "low",
    binaryType: "blob",
  };
  try{
      var pc = new RTCPeerConnection(rtcConfig);
      var dc = pc.createDataChannel("chat",dcInitOptions);
      if ( dc === undefined ){
       return false;
      }
      return true;
  }
  catch(err){
    return false;
  }
}

/**
 * Test if Browser support is part of banned browser
 * @returns {boolean}
 */
function isBannedBrowser(){
  if (bowser.msie || bowser.safari || bowser.msedge)
    return true;
  return false;
}

/**
 * Get All Media devices seen by the navigator
 * @param {callback} successCallback - callback that handles a mediaInfo object containing media labels
 * @param {callback} errorCallback - callback that handles the error message
 */
function getListDevices(successCallback,errorCallback){
   navigator.mediaDevices.enumerateDevices()
    .then(function (devices){
      var mediaInfo = {
          audioinput:[],
          audiooutput:[],
          videoinput :[]
      };
      console.log(devices);
      devices.forEach(function(deviceInfo) {
      if (deviceInfo.kind === 'audioinput')
          mediaInfo.audioinput.push(deviceInfo.label);
      else if (deviceInfo.kind === 'audiooutput')
          mediaInfo.audiooutput.push(deviceInfo.label);
      else if (deviceInfo.kind === 'videoinput')
          mediaInfo.videoinput.push(deviceInfo.label);
      });
      successCallback(mediaInfo);
    })
    .catch(function(err) {
        errorCallback(err);
    });
}

/**
 * try to capture a media by its type(audio or video)
 * @param {string} mediaType - selected mediatype : audio|video
 * @param {callback} successCallback - callback that handles capture track labels
 * @param {callback} errorCallback - callback that handles the error message
 */
function getDefaultMediaCapture(mediaType,successCallback,errorCallback){
    const mediaStreamConstraints = {
      video: false,
      audio: false
    };
    if (mediaType==="video"){
        mediaStreamConstraints.video = true;
    }
    else if (mediaType==="audio"){
        mediaStreamConstraints.audio = true;
    }
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(function(mediaStream) {
        /* use the stream */
        var localtracks = mediaStream.getTracks();
        var tracklabels = "";
        localtracks.forEach(function(track){
            tracklabels += track.label;
            track.stop();
        });
        successCallback(tracklabels);
    })
    .catch(function(err) {
        errorCallback(err);
    });
}

/**
 * try to initiate an Audio and Video webrtc peerconnection using different protocls
 * @param {string} uri - selected transport realy protocol : udp|tcp
 * @param {callback} successCallback - callback that handles capture track labels
 * @param {callback} errorCallback - callback that handles the error message
 */
function initiateMediaConnexion(uri,successCallback,errorCallback){
  var mediaStreamConstraints = {
    video: true,
    audio: true
  };
  var rtcConfig={
    iceTransportPolicy :'relay'
  };


  iceServer[0].urls=uri;
  rtcConfig.iceServers = iceServer;

  navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(function(mediaStream) {
      /* use the stream */
      localStreamGlobal = mediaStream;

      var localVideo = $("#localvideo")[0];
      localVideo.srcObject = mediaStream;
      localVideo.onloadedmetadata = function(e) {
        localVideo.play();
      };
      call(rtcConfig)
      .then(function() {
        wait(connectionTime).then(function() {return hangup(successCallback,errorCallback);});
      });
  })
  .catch(function(err) {
      errorCallback(err);
  })
}




/**
 * try to initiate an Audio and Video webrtc peerconnection using different protocls
 * @param {rtcConfig} rtcConfig - Object containing inforamtion about peerconneciton configuration
 */
function call(rtcConfig) {
  console.log('Call Start');
  var remoteVideo = $("#remotevideo")[0];
  var videoTracks = localStreamGlobal.getVideoTracks();
  var audioTracks = localStreamGlobal.getAudioTracks();
  if (audioTracks.length > 0) {
    console.log('Actual Audio device: ' + audioTracks[0].label);
  }

  if (videoTracks.length > 0) {
    console.log('Actual Video device: ' + videoTracks[0].label);
  }
  pc1 = new RTCPeerConnection(rtcConfig);
  pc2 = new RTCPeerConnection(rtcConfig);
  console.log('create peer connection objects');

  // signaling state
  var signalingStateLog1 = pc1.signalingState;
  var signalingStateLog2 = pc2.signalingState;

  pc1.onsignalingstatechange = function() {
    if (pc1) {
      signalingStateLog1 += " -> " + pc1.signalingState;
      console.log('PC1 Sinaling: ' + signalingStateLog1);
    }
  };

  pc2.onsignalingstatechange = function() {
    if (pc2) {
      signalingStateLog2 += " -> " + pc2.signalingState;
      console.log('PC2 Sinaling: ' + signalingStateLog2);
    }
  };

  // ice state
  var iceConnectionStateLog1 = pc1.iceConnectionState;
  var iceConnectionStateLog2 = pc2.iceConnectionState;

  pc1.oniceconnectionstatechange = function() {
    if (pc1) {
      iceConnectionStateLog1 += " -> " + pc1.iceConnectionState
      console.log('PC1 ICE: '+ iceConnectionStateLog1);
    }
  };

  pc2.oniceconnectionstatechange = function() {
    if (pc2) {
      iceConnectionStateLog2 += " -> " + pc2.iceConnectionState
      console.log('PC2 ICE: '+ iceConnectionStateLog2);
    }
  };

  pc1.onicecandidate = function (event){
    pc2.addIceCandidate(event.candidate);
     if (event.candidate){
       console.log('pc1 ICE Candidate: '+event.candidate.candidate);
     }
  }

  pc2.onicecandidate = function (event){
      pc1.addIceCandidate(event.candidate);
      if (event.candidate){
        console.log('pc2 ICE Candidate: '+event.candidate.candidate);
      }
  }

  pc2.ontrack = function(event) {
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.onloadedmetadata = function(e) {
      remoteVideo.play();
    };
  }
  pc2.onnegotiationneeded = function(event) {
    try {
      console.log("pc2");
    } catch (err) {
      console.error(err);
    }
  };

  // add mediastream
  localStreamGlobal.getTracks().forEach(function(track) {pc1.addTrack(track, localStreamGlobal);});

  var offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };

 // init call
 return pc1.createOffer(offerOptions).then( function(offer) {
   pc1.setLocalDescription(offer);
   pc2.setRemoteDescription(offer);
   console.log('Offer: '+offer.sdp);
   pc2.createAnswer().then( function(answer) {
     pc2.setLocalDescription(answer);
     pc1.setRemoteDescription(answer);
     console.log('Answer: '+answer.sdp);
     stateEnabled = true;
     timestampPrev = 0 ;
     bytesPrev = 0;
     packetLostPrev = 0;
     getterStats(pc2);
   });
 });
}

/**
* Promise stype timeout fonction
*/
function wait (ms) {
  return new Promise(function(resolve){ return setTimeout(resolve, ms)});
}

/**
 * Start the peerconnection getuser process
 * @param {Peerconneciton} Peerconnection
 */
function getterStats(peerconnection){
  if (stateEnabled){
      wait(getStatsTime).then(function(){
          peerconnection.getStats().then(function(report) {
          if (report)
              writeStats(report);
          getterStats(peerconnection);
          })
          .catch(function(err) {
            console.log(err);
          })
        }
     )
     .catch(function(err) {
       console.log(err);
     });
  }
}

/**
* Write some peerconnection statistics like packet loss or received bandwidth into global variable
* @param {PeerconnecitonStatsreport} result - Peerconnction statistique report for a specific timeStamp
*/
function writeStats(results){
  results.forEach(function(report) {
      var now = report.timestamp;
      if (startTime == -1) startTime = now;

      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        var bytes = report.bytesReceived;
        if (timestampPrev) {
          byteRate = 8 * (bytes - bytesPrev) / (now - timestampPrev);
          byteRate = Math.floor(byteRate);
          console.log("Byte Rate : "+ byteRate);
          $('#byteRate').text(byteRate);
        }
        bytesPrev = bytes;
        timestampPrev = now;
      }
      else if (report.type === "remote-candidate" ){
        $('#candidate').text(report.candidateType);
      }
    });
  results.forEach(function(report) {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video' ) {
        packetLostPrev = packetLost;
        packetLost = report.packetsLost;
        packetReceivedPrev = packetReceived;
        packetReceived = report.packetsReceived;
        fractionLost = report.fractionLost;
        jitter = report.jitter;
        data.push(packetLost);
        packetReceivedArray.push(packetReceived);
        currentimeSecond=(report.timestamp-startTime)/1000;

        var date = new Date(report.timestamp);

        time.push(date);

        $('#packetLost').text(packetLost);
        $('#fractionLost').text(fractionLost);
        $('#jitter').text(jitter);
        $('#packetReceived').text(packetReceived);
        packetLostRate= 100 * ((packetLost - packetLostPrev)/ (packetReceived-packetReceivedPrev) ) ;
        packetLostArray.push(packetLostRate);
        $('#packetLostRate').text(packetLostRate);
      }

  });
  updateGraph();
}


/**
* Close the 2 active peerconneciton pc1 and pc2 and release media capture
* @param {callback} successCallback - callback that handles end call status
* @param {callback} errorCallback - callback that handles the error message
*/
function hangup(successCallback,errorCallback){
  console.log("pc1 iceConnectionState :" + pc1.iceConnectionState);
  console.log("pc2 iceConnectionState :" + pc2.iceConnectionState);
  stateEnabled = false;
  var connected = (pc2.iceConnectionState === "connected");
  pc1.close();
  pc2.close();
  localStreamGlobal.getTracks().forEach(function(track) { track.stop();});
  successCallback(connected);
}
