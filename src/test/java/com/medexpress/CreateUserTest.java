package com.medexpress;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medexpress.controller.UserController;
import com.medexpress.dto.UserDTO;
import com.medexpress.entity.User;
import com.medexpress.service.EncryptionService;
import com.medexpress.service.UserService;
import com.medexpress.validator.UserValidator;

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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
public class CreateUserTest {

    // private MockMvc mockMvc;

    // @Mock
    // private UserService userService;

    // @Mock
    // private EncryptionService encryptionService;

    // @Mock
    // private ModelMapper modelMapper;

    // @InjectMocks
    // private UserController userController;

    // @Autowired
    // private ObjectMapper objectMapper = new ObjectMapper();
    // @BeforeEach
    // void setUp() {
    //     mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    // }

    // @Test
    // void testCreateUser() throws Exception {
       
    //     Map<String, String> requestBody = new HashMap<>();
    //     requestBody.put("name", "Mario");
    //     requestBody.put("surname", "Rossi");
    //     requestBody.put("fiscalCode", "RSSMRA80A14H501E");
    //     requestBody.put("address", "Via Roma, 10");
    //     requestBody.put("email", "mario.rossi@example.com");
    //     requestBody.put("password", "Password123!");
    //     requestBody.put("role", "1");
    //     requestBody.put("doctor", new ObjectId().toString()); 

      
    //     String encryptedPassword = "encryptedPassword123";
    //     when(encryptionService.encryptPassword("Password123!")).thenReturn(encryptedPassword);

    //     User user = new User(
    //         "Mario", "Rossi", "RSSMRA80A14H501E", "Via Roma, 10", 
    //         "mario.rossi@example.com", "encryptedPassword123", new ObjectId(requestBody.get("role")), 
    //         new ObjectId(requestBody.get("doctor")), LocalDateTime.now(), LocalDateTime.now()
    //     );

    //     when(userService.createUser(anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString()))
    //     .thenReturn(user);

    //     UserDTO userDTO = new UserDTO();
    //     userDTO.setName("Mario");
    //     userDTO.setEmail("mario.rossi@example.com");

    //     when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);
        
    //     System.out.println("User creato: " + user);
    //     System.out.println("UserDTO restituito: " + userDTO);

       
    //     try {
            
    //         UserValidator.validate(requestBody);
    //     } catch(Exception e) {
    //         System.out.println("Errore di validazione: " + e.getMessage());
    //         throw e;
    //     }

    //     mockMvc.perform(post("/api/v1/users")
    //             .contentType(MediaType.APPLICATION_JSON)
    //             .content(objectMapper.writeValueAsString(requestBody))) 
    //             .andExpect(status().isCreated())
    //             .andExpect(jsonPath("$.name").value("Mario")) 
    //             .andExpect(jsonPath("$.email").value("mario.rossi@example.com"));


    //     verify(encryptionService, times(1)).encryptPassword("Password123!");
    //     verify(userService, times(1)).createUser(anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyInt(), any(ObjectId.class));
    //     verify(modelMapper, times(1)).map(any(User.class), eq(UserDTO.class));
    //     //verify(userService, times(1)).deleteUser(user.getEmail());
   // }
}
    

