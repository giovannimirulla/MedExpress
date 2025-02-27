package com.medexpress.controller;

import com.medexpress.entity.OrderStatusMessage;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import org.springframework.stereotype.Component;


@Component

public class SocketIOController {
    private final SocketIOServer socketServer;

    SocketIOController(SocketIOServer socketServer){ // Constructor
        this.socketServer=socketServer;

        this.socketServer.addConnectListener(onUserConnectWithSocket);
        this.socketServer.addDisconnectListener(onUserDisconnectWithSocket);
        this.socketServer.addEventListener("messageSendToUser", OrderStatusMessage.class, onSendMessage);

    }

    // This method is used to connect the client to the server
    public ConnectListener onUserConnectWithSocket = new ConnectListener() {
        @Override
        public void onConnect(SocketIOClient client) {
           
        }
    };

    // This method is used to disconnect the client from the server
    public DisconnectListener onUserDisconnectWithSocket = new DisconnectListener() {
        @Override
        public void onDisconnect(SocketIOClient client) {
            
        }
    };

    // This method is used to send the message to the target user
    public DataListener<OrderStatusMessage> onSendMessage = new DataListener<OrderStatusMessage>() {
        @Override
        public void onData(SocketIOClient client, OrderStatusMessage message, AckRequest acknowledge) throws Exception {
          
            socketServer.getBroadcastOperations().sendEvent(message.getOrderId(),client, message);

            acknowledge.sendAckData("Message send to target user successfully");
        }
    };

}