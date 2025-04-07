#!/bin/bash

# Запуск Kotlin-сервера через Gradle 
# (Запустите с помощью команды: ./run.sh)

# Проверяем наличие Gradle
if ! command -v gradle &> /dev/null; then
    echo "Gradle не установлен. Попробуем использовать ./gradlew"
    
    # Проверяем наличие gradlew
    if [ ! -f "./gradlew" ]; then
        echo "Не найден исполняемый файл gradlew. Создаем его..."
        wget -q https://services.gradle.org/distributions/gradle-8.6-bin.zip -O gradle.zip
        unzip -q gradle.zip
        mv gradle-8.6 gradle-wrapper
        echo '#!/bin/bash' > gradlew
        echo 'export GRADLE_USER_HOME=./gradle-user-home' >> gradlew
        echo './gradle-wrapper/bin/gradle "$@"' >> gradlew
        chmod +x gradlew
    else
        echo "Найден gradlew, используем его"
    fi
    
    # Запускаем приложение через gradlew
    ./gradlew run
else
    # Запускаем приложение через установленный Gradle
    gradle run
fi
