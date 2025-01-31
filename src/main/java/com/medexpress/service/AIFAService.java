package com.medexpress.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import com.medexpress.dto.AIFAResponse;
import com.medexpress.dto.AifaDrugsResponse; 

@Service
public class AIFAService {

    private final WebClient webClient;

    public AIFAService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.aifa.gov.it").build();
    }

    public Mono<AIFAResponse> getAutocompleteResults(String query, int nos) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/aifa-bdf-eif-be/1.0.0/autocomplete")
                        .queryParam("query", query)
                        .queryParam("nos", nos)
                        .build())
                .retrieve()
                .bodyToMono(AIFAResponse.class);
    }

  public Mono<AifaDrugsResponse> getDrugs(String query, boolean spellingCorrection, int page) {
    return webClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/aifa-bdf-eif-be/1.0.0/formadosaggio/ricerca")
                    .queryParam("query", query)
                    .queryParam("spellingCorrection", spellingCorrection)
                    .queryParam("page", page)
                    .build())
            .retrieve()
            .bodyToMono(AifaDrugsResponse.class);
}



}
