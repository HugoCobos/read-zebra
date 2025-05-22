# SirAndroid

## Proyecto Angular + Capacitor

Este proyecto está construido con **Angular 19.0.4** y usa **Capacitor 7.2.0** para integrarse con funcionalidades nativas móviles (Android).

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.io/cli)
- [Android Studio](https://developer.android.com/studio)
- [Java JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) (versión 11+)
- [Capacitor CLI](https://capacitorjs.com/docs/getting-started)

## Instalación del proyecto

Clona el repositorio y navega al directorio del proyecto:

```bash
git clone https://github.com/HugoCobos/read-zebra
cd read-zebra
```

Instalamos las dependencias de angular y capacitor

```bash
npm install
```

Para añadir Android como plataforma:

```bash
npx cap add android
```

Sincronización de Capacitor
Cada vez que hagas cambios en Angular que deban reflejarse en el proyecto nativo (por ejemplo, cambios en los assets o en el build), debes compilar Angular y sincronizar Capacitor. Para eso generamos un scipt el cual puedes usar:

```bash
npm run build:cap
```

Que ejecuta dos comandos ("ng build && npx cap copy")

Tambien si haz añadido un plugin con capacitor necesitas sincronizarlo con android:

```bash
npx cap sync
```

Este comando:

Copia el contenido del directorio dist al proyecto nativo

Actualiza los plugins nativos si es necesario

## Abrir en Android Studio

### Una vez sincronizado, puedes abrir el proyecto nativo de Android con

```bash
npx cap open android

```

## ADICIONAL

### Comandos utiles

| Comando                       | Descripción                                   |
| ----------------------------- | --------------------------------------------- |
| `npm install`                 | Instala las dependencias del proyecto         |
| `ng build --output-path=dist` | Compila el proyecto Angular                   |
| `npx cap add android`         | Añade soporte para Android                    |
| `npx cap sync`                | Sincroniza Angular con el proyecto nativo     |
| `npx cap open android`        | Abre el proyecto nativo en Android Studio     |
| `npx cap copy`                | Copia archivos web sin actualizar los plugins |
| `npx cap update`              | Actualiza los plugins y plataformas nativas   |
