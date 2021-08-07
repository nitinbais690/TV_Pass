---
id: ResizableImage
title: ResizableImage
---

import useBaseUrl from '@docusaurus/useBaseUrl';

A custom Image component that wraps default `Image` component for displaying network images
and works with Firstlight's ImageResizer server by generating a deterministic image url with specific resizing params.

:::tip
Accepts standard `ImageProps` along with width and height optionally.
:::

:::note
`ResizableImage` supports computing the dimensions when the view gets layed-out (onLayout event),
this should be in layouts, while this is convenient in many layouts, we would recommend passing in
width and height props while using `ResizableImage` within a list view
since computing the width and height onLayout can be very expensive on a complicated list,
which would lead to stuttering on scroll.
:::

## Usage

```jsx
import { ResizableImage } from 'qp-discovery-ui';

<ResizableImage
    keyId={'123'}
    imageType={ImageType.Poster}
    aspectRatioKey={AspectRatio._16by9}
/>;
```

#### ResizableImage with custom image styles

```jsx {10}
import { ResizableImage } from 'qp-discovery-ui';

const style = StyleSheet.create({
    margin: 10,
    backgroundColor: 'black',
});

<ResizableImage
    keyId={'123'}
    style={style}
    imageType={ImageType.Poster}
    aspectRatioKey={AspectRatio._16by9}
/>;
```

---

## Props

-   [`keyId`](#keyId)
-   [`width`](#width)
-   [`height`](#height)
-   [`testID`](#testID)
-   [`skipResize`](#skipResize)
-   [`aspectRatioKey`](#aspectRatioKey)
-   [`imageType`](#imageType)

---

## Reference

### `keyId`

The resourceId for which to fetch favorite

|  Type  | Default |
| :----: | :-----: |
| string |    -    |

---

### `width`

The width of the image (Optional).

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `height`

The height of the image (Optional).

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `testID`

Unique identifier to identify the element in tests

|  Type  | Default |
| :----: | :-----: |
| string |  true   |

---

### `skipResize`

Optionally skips passing resize params.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `aspectRatioKey`

The aspect ratio of the image.

|     Type      | Default |
| :-----------: | :-----: |
| `AspectRatio` |  none   |

---

### `imageType`

The type of the image.

|    Type     | Default |
| :---------: | :-----: |
| `ImageType` |  none   |

---
