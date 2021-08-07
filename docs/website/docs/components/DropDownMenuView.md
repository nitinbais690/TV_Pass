---
id: DropDownMenuView
title: DropDownMenuView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

`DropDownMenuView` component is a wrapper components that composes several other micro components to display an opinionated layout to showcase a Movie, TV Series or a Live Program meta-data and Call-to-Action buttons like _Play_ and _Download_. Supports rendering following features:

-   Adaptive Poster display
-   Showcase Cast & Crew
-   Title metadata
-   Call-to-action Buttons
-   Browse TV Show Seasons

<div className="text--center">
  <figure>
    <img src={useBaseUrl('img/components/drop_down.png')} alt="Movie Info View" />
  </figure>
</div>

## Usage

```jsx
import { DropDownMenuView } from 'qp-discovery-ui';

<DropDownMenuView resource={movie} />;
```

#### DropDownMenuView with custom styling

```jsx
import { DropDownMenuView } from 'qp-discovery-ui';

const customCastStyle = StyleSheet.create({
    infoCaptionStyle: {
        margin: 5,
        fontSize: 10,
        fontColor: 'blue',
    },
});

<DropDownMenuView resource={movie} infoViewStyle={customCastStyle} />;
```

#### DropDownMenuView with continue watching

```jsx {5,6}
import { DropDownMenuView } from 'qp-discovery-ui';

<DropDownMenuView
    resource={movie}
    showResume={true}
    resumeProgress={0.45}
    onResourcePlayPress={movie => {
        console.log(`Play movie: ${movie.id}`);
    }}
/>;
```

---

## Props

-   [`resource`](#resource)
-   [`infoViewStyle`](#infoViewStyle)
-   [`underlayColor`](#underlayColor)
-   [`imageType`](#imageType)
-   [`defaultImageAspectRatio`](#defaultImageAspectRatio)
-   [`skipResize`](#skipResize)
-   [`showResume`](#showResume)
-   [`resumeProgress`](#resumeProgress)
-   [`showDownload`](#showDownload)
-   [`downloadActionText`](#downloadActionText)
-   [`downloadProgress`](#downloadProgress)
-   [`onResourcePlayPress`](#onResourcePlayPress)
-   [`onResourceDownloadPress`](#onResourceDownloadPress)

---

## Reference

### `resource`

The resource object which has to be rendered

|     Type     | Default |
| :----------: | :-----: |
| `ResourceVM` |  none   |

---

### `infoViewStyle`

The custom style instance

|          Type           |       Default        |
| :---------------------: | :------------------: |
| `DropDownMenuViewStyle` | default theme styles |

---

### `underlayColor`

Underlay color for Action (Play/Download) button

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

### `imageType`

---

Image type of the card

|   Type    | Default |
| :-------: | :-----: |
| ImageType |  none   |

### `defaultImageAspectRatio`

---

Default Image Aspect Ratio for data store images

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

### `skipResize`

---

Skip resizing the images.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `showResume`

Indicates whether to show a resume watching button or a regular play now button

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `resumeProgress`

The current progress of the content indicated as a float between 0 and 1.

|  Type  | Default |
| :----: | :-----: |
| number |    0    |

---

### `showDownload`

Indicates whether to show a `Download Now` button or not.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

### `downloadActionText`

The call-to-action text for Download button.

|  Type  |   Default    |
| :----: | :----------: |
| string | Download Now |

---

### `downloadProgress`

Indicates Download Progress.

|  Type  | Default |
| :----: | :-----: |
| number |    0    |

---

### `onResourcePlayPress`

Called when Play Action is selected.

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

---

### `onResourceDownloadPress`

Called when Download Action is selected

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

---
