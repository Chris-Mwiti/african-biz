import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createEvent = async (req: Request, res: Response) => {
  let { title, description, start_datetime, end_datetime, location, banner_image, listing_id } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  start_datetime = new Date(start_datetime)
  end_datetime = new Date(end_datetime)

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        banner_image,
        listing_id,
        creator_id: userId,
      },
    });

    // Create an analytic event
    await prisma.listingAnalyticEvent.create({
      data: {
        listing_id,
        user_id: userId,
        event_type: 'CREATE_EVENT',
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("listing error: ", error)
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const where: any = {};

    if (startDate && startDate !== 'undefined') {
      where.start_datetime = { gte: new Date(String(startDate)) };
    }

    if (endDate && endDate !== 'undefined') {
      where.end_datetime = { lte: new Date(String(endDate)) };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        listing: true,
        creator: true,
      },
    });
    res.json(events);
  } catch (error) {
    console.error("events error: ", error)
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        listing: true,
        creator: true,
      },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.log("get event: ", error)
    res.status(500).json({ message: 'Error fetching event' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data,
    });
    res.json(updatedEvent);
  } catch (error) {
    console.error("update event: ", error)
    res.status(500).json({ message: 'Error updating event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("delete error: ", error)
    res.status(500).json({ message: 'Error deleting event' });
  }
};
