---
id: FavoriteView
title: FavoriteView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

FavoriteView is backed by QuickplayTV Platform's Personalization APIs. It can be used to allow the user to `favorite` any content, and display the current state.

## Usage

```jsx
import { FavoriteView } from 'qp-discovery-ui';

<FavoriteView resourceId={'12345'} />;
```

#### FavoriteView with custom icon styles

```jsx
import { FavoriteView } from 'qp-discovery-ui';

<FavoriteView resourceId={'12345'} iconSize={30} iconColor={'red'} />;
```

#### FavoriteView with custom wrapper style

```jsx {11-13}
import { FavoriteView } from 'qp-discovery-ui';

const style = StyleSheet.create({
  position: 'absolute' as 'absolute',
  top: 10,
  left: 5
});

<FavoriteView
  resourceId={'12345'}
  wrapperStyle={{ margin: 5 }}
  activityIndicatorStyle={style}
  underlayColor={'yellow'}
/>;
```

---

## Props

-   [`resourceId`](#resourceId)
-   [`wrapperStyle`](#wrapperStyle)
-   [`activityIndicatorStyle`](#activityIndicatorStyle)
-   [`showActivityIndicator`](#showActivityIndicator)
-   [`underlayColor`](#underlayColor)
-   [`iconSize`](#iconSize)
-   [`iconColor`](#iconColor)

---

## Reference

### `resourceId`

The resourceId for which to fetch favorite

|  Type  | Default |
| :----: | :-----: |
| string |    -    |

---

### `wrapperStyle`

The wrapper style for the favorite button.

|          Type          | Default |
| :--------------------: | :-----: |
| `StyleProp<ViewStyle>` |  none   |

---

### `containerStyle`

The style for activity indicator, if its enabled. see @showActivityIndicator.

|          Type          | Default |
| :--------------------: | :-----: |
| `StyleProp<ViewStyle>` |  none   |

---

### `showActivityIndicator`

Indicates whether to show the activity indicator.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

---

### `underlayColor`

The color of the button when it is tapped.

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `iconSize`

The size of the favorite icon.

|  Type  | Default |
| :----: | :-----: |
| number |   40    |

---

### `iconColor`

The color to use for the favorite icon.

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---
