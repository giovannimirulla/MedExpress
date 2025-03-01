package com.medexpress;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
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
public class UserTest {

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
    void createUser() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("name", "Mario");
        requestBody.put("surname", "Rossi");
        requestBody.put("fiscalCode", "RSSMRA80A14H501E");
        requestBody.put("address", "Via Roma, 10");
        requestBody.put("email", "mario.rossi@example.com");
        requestBody.put("password", "Password123!");
        requestBody.put("role", "PATIENT"); // Ora è una stringa
        String doctorId = new ObjectId().toString();
        requestBody.put("doctor", doctorId);

        // Simuliamo la crittografia della password
        String encryptedPassword = "encryptedPassword123";
        when(encryptionService.encryptPassword("Password123!")).thenReturn(encryptedPassword);

        // Simuliamo il recupero del dottore dal database
        User doctor = new User(new ObjectId(doctorId), "Dr. Luigi", "Bianchi", "BNCLGU80A01H501Z", "Via Milano, 20",
                "luigi.bianchi@example.com", "passwordDottore", User.Role.DOCTOR, null, LocalDateTime.now(), LocalDateTime.now());

        when(userService.findByEmail("luigi.bianchi@example.com")).thenReturn(doctor);

        // Simuliamo la creazione dell'utente
        User user = new User(new ObjectId(), "Mario", "Rossi", "RSSMRA80A14H501E", "Via Roma, 10",
                "mario.rossi@example.com", encryptedPassword, User.Role.PATIENT, doctor,
                LocalDateTime.now(), LocalDateTime.now());

        when(userService.createUser(
                anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()
        )).thenReturn(user);

        // Simuliamo la conversione in DTO
        UserDTO userDTO = new UserDTO();
        userDTO.setName("Mario");
        userDTO.setEmail("mario.rossi@example.com");

        when(modelMapper.map(any(User.class), eq(UserDTO.class))).thenReturn(userDTO);

        // Eseguiamo la chiamata HTTP simulata
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Mario"))
                .andExpect(jsonPath("$.email").value("mario.rossi@example.com"));

        // Verifichiamo che i metodi siano stati chiamati correttamente
        verify(encryptionService, times(1)).encryptPassword("Password123!");
        verify(userService, times(1)).createUser(
                anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()
        );
        verify(modelMapper, times(1)).map(any(User.class), eq(UserDTO.class));
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