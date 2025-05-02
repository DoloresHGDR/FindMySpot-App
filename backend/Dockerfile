FROM openjdk:21-jdk-slim
ENV TZ=America/Argentina/Buenos_Aires
ENV SPRING_PROFILES_ACTIVE=production
ENV PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y \
    curl \
    htop \
    iputils-ping \
    build-essential \
    libpq-dev \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/* /tmp/*
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /home/spring
RUN useradd --create-home --home-dir /home/spring spring
USER spring
COPY ./build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]