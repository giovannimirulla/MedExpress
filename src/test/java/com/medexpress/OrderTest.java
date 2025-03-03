package com.medexpress;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.dto.CommonDrug;
import com.medexpress.entity.Order;
import com.medexpress.entity.User;
import com.medexpress.enums.AuthEntityType;
import com.medexpress.repository.OrderRepository;
import com.medexpress.repository.UserRepository;
import com.medexpress.security.JwtUtil;
import com.medexpress.service.AIFAService;
import com.medexpress.service.OrderService;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AIFAService aifaService;

    @Mock
    private JwtUtil jwtUtil;

    private String userId;
    private User user;
    private String validToken;
    private String invalidToken;
    private String packageId;
    private String drugId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        userId = new ObjectId().toString();
        packageId = "pkg1";
        drugId = "drug1";

        // Creazione utente mock
        user = new User();
        user.setId(new ObjectId(userId));

        validToken = "valid.jwt.token";
        invalidToken = "invalid.jwt.token";
    }

    @Test
    void shouldThrowExceptionWhenUserNotAuthenticated() {
        // Caso 1: Token non valido (utente non autenticato)
        when(jwtUtil.validateToken(invalidToken)).thenReturn(null);

        ResponseStatusException unauthException = assertThrows(ResponseStatusException.class,
                () -> orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH));

        assertEquals(HttpStatus.UNAUTHORIZED, unauthException.getStatusCode());

        // Caso 2: Utente non trovato nel database
        Claims claims = Mockito.mock(Claims.class);
        when(claims.getSubject()).thenReturn(userId);
        when(claims.get("entityType")).thenReturn(AuthEntityType.USER);
        
        when(jwtUtil.validateToken(validToken)).thenReturn(claims);
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.empty());

        RuntimeException userNotFoundException = assertThrows(RuntimeException.class,
                () -> orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH));

        assertEquals("User not found", userNotFoundException.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenAIFAServiceIsNotAvailable() {
        // Mock delle Claims per il JWT token
        Claims claims = Mockito.mock(Claims.class);
        when(claims.getSubject()).thenReturn(userId);
        when(claims.get("entityType")).thenReturn(AuthEntityType.USER);
        
        // Mock validazione del token
        when(jwtUtil.validateToken(validToken)).thenReturn(claims);
        
        // Mock utente esistente
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        
        // Simula il caso in cui AIFAService non restituisce dati (Mono vuoto)
        when(aifaService.getPackage(drugId, packageId)).thenReturn(Mono.empty());

        // Verifica che l'eccezione venga lanciata
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH));

        assertEquals("AIFA Service not available", exception.getMessage());
    }

    @Test
    void shouldCreateOrderWithoutPrescription() {
        // Creiamo un mock di Claims per simulare il token JWT
        Claims claims = Mockito.mock(Claims.class);
        when(claims.getSubject()).thenReturn(userId);
        when(claims.get("entityType")).thenReturn(AuthEntityType.USER);

        // Simuliamo la validazione del token con il mock di Claims
        when(jwtUtil.validateToken(validToken)).thenReturn(claims);

        // Simuliamo la ricerca dell'utente nel repository
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));

        // Simuliamo la risposta del servizio AIFA per ottenere il farmaco
        when(aifaService.getPackage(drugId, packageId)).thenReturn(Mono.just(new CommonDrug()));

        // Creiamo un ordine di test con lo stato NO_APPROVAL_NEEDED
        Order order = new Order(packageId, user, null, null, drugId, LocalDateTime.now(), LocalDateTime.now(),
                Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.NO_APPROVAL_NEEDED,
                Order.Priority.NORMAL);

        // Simuliamo il salvataggio dell'ordine
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Eseguiamo il metodo sotto test
        Order createdOrder = orderService.createOrder(packageId, userId, drugId, 
                            Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH);

        // Verifichiamo che l'ordine sia stato creato correttamente
        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.NO_APPROVAL_NEEDED, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority());  
    }

    @Test
    void shouldCreateOrderWithPrescriptionPendingApproval(){
         // Mock del Claims per simulare il JWT token
        Claims claims = Mockito.mock(Claims.class);
        when(claims.getSubject()).thenReturn(userId);
        when(claims.get("entityType")).thenReturn(AuthEntityType.USER);

        // Simuliamo la validazione del token con il mock di Claims
        when(jwtUtil.validateToken(validToken)).thenReturn(claims);

        // Simuliamo la ricerca dell'utente
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));

        // Simuliamo la risposta del servizio AIFA
        when(aifaService.getPackage(drugId, packageId)).thenReturn(Mono.just(new CommonDrug()));

        // Creiamo un ordine con status PENDING
        Order order = new Order(packageId, user, null, null, drugId, LocalDateTime.now(), LocalDateTime.now(),
                Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING,
                Order.Priority.NORMAL);

        // Simuliamo il salvataggio dell'ordine
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Eseguiamo il metodo sotto test
        Order createdOrder = orderService.createOrder(packageId, userId, drugId, 
                            Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        // Verifichiamo che l'ordine sia stato creato correttamente
        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority()); 
    }

    @Test
    void shouldUpdateOrderStatusDoctorApproved() {
        Order order = new Order(packageId, user, null, null, drugId, LocalDateTime.now(), LocalDateTime.now(),
                Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING,
                Order.Priority.NORMAL);

        when(orderRepository.findById(new ObjectId("order123"))).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order updatedOrder = orderService.updateStatusDoctor("order123", Order.StatusDoctor.APPROVED);

        assertEquals(Order.StatusDoctor.APPROVED, updatedOrder.getStatusDoctor());
    }

    @Test
    void shouldNotProcessOrderWhenDoctorDoesNotApprove() {
        // Mock Claims per il JWT token
        Claims claims = Mockito.mock(Claims.class);
        when(claims.getSubject()).thenReturn(userId);
        when(claims.get("entityType")).thenReturn(AuthEntityType.USER);

        // Mock validazione del token
        when(jwtUtil.validateToken(validToken)).thenReturn(claims);

        // Mock utente esistente
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));

        // Mock risposta AIFA con un farmaco valido
        when(aifaService.getPackage(drugId, packageId)).thenReturn(Mono.just(new CommonDrug()));

        // Creazione ordine con stato `PENDING`
        Order order = new Order(packageId, user, null, null, drugId, LocalDateTime.now(), LocalDateTime.now(),
                Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING, 
                Order.Priority.NORMAL);

        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Creazione ordine con prescrizione in attesa di approvazione
        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        // Verifica che l'ordine sia stato creato ma NON APPROVATO
        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());  // Il medico non ha ancora approvato
        assertNotEquals(Order.StatusDoctor.APPROVED, createdOrder.getStatusDoctor());  // Non deve essere approvato
    }

}
