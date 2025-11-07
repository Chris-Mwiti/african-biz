## Project: African Yellow Pages

This project is a web application called "African Yellow Pages". It appears to be a directory listing platform with features like user authentication, listings, events, blogs, and payments.

### Frontend

The frontend is a React application built with Vite. It uses TypeScript and has a well-organized structure with components, pages, contexts, hooks, and utils.

- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (implied by `tailwind-merge` and the presence of `globals.css`) and Radix UI components.
- **Routing:** `react-router-dom`
- **State Management:** React Context (`AuthContext.tsx`)
- **UI Components:** A rich set of UI components are used from `radix-ui` and `shadcn/ui` (implied by the file structure and component names), including `Accordion`, `AlertDialog`, `Button`, `Card`, `Carousel`, `DropdownMenu`, `Form`, `Input`, `Navbar`, `Sidebar`, and more.
- **Pages:** The application has pages for:
    - Authentication (`Auth.tsx`)
    - Home (`Home.tsx`)
    - Listings (`FindListings.tsx`, `ListingDetail.tsx`, `CreateListing.tsx`)
    - Blogs (`Blogs.tsx`)
    - Events (`Events.tsx`)
    - Contact (`Contact.tsx`)
    - Pricing (`Pricing.tsx`)
    - User Dashboard (`dashboard/`)
    - Admin Panel (`admin/`)
- **Linting/Formatting:** Not explicitly defined in `package.json`, but likely using Prettier and ESLint.

### Backend

The backend is a Node.js application using Express and TypeScript. It uses Prisma as an ORM for interacting with a PostgreSQL database.

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (`jsonwebtoken`) and `bcryptjs` for password hashing.
- **API:** The API is structured with controllers, routes, and middleware.
    - **Routes:**
        - `admin.routes.ts`
        - `auth.routes.ts`
        - `listing.routes.ts`
        - `stripe.routes.ts`
    - **Controllers:**
        - `admin.controller.ts`
        - `auth.controller.ts`
        - `listing.controller.ts`
        - `stripe.controller.ts`
- **Database Schema (`schema.prisma`):**
    - **Models:** `User`, `Listing`, `Category`, `Event`, `Blog`, `Subscription`, `Payment`, `ListingView`, `Favorite`, `Review`
    - **Enums:** `Role` (`MEMBER`, `PREMIUM`, `ADMIN`), `ApprovalStatus` (`PENDING`, `APPROVED`, `REJECTED`)
- **Payments:** Stripe is integrated for handling payments (`stripe` package and `stripe.controller.ts`).
