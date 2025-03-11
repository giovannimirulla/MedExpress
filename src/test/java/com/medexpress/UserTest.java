package com.medexpress;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.ArgumentMatchers.nullable;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medexpress.controller.AuthController;
import com.medexpress.controller.UserController;
import com.medexpress.dto.UserDTO;
import com.medexpress.entity.User;
import com.medexpress.security.JwtUtil;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@ExtendWith(MockitoExtension.class)
class UserTest {

        @Autowired
        private MockMvc mockMvc;
        
        @Autowired
        private ObjectMapper objectMapper;
    
        @Mock
        private UserService userService;
    
        @Mock
        private EncryptionService encryptionService;
    
        @Mock
        private ModelMapper modelMapper;

        @InjectMocks
        private UserController userController;

        @InjectMocks
        private AuthController authController;

        @Mock
        private JwtUtil jwtUtil;


        @BeforeEach
        void setUp() {
                objectMapper = new ObjectMapper();
                mockMvc = MockMvcBuilders.standaloneSetup(userController,authController).build();
        }

        @Test
        void createUserPatient() throws Exception {
                Map<String, String> requestBody = new HashMap<>();
                requestBody.put("name", "Mario");
                requestBody.put("surname", "Rossi");
                requestBody.put("fiscalCode", "RSSMRA80A14H501E");
                requestBody.put("address", "Via Roma, 10");
                requestBody.put("email", "mario.rossi@example.com");
                requestBody.put("password", "Password123!");
                requestBody.put("role", "PATIENT");
                String doctorId = new ObjectId().toString();
                requestBody.put("doctor", doctorId);

                String encryptedPassword = "encryptedPassword123";
                when(encryptionService.encryptPassword("Password123!")).thenReturn(encryptedPassword);

                User doctor = new User(new ObjectId(doctorId), "Dr. Luigi", "Bianchi", "BNCLGU80A01H501Z", "Via Milano, 20",
                        "luigi.bianchi@example.com", "passwordDottore", User.Role.DOCTOR, null, LocalDateTime.now(), LocalDateTime.now());

                User patient = new User(new ObjectId(), "Mario", "Rossi", "RSSMRA80A14H501E", "Via Roma, 10",
                        "mario.rossi@example.com", encryptedPassword, User.Role.PATIENT, doctor,
                        LocalDateTime.now(), LocalDateTime.now());

                doReturn(new User()).when(userService).createUser(
                anyString(), anyString(), anyString(), anyString(),
                anyString(), anyString(), eq("PATIENT"), nullable(String.class)
                );

                UserDTO userDTO = new UserDTO();
                userDTO.setName("Mario");
                userDTO.setEmail("mario.rossi@example.com");

                when(modelMapper.map(any(User.class), eq(UserDTO.class))).thenReturn(userDTO);

                MvcResult result = mockMvc.perform(post("/api/v1/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                        .andExpect(status().isCreated())
                        .andExpect(jsonPath("$.name").value("Mario"))
                        .andExpect(jsonPath("$.email").value("mario.rossi@example.com"))
                        .andExpect(status().isCreated())
                        .andReturn();

                System.out.println("Test createUserPatient completato con status: " + result.getResponse().getStatus());

                verify(encryptionService, times(1)).encryptPassword("Password123!");
                verify(userService, times(1)).createUser(
                anyString(), anyString(), anyString(), anyString(),
                anyString(), anyString(), eq("PATIENT"), nullable(String.class)
                );
                verify(modelMapper, times(1)).map(any(User.class), eq(UserDTO.class));
        }
    
        @Test
        void createUserDoctor() throws Exception {
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("name", "Luigi");
            requestBody.put("surname", "Bianchi");
            requestBody.put("fiscalCode", "BNCLGU80A01H501Z");
            requestBody.put("address", "Via Milano, 20");
            requestBody.put("email", "luigi.bianchi@example.com");
            requestBody.put("password", "Password456!");
            requestBody.put("role", "DOCTOR");
    
            String encryptedPassword = "encryptedPassword456";
            when(encryptionService.encryptPassword("Password456!")).thenReturn(encryptedPassword);
    
            User doctor = new User(new ObjectId(), "Luigi", "Bianchi", "BNCLGU80A01H501Z", "Via Milano, 20",
                    "luigi.bianchi@example.com", encryptedPassword, User.Role.DOCTOR, null,
                    LocalDateTime.now(), LocalDateTime.now());
    
            when(userService.createUser(
                    anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), eq("DOCTOR"), isNull()
            )).thenReturn(doctor);
    
            UserDTO userDTO = new UserDTO();
            userDTO.setName("Luigi");
            userDTO.setEmail("luigi.bianchi@example.com");
    
            when(modelMapper.map(any(User.class), eq(UserDTO.class))).thenReturn(userDTO);
    
            MvcResult result = mockMvc.perform(post("/api/v1/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestBody)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.name").value("Luigi"))
                    .andExpect(jsonPath("$.email").value("luigi.bianchi@example.com"))
                    .andExpect(status().isCreated())
                    .andReturn();
            
            System.out.println("Test createUserDoctor completato con status: " + result.getResponse().getStatus());

            verify(encryptionService, times(1)).encryptPassword("Password456!");
            verify(userService, times(1)).createUser(
                anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), eq("DOCTOR"), isNull()
            );
            verify(modelMapper, times(1)).map(any(User.class), eq(UserDTO.class));
        }
    
