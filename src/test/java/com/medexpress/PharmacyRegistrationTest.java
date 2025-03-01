package com.medexpress;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medexpress.controller.PharmacyController;
import com.medexpress.dto.PharmacyDTO;
import com.medexpress.dto.UserDTO;
import com.medexpress.entity.Pharmacy;
import com.medexpress.entity.User;
import com.medexpress.service.EncryptionService;
import com.medexpress.service.PharmacyService;
import com.medexpress.validator.PharmacyValidator;
import com.medexpress.validator.UserValidator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
public class PharmacyRegistrationTest {
    private MockMvc mockMvc;

    @Mock
    private PharmacyService pharmacyService;

    @Mock
    private EncryptionService encryptionService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private PharmacyController pharmacyController;

    @Autowired
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(pharmacyController).build();
    }

    @Test
    void testPharmacyRegistration() throws Exception {

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("companyName", "Farmacia Centrale");
        requestBody.put("vatNumber", "532858201");
        requestBody.put("address", "Via Roma, 15");
        requestBody.put("email", "info@farmaciacentrale.it");
        requestBody.put("password", "Password123!");

        String encryptedPassword = "encryptedPassword123";
        when(encryptionService.encryptPassword(anyString())).thenReturn(encryptedPassword);

        Pharmacy pharmacy = new Pharmacy(
            "Farmacia Centrale", "532858201", "Via Roma, 15", 
            "info@farmaciacentrale.it", encryptedPassword, LocalDateTime.now(), LocalDateTime.now()
        );

        when(pharmacyService.createPharmacy(anyString(), anyString(), anyString(), anyString(), anyString()))
            .thenReturn(pharmacy);

        PharmacyDTO pharmacyDTO = new PharmacyDTO();
        pharmacyDTO.setCompanyName("Farmacia Centrale");
        pharmacyDTO.setEmail("info@farmaciacentrale.it");

        when(modelMapper.map(pharmacy, PharmacyDTO.class)).thenReturn(pharmacyDTO);

        System.out.println("User creato: " + pharmacy);
        System.out.println("UserDTO restituito: " + pharmacyDTO);
       
        try {
            //PharmacyValidator.validate(requestBody);
        } catch(Exception e) {
            System.out.println("Errore di validazione: " + e.getMessage());
            throw e;
        }


        mockMvc.perform(post("/api/v1/pharmacy")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.companyName").value("Farmacia Centrale"))
                .andExpect(jsonPath("$.email").value("info@farmaciacentrale.it"));

        verify(encryptionService, times(1)).encryptPassword("Password123!");
        verify(pharmacyService, times(1)).createPharmacy(anyString(), anyString(), anyString(), anyString(), anyString());
        verify(modelMapper, times(1)).map(any(Pharmacy.class), eq(PharmacyDTO.class));        
    }
    
}

