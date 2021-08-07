# Setup ReactNative

## 🏃🏽‍ Steps to run this project in MacOS

### Installing Dependencies

You will need Node, Watchman, the React Native command line interface, and Xcode.

#### Node & Watchman

We recommend installing Node and Watchman using Homebrew. Run the following commands in a Terminal after installing Homebrew:

```bash
brew install node
brew install watchman
```

If you have already installed Node on your system, make sure it is Node 8.3 or newer.

### The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.
Run the following command in a Terminal:

```bash
npm install -g react-native-cli
```

### iOS

#### Install Xcode & Xcode Command Line Tools

To run it in iOS simulator, inside your React Native project folder run:

```bash
react-native run-ios
```

To run in physical device:

1. Plug in your device via USB

2. Configure code signing
   Select your project in the Xcode Project Navigator, then select your main target (it should share the same name as your project). Look for the "General" tab. Go to "Signing" and make sure your Apple developer account or team is selected under the Team dropdown. Do the same for the tests target (it ends with Tests, and is below your main target).

3. If everything is set up correctly, your device will be listed as the build target in the Xcode toolbar, and it will also appear in the Devices pane (⇧⌘2). You can now press the Build and run button (⌘R) or select Run from the Product menu. Your app will launch on your device shortly.

Connecting to the development server

1. You have to be on the same Wi-Fi network as your computer.

2. Shake your device to open the Developer menu, then enable Live Reload. Your app will reload whenever your JavaScript code has changed.

### Android

1. Installing dependencies

    You will need Node, Watchman, the React Native command line interface, a JDK, and Android Studio.

2. Java Development Kit

    React Native requires a recent version of the Java SE Development Kit (JDK). Download and install Oracle JDK 8 if needed. You can also use OpenJDK 8 as an alternative.

#### Install Android Studio

You will need Node, Watchman, the React Native command line interface, a JDK, and Android Studio.

Download and install Android Studio. Choose a "Custom" setup when prompted to select an installation type. Make sure the boxes next to all of the following are checked:

- Android SDK
- Android SDK Platform
- Performance (Intel ® HAXM) (See here for AMD)
- Android Virtual Device

Then, click "Next" to install all of these components.

If the checkboxes are grayed out, you will have a chance to install these components later on.

Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

#### Install the Android SDK

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 9 (Pie) SDK in particular.

The SDK Manager can be accessed from the "Welcome to Android Studio" screen. Click on "Configure", then select "SDK Manager".

The SDK Manager can also be found within the Android Studio "Preferences" dialog, under Appearance & Behavior → System Settings → Android SDK.

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 9 (Pie) entry, then make sure the following items are checked:

##### Android SDK Platform 28

Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that 28.0.3 is selected.

Finally, click "Apply" to download and install the Android SDK and related build tools.

###### Configure the ANDROID_HOME environment variable

The React Native tools require some environment variables to be set up in order to build apps with native code.

Add the following lines to your \$HOME/.bash_profile config file:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

`.bash_profile` is specific to bash. If you're using another shell, you will need to edit the appropriate shell-specific config file.

Type `source $HOME/.bash_profile` to load the config into your current shell. Verify that `ANDROID_HOME` has been added to your path by running `echo $PATH`.

Please make sure you use the correct Android SDK path. You can find the actual location of the SDK in the Android Studio "Preferences" dialog, under Appearance & Behavior → System Settings → Android SDK.

###### Preparing the Android device

To run in virtual device Emulator

If you use Android Studio to open the project, you can see the list of available Android Virtual Devices (AVDs) by opening the "AVD Manager" from within Android Studio.

###### Android Studio AVD Manager

If you have just installed Android Studio, you will likely need to create a new AVD. Select "Create Virtual Device...", then pick any Phone from the list and click "Next", then select the Pie API Level 28 image.

Click "Next" then "Finish" to create your AVD. At this point you should be able to click on the green triangle button next to your AVD to launch it, then proceed to the next step.

To run in physical device:

1. Enable Debugging over USB

    To enable USB debugging on your device, you will first need to enable the "Developer options" menu by going to Settings → About phone and then tapping the Build number row at the bottom seven times. You can then go back to Settings → Developer options to enable "USB debugging".

2. Plug in your device via USB

    ```bash
    adb devices
    ```

    List of devices attached

    ```bash
    emulator-5554 offline   # Google emulator
    14ed2fcc device         # Physical device
    ```

    Seeing device in the right column means the device is connected. You must have only one device connected at a time.

3. Run your app

    Type the following in your command prompt to install and launch your app on the device:

    ```bash
    react-native run-android
    ```

