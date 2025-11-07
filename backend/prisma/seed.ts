import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma';


async function main() {
  console.log('Start seeding ...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'MEMBER',
      country_of_residence: 'Nigeria',
      profile_image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      role: 'PREMIUM',
      country_of_residence: 'Kenya',
      profile_image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      country_of_residence: 'South Africa',
      profile_image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  });

  // Create Categories
  const category1 = await prisma.category.create({
    data: { name: 'Restaurant' },
  });

  const category2 = await prisma.category.create({
    data: { name: 'Hotel' },
  });

  const category3 = await prisma.category.create({
    data: { name: 'Tech Hub' },
  });

  // Create Listings
  const listing1 = await prisma.listing.create({
    data: {
      title: 'Afro-Fusion Restaurant',
      description: 'A taste of Africa in the heart of the city.',
      address: '123 Main Street',
      city: 'Lagos',
      country: 'Nigeria',
      phone: '123-456-7890',
      email: 'contact@afrofusion.com',
      website: 'https://afrofusion.com',
      social_links: {
        facebook: 'https://facebook.com/afrofusion',
        instagram: 'https://instagram.com/afrofusion',
      },
      images: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      ],
      category_id: category1.id,
      owner_id: user1.id,
      status: 'ACTIVE',
      is_premium: true,
      verified: true,
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      title: 'Savannah Suites',
      description: 'Luxury hotel with a wild touch.',
      address: '456 Safari Avenue',
      city: 'Nairobi',
      country: 'Kenya',
      phone: '987-654-3210',
      email: 'reservations@savannahsuites.com',
      website: 'https://savannahsuites.com',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        'https://images.unsplash.com/photo-1542314831-068cd1dbb5eb',
      ],
      category_id: category2.id,
      owner_id: user2.id,
      status: 'ACTIVE',
      is_premium: true,
      verified: true,
    },
  });

  const listing3 = await prisma.listing.create({
    data: {
      title: 'Innovate Cape Town',
      description: 'A hub for tech startups and entrepreneurs.',
      address: '789 Tech Park',
      city: 'Cape Town',
      country: 'South Africa',
      phone: '555-123-4567',
      email: 'info@innovatect.com',
      website: 'https://innovatect.com',
      images: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      ],
      category_id: category3.id,
      owner_id: adminUser.id,
      status: 'PENDING',
    },
  });

  // Create Events
  await prisma.event.create({
    data: {
      title: 'Grand Opening Party',
      description: 'Join us for the grand opening of Afro-Fusion Restaurant!',
      start_datetime: new Date('2025-12-01T18:00:00Z'),
      end_datetime: new Date('2025-12-01T23:00:00Z'),
      location: 'Afro-Fusion Restaurant',
      banner_image: 'https://images.unsplash.com/photo-1519205102413-e2e36b2a5632',
      listing_id: listing1.id,
      creator_id: user1.id,
      approval_status: 'APPROVED',
    },
  });

  // Create Blogs
  await prisma.blog.create({
    data: {
      title: 'The Rise of African Cuisine',
      content: 'Exploring the rich and diverse flavors of Africa...',
      excerpt: 'A culinary journey through the continent.',
      banner_image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      tags: ['food', 'africa', 'cuisine'],
      listing_id: listing1.id,
      author_id: user1.id,
      approval_status: 'APPROVED',
      published_date: new Date(),
    },
  });

  // Create Subscriptions
  await prisma.subscription.create({
    data: {
      user_id: user2.id,
      stripe_subscription_id: 'sub_123456789',
      status: 'active',
      plan: 'premium',
      amount: 29.99,
      started_at: new Date(),
      ends_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      last_payment_at: new Date(),
    },
  });

  // Create Reviews
  await prisma.review.create({
    data: {
      user_id: user2.id,
      listing_id: listing1.id,
      rating: 5,
      comment: 'Absolutely amazing food and ambiance!',
    },
  });

  // Create Favorites
  await prisma.favorite.create({
    data: {
      user_id: user1.id,
      listing_id: listing2.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
