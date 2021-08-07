---
id: RelatedItemsView
title: RelatedItemsView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

RelatedItemsView is backed by QuickplayTV CMS APIs. It can display a collection of contents that are similar to a selected content.

## Usage

```jsx
import { RelatedItemsView } from 'qp-discovery-ui';

<RelatedItemsView resourceId={'12345'} />;
```

#### RelatedItemsView with custom icon styles

```jsx
import { RelatedItemsView } from 'qp-discovery-ui';

<RelatedItemsView resourceId={'12345'} iconSize={30} iconColor={'red'} />;
```

#### RelatedItemsView with custom wrapper style

```jsx {11-13}
import { RelatedItemsView } from 'qp-discovery-ui';

const style = StyleSheet.create({
  position: 'absolute' as 'absolute',
  top: 10,
  left: 5
});

<RelatedItemsView
  resourceId={'12345'}
  wrapperStyle={{ margin: 5 }}
  activityIndicatorStyle={style}
  underlayColor={'yellow'}
/>;
```

---

## Props

-   [`relatedContentLink`](#relatedContentLink)
-   [`ListLoadingComponent`](#ListLoadingComponent)
-   [`cardProps`](#cardProps)
-   [`showActivityIndicator`](#showActivityIndicator)
-   [`title`](#title)
-   [`containerStyle`](#containerStyle)
-   [`sectionHeaderStyle`](#sectionHeaderStyle)

---

## Reference

### `relatedContentLink`

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
