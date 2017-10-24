package com.example.zrust.helloworld;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.*;
import android.widget.*;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    void buttonOnClick(View view){
        System.out.println("You clicked me! :)");
        TextView textView3 = (TextView) findViewById(R.id.textView3);
        EditText text = (EditText) findViewById(R.id.editText);
        textView3.setText(text.getText());
    }
}
