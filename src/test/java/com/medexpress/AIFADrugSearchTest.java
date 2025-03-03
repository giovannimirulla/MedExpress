package com.medexpress;

import org.springframework.web.reactive.function.client.WebClient;
import com.medexpress.service.AIFAService;
import com.medexpress.dto.AIFADrugsResponse;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class AIFAServiceTest {

    private static MockWebServer mockWebServer;
    private static AIFAService aifaService;
    private static WebClient webClient;
    
    
    @BeforeAll
    static void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        aifaService = new AIFAService(null);// Lambda per simulare il WebClient.Builder
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void testGetDrugs_Success() {
        // Simuliamo una risposta JSON valida per il MockWebServer
        String jsonResponse = """
        {
            "status": 200,
            "data": {
                "content": [],
                "pageable": {
                    "pageNumber": 0,
                    "pageSize": 10
                },
                "last": false,
                "totalPages": 5,
                "totalElements": 50,
                "first": true,
                "numberOfElements": 10,
                "size": 10,
                "number": 0,
                "empty": false
            }
        }
        """;

        mockWebServer.enqueue(new MockResponse()
                .setBody(jsonResponse)
                .addHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE));

        // Eseguiamo la richiesta al service
        Mono<AIFADrugsResponse> responseMono = aifaService.getDrugs("paracetamolo", true, 0, 10);

        // Verifichiamo il risultato usando StepVerifier
        StepVerifier.create(responseMono)
                .assertNext(response -> {
                    assertNotNull(response);
                    assertEquals(200, response.getStatus());
                    assertNotNull(response.getData());
                    assertEquals(10, response.getData().getSize());
                })
                .verifyComplete();
    }

    @Test
    void testGetDrugs_NotFound() {
        // Simuliamo una risposta 404 dal server
        mockWebServer.enqueue(new MockResponse().setResponseCode(404));

        // Eseguiamo la richiesta
        Mono<AIFADrugsResponse> responseMono = aifaService.getDrugs("aspirina", true, 0, 10);

        // Verifichiamo che il Mono restituisca un errore
        StepVerifier.create(responseMono)
                .expectError()
                .verify();
    }

    @Test
    void testGetDrugs_ServerError() {
        // Simuliamo un errore 500 dal server
        mockWebServer.enqueue(new MockResponse().setResponseCode(500));

        // Eseguiamo la richiesta
        Mono<AIFADrugsResponse> responseMono = aifaService.getDrugs("ibuprofene", true, 0, 10);

        // Verifichiamo che la chiamata restituisca un errore
        StepVerifier.create(responseMono)
                .expectError()
                .verify();
    }
}