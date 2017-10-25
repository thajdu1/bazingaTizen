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
    });
};

    var ProviderAppName = "bazingaProvider"
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
    		}
    		else
    		{
    			alert("Not found SAAgent!!");
    		}
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
    	}
    }

    function connect()
    	{
    	if (SASocket)
    		{
    		alert('Already connected!');

    		return false;
    		}
    	try
    	{
    		webapis.sa.requestSAAgent(onsuccess, function (err)
    		{
    			console.log("err [" + err.name + "] msg[" + err.message + "]");
    		});
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
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
    			}
    			else
    			{
    				alert("Not expected app!! : " + peerAgent.appName);
    			}
    		}
    		catch(err)
    		{
    			console.log("exception [" + err.name + "] msg[" + err.message + "]");
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
    		}
    		else
    		{
    		alert("Not found SAAgent!!");
    		}
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
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
    			}
    			else
    			{
    				alert("Not expected app!! : " + peerAgent.appName);
    			}
    		}
    		catch(err)
    		{
    			console.log("exception [" + err.name + "] msg[" + err.message + "]");
    		}
    	}, onerror : onerror
    }
    
    var agentCallback =
    {
    	onconnect : function(socket)
    	{
    		SASocket = socket;
    		createHTML("startConnection");
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

    			return false;
    		}
    		SASocket.sendData(CHANNELID, data);
    	}
    	catch(err)
    	{
    		console.log("exception [" + err.name + "] msg[" + err.message + "]");
    	}
    }
    
    function onreceive(channelId, data)
    {
    	//createHTML(data);
    	alert("hello " + data)
    }
    
	SASocket.setDataReceiveListener(onreceive);
    

    

