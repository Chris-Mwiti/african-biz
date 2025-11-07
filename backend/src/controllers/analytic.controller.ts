import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AnalyticEventType } from '@prisma/client';
import { TrackAnalyticEventDto } from '../dto/analytic.dto';

export const trackAnalyticEvent = async (req: Request, res: Response) => {
  const { listingId, eventType, details } = req.body as TrackAnalyticEventDto;
  const userId = req.user?.userId; // Optional: if user is logged in

  try {
    await prisma.listingAnalyticEvent.create({
      data: {
        listing_id: listingId,
        user_id: userId,
        event_type: eventType,
        details: details ? JSON.parse(details) : undefined,
      },
    });
    res.status(201).json({ message: 'Analytic event tracked successfully' });
  } catch (error: any) {
    console.error('Error tracking analytic event:', error);
    res.status(500).json({ message: 'Error tracking analytic event', error: error.message });
  }
};

// New: Get aggregated analytics for a specific listing (for owner)
export const getListingAnalytics = async (req: Request, res: Response) => {
  const { id } = req.params; // Listing ID
  const userId = req.user?.userId; // Owner ID

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify ownership of the listing
    const listing = await prisma.listing.findUnique({
      where: { id, owner_id: userId },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or you do not own this listing' });
    }

    const views = await prisma.listingAnalyticEvent.count({
      where: { listing_id: id, event_type: AnalyticEventType.VIEW },
    });

    const clicks = await prisma.listingAnalyticEvent.count({
      where: { listing_id: id, event_type: AnalyticEventType.CLICK },
    });

    const contacts = await prisma.listingAnalyticEvent.count({
      where: { listing_id: id, event_type: AnalyticEventType.CONTACT },
    });

    res.json({
      listingId: id,
      views,
      clicks,
      contacts,
    });
  } catch (error: any) {
    console.error('Error fetching listing analytics:', error);
    res.status(500).json({ message: 'Error fetching listing analytics', error: error.message });
  }
};

// New: Get aggregated analytics for all listings owned by a user
export const getUserListingsAnalytics = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Owner ID

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userListings = await prisma.listing.findMany({
      where: { owner_id: userId },
      select: { id: true, title: true },
    });

    const analyticsPromises = userListings.map(async (listing) => {
      const views = await prisma.listingAnalyticEvent.count({
        where: { listing_id: listing.id, event_type: AnalyticEventType.VIEW },
      });
      const clicks = await prisma.listingAnalyticEvent.count({
        where: { listing_id: listing.id, event_type: AnalyticEventType.CLICK },
      });
      const contacts = await prisma.listingAnalyticEvent.count({
        where: { listing_id: listing.id, event_type: AnalyticEventType.CONTACT },
      });
      const eventsCount = await prisma.listingAnalyticEvent.count({
        where: { listing_id: listing.id, event_type: AnalyticEventType.CREATE_EVENT },
      });
      return {
        listingId: listing.id,
        listingTitle: listing.title,
        views,
        clicks,
        contacts,
        eventsCount,
      };
    });

    const allListingsAnalytics = await Promise.all(analyticsPromises);
    res.json(allListingsAnalytics);
  } catch (error: any) {
    console.error('Error fetching user listings analytics:', error);
    res.status(500).json({ message: 'Error fetching user listings analytics', error: error.message });
  }
};
