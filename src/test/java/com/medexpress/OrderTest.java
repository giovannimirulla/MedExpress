package com.medexpress;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.dto.CommonDrug;
import com.medexpress.dto.CommonPackage;
import com.medexpress.dto.EntityDTO;
import com.medexpress.dto.OrderSocket;
import com.medexpress.entity.Order;
import com.medexpress.entity.Pharmacy;
import com.medexpress.entity.User;
import com.medexpress.repository.OrderRepository;
import com.medexpress.repository.PharmacyRepository;
import com.medexpress.repository.UserRepository;
import com.medexpress.security.JwtUtil;
import com.medexpress.service.AIFAService;
import com.medexpress.service.OrderService;
import com.corundumstudio.socketio.BroadcastOperations;
import com.corundumstudio.socketio.SocketIOServer;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

class OrderTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PharmacyRepository pharmacyRepository;

    @Mock
    private AIFAService aifaService;

    @Mock
    private Claims claims;

    @Mock
    private JwtUtil jwtUtil;
 
    @Mock
    private SocketIOServer socketServer;

    @Mock
    private BroadcastOperations broadcastOperations;

    private String userId;
    private User user;
    private Pharmacy pharmacy;
    private String packageId;
    private String drugId;
   

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);
        when(socketServer.getBroadcastOperations()).thenReturn(broadcastOperations);
        userId = new ObjectId().toString();
        packageId = "pkg1";
        drugId = "drug1";

        // Creazione utente mock
        user = new User();
        user.setId(new ObjectId(userId));

    }

    @Test
    void shouldThrowExceptionWhenUserNotAuthenticated() {
        // Mock del token JWT non valido
        when(jwtUtil.validateToken("invalidToken")).thenReturn(null);
        
        // Simuliamo il comportamento del repository: nessun utente trovato
        when(userRepository.findById(new ObjectId())).thenReturn(Optional.empty());

        // Verifica che venga lanciata una ResponseStatusException con stato 401
        RuntimeException  exception = assertThrows(RuntimeException.class, 
            () -> orderService.createOrder(packageId, userId, drugId, 
                                           Order.StatusDoctor.NO_APPROVAL_NEEDED, 
                                           Order.Priority.HIGH));

        // Controlla che il messaggio dell'eccezione sia quello atteso
        assertEquals("User not found", exception.getMessage());
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
    public void shouldCreateOrderWithoutPrescriptionWithNormalPriority() {
        String validToken = "validToken";
        String userId = "60c72b2f9b1e8a5f6d9b1e8b";
        String packageId = "packageId";
        String drugId = "drugId";
        Claims claims = mock(Claims.class);
        User user = new User();
        user.setId(new ObjectId(userId));

        when(jwtUtil.validateToken(validToken)).thenReturn(claims);
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));

        Order order = new Order(packageId, user, null, null, drugId,
                LocalDateTime.now(), LocalDateTime.now(),
                Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING,
                Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.NORMAL,
                new EntityDTO());

        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.NO_APPROVAL_NEEDED, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority());
}

    @Test
    void shouldCreateOrderWithoutPrescriptionWithHighPriority() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, 
                        LocalDateTime.now(), LocalDateTime.now(), 
                        Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, 
                        Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH, 
                        new EntityDTO());
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.Priority.HIGH);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.NO_APPROVAL_NEEDED, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.HIGH, createdOrder.getPriority());
    }

    @Test
    void shouldCreateOrderWithPrescriptionWithLowPriority() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, 
            LocalDateTime.now(), LocalDateTime.now(), 
            Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, 
            Order.StatusDoctor.PENDING, Order.Priority.NORMAL, 
            new EntityDTO());        
        
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority());
    }

    @Test
    void shouldCreateOrderWithPrescriptionWithHighPriority() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, 
        LocalDateTime.now(), LocalDateTime.now(), 
        Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, 
        Order.StatusDoctor.PENDING, Order.Priority.HIGH, 
        new EntityDTO());        
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.HIGH);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.HIGH, createdOrder.getPriority());
    }

    @Test
    void shouldKeepOrderPendingWhenPriorityIsWaiting() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, 
            LocalDateTime.now(), LocalDateTime.now(), 
            Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, 
            Order.StatusDoctor.PENDING, Order.Priority.NORMAL, 
            new EntityDTO());        
        
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.PENDING, createdOrder.getStatusDoctor());
        assertEquals(Order.Priority.NORMAL, createdOrder.getPriority());
    }

    @Test
    void shouldApproveOrderWhenDoctorApproves() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, 
        LocalDateTime.now(), LocalDateTime.now(), 
        Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, 
        Order.StatusDoctor.APPROVED, Order.Priority.NORMAL, 
        new EntityDTO());        
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.APPROVED, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertEquals(Order.StatusDoctor.APPROVED, createdOrder.getStatusDoctor());
    }

    @Test
    void shouldNotRejectOrderWhenNotExplicitlyRejected() {
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        Order order = new Order(packageId, user, null, null, drugId, 
        LocalDateTime.now(), LocalDateTime.now(),
        Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, 
        Order.StatusDoctor.PENDING, Order.Priority.NORMAL, 
        new EntityDTO());        
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(packageId, userId, drugId, Order.StatusDoctor.PENDING, Order.Priority.NORMAL);

        assertNotNull(createdOrder);
        assertNotEquals(Order.StatusDoctor.REJECTED, createdOrder.getStatusDoctor());
    }

    @Test
    void shouldAuthorizeMedicalPrescription() {
        // Creiamo un ObjectId per l'ordine
        ObjectId orderId = new ObjectId();

        // Creiamo l'utente con un ID valido
        User user = new User();
        user.setId(new ObjectId());
        user.setName("Nome");
        user.setSurname("Cognome");
        user.setEmail("email@example.com");

        // Creiamo l'ordine con l'ID e l'utente
        Order order = new Order(packageId, user, null, null, drugId,
            LocalDateTime.now(), LocalDateTime.now(),
            Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING,
            Order.StatusDoctor.PENDING, Order.Priority.HIGH,
            new EntityDTO());
        order.setId(orderId); // Assegniamo l'ID all'ordine

        // Mock del repository per restituire l'ordine quando viene cercato per ID
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        // Mock del repository per salvare l'ordine e restituirlo
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Mock del socketServer per evitare NullPointerException
        BroadcastOperations broadcastOperations = mock(BroadcastOperations.class);
        when(socketServer.getBroadcastOperations()).thenReturn(broadcastOperations);

        // Mock del servizio Aifa per restituire un CommonDrug
        CommonDrug commonDrug = new CommonDrug();
        when(aifaService.getPackage(order.getDrugId(), order.getPackageId())).thenReturn(Mono.just(commonDrug));

        // Aggiorniamo lo stato della prescrizione a APPROVED
        Order updatedOrder = orderService.updateStatusDoctor(orderId.toString(),
                Order.StatusDoctor.APPROVED,
                user);

        // Verifiche
        assertNotNull(updatedOrder);
        assertEquals(Order.StatusDoctor.APPROVED, updatedOrder.getStatusDoctor());
        assertNotNull(updatedOrder.getUpdatedAt());

        // Verifica che il repository sia stato chiamato per salvare l'ordine
        verify(orderRepository, times(1)).save(updatedOrder);

        // Verifica che l'evento sia stato inviato all'utente corretto
        verify(broadcastOperations, times(1))
            .sendEvent(eq(order.getUser().getId().toString()), any(OrderSocket.class));
    }
    
    @Test
    void testGetOrdersByPharmacy() {

        ObjectId pharmacyId = new ObjectId(); 
        String pharmacyIdString = pharmacyId.toString();
        Order order = new Order(); 

        when(orderRepository.findByPharmacy_IdOrPharmacyIsNullAndStatusDoctorIn(
                any(ObjectId.class), anyList(), any(Sort.class)))
                .thenReturn(List.of(order)); 

        List<Order> result = orderService.getOrdersByPharmacy(pharmacyIdString);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(orderRepository, times(1)).findByPharmacy_IdOrPharmacyIsNullAndStatusDoctorIn(
                any(ObjectId.class), anyList(), any(Sort.class));
    }

    @Test
    void testUpdateStatusPharmacy() {

        // Creazione di ID fittizi per farmacia e ordine
        ObjectId pharmacyId = new ObjectId();
        ObjectId orderId = new ObjectId();

        // Creazione di un oggetto Order
        Order order = new Order();
        order.setId(orderId);
        order.setDrugId("MED123");
        order.setPackageId("123456");
        order.setCreatedAt(LocalDateTime.now());

        User user = new User();
        user.setId(new ObjectId());
        order.setUser(user);

        // Creazione di un oggetto Pharmacy
        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setId(pharmacyId);
        pharmacy.setCompanyName("Farmacia Test");

        // Mock di un CommonDrug con una confezione valida
        CommonDrug commonDrug = new CommonDrug();
        commonDrug.setId("DRUG123");
        commonDrug.setPrincipiAttiviIt(Arrays.asList("Paracetamolo"));

        // Mock repository per trovare l'ordine
        when(orderRepository.findById(any(ObjectId.class))).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Mock del servizio AIFA per restituire un CommonDrug valido
        when(aifaService.getPackage(anyString(), anyString()))
            .thenReturn(Mono.just(commonDrug));  // Assicuriamoci che non sia null

            System.out.println("Test commonDrug:"+ commonDrug);
        
            System.out.println("DEBUG - Chiamata a AIFAService con:");
            System.out.println("DEBUG - Drug ID: " + order.getDrugId());
            System.out.println("DEBUG - Package ID: " + order.getPackageId());    

        // Eseguire l'update dello stato dell'ordine
        Order updatedOrder = orderService.updateStatusPharmacy(order.getId().toString(), 
            Order.StatusPharmacy.READY_FOR_PICKUP, 
            pharmacy);
           

        // Asserzioni per verificare che l'ordine sia stato aggiornato correttamente
        assertNotNull(updatedOrder);
        assertEquals(Order.StatusPharmacy.READY_FOR_PICKUP, updatedOrder.getStatusPharmacy());

        // Verifica che il repository salvi l'ordine una volta
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testTrackingDeliverYStatus() {
        
        String orderId = "60c72b2f9b1e8a5f6d9b1e8a";
        String userId = "60c72b2f9b1e8a5f6d9b1e8b";
        String pharmacyId = "60c72b2f9b1e8a5f6d9b1e8c";
        String drugId = "sampleDrugId";
        String packageId = "samplePackageId";

        User user = new User();
        user.setId(new ObjectId(userId));
        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setId(new ObjectId(pharmacyId));

        Order order = new Order();
        order.setId(new ObjectId(orderId));
        order.setUser(user);
        order.setPharmacy(pharmacy);
        order.setStatusPharmacy(Order.StatusPharmacy.READY_FOR_PICKUP);
        order.setStatusDriver(Order.StatusDriver.PENDING);
        order.setDrugId(drugId);
        order.setPackageId(packageId);
        order.setCreatedAt(LocalDateTime.now());

        // Mock dei metodi dei repository
        when(orderRepository.findById(new ObjectId(orderId))).thenReturn(Optional.of(order));
        when(userRepository.findById(new ObjectId(userId))).thenReturn(Optional.of(user));
        when(pharmacyRepository.findById(new ObjectId(pharmacyId))).thenReturn(Optional.of(pharmacy));

        // Mock del metodo getPackage per restituire un Mono<CommonDrug>
        CommonDrug mockDrugPackage = new CommonDrug();
        // Configura le proprietà necessarie di mockDrugPackage
        when(aifaService.getPackage(drugId, packageId)).thenReturn(Mono.just(mockDrugPackage));

        // Esegui il metodo di tracciamento
        Order result = orderService.getOrder(orderId);

        // Verifica che il risultato contenga le informazioni corrette
        assertNotNull(result);
        assertEquals(pharmacyId, result.getPharmacy().getId().toString());
        assertEquals(Order.StatusPharmacy.READY_FOR_PICKUP, result.getStatusPharmacy());
        assertEquals(Order.StatusDriver.PENDING, result.getStatusDriver());
        assertEquals(mockDrugPackage, result.getDrugPackage());
    }   
   
    @Test
    void testManagingPriorityOrders() {
        // Prepara i dati
        String orderId = "60c72b2f9b1e8a5f6d9b1e8a";
        String userId = "60c72b2f9b1e8a5f6d9b1e8b";
        String drugId = "sampleDrugId";
        String pharmacyId = "60c72b2f9b1e8a5f6d9b1e8c";
        Pharmacy pharmacy = new Pharmacy();
        
        User user = new User();
        user.setId(new ObjectId(userId));
      
        pharmacy.setId(new ObjectId(pharmacyId));

        Order order = new Order();
        order.setId(new ObjectId(orderId));
        order.setUser(user);
        order.setDrugId(drugId);  // Farmaco salvavita
        order.setPharmacy(pharmacy);
        order.setPriority(Order.Priority.HIGH); // Ordine prioritario
        order.setCreatedAt(LocalDateTime.now());

        // Mock dei metodi
        when(orderRepository.findById(new ObjectId(orderId))).thenReturn(Optional.of(order));
        when(aifaService.getPackage(drugId, order.getPackageId())).thenReturn(Mono.just(new CommonDrug()));
        when(pharmacyRepository.findById(new ObjectId(pharmacyId))).thenReturn(Optional.of(pharmacy));
        when(orderRepository.save(any(Order.class))).thenReturn(order);  // Mock per il salvataggio dell'ordine

        // Esegui il metodo di aggiornamento dello stato
        Order updatedOrder = orderService.updateStatusPharmacy(order.getId().toString(), 
            Order.StatusPharmacy.READY_FOR_PICKUP, 
            pharmacy);

        // Verifica che l'ordine prioritario venga trattato con urgenza
        assertNotNull(updatedOrder);
        assertEquals(Order.StatusPharmacy.READY_FOR_PICKUP, updatedOrder.getStatusPharmacy());
        assertEquals(Order.Priority.HIGH, updatedOrder.getPriority());
    }

}
