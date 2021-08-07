---
id: DiscoveryCatalog
title: DiscoveryCatalog
---

import useBaseUrl from '@docusaurus/useBaseUrl';

DiscoveryCatalog is a view that renders a typical OTT catalog. It has been designed to work well with Firstlight's Storefront Product, which enables Content Managers to easily design a Catalog experience to delight customers.

DiscoveryCatalog has been designed to allow simple integration and offer great flexibility to create highly customizable Catalog experience. Supports the following features:

-   Dynamic Tabs
-   Carousels
-   Embedded Collections
-   Server-driven styling (Shape, Size, Aspect Ratio)
-   Syndicated Content
-   Lazy Loading containers

<div className="component-preview component-preview--2">
  <figure>
    <img src={useBaseUrl('img/components/sf_catalog_1.png')} alt="Standard Indicator" />
  </figure>
  <figure>
    <img src={useBaseUrl('img/components/sf_catalog_3.png')} alt="Standard Indicator" />
  </figure>
  <figure>
    <img src={useBaseUrl('img/components/sf_catalog_5.png')} alt="Standard Indicator" />
  </figure>
  <figure>
    <img src={useBaseUrl('img/components/sf_catalog_4.png')} alt="Standard Indicator" />
  </figure>
</div>

## Usage

```jsx
import { DiscoveryCatalog } from 'qp-discovery-ui';

// Renders Catalog with default styles
<DiscoveryCatalog
    containers={containers}
    cardProps={cardProps}
    bannerProps={bannerProps}
    ListFooterComponent={LoadingComponent}
/>;
```

#### Catalog with custom card rendering

```jsx {5-7}
import { DiscoveryCatalog } from 'qp-discovery-ui';

<DiscoveryCatalog
    containers={containers}
    renderResource={({ item }: { item: ResourceVm }): JSX.Element => {
        return <MyCardView resource={item} />;
    }}
/>;
```

#### Catalog with lazy loading

```jsx {7-10}
import { DiscoveryCatalog } from 'qp-discovery-ui';

<DiscoveryCatalog
    containers={containers}
    cardProps={cardProps}
    bannerProps={bannerProps}
    onEndReached={() => {
        hasMore && loadMore ? loadMore(pageOffset) : undefined;
    }}
    onEndReachedThreshold={0.8}
    ListFooterComponent={hasMore ? LoadingComponent : undefined}
/>;
```

#### Catalog with refresh control

```jsx {19}
import { DiscoveryCatalog } from 'qp-discovery-ui';

const refreshControl = () => (
    <RefreshControl
        refreshing={loading && containers.length > 0}
        onRefresh={reload}
        tintColor={'#ccc'}
        titleColor={'#111'}
        progressBackgroundColor={'#fff'}
        colors={['#fff']}
    />
);

...

// Catalog with custom refresh control
<DiscoveryCatalog
    containers={containers}
    refreshControl={refreshControl}
    cardProps={cardProps}
    bannerProps={bannerProps}
  />;
```

---

## Props

-   [`containers`](#containers)
-   [`renderContainer`](#renderContainer)
-   [`renderResource`](#renderResource)
-   [`numColumns`](#numColumns)
-   [`ListFooterComponent`](#ListFooterComponent)
-   [`contentContainerStyle`](#contentContainerStyle)
-   [`containerContentContainerStyle`](#containerContentContainerStyle)
-   [`initialNumOfContainersToRender`](#initialNumOfContainersToRender)
-   [`showSectionHeader`](#showSectionHeader)
-   [`sectionHeaderStyle`](#sectionHeaderStyle)
-   [`bannerProps`](#bannerProps)
-   [`cardProps`](#cardProps)
-   [`onEndReached`](#onEndReached)
-   [`onEndReachedThreshold`](#onEndReachedThreshold)
-   [`refreshControl`](#refreshControl)

---

## Reference

### `containers`

The array of containers to render.

|             Type             | Default |
| :--------------------------: | :-----: |
| `ReadonlyArray<ContainerVm>` |  none   |

---

### `renderContainer`

Allows the ability to provide a custom rendering of `ContainerVm`.

When none is provided, the default rendering would apply.

Typical usage:

```jsx
_renderContainer = ({item}) => (
  <TouchableOpacity onPress={() => this._onPress(item)}>
    <Text>{item.title}</Text>
  <TouchableOpacity/>
);
...
<DiscoveryCatalog containers={containers} renderContainer={this._renderContainer} />
```

|             Type              |      Default      |
| :---------------------------: | :---------------: |
| `ListRenderItem<ContainerVm>` | default container |

---

### `renderResource`

Allows the ability to provide a custom rendering of `ResourceVm`.
Would not take effect when a custom `renderContainer` implementation is provided.

When none is provided, the default rendering would apply.

|             Type             | Default |
| :--------------------------: | :-----: |
| `ListRenderItem<ResourceVm>` |  none   |

---

### `numColumns`

Multiple columns can only be rendered with `horizontal={false}` and will zigzag like a `flexWrap` layout.
Items should all be the same height - masonry layouts are not supported.

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `ListFooterComponent`

Rendered at the very end of the list.

|                           Type                           | Default |
| :------------------------------------------------------: | :-----: |
| `React.ComponentType<any> or React.ReactElement or null` |  none   |

---

### `contentContainerStyle`

These styles will be applied to the scroll view content container which
wraps all of the child views.

Example:

```
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

### `containerContentContainerStyle`

These styles will be applied to the scroll view content container which
wraps all of the child views.

Example:

```
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

### `initialNumOfContainersToRender`

How many containers rows to render in the initial batch. This should be enough to fill the screen but not much more.
Note these items will never be unmounted as part of the windowed rendering
in order to improve perceived performance of scroll-to-top actions.

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `showSectionHeader`

Determines whether to show or hide the section headers

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

---

### `sectionHeaderStyle`

Styles for section header

|          Type          | Default |
| :--------------------: | :-----: |
| `StyleProp<TextStyle>` |  none   |

---

### `bannerProps`

Props for default `ResourceCarouselView` component

|                     Type                      | Default |
| :-------------------------------------------: | :-----: |
| [{...CardView Props}](ResourceCardView#props) |  none   |

---

### `cardProps`

Props for default `ResourceCardView` component

|                     Type                      | Default |
| :-------------------------------------------: | :-----: |
| [{...CardView Props}](ResourceCardView#props) |  none   |

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

### `refreshControl`

A RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.

|                   Type                    | Default |
| :---------------------------------------: | :-----: |
| `React.ReactElement<RefreshControlProps>` |  false  |

---
