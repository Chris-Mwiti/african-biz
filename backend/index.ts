import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes';
import listingRoutes from './src/routes/listing.routes';
import adminRoutes from './src/routes/admin.routes';
import stripeRoutes from './src/routes/stripe.routes';
import categoryRoutes from './src/routes/category.routes';
import analyticRoutes from './src/routes/analytic.routes'; // New import
import eventRoutes from './src/routes/event.routes';
import blogRoutes from './src/routes/blog.routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// Stripe webhook needs the raw body, so apply json middleware conditionally
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/stripe', stripeRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/analytics', analyticRoutes); // New route
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the African Yellow Pages API!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
