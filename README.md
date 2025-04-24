<h1 align="center">MedExpress</h1>
<p align="center">
  University Project for Drug Delivery
</p>

---

<div align="center">
  <!-- Java -->
  <img src="https://img.shields.io/badge/Java-21-%23ED8B00.svg?logo=openjdk&logoColor=white"/>
  <!-- Spring Boot -->
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.2-%236DB33F.svg?logo=springboot&logoColor=white"/>
  <!-- Maven -->
  <img src="https://img.shields.io/badge/Maven-3.8.6-C71A36.svg?logo=apachemaven&logoColor=white"/>
  <!-- MongoDB -->
  <img src="https://img.shields.io/badge/MongoDB-%2347A248.svg?logo=mongodb&logoColor=white"/>
  <!-- Socket.io -->
  <img src="https://img.shields.io/badge/Socket.io-2.0.12-%23000000.svg?logo=socket.io&logoColor=white"/>
  <!-- Tailwind CSS -->
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-%2338B2AC.svg?logo=tailwindcss&logoColor=white"/>
  <!-- TypeScript -->
  <img src="https://img.shields.io/badge/TypeScript-5.0.0-%23007ACC.svg?logo=typescript&logoColor=white"/>
  <!-- React -->
  <img src="https://img.shields.io/badge/React-19.0.0-%2361DAFB.svg?logo=react&logoColor=white"/>
  <!-- Next.js -->
  <img src="https://img.shields.io/badge/Next.js-15.2.4-%23000000.svg?logo=next.js&logoColor=white"/>
  <!-- Axios -->
  <img src="https://img.shields.io/badge/Axios-1.7.9-%235A29E4.svg?logo=axios&logoColor=white"/>
  <!-- Lodash -->
  <img src="https://img.shields.io/badge/Lodash-4.17.21-%2300A7E1.svg?logo=lodash&logoColor=white"/>
  <!-- Ant Design -->
  <img src="https://img.shields.io/badge/Ant%20Design-5.24.1-%230170FE.svg?logo=antdesign&logoColor=white"/>
  <!-- FontAwesome -->
  <img src="https://img.shields.io/badge/FontAwesome-6.7.2-%23528DD7.svg?logo=fontawesome&logoColor=white"/>
  <!-- ESLint -->
  <img src="https://img.shields.io/badge/ESLint-9.0.0-%234B32C3.svg?logo=eslint&logoColor=white"/>
  <!-- JUnit -->
  <img src="https://img.shields.io/badge/JUnit-5.10.0-%2325A162.svg?logo=junit5&logoColor=white"/>
  <!-- Reactor Test -->
  <img src="https://img.shields.io/badge/Reactor%20Test-3.5.10-%2361DAFB.svg?logo=reactivex&logoColor=white"/>
  <!-- Spring Security -->
  <img src="https://img.shields.io/badge/Spring%20Security-6.4.4-%236DB33F.svg?logo=springsecurity&logoColor=white"/>
  <!-- JJWT -->
  <img src="https://img.shields.io/badge/JJWT-0.12.6-%23D63AFF.svg?logo=jsonwebtokens&logoColor=white"/>
  <!-- SpringDoc -->
  <img src="https://img.shields.io/badge/SpringDoc-2.8.4-%236DB33F.svg?logo=swagger&logoColor=white"/>
  <!-- dotenv -->
  <img src="https://img.shields.io/badge/dotenv-4.0.0-%2348C774.svg?logo=dotenv&logoColor=white"/>
</div>

<p align="center">
<img src="docs/images/home.png" alt="screenshot">
</p><br>

# How to run the project

### Requirements

- Java 21

### Run the project

