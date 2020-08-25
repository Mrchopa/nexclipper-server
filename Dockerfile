FROM openjdk:8-jdk
LABEL version=0.1

COPY ./target/*.jar /app/
COPY ./script/*.sh /app/
COPY ./initialize/* /app/conf/

WORKDIR /app/

CMD ["java", "-jar", "*.jar"]