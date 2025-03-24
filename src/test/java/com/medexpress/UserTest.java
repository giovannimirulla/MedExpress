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
                requestBody.put("doctor", null);
        
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

                MvcResult result = mockMvc.perform(post("/api/v1/user")
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

   