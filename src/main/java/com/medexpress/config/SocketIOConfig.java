package com.medexpress.config;

import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin // This annotation is used to handle the request from a different origin
@Component  // This annotation is used to mark the class as a Spring component

public class SocketIOConfig {

	@Value("${socket.host}") // This annotation is used to inject the value from the application.properties file
	private String SOCKETHOST;
	@Value("${socket.port}") 
	private int SOCKETPORT;
	private SocketIOServer server;

	@Bean // It is an object that is instantiated, assembled, and otherwise managed by a Spring IoC container

    // This method is used to create the SocketIOServer instance
	public SocketIOServer socketIOServer() {
		Configuration config = new Configuration();
		config.setHostname(SOCKETHOST);
		config.setPort(SOCKETPORT);
		server = new SocketIOServer(config);
		server.start();
		server.addConnectListener(new ConnectListener() { // This method is used to add a listener to the server to connect the client
			@Override
			public void onConnect(SocketIOClient client) { //

			}
		});
    
        // This method is used to add a listener to the server to disconnect the client
		server.addDisconnectListener(new DisconnectListener() {
			@Override
			public void onDisconnect(SocketIOClient client) {
				client.getNamespace().getAllClients().stream().forEach(data-> { 
				});
			}
		});
		return server;
	}
    
	@PreDestroy // This annotation is used to perform the operations before the bean is destroyed
	public void stopSocketIOServer() {
		this.server.stop();
	}

}