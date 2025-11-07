# Events Module Implementation Plan

This document outlines the plan for implementing the Events module, which will allow users to create, view, update, and delete events.

## Backend

### 1. Create `event.dto.ts`

Create a `backend/src/dto/event.dto.ts` file to define the Data Transfer Objects (DTOs) for creating and updating events.

```typescript
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  start_datetime: string;

  @IsDateString()
  @IsNotEmpty()
  end_datetime: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  banner_image?: string;

  @IsUUID()
  @IsNotEmpty()
  listing_id: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  start_datetime?: string;

  @IsDateString()
  @IsOptional()
  end_datetime?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  banner_image?: string;
}
```

### 2. Create `event.controller.ts`

Create a `backend/src/controllers/event.controller.ts` file to handle the business logic for event CRUD operations.

-   `createEvent`: Create a new event. Only `PREMIUM` users and `ADMIN` can create events.
-   `getEvents`: Get a list of all events.
-   `getEventById`: Get a single event by its ID.
-   `updateEvent`: Update an event. Only the event creator or an `ADMIN` can update an event.
-   `deleteEvent`: Delete an event. Only the event creator or an `ADMIN` can delete an event.

### 3. Create `event.routes.ts`

Create a `backend/src/routes/event.routes.ts` file to define the API routes for events.

-   `POST /events`: Create a new event. (Protected: `PREMIUM`, `ADMIN`)
-   `GET /events`: Get all events. (Public)
-   `GET /events/:id`: Get a single event by ID. (Public)
-   `PUT /events/:id`: Update an event. (Protected: Owner, `ADMIN`)
-   `DELETE /events/:id`: Delete an event. (Protected: Owner, `ADMIN`)

### 4. Update `index.ts`

In `backend/src/index.ts`, import and use the event routes.

```typescript
import eventRoutes from './routes/event.routes';
// ...
app.use('/api/events', eventRoutes);
```

### 5. Implement Authorization

Create an `ownership.guard.ts` in `backend/src/guards` to check if a user is the owner of an event. Use this guard in `event.routes.ts` for the update and delete routes.

### 6. Implement Analytics

In the `createEvent` controller, after successfully creating an event, create a `ListingAnalyticEvent` with `event_type` as `'CREATE_EVENT'`.

## Frontend

### 1. Create `event.service.ts`

Create a `frontend/src/services/event.service.ts` file with `@tanstack/react-query` hooks for fetching and managing event data.

-   `useGetEvents`: Fetches all events.
-   `useGetEvent`: Fetches a single event by ID.
-   `useCreateEvent`: Creates a new event.
-   `useUpdateEvent`: Updates an event.
-   `useDeleteEvent`: Deletes an event.

### 2. Create Event Pages

-   **`Events.tsx`**: A public page to display a list of all events.
-   **`EventDetail.tsx`**: A public page to display the details of a single event.
-   **`CreateEvent.tsx`**: A protected page for `PREMIUM` users to create a new event. This page will be under the `/dashboard` route.
-   **`EditEvent.tsx`**: A protected page for the event owner to edit an event.

### 3. Update Routing

In `frontend/src/App.tsx`, add the routes for the new event pages.

### 4. Update Navigation

In `frontend/src/components/layout/Navbar.tsx`, add a link to the "Events" page.

## Analytics

### 1. Backend

In `event.controller.ts`, when an event is created, a `ListingAnalyticEvent` will be created with the `event_type` of `CREATE_EVENT`.

### 2. Frontend

The `frontend/src/pages/dashboard/Analytics.tsx` page will be updated to display event-related analytics, such as the number of events created over time.

## Potential Bottlenecks

-   The existing `OwnershipGuard` is listing-specific. A new, more generic guard or a specific event ownership guard will be needed.
-   The analytics model might need to be extended to better support event-specific analytics.

## Future Features

-   **Event Calendar View**: Display events on a calendar.
-   **Event Search and Filtering**: Allow users to search and filter events by various criteria.
-   **RSVP Functionality**: Allow users to RSVP to events.
-   **Event Reminders**: Notify users about upcoming events.