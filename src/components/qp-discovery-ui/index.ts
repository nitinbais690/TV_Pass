import ResourceCardView, { cardViewDimensions } from './src/views/ResourceCardView';
import EmptyResourceCardView from './src/views/EmptyResourceCardView';
import ResourceCarouselView from './src/views/ResourceCarouselView';
import { CarouselView } from './src/views/CarouselView';
import { CarouselPageIndicator } from './src/views/CarouselPageIndicator';

import SearchResults from './src/views/SearchResults';
import ResizableImage from './src/views/ResizableImage';
import useDebounce from './src/hooks/useDebounce';
import deepMerge from './src/utils/deepMerge';

export * from 'react-fetching-library';
export * from './src/views/DiscoveryCatalog';
export * from './src/views/EpgGuideView';
export * from './src/views/DropDownMenuView';
export * from './src/api/Client';
export * from './src/hooks/useFetchContainerQuery';
export * from './src/hooks/useFetchRecommendedSearchQuery';
export * from './src/hooks/useFetchRootContainerQuery';
export * from './src/hooks/useFetchCollectionQuery';
export * from './src/models/Storefront.types';
export * from './src/models/ViewModels';
export * from './src/models/Adapters';
export * from './src/views/SeasonsTabView';
export * from './src/views/RelatedItemsView';
export * from './src/views/EpgScheduleOverlayView';
export * from './src/views/ResourceInfoView';
export * from './src/api/actions/fetchDiscoveryResource';
export * from './src/views/ResourceCardView';
export * from './src/views/CarouselView';
export * from './src/views/CarouselPageIndicator';
export * from './src/views/CollectionCardView';
export * from './src/views/ResourceListView';
export * from './src/hooks/useFetchResourceQuery';
export * from './src/hooks/useFetchTVSeriesQuery';
export * from './src/context/ConfigProvider';
export * from './src/utils/DateUtils';
export * from './src/hooks/ContainerHookResponse';

export {
    ResourceCardView,
    EmptyResourceCardView,
    cardViewDimensions,
    ResourceCarouselView,
    CarouselView,
    CarouselPageIndicator,
};
export { SearchResults, ResizableImage };
export { useDiscoverySearch } from './src/hooks/useDiscoverySearch';
export { useFetchEpgQuery } from './src/hooks/useFetchEpgQuery';
export { useFetchRootContainerQuery } from './src/hooks/useFetchRootContainerQuery';
export { useDebounce };
export { useDeviceOrientation } from './src/hooks/useDeviceOrientation';
export { deepMerge };
