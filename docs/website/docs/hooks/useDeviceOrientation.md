---
id: use-device-orientation
title: useDeviceOrientation
---

`useRoute` is a hook which gives access to `route` object. It's useful when you cannot pass the `route` prop into the component directly, or don't want to pass it in case of a deeply nested child.

`useRoute()` returns the `route` prop of the screen it's inside.

## Example

<samp id="use-route-example" />

```js
import * as React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

function MyText() {
    const route = useRoute();

    return <Text>{route.params.caption}</Text>;
}
```

See the documentation for the [`route` prop](route-prop.md) for more info.
