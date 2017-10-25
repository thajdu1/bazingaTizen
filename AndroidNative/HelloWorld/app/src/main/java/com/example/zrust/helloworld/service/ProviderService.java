package com.example.zrust.helloworld.service;

import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.samsung.android.sdk.accessory.SAAgent;
import com.samsung.android.sdk.accessory.SAPeerAgent;
import com.samsung.android.sdk.accessory.SASocket;

import java.io.IOException;

/**
 * Created by zrust on 25/10/2017.
 */

public class ProviderService extends SAAgent {
    private ProviderServiceConnection mConnectionHandler = null;


    public ProviderService() {
        super(ProviderService.class.getName());
    }

    @Override
    protected void onFindPeerAgentResponse(SAPeerAgent peerAgent, int result)
    {
        if (result == PEER_AGENT_FOUND)
        {
	/* Peer Agent is found */
            System.out.println("peer agent found");
        }
        else if (result == FINDPEER_DEVICE_NOT_CONNECTED)
        {
            System.out.println("peer agent not found, no device connected");
	/* Peer Agents are not found, no accessory device connected */
        }
        else if(result == FINDPEER_SERVICE_NOT_FOUND )
        {
            System.out.println("no service on connected device");
	/* No matching service on connected accessory */
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    protected void
    onServiceConnectionResponse(SAPeerAgent peerAgent, SASocket socket, int result)
    {
        if (result == SAAgent.CONNECTION_SUCCESS)
        {
            if (socket != null)
            {
                //mConnectionHandler = (ProviderServiceConnection) socket;
                System.out.println("Gear connection is successful.");
            }
        }
        else if (result == SAAgent.CONNECTION_ALREADY_EXIST)
        {
            System.out.println("Gear connection is already exist.");
        }
    }

    public class ProviderServiceConnection extends SASocket
    {
        public ProviderServiceConnection() {
            super(ProviderServiceConnection.class.getName());
        }

        @Override
        public void onReceive(int channelId, byte[ ] data)
        {
            if (mConnectionHandler == null)
            {
                return;
            }
            final String message = new String(data);
            System.out.println("*** ON RECEIVE START");
            System.out.println(message);
            System.out.println("*** ON RECEIVE END");

        }

        @Override
        public void onError(int channelId, String errorString, int error) {
            System.out.println(errorString);
        }

        @Override
        public void onServiceConnectionLost(int channelId){
            System.out.println("*** ON SERVICE CONNECTION LOST START");
            System.out.println(channelId);
            System.out.println("*** ON SERVICE CONNECTION LOST END");
        }
    }


}