        @Test
        void createUserDriver() throws Exception {

                Map<String, String> requestBody = new HashMap<>();
                requestBody.put("name", "Marco");
                requestBody.put("surname", "Verdi");
                requestBody.put("fiscalCode", "VRDMRC90B10H501Y");
                requestBody.put("address", "Via Napoli, 5");
                requestBody.put("email", "marco.verdi@example.com");
                requestBody.put("password", "DriverPass789!");
                requestBody.put("role", "DRIVER");
        
                String encryptedPassword = "encryptedPassword789";
                when(encryptionService.encryptPassword("DriverPass789!")).thenReturn(encryptedPassword);
        
                User driver = new User(new ObjectId(), "Marco", "Verdi", "VRDMRC90B10H501Y", "Via Napoli, 5",
                        "marco.verdi@example.com", encryptedPassword, User.Role.DRIVER, null,
                        LocalDateTime.now(), LocalDateTime.now());
        
                when(userService.createUser(
                        anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), eq("DRIVER"), isNull()
                )).thenReturn(driver);
        
                UserDTO userDTO = new UserDTO();
                userDTO.setName("Marco");
                userDTO.setEmail("marco.verdi@example.com");
    
                when(modelMapper.map(any(User.class), eq(UserDTO.class))).thenReturn(userDTO);

                MvcResult result = mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                        .andExpect(status().isCreated())
                        .andExpect(jsonPath("$.name").value("Marco"))
                        .andExpect(jsonPath("$.email").value("marco.verdi@example.com"))
                        .andExpect(status().isCreated())
                        .andReturn();
                
                System.out.println("Test createUserDriver completato con status: " + result.getResponse().getStatus());

                verify(encryptionService, times(1)).encryptPassword("DriverPass789!");
                verify(userService, times(1)).createUser(
                        anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), eq("DRIVER"), isNull()
                );

                verify(modelMapper, times(1)).map(any(User.class), eq(UserDTO.class));
        }

        @Test
        void loginUser() throws Exception {
                Map<String, String> requestBody = new HashMap<>();
                requestBody.put("email", "mario.rossi@example.com");
                requestBody.put("password", "Password123!");
            
                // Simuliamo l'utente nel DB
                User user = new User(new ObjectId(), "Mario", "Rossi", "RSSMRA80A14H501E", "Via Roma, 10",
                        "mario.rossi@example.com", "encryptedPassword123", User.Role.PATIENT, null,
                        LocalDateTime.now(), LocalDateTime.now());
            
                // Simuliamo il recupero dell'utente per email
                when(userService.findByEmail("mario.rossi@example.com")).thenReturn(user);
            
                // Simuliamo la verifica della password
                when(encryptionService.verifyPassword("Password123!", "encryptedPassword123")).thenReturn(true);
            
                // Simuliamo la generazione dei token JWT
                String jwtToken = "mocked-jwt-token";
                String refreshToken = "mocked-refresh-token";
                when(jwtUtil.generateAccessToken(anyString(), any())).thenReturn(jwtToken);
                when(jwtUtil.generateRefreshToken(anyString())).thenReturn(refreshToken);
            
                // Eseguiamo la richiesta
                MvcResult result = mockMvc.perform(post("/api/v1/auth/login/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                        .andExpect(status().isOk()) // Deve restituire 200 OK
                        .andExpect(jsonPath("$.access_token").value("mocked-jwt-token")) 
                        .andExpect(jsonPath("$.refresh_token").value("mocked-refresh-token"))
                        .andReturn();
            
                System.out.println("Test Login completato con status: " + result.getResponse().getStatus());
            
                // Verifica che i metodi siano stati chiamati
                verify(userService).findByEmail("mario.rossi@example.com");
                verify(encryptionService).verifyPassword("Password123!", "encryptedPassword123");
                verify(jwtUtil).generateAccessToken(anyString(), any());
                verify(jwtUtil).generateRefreshToken(anyString());
            }
    }

   