##### Connecting to the development server

###### Method 1: Using adb reverse (recommended)

You can use this method if your device is running Android 5.0 (Lollipop) or newer, it has USB debugging enabled, and it is connected via USB to your development machine.

Run the following in a command prompt:

```bash
adb -s <device name> reverse tcp:8081 tcp:8081
```

To find the device name, run the following adb command:

```bash
adb devices
```

You can now enable Live reloading from the Developer menu. Your app will reload whenever your JavaScript code has changed.

###### Method 2: Connect via Wi-Fi

You can also connect to the development server over Wi-Fi. You'll first need to install the app on your device using a USB cable, but once that has been done you can debug wireless-ly by following these instructions. You'll need your development machine's current IP address before proceeding.

You can find the IP address in System Preferences → Network.

Make sure your laptop and your phone are on the same Wi-Fi network.
Open your React Native app on your device.
You'll see a red screen with an error. This is OK. The following steps will fix that.
Open the in-app Developer menu.
Go to Dev Settings → Debug server host & port for device.
Type in your machine's IP address and the port of the local dev server (e.g. 10.0.1.1:8081).
Go back to the Developer menu and select Reload JS.
You can now enable Live reloading from the Developer menu. Your app will reload whenever your JavaScript code has changed.

## 🏃🏽‍ Steps to run this project in Windows

iOS requires Mac to run the project. You cannot run iOS in Windows.

### Android on Windows

#### Installing dependencies

You will need Node, the React Native command line interface, Python2, a JDK, and Android Studio.

1. Node, Python2, JDK

    We recommend installing Node and Python2 via Chocolatey, a popular package manager for Windows.

    React Native also requires a recent version of the Java SE Development Kit (JDK), as well as Python 2. Both can be installed using Chocolatey.

    Open an Administrator Command Prompt (right click Command Prompt and select "Run as Administrator"), then run the following command:

    ```bash
    choco install -y nodejs.install python2 jdk8
    ```

    If you have already installed Node on your system, make sure it is Node 8.3 or newer. If you already have a JDK on your system, make sure it is version 8 or newer.

2. The React Native CLI

    Node comes with npm, which lets you install the React Native command line interface.
    Run the following command in a Command Prompt or shell:

    ```bash
    npm install -g react-native-cli
    ```

    If you get an error like Cannot find module 'npmlog', try installing npm directly:

    ```bash
    curl -0 -L https://npmjs.org/install.sh | sudo sh
    ```

3. Android development environment

    Make sure to follow the below steps:

    1. Install Android Studio

        Download and install Android Studio. Choose a "Custom" setup when prompted to select an installation type. Make sure the boxes next to all of the following are checked:

        - Android SDK
        - Android SDK Platform
        - Performance (Intel ® HAXM) (See here for AMD)
        - Android Virtual Device
        - Then, click "Next" to install all of these components.

        If the checkboxes are grayed out, you will have a chance to install these components later on.

        Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

    2. Install the Android SDK

        Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 9 (Pie) SDK in particular.The SDK Manager can be accessed from the "Welcome to Android Studio" screen. Click on "Configure", then select "SDK Manager".

        The SDK Manager can also be found within the Android Studio "Preferences" dialog, under Appearance & Behavior → System Settings → Android SDK.

        Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 9 (Pie) entry, then make sure the following items are checked:

        **Android SDK Platform 28**

        Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image
        Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that 28.0.3 is selected.

        Finally, click "Apply" to download and install the Android SDK and related build tools.

    3. Configure the ANDROID_HOME environment variable

        The React Native tools require some environment variables to be set up in order to build apps with native code.

        Open the System pane under System and Security in the Windows Control Panel, then click on Change settings.... Open the Advanced tab and click on Environment Variables.... Click on New... to create a new ANDROID_HOME user variable that points to the path to your Android SDK:

        ANDROID_HOME Environment Variable

        The SDK is installed, by default, at the following location:

        ```bash
        c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
        ```

        You can find the actual location of the SDK in the Android Studio "Preferences" dialog, under Appearance & Behavior → System Settings → Android SDK.

        Open a new Command Prompt window to ensure the new environment variable is loaded before proceeding to the next step.

    4. Add platform-tools to Path

        Open the System pane under System and Security in the Windows Control Panel, then click on Change settings.... Open the Advanced tab and click on Environment Variables.... Select the Path variable, then click Edit. Click New and add the path to platform-tools to the list.

        The default location for this folder is:

        ```bash
        c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk\platform-tools
        ```

    5. To run it in physical device/virtual device Emulator

        Same procedure as mentioned above for MacOS
