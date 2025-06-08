# Giai đoạn 1: Xây dựng ứng dụng
FROM maven:3.8-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy pom.xml
COPY pom.xml .
# Copy src code
COPY src ./src

# Package application
RUN mvn clean package -DskipTests

# Giai đoạn 2: Tạo image runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy jar from build stage
COPY --from=builder /build/target/*.jar app.jar

# Port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]