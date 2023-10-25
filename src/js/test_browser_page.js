var runTest = [];
var testIndex = 0;
var answerIndex = 0;
var testRunning = false;
var closeTestRoomTimeout ;
var hideTestRoomTimeout ;
var checkRoomStateTimeout ;
var runTestTimeout ;
var testRoomPending = false;
var iceServer = {};
var serverIndex = 0 ;
var TurnServerEndpointUrl = "https://gouv1.rendez-vous.renater.fr/home/rest.php/TurnServer";

var time=[0];
var data=[0];
var packetReceivedArray=[0];
var packetLostArray=[0];

var polyGraph;

var layout = {
  title: 'Packet loss',
  xaxis: {
    autorange: true,
    range: [0, 100],
    type: 'linear'
  },
  yaxis: {
    autorange: true,
    range: [0, 10000],
    type: 'linear'
  }
};

var layout2 = {
  title: 'Packet loss Rate',
  xaxis: {
    autorange: true,
    range: [0, 100],
    type: 'linear'
  },
  yaxis: {
    autorange: true,
    range: [0, 10000],
    type: 'linear'
  }
};


function initGraph(){
  polyGraph = document.getElementById('data_graph');
	Plotly.newPlot( polyGraph, [{
    x:  time,
    y:  data,
    type: 'scatter'  }],
    layout
  );

  polyGraph2 = document.getElementById('data_graph2');
	Plotly.newPlot( polyGraph2, [{
    x:  time,
    y:  packetLostArray,
    type: 'scatter'  }],
    layout2
  );
}


function updateGraph(){
	Plotly.newPlot( polyGraph, [{
    x: time,
    y: data,
    type: 'scatter' 
    }],
    layout
  );

  polyGraph2 = document.getElementById('data_graph2');
	Plotly.newPlot( polyGraph2, [{
    x:  time,
    y:  packetLostArray,
    type: 'scatter'  }],
    layout2
  );
}

