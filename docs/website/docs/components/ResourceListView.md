---
id: ResourceListView
title: ResourceListView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

`ResourceListView` component can be used to render any list of resources, like Movie, TV Series or a Live Program.

## Usage

```jsx
import { ResourceListView } from 'qp-discovery-ui';

<ResourceListView resources={episodes} cardProps={cardProps} />;
```

#### ResourceListView with custom styling

```jsx {14-16}
import { ResourceListView } from 'qp-discovery-ui';

const customCastStyle = StyleSheet.create({
    infoCaptionStyle: {
        margin: 5,
        fontSize: 10,
        fontColor: 'blue',
    },
});

<ResourceListView
    resources={episodes}
    cardProps={cardProps}
    contentContainerStyle={{
        margin: 20,
    }}
/>;
```

#### ResourceListView with grid style

```jsx {6}
import { ResourceListView } from 'qp-discovery-ui';

<ResourceListView
    resources={episodes}
    cardProps={cardProps}
    numColumns={3}
    removeClippedSubviews={false}
/>;
```

---

## Props

-   [`cardProps`](#cardProps)
-   [`resources`](#resources)
-   [`renderItem`](#renderItem)
-   [`numColumns`](#numColumns)
-   [`contentContainerStyle`](#contentContainerStyle)
-   [`removeClippedSubviews`](#removeClippedSubviews)

---

## Reference

### `cardProps`

Styles for list's card props.

|          Type           |       Default        |
| :---------------------: | :------------------: |
| `ResourceInfoVListtyle` | default theme styles |

---

### `resources`

List of resources to render

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `renderItem`

Allows the ability to provide a custom rendering of `ResourceVm`. When none is provided, the default rendering would apply.

|     Type     | Default |
| :----------: | :-----: |
| `ResourceVM` |  none   |

---

### `numColumns`

Multiple columns can only be rendered with `horizontal={false}` and will zigzag like a `flexWrap` layout. Items should all be the same height - masonry layouts are not supported.

|  Type  | Default |
| :----: | :-----: |
| number |    0    |

---

### `contentContainerStyle`

These styles will be applied to the scroll view content container which
wraps all of the child views. Example:

```jsx
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
    </ScrollView>
  );
  ...
  const styles = StyleSheet.create({
    contentContainer: {
      paddingVertical: 20
    }
  });
```

|          Type          | Default |
| :--------------------: | :-----: |
| `StyleProp<ViewStyle>` |  none   |

---

### `removeClippedSubviews`

FlatList property

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---
