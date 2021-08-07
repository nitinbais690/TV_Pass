---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

### Installation

Install the required packages in your React Native project:

```bash npm2yarn
yarn add qp-discovery-ui qp-player-ui rn-qp-vstb7-player

# or with npm
npm i qp-discovery-ui qp-player-ui rn-qp-vstb7-player --save
```

:::note
QuickplayTV UI/UX libraries are private packages and not published on public npm repo.
:::

From React Native 0.60 and higher, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md). So you don't need to run `react-native link`.

If you're on a Mac and developing for iOS, you need to install the pods (via Cocoapods) to complete the linking.

```sh
npx pod-install ios
```

Now, we need to wrap the whole app in `ConfigProvider`. Usually you'd do this in your entry file, such as `index.js` or `App.js`:

```jsx
import * as React from 'react';
import { ConfigProvider, Config } from 'qp-discovery-ui';

export default function App() {
    const { appConfig } = prefs;

    const serviceConfig = createAppConfig(getServiceConfig(appConfig));


return (
        <ConfigProvider
            config={appConfig}
            serviceConfig={serviceConfig.apiConfigs}>
            {/* Rest of your app code */}
        </ConfigProvider>
    );
}
```

Now you are ready to build and run your app on the device/simulator.

### Supported Devices

| Platform       | Minimum OS Version | Streaming Format |       DRM        |
| -------------- | :----------------: | :--------------: | :--------------: |
| iOS            |      iOS 10.0      |       HLS        |     Fairplay     |
| iPadOS         |    iPadOS 13.0     |       HLS        |     Fairplay     |
| AppleTV        |    tvOS 10.0       |       HLS        |     Fairplay     |
| Android Mobile |    Android 5.0     |    MPEG-DASH     | Widevine Modular |
| Android Tablet |    Android 5.0     |    MPEG-DASH     | Widevine Modular |
| AndroidTV      |    Android 5.0     |    MPEG-DASH     | Widevine Modular |
| FireTV         |     FireOS5.0      |    MPEG-DASH     | Widevine Modular |
