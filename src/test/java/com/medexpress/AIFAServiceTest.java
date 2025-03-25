package com.medexpress;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Mono;

import com.medexpress.dto.AIFAAutocompleteResponse;
import com.medexpress.dto.AIFADrugResponse;
import com.medexpress.dto.AIFADrugsResponse;
import com.medexpress.service.AIFAService;

@ExtendWith(MockitoExtension.class)
class AIFAServiceTest {

        
    // @InjectMocks
    private AIFAService aifaService;
        
    // @Mock
    // private WebClient.Builder webClientBuilder;
    // @Mock
    // private WebClient webClient;
    // @Mock
    // private RequestHeadersUriSpec requestHeadersUriSpec;
    // @Mock
    // private RequestHeadersSpec requestHeadersSpec;
    // @Mock
    // private ResponseSpec responseSpec;
                
    private WebClient.Builder webClientBuilder;
                
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        webClientBuilder = WebClient.builder();
        // webClientBuilder.baseUrl("https://api.aifa.gov.it/");

        
        aifaService = new AIFAService(webClientBuilder);
    }

    @Test
    void testGetAutocompleteResults_Success() {
        String query = "tachipi";
        int nos = 5;
        AIFAAutocompleteResponse result = aifaService.getAutocompleteResults(query, nos).block();
        assertNotNull(result);
        assertEquals(result.getStatus(), HttpStatus.OK.value());
        assertTrue(result.getData().size() > 0);
    }

    @Test
    void testGetAutocompleteResults_InvalidQueryLength() {
        String shortQuery = "a";
        Exception exception = assertThrows(ResponseStatusException.class, () -> 
            aifaService.getAutocompleteResults(shortQuery, 5).block()
        );
        assertEquals(HttpStatus.BAD_REQUEST, ((ResponseStatusException) exception).getStatusCode());
    }

    @Test
    void testGetDrugs_Success() {
        String query = "aspirin";
        boolean spellingCorrection = true;
        int page = 1;
        int size = 10;
        Mono<AIFADrugsResponse> result = aifaService.getDrugs(query, spellingCorrection, page, size);
        assertNotNull(result.block());
    }

    @Test
    void testGetDrug_Success() {
        String drugId = "0000049466";
        Mono<AIFADrugResponse> result = aifaService.getDrug(drugId);
        assertNotNull(result.block());
    }
}