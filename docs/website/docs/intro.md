---
id: introduction
title: Introduction
hide_table_of_contents: true
---

import useBaseUrl from '@docusaurus/useBaseUrl';

The QuickplayTV UI/UX is a library to build video applications for any screen /
form factor. By design it is built on React Native which enables truly cross-platform
application development. The flexible configurations provide ability to easily set UX
branding on the application for the customer needs. This library also includes a
fully integrated UI App with the QuickplayTV platform. It can also integrate with any
third-party head-end solution.

### Features

-   **Cross Platform** - Enables development teams to build and deploy applications with uniform UI across iOS, Android mobile, tablets and TV platforms using a single codebase.
-   **Designed for OTT** - Provides complete set of components to build features required for any Over-the-top application. Pre-built feature sets can also be leveraged.
-   **Customize UI/UX flow** - Supports driving the flow by configurations at headend or handcrafting the flow.
-   **Configure UX branding** - Launch applications quickly through the pre-integrated application.
-   **Easy integration with headend** - Consistent data models for components provide easy integration with headend solutions.
-   **Pre-integrated with QuickplayTV platform** - Launch applications quickly
    through the pre-integrated application.

### Design

QuickplayTV UI/UX components are designed to enable quick and easy integration with great customizability. The library is pre-integrated with QuickplayTV Platform, but it is flexible to integrate with any system.

The library includes custom UI components and React Hooks. All the UI components comes with a pre-defined style offering a consistent UI experience out-of-the-box. The atomic components can be weaved together forming a feature component.

The customer has the flexibility to utilize the individual components deciding the UI / UX or utilize the pre-built feature components by adhering to its data model.

The diagram below shows an overview of the various modules in the QuickplayTV UI suite.

<div className="">
  <figure>
    <img src={useBaseUrl('img/overview.svg')} alt="Overview" />
  </figure>
</div>

#### qp-discovery-ui

This feature components encapsulates Catalog Browse, Search & EPG related UI Components and custom react hooks. The custom react hooks abstracts the integration with QuickplayTV's Storefront and CMS APIs.

#### qp-player-ui

This feature components encapsulates player control components which are designed to work on all platforms and orientations.

#### rn-qp-vstb7-player

This feature component is a bridge between React Native and Native libraries of QuickplayTV Player. It exposes all powerful features of QuickplayTV Player library, like streaming VOD, streaming Live, Download-to-go etc., through a simple Javascript interface. It encapsulates the following features:

-   Content Authorization
-   Stream Concurrency validation
-   Playback/Download of Clear Contents
-   Playback/Download of DRM Protected Contents
-   License Caching for Offline Playback
-   Queued Downloads
-   Bookmarks Management
