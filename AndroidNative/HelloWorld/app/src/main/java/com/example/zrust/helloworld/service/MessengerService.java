package com.example.zrust.helloworld.service;

import android.app.Service;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.Messenger;
import android.os.RemoteException;
import android.util.Log;

public class MessengerService extends Service {
    // Constants describing types of message. Different types of messages can be
    // passed and this identifies them.
    /**
     * Message type: register the activity's messenger for receiving responses
     * from Service. We assume only one activity can be registered at one time.
     */
    public static final int MESSAGE_TYPE_REGISTER = 1;
    /**
     * Message type: text sent Activity<->Service
     */
    public static final int MESSAGE_TYPE_TEXT = 2;

    /**
     * Messenger used for handling incoming messages.
     */
    final Messenger mMessenger = new Messenger(new IncomingHandler());
    /**
     * Messenger on Activity side, used for sending messages back to Activity
     */
    Messenger mResponseMessenger = null;

    class IncomingHandler extends Handler {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case MESSAGE_TYPE_TEXT:
                    Bundle b = msg.getData();
                    if (b != null) {
                        Log.d("MessengerService",
                                "Service received message MESSAGE_TYPE_TEXT with: " + b.getCharSequence("data"));
                        sendToActivity("Who's there? You wrote: " + b.getCharSequence("data"));
                    } else {
                        Log.d("MessengerService", "Service received message MESSAGE_TYPE_TEXT with empty message");
                        sendToActivity("Who's there? Speak!");
                    }
                    break;
                case MESSAGE_TYPE_REGISTER:
                    Log.d("MessengerService", "Registered Activity's Messenger.");
                    mResponseMessenger = msg.replyTo;
                    break;
                default:
                    super.handleMessage(msg);
            }
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("MessengerService", "Service started");
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.d("MessengerService", "Binding messenger...");
        return mMessenger.getBinder();
    }

    /**
     * Sends message with text stored in bundle extra data ("data" key).
     *
     * @param text
     *            text to send
     */
    void sendToActivity(CharSequence text) {
        if (mResponseMessenger == null) {
            Log.d("MessengerService", "Cannot send message to activity - no activity registered to this service.");
        } else {
            Log.d("MessengerService", "Sending message to activity: " + text);
            Bundle data = new Bundle();
            data.putCharSequence("data", text);
            Message msg = Message.obtain(null, MESSAGE_TYPE_TEXT);
            msg.setData(data);
            try {
                mResponseMessenger.send(msg);
            } catch (RemoteException e) {
                // We always have to trap RemoteException (DeadObjectException
                // is thrown if the target Handler no longer exists)
                e.printStackTrace();
            }
        }
    }
}
