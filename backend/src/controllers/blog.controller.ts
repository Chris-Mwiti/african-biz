import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AnalyticEventType } from '@prisma/client';

export const createBlog = async (req: Request, res: Response) => {
  const { title, content, excerpt, banner_image, tags, listing_id } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        excerpt,
        banner_image,
        tags,
        listing_id,
        author_id: userId,
      },
    });

    // Create an analytic event
    await prisma.listingAnalyticEvent.create({
      data: {
        listing_id,
        user_id: userId,
        event_type: AnalyticEventType.CREATE_BLOG,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post' });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        listing: true,
        author: true,
      },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
};

export const getBlogsByUserId = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const blogs = await prisma.blog.findMany({
      where: { author_id: userId },
      include: {
        listing: true,
        author: true,
      },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user blog posts' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        listing: true,
        author: true,
      },
    });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data,
    });
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.blog.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post' });
  }
};
