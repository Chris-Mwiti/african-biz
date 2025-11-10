# Event and Blog Dynamic Search Functionality Implementation Plan

This document outlines the plan to implement dynamic search functionality for the Events and Blogs pages of the African Yellow Pages application.

## 1. Project Goals

The primary goal is to enhance user experience by allowing users to dynamically search for blogs and events based on specific criteria.

-   **Blogs Page:** Search by recent posts, author, and categories.
-   **Events Page:** Search by start date and end date.

## 2. Potential Bottlenecks

-   **Database Performance:** As the number of blogs and events grows, naive search queries could become slow. This can be mitigated by using proper database indexing on the fields that are frequently searched.
-   **UI/UX Complexity:** Adding multiple search filters can clutter the UI. The design should be intuitive and user-friendly. Using debouncing for text inputs will be crucial to prevent excessive API calls and provide a smoother experience.
-   **Date/Time Handling:** Ensuring consistent handling of dates and timezones between the frontend and backend is critical to avoid incorrect search results.
-   **State Management:** Managing the state of various search filters on the frontend can become complex.

## 3. Implementation Steps

### Backend

1.  **Update Prisma Schema:**
    -   Add indexes to the `Blog` model for `authorId` and `categoryId`.
    -   Add indexes to the `Event` model for `startDate` and `endDate`.

2.  **Update DTOs (`*.dto.ts`):**
    -   Create or update DTOs for search query parameters for both blogs and events to ensure type safety and validation.

3.  **Update Controllers (`blog.controller.ts`, `event.controller.ts`):**
    -   Modify the `getAllBlogs` function in `blog.controller.ts` to accept query parameters for `author`, `category`, and a sorting parameter for `recency`.
    -   Modify the `getAllEvents` function in `event.controller.ts` to accept `startDate` and `endDate` query parameters.
    -   Implement the filtering logic using Prisma's `where` clause.

4.  **Update Routes (`blog.routes.ts`, `event.routes.ts`):**
    -   Ensure the routes can handle the new query parameters. No major changes are expected here, as Express handles query parameters by default.

### Frontend

1.  **Create/Update UI Components:**
    -   **Blogs Page (`Blogs.tsx`):**
        -   Add a text input for searching by author.
        -   Add a dropdown or multi-select for filtering by categories.
        -   Add a sort option for "Recent Posts".
    -   **Events Page (`Events.tsx`):**
        -   Add date pickers for selecting `startDate` and `endDate`.

2.  **Update Services (`blog.service.ts`, `event.service.ts`):**
    -   Modify the functions that fetch all blogs and events to accept search parameters.
    -   These functions will construct the query string to be sent to the backend API.

3.  **Update Page Components (`Blogs.tsx`, `Events.tsx`):**
    -   Manage the state of the search filters (e.g., using `useState`).
    -   Use a `useEffect` hook to watch for changes in the search filters. When a change is detected, call the corresponding service function to fetch the filtered data.
    -   Implement debouncing for text inputs to avoid making an API call on every keystroke. The existing `useDebounce` hook can be utilized.
    -   Display the filtered results on the page.
    -   Handle loading and empty states appropriately.

## 4. Testing

-   **Backend:** Unit tests will be written for the controller logic to ensure the filtering works as expected.
-   **Frontend:** The new functionality will be manually tested to ensure the UI is responsive, the API calls are correct, and the results are displayed accurately.
