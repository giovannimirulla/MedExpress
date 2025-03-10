package com.medexpress.config;

import javax.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

@CrossOrigin // Gestisce le richieste da origini diverse
@Component  // Segnala a Spring che questa classe è un componente
public class SocketIOConfig {

    @Value("${socket.host}") 
    private String SOCKETHOST;
    
    @Value("${socket.port}") 
    private int SOCKETPORT;
    
    private SocketIOServer server;

    @Bean // Crea e configura l'istanza del server Socket.IO
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname(SOCKETHOST);
        config.setPort(SOCKETPORT);

		server = new SocketIOServer(config);
        
        server.addConnectListener(new ConnectListener() {
            @Override
            public void onConnect(SocketIOClient client) {
                System.out.println("Client connesso: " + client.getSessionId());
            }
        });

        server.addDisconnectListener(new DisconnectListener() {
            @Override
            public void onDisconnect(SocketIOClient client) {
                System.out.println("Client disconnesso: " + client.getSessionId());
            }
        });
        
        server.start();
        return server;
    }
    
    @PreDestroy // Spegne il server prima che l'app si chiuda
    public void stopSocketIOServer() {
        if (this.server != null) {
            this.server.stop();
            System.out.println("Socket.IO Server arrestato.");
        }
    }
}