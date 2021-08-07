---
id: CollectionCardView
title: CollectionCardView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

CollectionCardView can be used to present a Collection of resource types.

## Usage

```jsx
import { CollectionCardView } from 'qp-discovery-ui';

// Renders Catalog with default styles
<CollectionCardView
    resource={item}
    onResourcePress={(resource: ResourceVm) => {
        console.log(`card selected : ${resource.id}`);
    }}
    cardStyle={updatedCardStyle}
    cardAspectRatio={aspectRatio}
    cardImageType={ImageType.Poster}
/>;
```

---

## Props

-   [`resource`](#resource)
-   [`onResourcePress`](#onResourcePress)
-   [`tvParallaxProperties`](#tvParallaxProperties)
-   [`linearGradientProps`](#linearGradientProps)
-   [`cardStyle`](#cardStyle)
-   [`cardAspectRatio`](#cardAspectRatio)
-   [`cardImageType`](#cardImageType)
-   [`hideGradient`](#hideGradient)
-   [`testID`](#testID)
-   [`showTitle`](#showTitle)
-   [`showSubtitle`](#showSubtitle)
-   [`titleNumberOfLines`](#titleNumberOfLines)
-   [`skipResize`](#skipResize)
-   [`underlayColor`](#underlayColor)
-   [`activeOpacity`](#activeOpacity)

---

## Reference

### `resource`

Must be either `ResourceVm` or one of its extensions

|         Type         | Default |
| :------------------: | :-----: |
| object(`ResourceVm`) |  none   |

---

### `onResourcePress`

Called when the touch is released, but not if cancelled (e.g. by a scroll that steals the responder lock).

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

---

### `tvParallaxProperties`

(Apple TV only) Object with properties to control Apple TV parallax effects.

|              Type              |                                                                           Default                                                                           |
| :----------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------: |
| object(`TVParallaxProperties`) | {enabled: true, shiftDistanceX: 2.0, shiftDistanceY: 2.0, tiltAngle: 0.05, magnification: 1.0, pressMagnification: 1.0, pressDuration: 0.3 pressDelay: 0.0} |

---

### `linearGradientProps`

Props to apply as a linear gradient on top of image

|             Type              | Default |
| :---------------------------: | :-----: |
| object(`LinearGradientProps`) |  none   |

---

### `cardStyle`

The style of the `ResourceCardView` component

|            Type             |       Default       |
| :-------------------------: | :-----------------: |
| object(`ResourceCardStyle`) | default card styles |

---

### `cardAspectRatio`

The aspectRatio for the card view

|     Type      | Default |
| :-----------: | :-----: |
| `AspectRatio` |    1    |

---

### `cardImageType`

The image type for the card view

|    Type     |      Default       |
| :---------: | :----------------: |
| `ImageType` | `ImageType.Poster` |

---

### `hideGradient`

Boolean prop to toggle show/hide gradient

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `testID`

Unique identifier to identify the element in tests

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `showTitle`

Boolean prop to toggle show/hide title

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

---

### `showSubtitle`

Boolean prop to show subtitle or not

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

---

### `titleNumberOfLines`

The max number of lines to show for title

|  Type  | Default |
| :----: | :-----: |
| number |    1    |

---

### `skipResize`

Skip resizing the images. Default is to resize the images.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `underlayColor`

The color of the underlay that will show through when the touch is active.

|  Type  |           Default            |
| :----: | :--------------------------: |
| string | Background color of the card |

---

### `activeOpacity`

Determines what the opacity of the wrapped view should be when touch is active.
The value should be between 0 and 1. Requires underlayColor to be set.

|  Type  | Default |
| :----: | :-----: |
| number |  0.85   |

---
