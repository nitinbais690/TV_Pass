---
id: ResourceMetaInfoView
title: ResourceMetaInfoView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

`ResourceMetaInfoView` component can be used to render the meta data info of a Movie, TV Series on a Live Program.

## Usage

```jsx
import { ResourceMetaInfoView } from 'qp-discovery-ui';

<ResourceMetaInfoView resource={movie} />;
```

#### ResourceMetaInfoView with custom styling

```jsx
import { ResourceMetaInfoView } from 'qp-discovery-ui';

const customCastStyle = StyleSheet.create({
    infoCaptionStyle: {
        margin: 5,
        fontSize: 10,
        fontColor: 'blue',
    },
});

<ResourceMetaInfoView resource={movie} infoViewStyle={customCastStyle} />;
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
