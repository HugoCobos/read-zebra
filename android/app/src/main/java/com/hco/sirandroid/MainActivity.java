package com.hco.sirandroid;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import com.symbol.emdk.EMDKManager;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Inicializar el EMDKManager
    EMDKManager emdkManager = EMDKManager.getEMDKManager(this, new EMDKManager.EMDKListener() {
      @Override
      public void onOpened(EMDKManager emdkManager) {
        // Configurar el escáner y otras funcionalidades
      }

      @Override
      public void onClosed() {
        // Liberar recursos
      }
    });
  }
}
