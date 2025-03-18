package com.medexpress.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.annotation.PreDestroy;

@CrossOrigin // Gestisce le richieste da origini diverse
@org.springframework.context.annotation.Configuration  // Usa questa annotazione per le configurazioni di bean
public class SocketIOConfig {
    @Value("${socket.host}") 
    private String SOCKETHOST;
    
    @Value("${socket.port}") 
    private int SOCKETPORT;
    
    private SocketIOServer server;
    
    @Bean
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname(SOCKETHOST);
        config.setPort(SOCKETPORT);
        
        server = new SocketIOServer(config);
        
        // Aggiungiamo il listener per la connessione
        server.addConnectListener((ConnectListener) client -> 
            System.out.println("Client connesso: " + client.getSessionId())
        );
        
        // Aggiungiamo il listener per la disconnessione
        server.addDisconnectListener((DisconnectListener) client -> 
            System.out.println("Client disconnesso: " + client.getSessionId())
        );
        
        server.start();
        return server;
    }
    
    @PreDestroy
    public void stopSocketIOServer() {
        if (this.server != null) {
            this.server.stop();
            System.out.println("Socket.IO Server arrestato.");
        }
    }
}