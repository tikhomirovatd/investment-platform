FROM amazoncorretto:17-alpine as build
WORKDIR /app

COPY . .
RUN ./gradlew bootJar --no-daemon

FROM amazoncorretto:17-alpine
WORKDIR /app

COPY --from=build /app/build/libs/app.jar app.jar

EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]
