---
id: customization
title: Customization
hide_table_of_contents: true
---

import useBaseUrl from '@docusaurus/useBaseUrl';

QuickplayTV UI/UX offers out-of-the-box integration with QuickplayTV Platform features and enables fast iteration of the app. But in the event that the application requires integration with other OSS or 3rd party APIs or if the UI requirements are dramatically different than the ones supported out of the box, one could easily adapt the application for these use-cases.

The custom [React Hooks](https://reactjs.org/docs/hooks-intro.html) and the UI components are _by design_ not directly coupled, rather the application ties them together. For cases when the application needs to integrate with a different API, the react hook can be swapped out for a different implementation, yet use the UI component by adapting the model data into the `ViewModel` structure defined by the UI component. Conversely, if the application needs a different UI treatment, the UI component can be swapped out by still integrate with the components library's `hook`.

<div className="text--center">
  <figure>
    <img src={useBaseUrl('img/rn_components_design.svg')} alt="Component Design" />
  </figure>
</div>

#### Styling

Every component from QuickplayTV UI/UX library allows overriding the default styles via props. Refer to the component documentation to understand the customizable props.

```jsx
// custom card aspect ratio
const aspectRatio = AspectRatio._16by9;

// custom card style
const cardStyle = StyleSheet.create({
    wrapperStyle: {
        width: 200,
        aspectRatio: aspectRatio,
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    imageStyle: {
        borderRadius: 5,
        flex: 1,
    },
    onFocusCardStyle: {
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: 2,
    },
    textWrapperStyle: {
        position: 'absolute',
    },
    titleStyle: {
        color: '#000',
    },
    subtitleStyle: {
        color: '#333',
    },
    gradientOverlayStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

return (
    <ResourceCardView
        resource={item}
        showTitle={true}
        onResourcePress={(resource: ResourceVm) => {
            console.log(`card selected : ${resource.id}`);
        }}
        cardStyle={updatedCardStyle}
        cardAspectRatio={aspectRatio}
        cardImageType={ImageType.Poster}
    />
);
```
