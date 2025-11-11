## Pipoca & Nota (React Native) - Setup

This repository contains the source code structure (`src/`) for the Pipoca & Nota app: a personal movie catalog with local authentication, per-user watched list, ratings, and TMDb-powered search.

### 1) Create the React Native project (TypeScript)

If you haven't yet created the React Native project shell, run:

```bash
npx react-native@latest init PipocaNota --template react-native-template-typescript
```

On Windows/PowerShell, avoid `&&` chaining. Run the commands separately. If you hit `ECONNRESET` from npm, try again on a stable network or set a registry mirror:

```bash
npm config set registry https://registry.npmmirror.com
```

Then re-run the init command.

### 2) Copy the `src` folder

Copy the `PipocaNota/src` directory from this repo into your generated React Native app root (overwrite if prompted):

```
<your-app-root>/src
```

Ensure your `index.js` (or `index.tsx`) uses `src/App` as the entry point:

```js
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### 3) Install dependencies

```bash
cd PipocaNota

# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Storage
npm install @react-native-async-storage/async-storage

# Image picker
npm install react-native-image-picker

# Icons (optional but recommended)
npm install react-native-vector-icons

# TypeScript helpers (if missing)
npm install -D @types/react @types/react-native @types/react-native-vector-icons
```

Android: make sure gradle sync picks up `react-native-vector-icons`. iOS: after installing pods:

```bash
cd ios && pod install && cd ..
```

### 4) Configure TMDb API key

Create `src/config/tmdb.local.ts` with your key:

```ts
export const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
```

Never commit real keys. The app will fall back to a placeholder and show an error if the key is missing.

### 5) Run

```bash
npx react-native start
npx react-native run-android   # or
npx react-native run-ios
```

### Features mapped to requirements

- RF01: Local auth (register with name, email, password, profile photo from camera/gallery) persisted via AsyncStorage.
- RF02: Profile screen shows user name + profile photo.
- RF03: Search screen with TextInput that queries TMDb and lists results.
- RF04: Navigation to details screen; details allow rating + save.
- RF05: "My Watched Movies" per logged-in user using global Context.
- RF06: Per-user persistence via namespaced storage keys.
- RF07: Accessibility: descriptive `accessibilityLabel`, `accessibilityRole`, alt text for images, focus management, minimum 44x44 touch targets.

### Notes

- This code targets Android and iOS.
- Camera/gallery access requires runtime permissions on Android and proper Info.plist keys on iOS (NSPhotoLibraryUsageDescription, NSCameraUsageDescription). See `RegisterScreen` notes inline.


