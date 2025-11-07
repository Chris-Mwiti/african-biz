import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createListing = async (req: Request, res: Response) => {
  const { title, description, address, phone, email, website, category_id, country, city, images } = req.body;
  const userId = req.user?.userId; // Assuming userId is attached to req by auth middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const listing = await prisma.listing.create({
      data: {
        address,
        country,
        city,
        title,
        description,
        phone,
        email,
        website,
        category_id,
        owner_id: userId,
        images, // Include images here
      },
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error creating listing' });
  }
};

export const getListings = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is attached to req by auth middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        owner_id: userId,
      },
      include: {
        category: true,
      },
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings' });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        owner: { select: { email: true } },
        category: true,
      },
    });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing' });
  }
};

export const getPublicListings = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const skip = (page - 1) * pageSize;

  try {
    const listings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        category: true,
      },
      skip,
      take: pageSize,
    });

    const total = await prisma.listing.count({
      where: {
        status: 'ACTIVE',
      },
    });

    res.json({
      data: listings,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public listings' });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data,
    });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing' });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.listing.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing' });
  }
};

export const searchListings = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query parameter \"q\" is required' });
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          {
            title: {
              contains: q as string,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q as string,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
      },
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error searching listings' });
  }
};
