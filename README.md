# Carta de Patrão Local ⚓

An interactive mobile and web application designed to help users study and prepare for the Portuguese **Patrão Local** (Local Skipper) recreational boating license exam. 

Built with **Expo (SDK 56)**, **React Native Web**, and **TypeScript**, the app provides a highly polished, responsive, and animated user interface optimized for iOS, Android, and Web browsers.

---

## 📱 Application Features

* **Exam Simulation:** Simulates the official exam structure (40 random questions covering all official syllabus areas, timed, with instant grading and pass/fail thresholds).
* **Topic-Based Study:** Practice specifically in targeted categories such as Navigation, RIEAM (Collision Regs), Meteorology, Safety, Tides, Communications, and Legislation.
* **Detailed Statistics & History:** Track progress over time with stored exam history, success rates, average times, and granular topic breakdown.
* **Premium UX/UI:** Sleek dark-mode interface utilizing smooth animations (via `moti` and `react-native-reanimated`), custom gradients, progress visuals, and responsive layouts.
* **Offline-Ready:** Persists historical attempts and settings locally using `AsyncStorage`.

---

## 🏗️ Architecture & Directory Structure

The application follows a clean modular React Native architecture leveraging Expo's file-based router:

```text
nauta-exam-local-skipper/
├── .dockerignore          # Docker ignore file
├── Dockerfile             # Multi-stage production web builder
├── docker-compose.yml     # Dev and Prod docker configurations
├── nginx.conf             # Nginx reverse proxy configuration for Web routing
├── app.json               # Expo configuration (meta, splash, orientation, colors)
├── package.json           # Native and web dependencies + npm scripts
├── tsconfig.json          # TypeScript configurations
│
└── src/
    ├── app/               # Expo Router (file-based navigation)
    │   ├── _layout.tsx    # Root navigator configuration
    │   ├── (tabs)/        # Tab-bar screens (Dashboard, Study, History, Settings)
    │   └── exam/          # Exam process routes (Setup, Engine, Results)
    │
    ├── components/        # Reusable UI & Layout Components
    │   ├── exam/          # Exam-specific views (QuestionCard, AnswerOption, ResultsChart)
    │   ├── ui/            # Generic primitives (Button, Card, Badge, ProgressBar, Timer)
    │   └── theme/         # Themed wrappers and inputs
    │
    ├── contexts/          # React Contexts
    │   └── ExamContext.tsx # Centralized state provider for the quiz engine
    │
    ├── data/              # Static Datasets
    │   ├── questions.json # Database of Portuguese skipper exam questions
    │   └── subjects.ts    # Syllabus topic metadata, colors, and descriptions
    │
    ├── hooks/             # Custom React hooks
    │   └── use-theme.ts   # HSL/Design Tokens theme hooks
    │
    └── utils/             # Business Logic & Helpers
        ├── examEngine.ts  # Algorithm for generating/evaluating exams
        ├── storage.ts     # Wrapper for AsyncStorage
        └── theme.ts       # HSL palette design token system
```

### Key Subsystems
* **Exam Context & Engine (`src/contexts/ExamContext.tsx` & `src/utils/examEngine.ts`):** Orchestrates the generation of mock tests, tracks user answers, manages the countdown timer, computes final scores, and grades topics.
* **Theme System (`src/utils/theme.ts`):** Defines a custom Dark-Navy theme using HSL color tokens for seamless design adaptations on mobile and web platforms.

---

## 🛠️ Local Development (Dev Mode)

To run the application locally in development mode, follow these steps:

### Prerequisites
* **Node.js:** version `20.x` or later.
* **Expo Go** app installed on your physical iOS/Android device (if testing on physical hardware).

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Expo Development Server
```bash
npx expo start
```

### Running on Targets
Once the server is running, use the interactive terminal shortcuts to launch:
* **Web:** Press `w` to open the web version in your browser.
* **Android:** Press `a` (requires Android Emulator or connected device running ADB).
* **iOS:** Press `i` (requires macOS with Xcode iOS Simulator installed).
* **Physical Device (Expo Go):** Scan the generated terminal QR code with your phone camera (iOS) or the Expo Go App (Android).

