import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body as CreateCategoryDto;
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
      return res.status(409).json({ message: 'Category with this name already exists' });
    }
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body as UpdateCategoryDto;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
      return res.status(409).json({ message: 'Category with this name already exists' });
    }
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
