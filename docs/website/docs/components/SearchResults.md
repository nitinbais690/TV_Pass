---
id: SearchResults
title: SearchResults
---

import useBaseUrl from '@docusaurus/useBaseUrl';

`SearchResults` component can be used to render any list of resources, like Movie, TV Series or a Live Program.

<div className="text--center">
  <figure>
    <img src={useBaseUrl('img/components/search.png')} alt="Movie Info View" />
  </figure>
</div>

## Usage

```jsx
import { SearchResults } from 'qp-discovery-ui';

<SearchResults resources={searchResults} />;
```

#### SearchResults with custom styling

```jsx {14-16}
import { SearchResults } from 'qp-discovery-ui';

const customCastStyle = StyleSheet.create({
    infoCaptionStyle: {
        margin: 5,
        fontSize: 10,
        fontColor: 'blue',
    },
});

<SearchResults
    resources={searchResults}
    cardProps={cardProps}
    contentContainerStyle={{
        margin: 20,
    }}
/>;
```

#### SearchResults with grid style

```jsx {6}
import { SearchResults } from 'qp-discovery-ui';

<SearchResults
    resources={searchResults}
    cardProps={cardProps}
    cardsPerRow={selectDeviceType({ Handset: 3, Tablet: 6 }, 8)}
/>;
```

#### SearchResults with grid style

```jsx {7-10}
import { SearchResults } from 'qp-discovery-ui';

<SearchResults
    resources={searchResults}
    cardProps={cardProps}
    cardsPerRow={selectDeviceType < number > ({ Handset: 3, Tablet: 6 }, 8)}
    onEndReached={() => {
        hasMore && loadMore ? loadMore() : undefined;
    }}
    onEndReachedThreshold={0.7}
/>;
```

---

## Props

-   [`resources`](#resources)
-   [`cardProps`](#cardProps)
-   [`cardsPerRow`](#cardsPerRow)
-   [`contentContainerStyle`](#contentContainerStyle)
-   [`onEndReached`](#onEndReached)
-   [`onEndReachedThreshold`](#onEndReachedThreshold)
-   [`ListFooterComponent`](#ListFooterComponent)

---

## Reference

### `resources`

List of resources to render

|      Type      | Default |
| :------------: | :-----: |
| `ResourceVm[]` |  none   |

---

### `cardProps`

Styles for list's card props.

|          Type           |       Default        |
| :---------------------: | :------------------: |
| `ResourceInfoVListtyle` | default theme styles |

---

### `cardsPerRow`

The number of columns to show when rendering in grid style.

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

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

### `onEndReached`

Called once when the scroll position gets within onEndReachedThreshold of the rendered content.

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

---

### `onEndReachedThreshold`

How far from the end (in units of visible length of the list) the bottom edge of the
list must be from the end of the content to trigger the `onEndReached` callback.
Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
within half the visible length of the list.

|      Type       | Default |
| :-------------: | :-----: |
| `number | null` |    1    |

---

### `ListFooterComponent`

Rendered at the very end of the list.

|                           Type                           | Default |
| :------------------------------------------------------: | :-----: |
| `React.ComponentType<any> or React.ReactElement or null` |  none   |

---