1. Download .jar from [MedExpress Releases](https://github.com/giovannimirulla/MedExpress/releases)
2. Run the jar with the command `java -jar <file>.jar`

<br>

# Test Users

Below are the test users you can use to access the application:

- **Patient**:

  - Email: `patient@gmail.com`
  - Password: `Qwertyuiop123.`

- **Driver**:

  - Email: `driver@gmail.com`
  - Password: `Qwertyuiop123.`

- **Doctor**:

  - Email: `doctor@gmail.com`
  - Password: `Qwertyuiop123.`

- **Pharmacy 1**:

  - Email: `pharmacy1@gmail.com`
  - Password: `Qwertyuiop123.`

- **Pharmacy 2**:
  - Email: `pharmacy2@gmail.com`
  - Password: `Qwertyuiop123.`

# Documentation

For a complete overview of the project, you can refer to the detailed documentation available in PDF format:  
[Detailed Documentation](Documentazione%20MedExpress/Documentazione%20Completa/Documentazione%20Completa.pdf)

# Swagger

The Swagger UI is available at the following URL: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
<br>

# Reference Documentation

For further reference, please consider the following sections:

- [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
- [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.4.2/maven-plugin)
- [Create an OCI image](https://docs.spring.io/spring-boot/3.4.2/maven-plugin/build-image.html)
- [Spring Web](https://docs.spring.io/spring-boot/3.4.2/reference/web/servlet.html)
- [Spring Data MongoDB](https://docs.spring.io/spring-boot/3.4.2/reference/data/nosql.html#data.nosql.mongodb)
- [WebSocket](https://docs.spring.io/spring-boot/3.4.2/reference/messaging/websockets.html)
- [Spring Boot DevTools](https://docs.spring.io/spring-boot/3.4.2/reference/using/devtools.html)

### Guides

The following guides illustrate how to use some features concretely:

- [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
- [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
- [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
- [Accessing Data with MongoDB](https://spring.io/guides/gs/accessing-data-mongodb/)
- [Using WebSocket to build an interactive web application](https://spring.io/guides/gs/messaging-stomp-websocket/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

<br>

# Screenshot

### Search drugs

<p align="center">
<img src="docs/images/search.png" alt="screenshot">
</p><br>

### Dashboard

<p align="center">
<img src="docs/images/dashboard.png" alt="screenshot">
</p><br>

### Order details

<p align="center">
<img src="docs/images/modal.png" alt="screenshot">
</p><br>

# Design Pattern

### Creational Patterns

1. Singleton :
   - The ModelMapperConfig class uses the @Bean annotation to create a singleton instance of ModelMapper . This ensures that only one instance of ModelMapper is created and shared across the application. - `ModelMapperConfig.java`

### Structural Patterns

1. Facade :
   - The JwtUtil class acts as a facade for JWT operations, providing a simplified interface for generating and validating tokens. - `JwtUtil.java`

### Behavioral Patterns

1. Observer :

   - The SocketIOServer in SocketIOController uses event listeners ( addConnectListener , addDisconnectListener , addEventListener ) which are typical of the Observer pattern, where changes in state are communicated to interested parties. - `SocketIOController.java`


2. Strategy :

   - The Order class uses enums like StatusDoctor , StatusPharmacy , and StatusDriver to define different strategies for handling order statuses. - `Order.java`

   <br>

# To DO

### Uses Cases

- [x] UC1: User Registration - @giovannimirulla
- [x] UC2: Pharmacy Registration - @agatarosselli
- [x] UC3: Search for a drug - @giovannimirulla
- [x] UC4: Order drug - @agatarosselli
- [x] UC5: Request a prescription - @agatarosselli
- [x] UC6: Autorize a prescription - @agatarosselli & @giovannimirulla
- [x] UC7: Communicate authorization status - @agatarosselli & @giovannimirulla
- [x] UC8: Manage evasion and status order registration - @giovannimirulla
- [x] UC9: Take charge of the order - @giovannimirulla
- [x] UC10: Track delivery status - @giovannimirulla
- [x] UC11: Track priority orders - @giovannimirulla

### Frontend

- [x] Home - Search drugs page - @giovannimirulla
- [x] Swagger - @giovannimirulla
- [x] Search drug - @giovannimirulla
- [x] Drug details - @giovannimirulla
- [x] Login - @giovannimirulla
- [x] Sign up pharmacy - @giovannimirulla
- [x] Sign up user - @giovannimirulla
- [x] Order drug - @giovannimirulla
- [x] Dashboard pharmacy - @giovannimirulla
- [x] Dashboard patient - @giovannimirulla
- [x] Dashboard doctor - @giovannimirulla
- [x] Dashboard driver - @giovannimirulla
- [x] Dashboard drugs - @agatarosselli
- [x] Priority - @agatarosselli

### Tests

- [x] UC1 Test - @mariachiara98
- [x] UC2 Test - @mariachiara98
- [x] UC3 Test - @mariachiara98
- [x] UC4 Test - @mariachiara98
- [x] UC5 Test - @mariachiara98
- [x] UC6 Test - @mariachiara98
- [x] UC7 Test - @mariachiara98
- [x] UC8 Test - @mariachiara98
- [x] UC9 Test - @mariachiara98
- [x] UC10 Test - @mariachiara98
- [x] UC11 Test - @mariachiara98