function download(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function onDownload(){
}

function exportResult(){
  result = [];
  for (i=0;i<time.length;i++){
    var item = {time:time[i],loss:data[i],received:packetReceivedArray[i],lossrate:packetLostArray[i]};
    result.push(item);
  }
  
  download(JSON.stringify(result), "result.json", "text/plain");
}

function displaySuccess(){
  $("a[href='#answer"+answerIndex+"']").addClass("test_success");
  $("#success"+answerIndex).removeClass("hide");
  answerIndex++;
}

function displayError(error){
  $("a[href='#answer"+answerIndex+"']").addClass("test_error");
  $("#fail"+answerIndex).removeClass("hide");
  if (error !== undefined)
    $("#fail"+answerIndex).append(" "+error);
  testRunning = false;
}

function displayErrorAndContinue(error){
  $("a[href='#answer"+answerIndex+"']").addClass("test_error");
  $("#fail"+answerIndex).removeClass("hide");
  if (error !== undefined)
    $("#fail"+answerIndex).append(" "+error);
  answerIndex++;
  runNextTest();
}

function startWebRTCTest(){

    getTurnCredentials();
    console.log("startWebRTCTest Started");
    initGraph();

    if (!testRunning){
      testRunning = true;
      if (testIndex>0)
        cleanPreviousTestResult();
      testIndex   = 1;
      answerIndex = 1;
      if (runTestTimeout)
        clearTimeout(runTestTimeout);
      runNextTest();
    }
    else if (testIndex === runTest.length && !testRoomPending){
      testRunning=false;
      closeTestRoomTimeout = setTimeout(closeTestRoom,500);
      hideTestRoomTimeout  = setTimeout(hideTestRoom,1000);
      $("#reRunButton").removeClass("hide");
    }
}

function runNextTest(){
  if (testIndex < runTest.length){
      runTestTimeout = setTimeout(function(){
        console.log("Run test "+ testIndex +"/"+runTest.length);
        runTest[testIndex](testIndex);
        testIndex++;
      },
      1000 );
  }
  else {
      testRunning=false;
      $("#reRunButton").removeClass("hide");
  }
}

function cleanPreviousTestResult(){
    closeAll();
    for (var i = 1 ; i <= runTest.length ; i++){
      $("a[href='#answer"+i+"']").removeClass("test_success test_error");
    }
    $('[id^="success"]').addClass('hide');
    $('[id^="fail"]').addClass('hide');
    $("#reRunButton").addClass("hide");
    $(".result").empty();
}

function closeAll() {
  $('.accroot').each(function () {
    var $acc = $(this);
     var $openSections = $acc.find('.accordion-item.is-active .accordion-content');
     $openSections.each(function (i, section) {
        $acc.foundation('up', $(section));
     });
  });
}

function testBrowser_ref(index){
  var hasGUM = true;//isGetUserMediaSupported();
  var hasPeerConnection = isPeerConnectionSupported();
  var bannedBrowser = isBannedBrowser();
  $("#answer"+(answerIndex)+"-label")[0].click();
  if (hasGUM && hasPeerConnection && !bannedBrowser){
    displaySuccess();
    runNextTest();
  }
  else {
    displayError();
    $("#fail"+answerIndex).removeClass("hide");
  }
}
function testBrowser(index){
  $("#resultmessage"+answerIndex).append("Test");

  var arrayElem = [];
  for (i=0;i<100000;i++)
    arrayElem.push("bob");


  start = Date.now();
  sum=0;

  for (j=0;j<10000;j++){
      for (i=0;i<arrayElem.length;i++)
        sum= sum + 3 ;
  }
  end = Date.now();
  time = end-start;
  console.log("T1:"+time);
  $("#resultmessage"+answerIndex).append("Test 1 Time :"+time);

  start = Date.now();
  sum=0;
  const length = arrayElem.length;
  for (j=0;j<10000;j++){
    for (i=0;i<length;i++)
      sum= sum + 3 ;
  }
  end = Date.now();
  time = end-start;
  console.log("T2:"+time);
  $("#resultmessage"+answerIndex).append("Test 2 Time :"+time);



  displaySuccess();
  runNextTest();
}


function displayDeviceName(deviceName){
  $("#resultmessage"+answerIndex).append(deviceName);
  $("#resultmessage"+answerIndex).removeClass("hide");
  $("#info"+answerIndex).removeClass("hide");
  displaySuccess();
  runNextTest();
}

function testGetDefaultAudioCapture(index){
  getDefaultMediaCapture("audio",displayDeviceName,displayErrorAndContinue);
  $("#answer"+answerIndex+"-label")[0].click();
}

function testGetDefaultVideoCapture(index){
  getDefaultMediaCapture("video",displayDeviceName,displayErrorAndContinue);
  $("#answer"+answerIndex+"-label")[0].click();
}

function testListDevices(index){
  getListDevices(function(mediaInfo){
    mediaInfo.audioinput.forEach(function(deviceLabel){
        $("#audioinputresult"+answerIndex).append("<span style='display:block;padding-left: 50px;'>" + deviceLabel + "</span>");
    });
    mediaInfo.audiooutput.forEach(function(deviceLabel){
        $("#audiooutputresult"+answerIndex).append("<span style='display:block;padding-left: 50px;'>" + deviceLabel + "</span>");
    });
    mediaInfo.videoinput.forEach(function(deviceLabel){
        $("#videoinputresult"+answerIndex).append("<span style='display:block;padding-left: 50px;'>" + deviceLabel + "</span>");
    });
    displaySuccess();
    runNextTest();
  },
  displayErrorAndContinue);
  $("#answer"+answerIndex+"-label")[0].click();
}

function testMediaConnexion(index){
  var geantUris = generateServerUri();
  iceServer[0].uris = geantUris;
  serverIndex = 0;
  $("#answer"+(answerIndex)+"-label")[0].click();
  testMediaConnexionServer();
}


function testMediaConnexionServer(){
  console.log("Test udp media network");
  $("#label"+answerIndex).removeClass("hide");
  $("#result"+answerIndex).removeClass("hide");
  $("#netSpinner").removeClass("hide");
  var message = ';'
  var serverUri = getServerUri(serverIndex);
  serverIndex++;
  console.log("Test media network "+serverIndex+":"+getServerIndexNumber());
  if (serverIndex <= getServerIndexNumber() ) {
  //if (serverIndex < 4 ) {
    $("#result"+answerIndex).append('-'+serverUri+' : ');
    initiateMediaConnexion(serverUri,
      function(connected){
          if (connected)
            message = '<span style="color:green"> OK </span><br>';
          else
            message = '<span style="color:red"> KO </span><br>';
          $("#result"+answerIndex).append(message);
          testMediaConnexionServer();
      },
      function(err){
        message = '<p style="color:red"> KO<br>';
        $("#result"+answerIndex).append(message);
        testMediaConnexionServer();
      }
    );
  }
  else {
    displaySuccess();
    runNextTest();
  }
}


function testDataConnexion(index){
  var geantUris = generateServerUri();
  iceServer[0].uris = geantUris;
  serverIndex = 0;
  $("#answer"+(answerIndex)+"-label")[0].click();
  testDataConnexionServer();
}


function testDataConnexionServer(){
  console.log("Test udp media network");
  $("#label"+answerIndex).removeClass("hide");
  $("#result"+answerIndex).removeClass("hide");
  $("#netSpinner").removeClass("hide");
  var message = ';'
  var serverUri = getServerUri(serverIndex);
  serverIndex++;
  console.log("Test Data network "+serverIndex+":"+getServerIndexNumber());
  if (serverIndex <= getServerIndexNumber() ) {
    $("#result"+answerIndex).append('-'+serverUri+' : ');
    initiateDataConnexion(serverUri,
      function(connected){
          if (connected)
            message = '<span style="color:green"> OK </span><br>';
          else
            message = '<span style="color:red"> KO </span><br>';
          $("#result"+answerIndex).append(message);
          testDataConnexionServer();
      },
      function(err){
        message = '<p style="color:red"> KO<br>';
        $("#result"+answerIndex).append(message);
        testDataConnexionServer();
      }
    );
  }
  else {
    displaySuccess();
    runNextTest();
  }
}

function getTurnCredentials(){
     iceServer=[{
       "urls":"",
       "username":$("#turn_server_username").val(),
       "credential":$("#turn_server_credentials").val(),
       "credentialType":"password",
       "uris":[]
      }];
      serverRestHosts[0]=$("#turn_server_uri").val();
}

function testDefault(index){
  console.log("Test " + index);
  displaySuccess();
  setTimeout(runNextTest,500);
}
