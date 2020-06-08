/*
author	: Sharat Achary
date 	: 20200608
*/

// Main root.
var _sttApp = {};

// Flag to allow record longer silence period.
_sttApp._detectLongPhrase = true;

// Flag to check whether Web Speech API is supported.
_sttApp._isWebSpeechAPISupported = false;


// Create SpeechRecognition object.
try{

	// Check for chrome or mozilla SpeechRecognition object.
	_sttApp._speechRecognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();


	// Update flag as SpeechRecognition object was found.
	_sttApp._isWebSpeechAPISupported = true;

}catch(e){

	// Else log the error.
	console.error(e);
}


// Prepare custom _speechRecognizer
if(_sttApp._isWebSpeechAPISupported){
	console.log("Web Speech API is recognized by the browser.");

	// Flag to allow record longer silence period.
	_sttApp._speechRecognizer.continuous = _sttApp._detectLongPhrase;


	// Method to enable microphone.
	_sttApp._StartListening = function(){
		_sttApp._speechRecognizer.start();
	};

	// Method to disable microphone.
	_sttApp._StopListening = function(){
		_sttApp._speechRecognizer.stop();
	};

	// Events
	// Event handler when speechRecognizer start listening.
	_sttApp._speechRecognizer.onstart = function(){
		//Todo - Enable microphone icon.
	}

	// Event handler when speechRecognizer stop listening.
	_sttApp._speechRecognizer.onspeechend = function(){
		console.log("Timed out...");

		// Send message to unity.
		unityInstance.SendMessage('STTManager', '_TimedOut');
	}

	// Event handler when speechRecognizer encounters error.
	_sttApp._speechRecognizer.onerror = function(e){
		console.error(e.error);
	}

	// Event handler when speechRecognizer detect a line.
	_sttApp._speechRecognizer.onresult = function(e){
		
		// Extract the detected line.
		var _detectedLine = e.results[e.resultIndex][0].transcript;

		// Send message to unity.
		unityInstance.SendMessage('STTManager', '_DetectedLine', _detectedLine);

		console.log("detectedLine : ", _detectedLine);
	}


	// Prepare the HTML
	_sttApp._isListening = false;


	// Prepare the start listeneing button.
	_sttApp.microphoneButton = document.getElementById("microphoneButton");

	// Add the click behaviour.
	if(_sttApp.microphoneButton){
		_sttApp.microphoneButton.addEventListener("click", function(){
			
			_sttApp._isListening = !_sttApp._isListening;

			_sttApp.microphoneButton.innerText = _sttApp._isListening ? "Stop Listening" : "Start Listening";

			_sttApp._isListening ? _sttApp._StartListening() : _sttApp._StopListening();

		});
	}

}else{
	console.log("Web Speech API is not recognized by the browser.");
	
	document.getElementById("sttApp").style.display = "none";

	//TODO - Show Web Speech API not supported.

}
