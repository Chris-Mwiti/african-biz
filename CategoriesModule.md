# Categories Module Implementation Guide

This document outlines the implementation and integration of category management within the African Yellow Pages application, ensuring that only administrators can manage categories and that categories are correctly handled across the frontend and backend.

## 1. Backend Setup (Completed)

The backend has been configured to support CRUD operations for categories, with administrative access control.

### 1.1. Category DTOs

*   **File:** `backend/src/dto/category.dto.ts`
*   **Purpose:** Defines data transfer objects for creating and updating categories, ensuring data validation.
    *   `CreateCategoryDto`: For creating new categories (e.g., `name: string`).
    *   `UpdateCategoryDto`: For updating existing categories (e.g., `name?: string`).

### 1.2. Category Controller

*   **File:** `backend/src/controllers/category.controller.ts`
*   **Purpose:** Implements the business logic for category CRUD operations.
    *   `createCategory`: Handles the creation of a new category.
    *   `getCategories`: Retrieves all categories.
    *   `getCategoryById`: Retrieves a single category by its ID.
    *   `updateCategory`: Updates an existing category.
    *   `deleteCategory`: Deletes a category.

### 1.3. Category Routes

*   **File:** `backend/src/routes/category.routes.ts`
*   **Purpose:** Defines the API endpoints for category management.
    *   **Public Routes:**
        *   `GET /api/v1/categories`: Get all categories (accessible to all users for display/filtering).
        *   `GET /api/v1/categories/:id`: Get a single category by ID (accessible to all users).
    *   **Admin-Only Routes:** These routes are protected by `AuthenticationGuard` and `AuthorizationGuard([Role.ADMIN])`.
        *   `POST /api/v1/categories`: Create a new category.
        *   `PUT /api/v1/categories/:id`: Update a category.
        *   `DELETE /api/v1/categories/:id`: Delete a category.

### 1.4. Route Integration

*   **File:** `backend/src/index.ts`
*   **Purpose:** The `categoryRoutes` have been integrated into the main Express application under the `/api/v1/categories` base path.

## 2. Frontend Implementation

The frontend needs to be updated to consume these new category APIs and provide a user interface for administrators to manage categories, as well as for general users to view and filter by categories.

### 2.1. Category Service

*   **File:** `frontend/src/services/category.service.ts` (New file to be created)
*   **Purpose:** Provide functions to interact with the backend category API.
    *   `getAllCategories()`: Fetches all categories.
    *   `createCategory(name: string)`: Sends a request to create a new category.
    *   `updateCategory(id: string, name: string)`: Sends a request to update a category.
    *   `deleteCategory(id: string)`: Sends a request to delete a category.

### 2.2. Admin Category Management Page

*   **File:** `frontend/src/pages/admin/ManageCategories.tsx` (New file to be created)
*   **Purpose:** A dedicated page for administrators to perform CRUD operations on categories.
    *   **Display:** List all existing categories (using `getAllCategories` from `category.service.ts`).
    *   **Create:** A form to add new categories (using `createCategory`).
    *   **Update:** Functionality to edit existing categories (using `updateCategory`). This could be an inline edit or a modal.
    *   **Delete:** Buttons to delete categories (using `deleteCategory`).
    *   **User Experience:** Implement a user-friendly interface with clear feedback (e.g., loading states, success/error messages using `sonner`).

### 2.3. Integration into Admin Dashboard

*   **File:** `frontend/src/pages/admin/AdminLayout.tsx` (Existing file)
*   **Purpose:** Add a navigation link to the `ManageCategories.tsx` page in the admin sidebar or navigation menu.

### 2.4. Category Filtering and Display (General User)

*   **File:** `frontend/src/pages/FindListings.tsx` (Existing file)
*   **Purpose:** Allow users to filter listings by category.
    *   Fetch categories using `getAllCategories()` from `category.service.ts`.
    *   Display categories (e.g., as a dropdown, checkboxes, or tags).
    *   Update the listing search/filter logic to include category filtering.

*   **File:** `frontend/src/pages/dashboard/CreateListing.tsx` (Existing file, already modified)
*   **Purpose:** Ensure that when creating a listing, the available categories are fetched from the backend and displayed for selection.
    *   Replace the `CATEGORIES` mock data with data fetched from `getAllCategories()` from `category.service.ts`.

## 3. Data Flow and Concurrency

*   **Fetching Categories:** All components that need to display or use categories (e.g., `FindListings.tsx`, `CreateListing.tsx`, `ManageCategories.tsx`) should fetch them from the backend's `/api/v1/categories` endpoint using the `category.service.ts`.
*   **Real-time Updates:** For admin management, consider using React Query's `invalidateQueries` to refetch categories after a create, update, or delete operation, ensuring the UI reflects the latest data.
*   **Error Handling:** Implement robust error handling for all API calls, providing clear feedback to the user.

## 4. Environment Variables

Ensure that any backend API URLs used in the frontend (e.g., `VITE_API_BASE_URL`) are correctly configured in the frontend's `.env` file and typed in `vite-env.d.ts`.

---
