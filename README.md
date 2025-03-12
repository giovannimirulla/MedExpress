# MedExpress
University Project for Drug Delivery

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.4.2/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/3.4.2/maven-plugin/build-image.html)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/3.4.2/reference/using/devtools.html)
* [Vaadin](https://vaadin.com/docs)
* [Spring Data MongoDB](https://docs.spring.io/spring-boot/3.4.2/reference/data/nosql.html#data.nosql.mongodb)
* [WebSocket](https://docs.spring.io/spring-boot/3.4.2/reference/messaging/websockets.html)

### Guides
The following guides illustrate how to use some features concretely:

* [Creating CRUD UI with Vaadin](https://spring.io/guides/gs/crud-with-vaadin/)
* [Accessing Data with MongoDB](https://spring.io/guides/gs/accessing-data-mongodb/)
* [Using WebSocket to build an interactive web application](https://spring.io/guides/gs/messaging-stomp-websocket/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

# Design Pattern

### Creational Patterns
1. Singleton :
   - The ModelMapperConfig class uses the @Bean annotation to create a singleton instance of ModelMapper . This ensures that only one instance of ModelMapper is created and shared across the application.
   - `ModelMapperConfig.java`
### Structural Patterns
1. Facade :
   - The JwtUtil class acts as a facade for JWT operations, providing a simplified interface for generating and validating tokens.
   - `JwtUtil.java`
### Behavioral Patterns
1. Observer :
   
   - The SocketIOServer in SocketIOController uses event listeners ( addConnectListener , addDisconnectListener , addEventListener ) which are typical of the Observer pattern, where changes in state are communicated to interested parties.
   - `SocketIOController.java`
2. Strategy :
   
   - The Order class uses enums like StatusDoctor , StatusPharmacy , and StatusDriver to define different strategies for handling order statuses.
   - `Order.java`

# To DO

### Uses Cases
- [x] UC1: User Registration - @giovannimirulla
- [x] UC2: Pharmacy Registration - @agatarosselli
- [x] UC3: Search for a drug - @giovannimirulla
- [x] UC4: Order drug - @agatarosselli

### Frontend - @giovannimirulla
- [x] Home - Search drugs page 
- [x] Swaggger
- [x] List search results
- [x] Drug details
- [x] Login
- [x] Register
- [x] Order drug

### Tests
- [x] UC1 tests - @mariachiara98
