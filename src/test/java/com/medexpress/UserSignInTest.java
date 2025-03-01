package com.medexpress;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medexpress.controller.UserController;
import com.medexpress.dto.UserDTO;
import com.medexpress.entity.User;
import com.medexpress.service.EncryptionService;
import com.medexpress.service.UserService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserSignInTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private EncryptionService encryptionService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private UserController userController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void loginUser() throws Exception {
        // Creiamo un utente simulato
        String email = "mario.rossi@example.com";
        String password = "Password123!";
        String encryptedPassword = "encryptedPassword123";

        User user = new User(new ObjectId(), "Mario", "Rossi", "RSSMRA80A14H501E", "Via Roma, 10",
                email, encryptedPassword, User.Role.PATIENT, null,
                LocalDateTime.now(), LocalDateTime.now());

        // Mockiamo la ricerca dell'utente per email
        when(userService.findByEmail(email)).thenReturn(user);

        // Simuliamo la richiesta di login
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", email);
        loginRequest.put("password", password);

        mockMvc.perform(post("/api/v1/auth/login") // Supponendo che l'endpoint del login sia questo
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.role").value("PATIENT")); // Verifica che il ruolo restituito sia corretto

        verify(userService, times(1)).findByEmail(email);
    }
}