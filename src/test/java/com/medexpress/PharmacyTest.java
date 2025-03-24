package com.medexpress;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medexpress.controller.AuthController;
import com.medexpress.controller.PharmacyController;
import com.medexpress.dto.PharmacyDTO;
import com.medexpress.entity.Pharmacy;
import com.medexpress.enums.AuthEntityType;
import com.medexpress.security.JwtUtil;
import com.medexpress.service.EncryptionService;
import com.medexpress.service.PharmacyService;


import org.bson.types.ObjectId;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
public class PharmacyTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private PharmacyService pharmacyService;

    @Mock
    private EncryptionService encryptionService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private PharmacyController pharmacyController;

    @InjectMocks
    private AuthController authController;

    @Mock
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(pharmacyController,authController).build();
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

        MvcResult result = mockMvc.perform(post("/api/v1/pharmacy")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.companyName").value("Farmacia Centrale"))
                .andExpect(jsonPath("$.email").value("info@farmaciacentrale.it"))
                .andReturn();

        System.out.println("Test createPharmacy completato con status: " + result.getResponse().getStatus());

        verify(encryptionService, times(1)).encryptPassword("Password123!");
        verify(pharmacyService, times(1)).createPharmacy(anyString(), anyString(), anyString(), anyString(), anyString());
        verify(modelMapper, times(1)).map(any(Pharmacy.class), eq(PharmacyDTO.class));        
    }
    @Test
    void loginPharmacy() throws Exception {
        // Definizione delle credenziali
        String email = "farmacia.roma@example.com";
        String plainPassword = "Password123!";
        String encryptedPassword = "encryptedPassword123"; // Simulazione della password crittografata
    
        // Creazione di una farmacia simulata
        Pharmacy pharmacy = new Pharmacy(new ObjectId(), "Farmacia Roma", "IT123456789",
                "Via Roma, 20", email, encryptedPassword, LocalDateTime.now(), LocalDateTime.now());
    
        // Mockiamo la ricerca della farmacia per email
        when(pharmacyService.findByEmail(email)).thenReturn(pharmacy);
    
        // Mockiamo la verifica della password
        when(encryptionService.verifyPassword(plainPassword, encryptedPassword)).thenReturn(true);
    
        // Mockiamo la generazione dei token JWT
        when(jwtUtil.generateAccessToken(eq(pharmacy.getId().toString()), eq(AuthEntityType.PHARMACY))).thenReturn("mocked-jwt-token");
                when(jwtUtil.generateRefreshToken(eq(pharmacy.getId().toString()), eq(AuthEntityType.PHARMACY))).thenReturn("mocked-refresh-token");
    
        // Simuliamo la richiesta di login (password in chiaro!)
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", email);
        loginRequest.put("password", plainPassword); // IMPORTANTE: password in chiaro
    
        // Eseguiamo la richiesta
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login/pharmacy")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk()) // Deve restituire 200 OK
                .andExpect(jsonPath("$.accessToken").value("mocked-jwt-token"))
                .andExpect(jsonPath("$.refreshToken").value("mocked-refresh-token"))
                .andReturn();


        System.out.println("Test loginPharmacy completato con status: " + result.getResponse().getStatus());
    
        // Verifichiamo che i metodi mockati siano stati chiamati
        verify(pharmacyService, times(1)).findByEmail(email);
        verify(encryptionService, times(1)).verifyPassword(plainPassword, encryptedPassword);
        verify(jwtUtil, times(1)).generateAccessToken(eq(pharmacy.getId().toString()), eq(AuthEntityType.PHARMACY));
        verify(jwtUtil, times(1)).generateRefreshToken(eq(pharmacy.getId().toString()), eq(AuthEntityType.PHARMACY));
    }
}

