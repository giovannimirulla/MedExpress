package com.medexpress;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersSpec;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersUriSpec;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Mono;

import com.medexpress.dto.AIFAAutocompleteResponse;
import com.medexpress.dto.AIFADrugResponse;
import com.medexpress.dto.AIFADrugsResponse;
import com.medexpress.service.AIFAService;

@ExtendWith(MockitoExtension.class)
class AIFAServiceTest {
        
    @InjectMocks
    private AIFAService aifaService;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec<?> requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec<?> requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @Mock
    private WebClient.Builder webClientBuilder;
                
    @BeforeEach
    void setUp() {
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);
        aifaService = new AIFAService(webClientBuilder);
    }

    @Test
    void testGetAutocompleteResults_Success() {
        String query = "tachipi";
        int nos = 5;

        // Creazione della risposta mock
        AIFAAutocompleteResponse mockResponse = new AIFAAutocompleteResponse();
        mockResponse.setStatus(200);
        mockResponse.setData(List.of("Paracetamolo", "Ibuprofene"));

        // Mock degli step della catena WebClient
        WebClient.RequestHeadersUriSpec mockUriSpec = mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec mockHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec mockResponseSpec = mock(WebClient.ResponseSpec.class);

        // Fix: Cast esplicito a (WebClient.RequestHeadersUriSpec<?>)
        when(webClient.get()).thenReturn(mockUriSpec);
        when(mockUriSpec.uri(any(Function.class))).thenReturn((WebClient.RequestHeadersSpec<?>) mockHeadersSpec);
        when(mockHeadersSpec.retrieve()).thenReturn(mockResponseSpec);
        when(mockResponseSpec.bodyToMono(AIFAAutocompleteResponse.class)).thenReturn(Mono.just(mockResponse));

        // Eseguiamo il test
        AIFAAutocompleteResponse result = aifaService.getAutocompleteResults(query, nos).block();

        // Verifiche
        assertNotNull(result);
        assertEquals(200, result.getStatus());
        assertFalse(result.getData().isEmpty());
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