---

## 🐳 Running on Docker & Docker Compose

Containerized setups are provided for running both the hot-reloading development server and a high-performance production build.

### 1. Development Mode (Hot-Reloading in Docker)
Run the development container to test changes instantly within a Dockerized Node environment:
```bash
docker compose up dev
```
* The dev server runs at **`http://localhost:8081`**.
* Chokidar file polling is enabled for stable Hot Module Replacement (HMR) across container volumes.

### 2. Production Mode (Serving Web via Nginx)
To build and run the optimized production container:
```bash
docker compose up --build app
```
* **How it works:** A multi-stage `Dockerfile` compiles the production static web bundle (`npx expo export --platform web`) and copies it to a lightweight Alpine Nginx server.
* The application runs at **`http://localhost:8085`**.
* **Nginx Features (`nginx.conf`):** Configured with custom `try_files` fallbacks to handle single-page navigation and enables Gzip compression (for CSS, HTML, JS) to improve web performance metrics.

---

## 🚀 Building for Production

### 1. Web Production Build
Export the web application to a static folder for deployment:
```bash
npx expo export --platform web
```
This builds static client assets (HTML, CSS, JS) into the local `/dist` directory, which can be uploaded to hosting services like Netlify, Vercel, or AWS S3.

---

### 2. Android Mobile Build

There are two primary methods to build native Android applications (`.apk` or `.aab`):

#### Method A: EAS Build (Recommended & Cloud-based)
Expo Application Services (EAS) handles the native SDK configuration and keystore files.

1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```
2. **Log into your Expo account:**
   ```bash
   eas login
   ```
3. **Initialize the EAS project configuration:**
   ```bash
   eas build:configure
   ```
4. **Trigger the build:**
   * For testing (generate an installable `.apk`):
     ```bash
     eas build --platform android --profile preview
     ```
   * For Google Play Console release (generates an `.aab`):
     ```bash
     eas build --platform android --profile production
     ```

#### Method B: Local Build (Using Android Studio)
Compile the binary directly on your machine without cloud services.

1. **Prebuild the native project:**
   ```bash
   npx expo prebuild --platform android
   ```
   *This generates the `android/` directory containing native Gradle files.*
2. **Compile the app:**
   * Open the generated `android/` directory in **Android Studio** to run/build, OR
   * Build using Gradle in your terminal:
     ```bash
     cd android
     ./gradlew assembleRelease
     ```
   *The built `.apk` will be outputted to `android/app/build/outputs/apk/release/`.*

---

### 3. iOS Mobile Build

> [!NOTE]
> Building for iOS requires a macOS machine and an active Apple Developer Program membership.

#### Method A: EAS Build (Recommended & Cloud-based)
1. **Install EAS CLI and configure project (if not already done):**
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```
2. **Trigger the build:**
   * For simulator testing (generates a `.tar` payload):
     ```bash
     eas build --platform ios --profile development
     ```
   * For TestFlight / App Store submission:
     ```bash
     eas build --platform ios --profile production
     ```

#### Method B: Local Build (Using Xcode)
1. **Prebuild the native project:**
   ```bash
   npx expo prebuild --platform ios
   ```
   *This generates the `ios/` directory and installs CocoaPods dependencies.*
2. **Open Workspace in Xcode:**
   ```bash
   open ios/Carta de Patrão Local.xcworkspace
   ```
3. **Compile the App:**
   * In Xcode, select **Product > Archive** to build the production build for signing and submission.
   * Alternatively, run locally via EAS CLI on your Mac machine:
     ```bash
     eas build --platform ios --local
     ```

---

## 📄 License

This project is licensed under the terms of the MIT License. See the [LICENSE](file:///Users/vieirri2/GitHub/githubcom/new/nauta-exam-local-skipper/LICENSE) file for details.
