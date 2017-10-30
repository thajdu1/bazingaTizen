package com.example.zrust.helloworld;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.*;
import android.widget.*;

import com.example.zrust.helloworld.service.ProviderService;

public class MainActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        IntentFilter filter = new IntentFilter(ProviderService.ACTION_DATA_RECEIVED);
        registerReceiver(statusReceiver, filter);
    }

    public void buttonOnClick(View view){
        System.out.println("You clicked me! :)");
        TextView textView3 = (TextView) findViewById(R.id.textView3);
        EditText text = (EditText) findViewById(R.id.editText);
        textView3.setText(text.getText());
        Intent i = new Intent(ProviderService.ACTION_DATA_SENT);
        i.putExtra("message", text.getText().toString());
        sendBroadcast(i);
    }

    BroadcastReceiver statusReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message");  //get the type of message from MyGcmListenerService 1 - lock or 0 -Unlock
            System.out.println("DATA RECEIVED: " + message);
            TextView textView3 = (TextView) findViewById(R.id.textView3);
            textView3.setText(message);
        }
    };
}
