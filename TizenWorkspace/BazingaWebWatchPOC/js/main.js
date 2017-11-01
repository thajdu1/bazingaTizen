
window.onload = function() {

	// Listens for hardware key press to exit the app
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === "back") {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (ignore) {

			}
		}
	});




	// Simple text toggle, changes text on click and sends data to phone
	var textbox = document.querySelector('.contents');

	textbox.addEventListener("click", function() {

		var box = document.querySelector('#textbox');

		box.innerHTML = (box.innerHTML === "Bazinga") ? "Watch" : "Bazinga";


		// Calls method to send Message to host app (Provider)

		sendMessage("abc");

	});

};



// Name of the Provider defined in accessoryservices.xml in host app (Provider)
var ProviderAppName = "BazingaPOCProvider"

// Channel used for communicaiton defined in accessoryservices.xml must be the same in Provider and Consumer (Host app and watch app)
var CHANNEL_ID = 110;

var SASocket = null;
var SASagent = null;

// Called to create new socket for communication
function connect() {
	if (SASocket) {
		return false;
	}

	try {

		webapis.sa.requestSAAgent(onsuccess, function(err) {

			console.log("err [" + err.name + "] msg[" + err.message + "]");

		});

	} catch (err) {

		console.log("exception [" + err.name + "] msg[" + err.message + "]");

	}

}

// Calling function at once, to attempt to connect when app opens
connect()


// Called by SDK when possible host app (Provider) was found.
var peerAgentFindCallback = {

	onpeeragentfound : function(peerAgent) {

		try {

			if (peerAgent.appName == ProviderAppName) {

				console.log("perr agent found");

			} else {

				alert("Not expected app!! : " + peerAgent.appName);

			}

		} catch (err) {

			console.log("exception [" + err.name + "] msg[" + err.message + "]");

		}

	},

	onerror : onerror
}


// Called by SDK when sucessfully connected to the host app (Provider)
function onsuccess(agents) {

	try {

		if (agents.length > 0) {

			SAAgent = agents[0];


			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);

			SAAgent.findPeerAgents();

		} else {

			alert("Not found SAAgent!!");

		}

	} catch (err) {

		console.log("exception [" + err.name + "] msg[" + err.message + "]");

	}

}


// Called when peer agent (Provider) host app was found to check whether it is suitable four our app
var peerAgentFindCallback = {

	onpeeragentfound : function(peerAgent) {

		try {

			if (peerAgent.appName == ProviderAppName) {

				SAAgent.setServiceConnectionListener(agentCallback);

				SAAgent.requestServiceConnection(peerAgent);

			} else {

				alert("Not expected app!! : " + peerAgent.appName);

			}

		} catch (err) {

			console.log("exception [" + err.name + "] msg[" + err.message + "]");

		}

	},

	onerror : onerror

}



// Called when perr agent (Provider) host app was connected
var agentCallback = {

	onconnect : function(socket) {

		SASocket = socket;

		var textbox = document.querySelector('.contents');

		textbox.addEventListener("click", function() {

			var box = document.querySelector('#textbox');

			box.innerHTML = "pripojen"

		});




		SASocket.setDataReceiveListener(onreceive);


		SASocket.setSocketStatusListener(function(reason) {

			console.log("Service connection lost, Reason : [" + reason + "]");

			disconnect();

		});

	},

	onerror : onerror

};

// Called by SDK when connection lost
SASocket.setSocketStatusListener(function(reason) {

	console.log("Service connection lost, Reason : [" + reason + "]");

	disconnect();

});


// Called by SDK when disconnected from Provider host app
function disconnect() {

	try {

		if (SASocket != null) {

			SASocket.close();

			SASocket = null;

			createHTML("closeConnection");

		}

	} catch (err) {

		console.log("exception [" + err.name + "] msg[" + err.message + "]");

	}

}


// Function that sends message to Provider host app
function sendMessage(data) {
	try {

		if (SASocket == null) {

			connect();

			return false;

		}

		SASocket.sendData(CHANNEL_ID, data);

	} catch (err) {

		console.log("exception [" + err.name + "] msg[" + err.message + "]");

	}
}


// Called when receive some data from host app (Provider)
function onreceive(channelId, data) {
	alert(data);
}