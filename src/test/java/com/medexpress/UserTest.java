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
import com.medexpress.entity.User.Role;
import com.medexpress.enums.AuthEntityType;
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

        private String doctorId;

        @BeforeEach
        void setUp() {
                objectMapper = new ObjectMapper();
                mockMvc = MockMvcBuilders.standaloneSetup(userController, authController).build();
                User doctor = new User(new ObjectId(), "Luigi", "Bianchi", "BNCLGU80A01H501Z", "Via Milano, 20",
                "luigi.bianchi@example.com", "encryptedPassword456", User.Role.DOCTOR, null,
                LocalDateTime.now(), LocalDateTime.now());
                 doctorId = doctor.getId().toString();
        }

        @Test
        void createUserDoctor() throws Exception {
                System.out.println("Creating user doctor...");
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
                                anyString(), anyString(), anyString(), anyString(), anyString(), anyString(),
                                eq("DOCTOR"), isNull())).thenReturn(doctor);

                UserDTO userDTO = new UserDTO();
                userDTO.setName("Luigi");
                userDTO.setEmail("luigi.bianchi@example.com");

                when(modelMapper.map(any(User.class), eq(UserDTO.class))).thenReturn(userDTO);

                mockMvc.perform(post("/api/v1/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                        .andExpect(status().isCreated())
                        .andExpect(jsonPath("$.name").value("Luigi"))
                        .andExpect(jsonPath("$.email").value("luigi.bianchi@example.com"));

                verify(userService, times(1)).createUser(
                                eq("Luigi"), eq("Bianchi"), eq("BNCLGU80A01H501Z"), eq("Via Milano, 20"),
                                eq("luigi.bianchi@example.com"), eq(encryptedPassword), eq("DOCTOR"), isNull());
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
                requestBody.put("doctorId", doctorId);
        
                String encryptedPassword = "encryptedPassword123";
                when(encryptionService.encryptPassword(anyString())).thenReturn(encryptedPassword);
        
                User mockUser = new User();
                mockUser.setName("Mario");
                mockUser.setEmail("mario.rossi@example.com");
                when(userService.createUser(
                        anyString(), anyString(), anyString(), anyString(),
                        anyString(), anyString(), eq("PATIENT"), nullable(String.class)
                )).thenReturn(mockUser);
        
                UserDTO userDTO = new UserDTO();
                userDTO.setName("Mario");
                userDTO.setEmail("mario.rossi@example.com");
        
                when(modelMapper.map(any(User.class), eq(UserDTO.class))).thenReturn(userDTO);
        
                MvcResult result = mockMvc.perform(post("/api/v1/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                        .andExpect(status().isCreated())
                        .andExpect(jsonPath("$.name").value("Mario"))
                        .andExpect(jsonPath("$.email").value("mario.rossi@example.com"))
                        .andReturn();
        
                System.out.println("Test createUserPatient completato con status: " + result.getResponse().getStatus());
        
                verify(encryptionService, times(1)).encryptPassword(anyString());
                verify(userService, times(1)).createUser(
                        anyString(), anyString(), anyString(), anyString(),
                        anyString(), anyString(), eq("PATIENT"), nullable(String.class)
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
                requestBody.put("doctorId", doctorId);

                String encryptedPassword = "encryptedPassword789";
                when(encryptionService.encryptPassword(anyString())).thenReturn(encryptedPassword);

                User mockUser = new User();
                mockUser.setName("Marco");
                mockUser.setEmail("marco.verdi@example.com");
                when(userService.createUser(
                                anyString(), anyString(), anyString(), anyString(),
                                anyString(), anyString(), eq("DRIVER"), eq(doctorId))).thenReturn(mockUser);

                UserDTO userDTO = new UserDTO();
                userDTO.setName("Marco");
                userDTO.setEmail("marco.verdi@example.com");

                when(modelMapper.map(any(User.class), eq(UserDTO.class))).thenReturn(userDTO);

                mockMvc.perform(post("/api/v1/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                        .andExpect(status().isCreated())
                        .andExpect(jsonPath("$.name").value("Marco"))
                        .andExpect(jsonPath("$.email").value("marco.verdi@example.com"));

                verify(userService, times(1)).createUser(
                                eq("Marco"), eq("Verdi"), eq("VRDMRC90B10H501Y"), eq("Via Napoli, 5"),
                                eq("marco.verdi@example.com"), eq(encryptedPassword), eq("DRIVER"), eq(doctorId));
        }

        @Test
        void registerUserWithInvalidFiscalCodeOrUnderage() throws Exception {
                // Caso 1: Codice fiscale non valido
                Map<String, String> invalidFiscalCodeRequest = new HashMap<>();
                invalidFiscalCodeRequest.put("name", "Giovanni");
                invalidFiscalCodeRequest.put("surname", "Rossi");
                invalidFiscalCodeRequest.put("fiscalCode", "INVALIDCODE");
                invalidFiscalCodeRequest.put("address", "Via Torino, 15");
                invalidFiscalCodeRequest.put("email", "giovanni.rossi@example.com");
                invalidFiscalCodeRequest.put("password", "Password123!");
                invalidFiscalCodeRequest.put("role", "PATIENT");
                invalidFiscalCodeRequest.put("doctorId", doctorId);

                mockMvc.perform(post("/api/v1/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidFiscalCodeRequest)))
                        .andExpect(status().isBadRequest());
                        
                // Caso 2: Utente minorenne
                Map<String, String> underageRequest = new HashMap<>();
                underageRequest.put("name", "Luca");
                underageRequest.put("surname", "Bianchi");
                underageRequest.put("fiscalCode", "RSSMRA10A01H501E");
                underageRequest.put("address", "Via Firenze, 20");
                underageRequest.put("email", "luca.bianchi@example.com");
                underageRequest.put("password", "Password123!");
                underageRequest.put("role", "PATIENT");
                underageRequest.put("doctorId", doctorId);

                mockMvc.perform(post("/api/v1/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(underageRequest)))
                        .andExpect(status().isBadRequest());
      
                Map<String, String> requestBody = new HashMap<>();
                requestBody.put("email", "mario.rossi@example.com");
                requestBody.put("password", "Password123!");

                User mockUser = new User();
                mockUser.setId(new ObjectId());
                mockUser.setPassword("hashed-password");
                mockUser.setRole(Role.PATIENT);

                when(userService.findByEmail(eq("mario.rossi@example.com"))).thenReturn(mockUser);
                when(encryptionService.verifyPassword(eq("Password123!"), eq("hashed-password"))).thenReturn(true);
                when(jwtUtil.generateAccessToken(eq(mockUser.getId().toString()), eq(AuthEntityType.USER)))
                                .thenReturn("mocked-jwt-token");
                when(jwtUtil.generateRefreshToken(eq(mockUser.getId().toString()), eq(AuthEntityType.USER)))
                                .thenReturn("mocked-refresh-token");

                MvcResult result = mockMvc.perform(post("/api/v1/auth/login/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").value("mocked-jwt-token"))
                                .andExpect(jsonPath("$.refreshToken").value("mocked-refresh-token"))
                                .andReturn();

                System.out.println("Test loginUser completato con status: " + result.getResponse().getStatus());

                verify(userService, times(1)).findByEmail(eq("mario.rossi@example.com"));
                verify(encryptionService, times(1)).verifyPassword(eq("Password123!"), eq("hashed-password"));
                verify(jwtUtil, times(1)).generateAccessToken(eq(mockUser.getId().toString()), eq(AuthEntityType.USER));
                verify(jwtUtil, times(1)).generateRefreshToken(eq(mockUser.getId().toString()),
                                eq(AuthEntityType.USER));
        }

        // @Test
        // void runTestsInOrder() throws Exception {
        //         createUserDoctor();
        //         createUserPatient();
        //         // createUserDriver();
        //         // registerUserWithInvalidFiscalCodeOrUnderage();
        // }


        @Test
        void loginUser() throws Exception {
                Map<String, String> requestBody = new HashMap<>();
                requestBody.put("email", "mario.rossi@example.com");
                requestBody.put("password", "Password123!");
        
                User mockUser = new User();
                mockUser.setId(new ObjectId());
                mockUser.setPassword("hashed-password");
                mockUser.setRole(Role.PATIENT); // Ensure the role is set
        
                when(userService.findByEmail(eq("mario.rossi@example.com"))).thenReturn(mockUser);
                when(encryptionService.verifyPassword(eq("Password123!"), eq("hashed-password"))).thenReturn(true);
                when(jwtUtil.generateAccessToken(eq(mockUser.getId().toString()), eq(AuthEntityType.USER))).thenReturn("mocked-jwt-token");
                when(jwtUtil.generateRefreshToken(eq(mockUser.getId().toString()), eq(AuthEntityType.USER))).thenReturn("mocked-refresh-token");
        
                MvcResult result = mockMvc.perform(post("/api/v1/auth/login/user")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.accessToken").value("mocked-jwt-token"))
                        .andExpect(jsonPath("$.refreshToken").value("mocked-refresh-token"))
                        .andReturn();
        
                System.out.println("Test loginUser completato con status: " + result.getResponse().getStatus());
        
                verify(userService, times(1)).findByEmail(eq("mario.rossi@example.com"));
                verify(encryptionService, times(1)).verifyPassword(eq("Password123!"), eq("hashed-password"));
                verify(jwtUtil, times(1)).generateAccessToken(eq(mockUser.getId().toString()), eq(AuthEntityType.USER));
                verify(jwtUtil, times(1)).generateRefreshToken(eq(mockUser.getId().toString()), eq(AuthEntityType.USER));
        }
}

   