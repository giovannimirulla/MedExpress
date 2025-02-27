package com.medexpress.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import com.medexpress.service.AIFAService;
import com.medexpress.dto.AIFAAutocompleteResponse;
import com.medexpress.dto.AIFADrugsResponse;
import com.medexpress.dto.CommonDrug;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/aifa")
public class AIFAController {

    private final AIFAService aifaService;

    public AIFAController(AIFAService aifaService) {
        this.aifaService = aifaService;
    }

    // autocomplete return list of drugs
    // https://api.aifa.gov.it/aifa-bdf-eif-be/1.0.0/autocomplete?query=tac&nos=5

    // {
    // "status": 200,
    // "data": [
    // "TACALCITOLO (ATC)",
    // "TACALCITOLO MONOIDRATO (PRINCIPIO ATTIVO)",
    // "TACFORIUS (MEDICINALE)",
    // "TACHICAF (MEDICINALE)",
    // "TACHIDOL (MEDICINALE)"
    // ]
    // }

    @GetMapping("/autocomplete")
    public Mono<AIFAAutocompleteResponse> getAutocomplete(@RequestParam String query,
            @RequestParam(defaultValue = "5") int nos) {
        return aifaService.getAutocompleteResults(query, nos);
    }

    // https://api.aifa.gov.it/aifa-bdf-eif-be/1.0.0/formadosaggio/ricerca?query=Tachipirina&spellingCorrection=true&page=0

    @GetMapping("/drugs")
    public Mono<AIFADrugsResponse> getDrugs(
            @RequestParam String query,
            @RequestParam(defaultValue = "true") boolean spellingCorrection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return aifaService.getDrugs(query, spellingCorrection, page, size);
    }

    // get package
    @GetMapping("/package")
    public Mono<CommonDrug> getPackage(
            // iddrug and idpackage
            @RequestParam String drugId,
            @RequestParam String packageId) {
        return aifaService.getPackage(drugId, packageId);
    }

}
