package com.example.zrust.helloworld.service;

import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.samsung.android.sdk.accessory.SAAgent;
import com.samsung.android.sdk.accessory.SAPeerAgent;
import com.samsung.android.sdk.accessory.SASocket;

import java.io.IOException;
import java.util.HashMap;

/**
 * Created by zrust on 25/10/2017.
 */

public class ProviderService extends SAAgent {
    private ProviderServiceConnection mConnectionHandler = null;

    public static final String TAG = "ProviderService";

    public static final int SERVICE_CONNECTION_RESULT_OK = 0;

    public static final int HELLOACCESSORY_CHANNEL_ID = 110;


    HashMap<Integer, ProviderServiceConnection> mConnectionsMap = null;

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
        } else {
            System.out.print("TADAAAAAAM ERROR");
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


        ProviderServiceConnection myConnection = (ProviderServiceConnection) socket;

        if (result == SAAgent.CONNECTION_SUCCESS)
        {
            if (socket != null)
            {

                if (mConnectionsMap == null) {
                    mConnectionsMap = new HashMap<Integer, ProviderServiceConnection>();
                }

                myConnection.mConnectionId = (int) (System.currentTimeMillis() & 255);

                System.out.println("onServiceConnection connectionID = "
                        + myConnection.mConnectionId);

                mConnectionsMap.put(myConnection.mConnectionId, myConnection);

                System.out.println("Gear connection is successful.");

                myConnection.sendMsgToWatch("Whatever connected");
            }
        }
        else if (result == SAAgent.CONNECTION_ALREADY_EXIST)
        {
            System.out.println("Gear connection is already exist.");
        }
    }

    public class ProviderServiceConnection extends SASocket
    {
        private int mConnectionId;
        public ProviderServiceConnection() {
            super(ProviderServiceConnection.class.getName());
        }

        public void sendMsgToWatch(String msg) {
            System.out.println("In sendMsgToWatch");
            final String message = msg;
            final ProviderServiceConnection uHandler = mConnectionsMap
                    .get(Integer.parseInt(String.valueOf(mConnectionId)));
            if (uHandler == null) {
                System.out.println("Error, can not get HelloAccessoryProviderConnection handler");
                return;
            }
            new Thread(new Runnable() {
                public void run() {
                    try {
                        uHandler.send(HELLOACCESSORY_CHANNEL_ID,
                                message.getBytes());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }).start();
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




