# FoodHub - Backend (Spring Boot 3.3 REST API)

Full-stack food ordering and delivery management system backend built with Spring Boot, Spring Security 6 (JWT), Spring Data JPA, and H2/MySQL database.

---

## 🛠️ Tech Stack
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17+
- **Security**: Spring Security 6 + JSON Web Tokens (JJWT)
- **Database**: H2 (In-Memory default with web console) / MySQL 8.x ready
- **ORM**: Hibernate / Spring Data JPA
- **Build Tool**: Maven

---

## 🚀 Quick Start

### 1. Compile & Build
```bash
mvn clean compile
```

### 2. Run the Application
```bash
mvn spring-boot:run
```
The server will start at: `http://localhost:8080`

### 3. Database Console (H2)
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:foodhubdb`
- Username: `sa`
- Password: *(leave blank)*

---

## 👥 Pre-seeded Demo Accounts
All accounts use password: `password123`

| Role | Email | Features |
|---|---|---|
| **Admin** | `admin@foodhub.com` | View all orders, manage users, restaurants, menu items & deliveries |
| **Restaurant Owner** | `restaurant@foodhub.com` | Manage food items, track incoming orders, update order status |
| **Delivery Partner** | `delivery@foodhub.com` | Accept delivery orders, update delivery progress, track history |
| **Customer** | `customer@foodhub.com` | Browse restaurants, add to cart, checkout, live tracking |

---

## 🌐 Switching to MySQL
To use MySQL instead of H2:
1. Open `src/main/resources/application.properties`
2. Comment the H2 lines
3. Uncomment the MySQL configuration block:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/foodhub_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   spring.jpa.hibernate.ddl-auto=update
   ```
4. Restart the Spring Boot app.
