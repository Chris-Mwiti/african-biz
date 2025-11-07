# DiasporaBiz - Marketing Platform

A full-stack marketing platform for Africans in the diaspora to create business listings, promote events and blog posts, and get visibility.

## 🚀 Quick Start

### Admin Login
To access the admin dashboard, use these credentials:
- **Email:** `admin@diasporabiz.com`
- **Password:** `admin123`

### Member Login
For testing member features, you can sign in with any email and password combination.

## 📁 Project Structure

```
diasporabiz/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer, etc.)
│   ├── ui/             # shadcn/ui components
│   ├── figma/          # Figma-specific components
│   ├── BlogCard.tsx
│   ├── EventCard.tsx
│   ├── ListingCard.tsx
│   ├── ProtectedRoute.tsx
│   └── SearchBar.tsx
├── pages/              # Page components
│   ├── admin/         # Admin dashboard pages
│   ├── dashboard/     # Member dashboard pages
│   ├── Auth.tsx
│   ├── FindListings.tsx
│   ├── Home.tsx
│   ├── ListingDetail.tsx
│   └── Pricing.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── utils/              # Utility functions
│   ├── cn.ts          # Class name utilities
│   ├── formatters.ts  # Date, currency, text formatters
│   └── validators.ts  # Form validation utilities
├── constants/          # Application constants
│   ├── app.ts         # App-wide constants
│   ├── auth.ts        # Authentication constants
│   └── routes.ts      # Route definitions
├── lib/                # Core library code
│   ├── mockData.ts
│   └── types.ts
├── styles/             # Global styles
│   └── globals.css
└── App.tsx             # Root component
```

## 🎨 Design System

### Brand Colors
- **Primary:** `#0B3D91` (Deep Blue)
- **Secondary:** `#F9A826` (Gold)
- **Accent:** `#22C55E` (Green)

### Typography
- **Headings:** Poppins
- **Body:** Inter

### Spacing
- 8px grid system

## 👥 User Roles

### Free Members
- Create business listings (appear only on Find Listings page)
- Basic profile management
- Limited features

### Premium Members
- Featured listings on Home page carousel
- Create and publish events
- Create and publish blog posts
- Access to analytics
- Priority support

### Admin
- Approve/reject pending listings
- User management
- Content moderation
- Featured content management
- Platform settings

## 🔑 Key Features

1. **Authentication System**
   - Email/password authentication
   - Role-based access control
   - Protected routes
   - Persistent sessions

2. **Listings Management**
   - 4-step creation wizard
   - Category selection
   - Image upload
   - Location-based filtering

3. **Dashboard**
   - Member dashboard with analytics
   - Admin dashboard with moderation tools
   - Real-time statistics
   - Quick actions panel

4. **Responsive Design**
   - Mobile-first approach
   - Tablet and desktop optimized
   - Touch-friendly interactions

## 🛠️ Technology Stack

- **Frontend:** React + TypeScript
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **State Management:** React Context
- **Notifications:** Sonner

## 📦 Available Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Authentication Flow

1. **Sign In**
   - Navigate to `/signin`
   - Enter credentials
   - Redirected to appropriate dashboard based on role

2. **Sign Up**
   - Navigate to `/signup`
   - Fill in registration form
   - Automatically logged in as Free Member
   - Redirected to dashboard

3. **Admin Access**
   - Use admin credentials at `/signin`
   - Automatically redirected to `/admin`

## 🎯 Next Steps

- [ ] Integrate backend API
- [ ] Add Stripe payment integration
- [ ] Implement real-time notifications
- [ ] Add email verification
- [ ] Implement password reset flow
- [ ] Add image upload functionality
- [ ] Create event and blog pages
- [ ] Add analytics tracking
- [ ] Implement search functionality
- [ ] Add social media sharing

## 📚 Documentation

For more detailed documentation, see:
- [Design Specifications](DESIGN_SPEC.md)
- [Component States](COMPONENT_STATES.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Folder Structure](FOLDER_STRUCTURE.md)

## 🤝 Contributing

This is a demo project. For production use, please ensure:
- Replace mock data with real API integration
- Implement proper security measures
- Add comprehensive testing
- Set up CI/CD pipeline
- Configure environment variables
- Add error monitoring

## 📄 License

MIT License - feel free to use this as a starting point for your own projects.
