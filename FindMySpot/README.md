# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


##Dependencias
npm install react-hook-form yup @hookform/resolvers
npm install react-native-google-places-autocomplete

Notificaciones:
-npm install -g eas-cli
-eas login
-eas init
-eas credentials (crear una nueva key si el eas init no lo hace solo)
-npx expo prebuild
-npx eas build:configure (ejecutar si no se crea el eas.json)
-npm install @react-native-firebase/app @react-native-firebase/messaging

Crear un proyecto firebase en https://console.firebase.google.com/:
-Descargar archivo google-services.json del proyecto firebase y guardarlo en carpeta android/app
-Añadir dependencias en ambos build.gradle, tanto de la raiz de la carpeta android como de android/app

Backend:
- Crear una carpeta config en resources si no la hay y colocar el archivo firebase que se indica en el proyecto firebase.
- Añadir implementation 'com.google.firebase:firebase-admin:9.5.0' en el build.gradle del backend.
- Actualizar dependencias
- Volver a hacer la build del backend ./gradlew build -x test y volver a crear otra imagen para docker.

Buildear la app:
- Desde Android Studio (Instalar) ir a las herramientas de arriba y en build ir al apartado generate app bundles or Apks
- Ejecutar Generate Apk.
- El archivo app-debug.apk que se crea en la carpeta android/app/build/outputs/apk/debug instalarlo en el celular y seguir programando desde ahi.
- Ejecutar el proyecto como npx expo start y el backend para que funcione.