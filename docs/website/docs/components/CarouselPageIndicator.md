---
id: CarouselPageIndicator
title: CarouselPageIndicator
---

import useBaseUrl from '@docusaurus/useBaseUrl';

CarouselPageIndicator can be used along with a Carousel to indicate the current page.

<div className="text--center">
  <figure>
    <img src={useBaseUrl('img/components/page_indicator.png')} alt="Standard Indicator" />
    <figcaption>Standard</figcaption>
  </figure>
  <figure>
    <img src={useBaseUrl('img/components/page_indicator_1.png')} alt="Standard Indicator" />
    <figcaption>Carousel</figcaption>
  </figure>
</div>

## Usage

```jsx
import { CarouselPageIndicator } from 'qp-discovery-ui';

// Default Page Indicator
<CarouselPageIndicator numberOfPages={total} activeIndexPage={activeIndex} />;
```

#### Custom Styled Page Indicator

```jsx {6-7}
import { CarouselPageIndicator } from 'qp-discovery-ui';

<CarouselPageIndicator
    numberOfPages={total}
    activeIndexPage={activeIndex}
    pageStyle={inactiveStyle}
    activePageStyle={inactiveStyle}
/>;
```

#### Indicator with custom wrapper style

```jsx {6}
import { CarouselPageIndicator } from 'qp-discovery-ui';

<CarouselPageIndicator
    numberOfPages={total}
    activeIndexPage={activeIndex}
    containerStyle={indicatorWrapperStyle}
/>;
```

---

## Props

-   [`numberOfPages`](#numberOfPages)
-   [`activeIndexPage`](#activeIndexPage)
-   [`containerStyle`](#containerStyle)
-   [`pageStyle`](#pageStyle)
-   [`activePageStyle`](#activePageStyle)

---

## Reference

### `numberOfPages`

Number of pages to be indicated below the highlights carousel.

|  Type  | Default |
| :----: | :-----: |
| number |    -    |

---

### `activeIndexPage`

Active page to be indicated on the list of pages (optional)

|  Type  | Default |
| :----: | :-----: |
| number |    0    |

---

### `containerStyle`

Style of the container holding the pages. Default style is a flex below the highlights carousel (optional)

|      Type      |                                     Default                                     |
| :------------: | :-----------------------------------------------------------------------------: |
| object (style) | {flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'} |

---

### `pageStyle`

Style of the pages denoting the carousel elements. Default style is grey dots (optional).

|      Type      |                                                       Default                                                       |
| :------------: | :-----------------------------------------------------------------------------------------------------------------: |
| object (style) | { width: scale(4), height: scale(4), borderRadius: scale(4), backgroundColor: '#ccc', marginHorizontal: scale(5), } |

---

### `activePageStyle`

Style of the active carousel in the list of carousel page (optional).

|      Type      |                                                         Default                                                         |
| :------------: | :---------------------------------------------------------------------------------------------------------------------: |
| object (style) | { width: scale(7), height: scale(7), borderRadius: scale(4), backgroundColor: 'darkgrey', marginHorizontal: scale(5), } |

---
