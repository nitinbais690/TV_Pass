---
id: CarouselView
title: CarouselView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Custom React component for rendering a collection of objects as a Carousel.

<div className="text--center">
  <figure>
    <img src={useBaseUrl('img/components/page_indicator_1.png')} alt="Standard Carousel" />
    <figcaption>Standard</figcaption>
  </figure>
</div>

## Usage

```jsx
import { CarouselView } from 'qp-discovery-ui';

<CarouselView
    data={resources}
    renderItem={({ item }: { item: ResourceVm }): JSX.Element => {
        return <MyCardView resource={item} />;
    }}
    onIndexChange={updateActiveIndex}
/>;
```

#### Enable Auto scroll with custom scroll interval

```jsx {5-6}
import { CarouselView } from 'qp-discovery-ui';

<CarouselView
    data={resources}
    autoplay={true}
    autoplayInterval={2000}
    renderItem={({ item }: { item: ResourceVm }): JSX.Element => {
        return <MyCardView resource={item} />;
    }}
    onIndexChange={updateActiveIndex}
/>;
```

#### Enable Infinite scroll

```jsx {6}
import { CarouselView } from 'qp-discovery-ui';

<CarouselView
    data={resources}
    autoplay={true}
    loop={true}
    autoplayInterval={2000}
    renderItem={({ item }: { item: ResourceVm }): JSX.Element => {
        return <MyCardView resource={item} />;
    }}
    onIndexChange={updateActiveIndex}
/>;
```

---

## Props

:::note
This component inherits all [FlatList props](https://reactnative.dev/docs/flatlist#props), along with the following:
:::

-   [`autoplay`](#autoplay)
-   [`loop`](#loop)
-   [`autoplayInterval`](#autoplayInterval)
-   [`snapToInterval`](#snapToInterval)
-   [`onIndexChange`](#onIndexChange)

---

## Reference

### `autoplay`

Trigger autoplay on list. Set `@pagingEnabled` to `true` for better user experience. The default value is false.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `loop`

When true, the items in the list would repeat on either side, mimicking an endless list.This would work only when the there are a minimum of n items that cover the screen.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `autoplayInterval`

Delay in ms until navigating to the next item.

|  Type  | Default |
| :----: | :-----: |
| number |  5000   |

---

### `snapToInterval`

When set, causes the scroll view to stop at multiples of the value of `snapToInterval`.This can be used for paginating through children that have lengths smaller than the scroll view. Used in combination with `snapToAlignment` and `decelerationRate="fast"`. Overrides less configurable `pagingEnabled` prop.

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `onIndexChange`

Used to read the active page on the carousal callback is done to the parent element and value is passed to the `casousalPageIndicator` child element

|   Type   | Default |
| :------: | :-----: |
| function |    -    |

---
