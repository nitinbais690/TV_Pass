---
id: EpgGuideView
title: EpgGuideView
---

import useBaseUrl from '@docusaurus/useBaseUrl';

EpgGuideView is a view that renders Electronic Program Guide (EPG) for multiple channels and multiple days. Supports lazy-loading the schedules, rendering program information.

<div className="component-preview component-preview--2">

  <figure>
    <img src={useBaseUrl('img/components/epg_1.png')} alt="Standard Indicator" />
  </figure>
  <figure>
    <img src={useBaseUrl('img/components/epg_2.png')} alt="Standard Indicator" />
  </figure>
</div>

## Usage

```jsx
import { EpgGuideView } from 'qp-discovery-ui';

<EpgGuideView
    dayStartTime={dayStartTime}
    dayEndTime={dayEndTime}
    timeSlotData={timeSlotData}
    channels={channels}
    schedules={schedules}
    onResourcePress={schedule =>
        console.log(`selected schedule : ${schedule}`);
    }
/>;
```

#### EPG with custom styling

```jsx {9-13}
import { EpgGuideView } from 'qp-discovery-ui';

<EpgGuideView
    dayStartTime={dayStartTime}
    dayEndTime={dayEndTime}
    timeSlotData={timeSlotData}
    channels={channels}
    schedules={schedules}
    channelTintColor={'#ccc'}
    epgGuideViewStyle={customEpgGuideViewStyle}
    scheduleUnderlayColor={'#eee'}
    progressColor={'red'}
    progressBackgroundColor={'white'}
    onResourcePress={schedule =>
        console.log(`selected schedule : ${schedule}`);
    }
/>;
```

#### EPG with lazy loading

```jsx {12-14}
import { EpgGuideView } from 'qp-discovery-ui';

<EpgGuideView
    dayStartTime={dayStartTime}
    dayEndTime={dayEndTime}
    timeSlotData={timeSlotData}
    channels={channels}
    schedules={schedules}
    onResourcePress={schedule =>
        console.log(`selected schedule : ${schedule}`);
    }
    loading={false}
    onEndReachedThreshold={0.8}
    onEndReached={() => hasMore && loadMore()}
/>;
```

#### EPG without current time indicator

```jsx {9}
import { EpgGuideView } from 'qp-discovery-ui';

<EpgGuideView
    dayStartTime={dayStartTime}
    dayEndTime={dayEndTime}
    timeSlotData={timeSlotData}
    channels={channels}
    schedules={schedules}
    showCurrentTimeIndicator={false}
    onResourcePress={schedule =>
        console.log(`selected schedule : ${schedule}`);
    }
/>;
```

---

## Props

-   [`dayStartTime`](#dayStartTime)
-   [`dayEndTime`](#dayEndTime)
-   [`scrollToActiveProgram`](#scrollToActiveProgram)
-   [`timeSlotData`](#timeSlotData)
-   [`channels`](#channels)
-   [`schedules`](#schedules)
-   [`epgGuideViewStyle`](#epgGuideViewStyle)
-   [`onResourcePress`](#onResourcePress)
-   [`initialNumOfChannelsToRender`](#initialNumOfChannelsToRender)
-   [`channelTintColor`](#channelTintColor)
-   [`progressColor`](#progressColor)
-   [`progressBackgroundColor`](#progressBackgroundColor)
-   [`scheduleUnderlayColor`](#scheduleUnderlayColor)
-   [`showCurrentTimeIndicator`](#showCurrentTimeIndicator)
-   [`showActiveProgramProgressIndicator`](#showActiveProgramProgressIndicator)
-   [`loading`](#loading)
-   [`onEndReached`](#onEndReached)
-   [`onEndReachedThreshold`](#onEndReachedThreshold)

---

## Reference

### `dayStartTime`

The start time for the EPG schedule

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `dayEndTime`

The end time for the EPG schedule

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `scrollToActiveProgram`

Controls whether to scroll to the active program.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

---

### `timeSlotData`

An array representing time slots on the EPG schedule

|   Type   | Default |
| :------: | :-----: |
| string[] |  none   |

---

### `channels`

An array of channels to show in the EPG grid

|      Type      | Default |
| :------------: | :-----: |
| `ResourceVM[]` |  none   |

### `schedules`

An array representing programs for all channels

|       Type       | Default |
| :--------------: | :-----: |
| `ResourceVM[][]` |  none   |

---

### `epgGuideViewStyle`

The style of the epg view container

|        Type         | Default |
| :-----------------: | :-----: |
| `EpgGuideViewStyle` |  none   |

---

### `onResourcePress`

Called when the touch is released, but not if cancelled (e.g. by a scroll that steals the responder lock).

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

---

### `initialNumOfChannelsToRender`

How many channel schedule rows to render in the initial batch. This should be enough to fill the screen but not much more.

:::note
These items will never be unmounted as part of the windowed rendering
in order to improve perceived performance of scroll-to-top actions.
:::

|  Type  | Default |
| :----: | :-----: |
| number |  none   |

---

### `channelTintColor`

The tint color to apply on the channel logo

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `progressColor`

The color to be used for the progress indicator

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `progressBackgroundColor`

The color to be used for the progress background indicator

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `scheduleUnderlayColor`

The color to use when selecting the program tile

|  Type  | Default |
| :----: | :-----: |
| string |  none   |

---

### `showCurrentTimeIndicator`

Determines whether to show the current time indicator on top if the EPG.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

---

### `showActiveProgramProgressIndicator`

Determines whether to show the current progress for the active program.

|  Type   | Default |
| :-----: | :-----: |
| boolean |  true   |

---

### `loading`

Indicates whether data is currently being loaded

|  Type   | Default |
| :-----: | :-----: |
| boolean |  none   |

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

|  Type  | Default |
| :----: | :-----: |
| number |    1    |

---
