package com.medexpress.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import com.medexpress.dto.AIFAAutocompleteResponse;
import com.medexpress.dto.AIFADrugsResponse; 

@Service
public class AIFAService {

    private final WebClient webClient;

    public AIFAService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.aifa.gov.it").build();
    }

    public Mono<AIFAAutocompleteResponse> getAutocompleteResults(String query, int nos) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/aifa-bdf-eif-be/1.0.0/autocomplete")
                        .queryParam("query", query)
                        .queryParam("nos", nos)
                        .build())
                .retrieve()
                .bodyToMono(AIFAAutocompleteResponse.class);
    }

  public Mono<AIFADrugsResponse> getDrugs(String query, boolean spellingCorrection, int page) {
    return webClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/aifa-bdf-eif-be/1.0.0/formadosaggio/ricerca")
                    .queryParam("query", query)
                    .queryParam("spellingCorrection", spellingCorrection)
                    .queryParam("page", page)
                    .build())
            .retrieve()
            .bodyToMono(AIFADrugsResponse.class);
}



}
