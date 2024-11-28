# React Native vs Traditional iOS Development

### Introduction
I recently learned how **React Native** has revolutionized app development for iOS! While **Swift** and **SwiftUI** are Apple's native programming languages/frameworks, **React Native** offers a compelling alternative. Here are the key differences:

### Traditional iOS Development
- **Uses**: Swift/SwiftUI  
- **Requirements**:
  - Requires a Mac  
  - Requires an Apple Developer account ($99/year)  
- **Platform**: Only works on iOS  

### React Native
- **Uses**: JavaScript/React  
- **Benefits**:
  - Works on both iOS and Android from the same code  
  - Can develop on any computer  
  - Much easier to learn if you know JavaScript  
- **Adoption**: Used by major apps like Instagram, Discord, and Walmart  rd, Walmart

# History of React Native

React Native was first announced by Facebook (now Meta) in 2015! Here's an interesting timeline:

### 2015
- **March**: Facebook announces React Native at React.js Conf  
- **March 26**: React Native becomes open source  
- Initial release only supported iOS  

### 2015 (September)
- Android support added  
- Companies like Instagram and Airbnb start adopting it  

### 2016-2018
- **Massive adoption period**  
- Major companies switch to React Native:
  - Facebook Ads Manager  
  - Instagram  
  - Discord  
  - Walmart  
  - UberEats  
  - Skype  

### 2019-2020
- New architecture announced  
- Improved performance  
- Better native module support  

### 2022-2023
- "The New Architecture" released  
- Key features introduced:
  - **Fabric**: New rendering system  
  - **Turbo Modules**: Better native bridge  
  - Improved performance and stability  

### 2024 (Current)
- Used by thousands of apps  
- Very stable and mature  
- Large ecosystem of libraries  
- Strong community support  

---

### Why React Native Was Revolutionary

#### Before React Native
- Developers HAD to:
  - Use **Swift/Objective-C** for iOS  
  - Use **Java/Kotlin** for Android  
  - Maintain **two separate codebases**  
  - Have **two different development teams**  

#### After React Native
- One codebase for both platforms  
- Use **JavaScript/React** (more developers are familiar with this)  
- Faster development  
- Smaller teams needed  

---

### Conclusion
React Native solved a huge pain point in mobile development. The ability to **write once and run on both platforms** was a game-changer, especially for smaller companies that couldn't afford separate iOS and Android teams.

# Setting Up Expo Go and Creating a React Native App

## Step 1: Install Expo Go

1. Install **Expo Go** on your iPhone from the App Store.

---

## Step 2: Install Node.js

You need Node.js (which includes npm, the Node Package Manager) to set up your development environment.

