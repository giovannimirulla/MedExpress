package com.medexpress.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Mono;
import com.medexpress.dto.AIFAAutocompleteResponse;
import com.medexpress.dto.AIFADrugResponse;
import com.medexpress.dto.AIFADrugsResponse; 
import com.medexpress.dto.CommonPackage;

@Service
public class AIFAService {

    private final WebClient webClient;

    public AIFAService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.aifa.gov.it").build();
    }

public Mono<AIFAAutocompleteResponse> getAutocompleteResults(String query, int nos) {
    if (query.length() < 2 || query.length() > 100) {
        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "The length of the query must be between 2 and 100 characters"));
    }
    return webClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/aifa-bdf-eif-be/1.0.0/autocomplete")
                    .queryParam("query", query)
                    .queryParam("nos", nos)
                    .build())
            .retrieve()
            .bodyToMono(AIFAAutocompleteResponse.class);
}


public Mono<AIFADrugsResponse> getDrugs(String query, boolean spellingCorrection, int page, int size) {
        return webClient.get()
                        .uri(uriBuilder -> {
                                uriBuilder.path("/aifa-bdf-eif-be/1.0.0/formadosaggio/ricerca")
                                                .queryParam("query", query)
                                                .queryParam("spellingCorrection", spellingCorrection)
                                                .queryParam("page", page)
                                                .queryParam("size", size);

                                return uriBuilder.build();
                        })
                        .retrieve()
                        .bodyToMono(AIFADrugsResponse.class);
}

//https://api.aifa.gov.it/aifa-bdf-eif-be/1.0.0/formadosaggio/0000049466?lang=it
public Mono<AIFADrugResponse> getDrug(String id) {
        return webClient.get()
                        .uri(uriBuilder -> {
                                uriBuilder.path("/aifa-bdf-eif-be/1.0.0/formadosaggio/" + id)
                                                .queryParam("lang", "it");

                                return uriBuilder.build();
                        })
                        .retrieve()
                        .bodyToMono(AIFADrugResponse.class);
                }

                public Mono<CommonPackage> getPackage(String drugId, String packageId) {
                        return getDrug(drugId)
                                .flatMap(drugResponse -> {
                                    if (drugResponse.getData() != null &&
                                        drugResponse.getData().getConfezioni() != null) {
                                        
                                        return drugResponse.getData().getConfezioni().stream()
                                                .filter(pkg -> packageId.equals(pkg.getIdPackage()))
                                                .findFirst()
                                                .map(Mono::just)
                                                .orElse(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found")));
                                    }
                                    return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Drug or package not found"));
                                });
                    }


}
