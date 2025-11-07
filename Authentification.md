## Authentication and Authorization Analysis and Recommendations

This document outlines the current state of the authentication and authorization process in the African Yellow Pages application, identifies bottlenecks and issues, and provides recommendations for improvement.

### Frontend Analysis

#### Sign-up and Sign-in Flow

The frontend uses `@tanstack/react-query`'s `useMutation` hook to call the backend's `/auth/register` and `/auth/login` endpoints. The `AuthContext` manages the user's authentication state, storing a user object in local storage to persist the session.

#### Authorization

The `ProtectedRoute` component is used to protect routes that require authentication. It checks if a user is authenticated and has the required role to access a route. If the user is not authenticated, they are redirected to the sign-in page. If they are authenticated but do not have the required role, they are redirected to their respective dashboard.

### Backend Analysis

#### Sign-up and Sign-in Flow

The backend provides two main endpoints for authentication:

*   `POST /auth/signup`: Creates a new user in the database. It expects an `email` and `password` in the request body.
*   `POST /auth/login`: Authenticates a user based on their `email` and `password`. If the credentials are valid, it returns a JSON Web Token (JWT).

#### Authorization

The `authenticateToken` middleware is used to protect routes that require authentication. It verifies the JWT from the `Authorization` header and attaches the user payload (containing the user's ID and role) to the request object.

### Identified Bottlenecks and Issues

1.  **Data Mismatch in Registration:** The frontend's registration form collects the user's `name` and `country_of_residence`, but the backend's `/auth/signup` endpoint only accepts `email` and `password`. This leads to a loss of data during the registration process.

2.  **Incomplete User State on Frontend:** The `AuthContext` stores a minimal user object in local storage. On a page refresh, the full user object is lost, which can lead to a degraded user experience and potential issues with components that rely on the full user object.

3.  **Missing JWT Handling on Frontend:** The frontend does not appear to be storing the JWT received on login or sending it in the `Authorization` header of subsequent requests. This will cause all authenticated requests to fail.

4.  **Hardcoded Admin Login:** The frontend contains a hardcoded admin login flow that uses mock data. This is a security risk and should be removed.

5.  **Inconsistent User Roles:** The frontend `UserRole` type includes a `'guest'` role, which is not present in the backend `Role` enum. This can lead to inconsistencies and unexpected behavior.

6.  **Lack of User Feedback:** The error handling on the frontend is not user-friendly. If a login or signup request fails, the user is not given a clear reason why.

### Recommendations for Rectification

To address the identified issues and create a robust and secure authentication and authorization system, the following steps should be taken:

#### Backend Rectifications

1.  **Update the `signup` Controller:** Modify the `signup` controller in `auth.controller.ts` to accept `name` and `country_of_residence` in the request body and save them to the database.

    ```typescript
    // backend/src/controllers/auth.controller.ts
    export const signup = async (req: Request, res: Response) => {
      const { email, password, name, country_of_residence } = req.body;

      if (!email || !password || !name || !country_of_residence) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            country_of_residence,
          },
        });

        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        res.status(400).json({ message: 'User already exists' });
      }
    };
    ```

2.  **Return User Object on Login:** Modify the `login` controller to return the user object along with the token. This will provide the frontend with the full user object on login.

    ```typescript
    // backend/src/controllers/auth.controller.ts
    export const login = async (req: Request, res: Response) => {
      // ... (existing code)

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '1h',
      });

      res.json({ token, user }); // Return user object
    };
    ```

3.  **Use Environment Variables for JWT Secret:** Ensure that the `JWT_SECRET` is always loaded from an environment variable and that the hardcoded fallback is removed.

#### Frontend Rectifications

1.  **Update the `signup` Mutation:** Modify the `signup` function in `AuthContext.tsx` to send the `name` and `country_of_residence` to the backend.

2.  **Store JWT and User Object:** On successful login, store both the JWT and the full user object in local storage. The JWT should be sent in the `Authorization` header of all subsequent API requests.

    ```typescript
    // frontend/src/contexts/AuthContext.tsx
    const login = async (email: string, password: string) => {
      // ... (API call)
      const { token, user } = await response.json();
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      // ...
    };
    ```

3.  **Create an API Client/Interceptor:** Create a centralized API client (e.g., using Axios) that automatically adds the JWT to the `Authorization` header of every request.

4.  **Remove Hardcoded Admin Login:** Remove the hardcoded admin login logic from the `AuthContext` and use the standard login flow.

5.  **Align User Roles:** Remove the `'guest'` role from the `UserRole` type in `frontend/src/lib/types.ts` to align with the backend.

6.  **Improve Error Handling:** Provide clear and user-friendly error messages on login and signup failures. For example, if a user enters the wrong password, display a "Invalid credentials" message instead of a generic "Login failed" error.

### CRUD Operations

*   **Create:** Signup a new user (handled by the `signup` controller).
*   **Read:** Implement a `GET /auth/me` endpoint to fetch the current user's profile using the JWT.
*   **Update:** Implement a `PUT /auth/password` endpoint to allow users to update their password. For role updates, create an admin-only `PUT /admin/users/:id/role` endpoint.
*   **Delete:** Implement a `DELETE /auth/me` endpoint for users to deactivate their own account (soft delete). Create an admin-only `DELETE /admin/users/:id` endpoint for hard deletes.

### Advanced Augmentation and Filtering

#### Aggregation

*   **Count Active Users by Role:** Implement an admin-only endpoint `GET /admin/users/stats` that uses Prisma's `groupBy` and `count` to return the number of users for each role.

    ```typescript
    // backend/src/controllers/admin.controller.ts
    export const getUserStats = async (req: Request, res: Response) => {
      const userStats = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      });
      res.json(userStats);
    };
    ```

#### Filtering

*   **Search Users by Email/Role:** Enhance the `GET /admin/users` endpoint to accept `email` and `role` query parameters for filtering.

    ```typescript
    // backend/src/controllers/admin.controller.ts
    export const getUsers = async (req: Request, res: Response) => {
      const { email, role } = req.query;
      const where: any = {};
      if (email) {
        where.email = { contains: email as string, mode: 'insensitive' };
      }
      if (role) {
        where.role = role as any;
      }
      const users = await prisma.user.findMany({ where });
      res.json(users);
    };
    ```

#### Augmentation

*   **OAuth Integration:** Integrate OAuth providers like Google and Facebook using a library like Passport.js. This will involve:
    *   Creating `GET /auth/google` and `GET /auth/google/callback` endpoints.
    *   Adding `googleId` and `facebookId` fields to the `User` model.
    *   Handling user creation and login via OAuth callbacks.
*   **Auto-refresh Tokens:** Implement a mechanism to automatically refresh JWTs before they expire. This can be done by:
    *   Using a refresh token stored in an `httpOnly` cookie.
    *   Creating a `POST /auth/refresh_token` endpoint that takes a refresh token and returns a new JWT.
*   **Inactivity Logout:** On the frontend, implement a timer that tracks user inactivity. If the user is inactive for a certain period, automatically log them out by clearing their session from local storage and redirecting them to the login page.
