
# Blogs Module Implementation Plan

This document outlines the plan for implementing the Blogs module, which will allow users to create, view, update, and delete blog posts.

## Backend

### 1. Create `blog.dto.ts`

Create a `backend/src/dto/blog.dto.ts` file to define the Data Transfer Objects (DTOs) for creating and updating blog posts.

```typescript
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsOptional()
  banner_image?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsUUID()
  @IsNotEmpty()
  listing_id: string;
}

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  banner_image?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
```

### 2. Create `blog.controller.ts`

Create a `backend/src/controllers/blog.controller.ts` file to handle the business logic for blog CRUD operations.

-   `createBlog`: Create a new blog post. Only `PREMIUM` users and `ADMIN` can create blogs.
-   `getBlogs`: Get a list of all blog posts.
-   `getBlogById`: Get a single blog post by its ID.
-   `updateBlog`: Update a blog post. Only the blog author or an `ADMIN` can update a blog post.
-   `deleteBlog`: Delete a blog post. Only the blog author or an `ADMIN` can delete a blog post.

### 3. Create `blog.routes.ts`

Create a `backend/src/routes/blog.routes.ts` file to define the API routes for blogs.

-   `POST /blogs`: Create a new blog post. (Protected: `PREMIUM`, `ADMIN`)
-   `GET /blogs`: Get all blog posts. (Public)
-   `GET /blogs/:id`: Get a single blog post by ID. (Public)
-   `PUT /blogs/:id`: Update a blog post. (Protected: Author, `ADMIN`)
-   `DELETE /blogs/:id`: Delete a blog post. (Protected: Author, `ADMIN`)

### 4. Update `index.ts`

In `backend/src/index.ts`, import and use the blog routes.

```typescript
import blogRoutes from './routes/blog.routes';
// ...
app.use('/api/v1/blogs', blogRoutes);
```

### 5. Implement Authorization

Create an `ownership.guard.ts` in `backend/src/guards` to check if a user is the author of a blog. Use this guard in `blog.routes.ts` for the update and delete routes.

### 6. Implement Analytics

In the `createBlog` controller, after successfully creating a blog, create a new `ListingAnalyticEvent` with `event_type` as `'CREATE_BLOG'`.

## Frontend

### 1. Create `blog.service.ts`

Create a `frontend/src/services/blog.service.ts` file with `@tanstack/react-query` hooks for fetching and managing blog data.

-   `useGetBlogs`: Fetches all blog posts.
-   `useGetBlog`: Fetches a single blog post by ID.
-   `useCreateBlog`: Creates a new blog post.
-   `useUpdateBlog`: Updates a blog post.
-   `useDeleteBlog`: Deletes a blog post.

### 2. Create Blog Pages

-   **`Blogs.tsx`**: A public page to display a list of all blog posts.
-   **`BlogDetail.tsx`**: A public page to display the details of a single blog post.
-   **`CreateBlog.tsx`**: A protected page for `PREMIUM` users to create a new blog post. This page will be under the `/dashboard` route.
-   **`EditBlog.tsx`**: A protected page for the blog author to edit a blog post.

### 3. Update Routing

In `frontend/src/App.tsx`, add the routes for the new blog pages.

### 4. Update Navigation

In `frontend/src/components/layout/Navbar.tsx`, add a link to the "Blogs" page.

### 5. Update Dashboard Layout

In `frontend/src/pages/dashboard/DashboardLayout.tsx`, add a link to the "Create Blog" page in the sidebar.

## Analytics

### 1. Backend

In `blog.controller.ts`, when a blog is created, a `ListingAnalyticEvent` will be created with the `event_type` of `CREATE_BLOG`.

### 2. Frontend

The `frontend/src/pages/dashboard/Analytics.tsx` page will be updated to display blog-related analytics, such as the number of blogs created over time.

## Potential Bottlenecks

-   The existing `OwnershipGuard` is listing-specific. A new, more generic guard or a specific blog ownership guard will be needed.
-   The analytics model might need to be extended to better support blog-specific analytics.

## Future Features

-   **Blog Search and Filtering**: Allow users to search and filter blogs by various criteria.
-   **Blog Categories**: Implement categories for blogs.
-   **Rich Text Editor**: Integrate a rich text editor for blog content.
