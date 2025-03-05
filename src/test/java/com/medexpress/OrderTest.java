package com.medexpress;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.entity.Order;
import com.medexpress.entity.User;
import com.medexpress.repository.OrderRepository;
import com.medexpress.repository.UserRepository;
import com.medexpress.security.JwtUtil;
import com.medexpress.service.AIFAService;
import com.medexpress.service.OrderService;

import io.jsonwebtoken.Claims;

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
    private Claims claims;

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
        when(jwtUtil.validateToken("invalidToken")).thenReturn(null);

        Exception exception = assertThrows(ResponseStatusException.class,
                () -> orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH));

        assertEquals("401 UNAUTHORIZED", exception.getMessage());
    }
    
    @Test
    void shouldThrowExceptionWhenAIFAServiceIsNotAvailable() {
        when(jwtUtil.validateToken("validToken")).thenReturn(claims); // Restituiamo un mock di Claims
        when(claims.getSubject()).thenReturn(userId); // Simuliamo la chiamata getSubject()
        
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class,
                () -> orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH));

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void shouldCreateOrderWithoutPrescriptionWithNormalPriority(){
        String validToken = "validToken";
        
        when(jwtUtil.validateToken(validToken)).thenReturn(claims);
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));

        Order order = new Order(packageId, user, null, null, drugId, null, null, Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.NORMAL);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.NO_APPROVAL_NEEDED, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority());

        verify(jwtUtil, times(1)).validateToken(validToken);
    }

    @Test
    void shouldCreateOrderWithoutPrescriptionWithHighPriority() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, null, null, Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.NO_APPROVAL_NEEDED, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.HIGH, createdOrder.getPriority());
    }

    @Test
    void shouldCreateOrderWithPrescriptionWithLowPriority() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, null, null, Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority());
    }

    @Test
    void shouldCreateOrderWithPrescriptionWithHighPriority() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, null, null, Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING, Order.Priority.HIGH);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.HIGH);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.HIGH, createdOrder.getPriority());
    }

    @Test
    void shouldKeepOrderPendingWhenPriorityIsWaiting() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, null, null, Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority());
    }

    @Test
    void shouldApproveOrderWhenDoctorApproves() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, null, null, Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.APPROVED, Order.Priority.NORMAL);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.APPROVED, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.APPROVED, createdOrder.getStatusDoctor());
    }

    @Test
    void shouldNotRejectOrderWhenNotExplicitlyRejected() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, null, null, Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertNotEquals(Order.StatusDoctor.REJECTED, createdOrder.getStatusDoctor());
    }
   
}