- Visit [Node.js](https://nodejs.org/) and download the **LTS (Long Term Support)** version for macOS.
- Run the downloaded installer.
- Alternatively, use Homebrew to install Node.js:
  ```bash
  brew install node

  ```
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

---

## Step 3: Set Up and Start Your Project

1. Install Expo CLI:
   ```bash
   npm install -g expo-cli
   ```

2. Create a new project:
   ```bash
   expo init MemoryGame
   cd MemoryGame
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Replace the contents of the `App.js` file with your game code:
   - Open the `MemoryGame` folder.
   - Locate `App.js` in the root directory.
   - Delete everything and paste your game code.
   - Save the file.
   - The app should automatically reload on your device.

5. **Important**: Ensure your iPhone is on the same Wi-Fi network as your computer. Use the LAN option instead of the tunnel:
   ```bash
   npx expo start --lan
   ```

6. Open **Expo Go** on your iPhone and scan the QR code displayed in the terminal.

---

## Step 4: Share Your Game

### Options to Share:
1. **Standalone App (Using Expo Build)**:
   - Creates an installable `.ipa` file.
   - Shareable through TestFlight.
   - **Free**, but limited to 100 devices for testing.
   - Cannot be found on the App Store.

2. **App Store Publishing**:
   - Requires an **Apple Developer Account** ($99/year).
   - Goes through Apple's review process.
   - Can be monetized.
   - Available to unlimited users via the App Store.
   - Go to https://developer.apple.com/
   - Sign in with your Apple ID
   - Register as a developer
   - **Membership Details**: **Team ID**: C4N82946GY

### Setting Up Xcode

1. **Download Xcode** from the App Store (Note: Xcode is large, approximately 12GB).
2. **Configure Xcode** after installation:
   - Open a terminal and reset Xcode configuration:
     ```bash
     sudo xcode-select --reset
     ```
   - Open Xcode and:
     - Accept the license agreement.
     - Install additional components.
     - Complete the first-time setup.
3. After the setup is complete, verify the installation:
   ```bash
   xcode-select -p

---

## Step 5: Build a Standalone App with Expo EAS

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Create an Expo account:
   - Visit [Expo Signup](https://expo.dev/signup) and create an account.
   - Login:
     ```bash
     eas login
     ```

3. Update your `app.json` file to include metadata:
   ```json
   {
     "expo": {
       "name": "Memory Game",
       "slug": "memory-game",
       "version": "1.0.0",
       "orientation": "portrait",
       "ios": {
         "bundleIdentifier": "com.yiyi19911211.memorygame"
       }
     }
   }
   ```

4. Start the Build
   
   a. Start the build process:
   ```bash
   eas build --platform ios --profile preview
   ```
   
   b. During the build process, you'll be asked to register devices:
   - Choose **Websites**
   - This option generates a registration URL for your devices
   
   c. If the bundle identifier is already taken:
   - Open `app.json`
   - Update `ios.bundleIdentifier` to something unique:
     ```json
     "ios": {
       "bundleIdentifier": "com.yiyi19911211.memorygame2023"
     }
     ```
---


## Step 6: Add Animations and Sound Effects

### Animations:
1. Install Lottie React Native:
   ```bash
   npx expo install lottie-react-native
   ```
2. Download animations (e.g., confetti, sparkle) from [LottieFiles](https://lottiefiles.com/) and save them in your `assets` folder.

### Sound Effects:
1. Install the audio package:
   ```bash
   npx expo install expo-av
   ```
2. Add sound files (e.g., `flip.mp3`, `match.mp3`, `victory.mp3`) to the `assets` folder.

---

## Step 7: Update Your App Icon

1. Create a 1024x1024px icon and save it as `icon.png` in the `assets` folder.
2. Update your `app.json`:
   ```json
   {
     "expo": {
       ...
       "icon": "./assets/icon.png",
       ...
     }
   }
   ```
3. Rebuild the app:
   ```bash
   eas build --platform ios --profile development --clear-cache
   ```

---

## Step 8: Enable Developer Mode on Your iPhone

1. Go to **Settings > Privacy & Security > Developer Mode**.
2. Enable Developer Mode and restart your phone.
3. Trust the developer certificate:
   - **Settings > General > VPN & Device Management > Trust Certificate**.

---

## Typical Development Workflow

1. Make changes in `App.js` or other files.
2. "Using development build": Press s to switch to Expo Go"
3. Test quickly in Expo Go:
   ```bash
   npm start
   ```
4. Build the app when ready:
   ```bash
   eas build --platform ios --profile development --clear-cache
   ```

---

## Step 9: Testing and Deploying

- Use Expo Go for rapid testing.
- Build standalone apps for final deployment.
- Add finishing touches like sound effects, animations, and a custom app icon before publishing.
  
---

# Key Project Files in React Native

Your three key files should now be:

1. **App.js** - Your game code  
2. **app.json** - Your app configuration  
3. **eas.json** - Your build settings  

---

## File Details

### 1. App.js
- This is your **actual game code**.
- Contains all the **React Native components**.
- Includes your **game logic, UI elements, and styles**.
- The memory game code we wrote resides in this file.
- You should **keep all the game-related code here**.

---

### 2. app.json
- This is your **project configuration file**.
- It tells Expo **how to build your app**.
- Contains metadata such as:
  - App name
  - Version
  - Bundle Identifier
- **Does NOT contain any game code**.

---

### 3. eas.json
- This is your **build settings file**.
- Specifies the profiles for different build environments (e.g., development, preview, production).
- Common properties include:
  - Platform (iOS or Android)
  - Build type (e.g., development or release)
  - Credentials management
- Example snippet:
  ```json
  {
    "build": {
      "development": {
        "distribution": "internal",
        "ios": {
          "buildType": "development"
        }
      },
      "production": {
        "distribution": "store",
        "ios": {
          "buildType": "release"
        }
      }
    }
  }
