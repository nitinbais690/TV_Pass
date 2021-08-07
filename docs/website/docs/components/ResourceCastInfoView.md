---
id: ResourceCastInfoView
title: ResourceCastInfoView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

`ResourceCastInfoView` component can be used to display the cast and crew info of a Movie or a TV Series.

## Usage

```jsx
import { ResourceCastInfoView } from 'qp-discovery-ui';

<ResourceCastInfoView resource={movie} />;
```

#### ResourceCastInfoView with custom styling

```jsx
import { ResourceCastInfoView } from 'qp-discovery-ui';

const customCastStyle = StyleSheet.create({
    infoCaptionStyle: {
        margin: 5,
        fontSize: 10,
        fontColor: 'blue',
    },
});

<ResourceCastInfoView resource={movie} infoViewStyle={customCastStyle} />;
```

---

## Props

-   [`resource`](#resource)
-   [`infoViewStyle`](#infoViewStyle)

---

## Reference

### `resource`

The resource object which has to be rendered

|     Type     | Default |
| :----------: | :-----: |
| `ResourceVM` |    -    |

---

### `infoViewStyle`

The custom style instance

|          Type           |       Default        |
| :---------------------: | :------------------: |
| `ResourceInfoViewStyle` | default theme styles |

---
