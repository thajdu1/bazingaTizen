window.onload = function () {
    // TODO:: Do your initialization job
	
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
			try {
			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
	});

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	var box = document.querySelector('#textbox');
    	box.innerHTML = (box.innerHTML === "Bazinga") ? "Watch" : "Bazinga";
    	sendMessage("abc");
    });
};

    var ProviderAppName = "BazingaPOCProvider"
    var CHANNEL_ID = 110;
    var SASocket = null;
    var SASagent = null;
    
    
    function onsuccess(agents)
    {
    	try
    	{
    		if (agents.length > 0)
    		{
    			SAAgent = agents[0];
    			// alert("onsuccess agentslength > 1");
    		}
    		else
    		{
    			// alert("Not found SAAgent!!");
    		}
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
    		// alert("onsuccesscatch");
    	}
    }

    function connect()
    	{
    	if (SASocket)
    		{
    		// alert('Already connected!');

    		return false;
    		}
    	try
    	{
    		webapis.sa.requestSAAgent(onsuccess, function (err)
    		{
    			console.log("err [" + err.name + "] msg[" + err.message + "]");
    			// alert("connect error SAsocket");
    		});
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
    		// alert("connect catch");
    	}
    }
    
    var peerAgentFindCallback =
    {
    	onpeeragentfound : function(peerAgent)
    	{
    		try
    		{
    			if (peerAgent.appName == ProviderAppName)
    			{
    				// alert("peerAgentFindCallback1");
    			}
    			else
    			{
    				// alert("Not expected app!! : " + peerAgent.appName);
    			}
    		}
    		catch(err)
    		{
    			console.log("exception [" + err.name + "] msg[" + err.message + "]");
    			// alert("peerAgentFindCallback error");
    		}
    	}, onerror : onerror
    }

    function onsuccess(agents)
    {
    	try
    	{
    		if (agents.length > 0)
    		{
    		SAAgent = agents[0];

    		SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
    		SAAgent.findPeerAgents();
    		// alert("onsuccess");
    		}
    		else
    		{
    		// alert("Not found SAAgent!!");
    		}
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
    		// alert("onsuccess error1");
    	}
    }
    
    var peerAgentFindCallback =
    {
    	onpeeragentfound : function(peerAgent)
    	{
    		try
    		{
    			if (peerAgent.appName == ProviderAppName)
    			{
    				SAAgent.setServiceConnectionListener(agentCallback);
    				SAAgent.requestServiceConnection(peerAgent);
    				// alert("peerAgentFindCallback0")
    			}
    			else
    			{
    				// alert("Not expected app!! : " + peerAgent.appName);
    			}
    		}
    		catch(err)
    		{
    			console.log("exception [" + err.name + "] msg[" + err.message + "]");
    			// alert("peerAgentFindCallback error")
    		}
    	}, onerror : onerror
    }
    
    var agentCallback =
    {
    	onconnect : function(socket)
    	{
    		SASocket = socket;
    		
        	//createHTML(data);
        	// alert("pripojen!")
            var textbox = document.querySelector('.contents');
            textbox.addEventListener("click", function(){
            	var box = document.querySelector('#textbox');
            	box.innerHTML = "pripojen"
            });

    		SASocket.setDataReceiveListener(onreceive);

    		SASocket.setSocketStatusListener(function(reason)
    		{
    			console.log("Service connection lost, Reason : [" + reason + "]");
    			disconnect();
    		});
    	}, onerror : onerror
    };
    
    SASocket.setSocketStatusListener(function(reason)
    {
    			console.log("Service connection lost, Reason : [" + reason + "]");
    			disconnect();
    });
    
    function disconnect()
    {
    	try
    	{
    		if (SASocket != null)
    		{
    			SASocket.close();
    			SASocket = null;
    			createHTML("closeConnection");
    		}
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
    	}
    }

    
    function sendMessage(data)
    {
    	try
    	{
    		if (SASocket == null)
    		{
    			console.log("sap initialize");
    			connect();
//    			// alert("sendMessage0");

    			return false;
    		}
//    		// alert("sendMessage1");
    		SASocket.sendData(CHANNEL_ID, data);
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
    		//// alert("sendMessage error");
    		// alert(err.name)
    		// alert(err.message)
    	}
    }
    
    function onreceive(channelId, data)
    {
    	//createHTML(data);
    	 alert("ahoj received");
//        var textbox = document.querySelector('.contents');
//        textbox.addEventListener("click", function(){
//        	var box = document.querySelector('#textbox');
//        	box.innerHTML = (box.innerHTML === "Bazinga") ? "Watch" : "Bazinga";
//        });
    }
    
    

    

