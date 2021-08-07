---
id: SeasonsTabView
title: SeasonsTabView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

`SeasonsTabView` component is a wrapper components that composes several other micro components to display an opinionated layout to showcase a Movie, TV Series or a Live Program meta-data and Call-to-Action buttons like _Play_ and _Download_. Supports rendering following features:

-   Adaptive Poster display
-   Showcase Cast & Crew
-   Title metadata
-   Call-to-action Buttons
-   Browse TV Show Seasons

<div className="text--center">
  <figure>
    <img src={useBaseUrl('img/components/seasons_tab.png')} alt="Seasons Tab" />
  </figure>
</div>

## Usage

```jsx {8-12}
import { SeasonsTabView } from 'qp-discovery-ui';

<SeasonsTabView
    resourceId={12345}
    resourceType={Category.TVSeason}
    ListLoadingComponent={LoadingComponent}
    ListErrorComponent={ErrorComponent}
    tabBarStyle={{
        barHeight: 50,
        barColor: 'blue',
        indicatorColor: 'yellow',
    }}
    renderPage={season =>
        season ? (
            <EpisodesListView
                seriesId={12345}
                seasonId={season.id}
                resourceType={Category.TVEpisodes}
                pageNumber={1}
                pageSize={15}
            />
        ) : null
    }
/>;
```

---

## Props

-   [`resourceId`](#resourceId)
-   [`resourceType`](#resourceType)
-   [`pageNumber`](#pageNumber)
-   [`pageSize`](#pageSize)
-   [`ListLoadingComponent`](#ListLoadingComponent)
-   [`ListErrorComponent`](#ListErrorComponent)
-   [`containerStyle`](#containerStyle)
-   [`tabBarStyle`](#tabBarStyle)
-   [`renderPage`](#renderPage)

---

## Reference

### `resourceId`

The unique identifier of the TV Season.

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

The type of the resource.

### `resourceType`

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `pageNumber`

The page number of the paginated request

|  Type  | Default |
| :----: | :-----: |
| number |    0    |

---

### `pageSize`

The number of seasons to fetch.

|  Type  | Default |
| :----: | :-----: |
| number |   10    |

---

### `ListLoadingComponent`

Rendered when the list is loading.

|                           Type                           | Default |
| :------------------------------------------------------: | :-----: |
| `React.ComponentType<any> or React.ReactElement or null` |  none   |

---

### `ListErrorComponent`

Rendered when the list has an error.

|                           Type                           | Default |
| :------------------------------------------------------: | :-----: |
| `React.ComponentType<any> or React.ReactElement or null` |  none   |

---

### `containerStyle`

The style of seasons tab view

|             Type              | Default |
| :---------------------------: | :-----: |
| `SeasonsTabBarContainerStyle` |  none   |

---

### `tabBarStyle`

The style of the tab bar

|     Type      | Default |
| :-----------: | :-----: |
| `TabBarStyle` |  none   |

---

### `renderPage`

The component to be rendered

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

---
