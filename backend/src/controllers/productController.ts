import { Request, Response } from 'express';
import { Product } from '../models/Product';
import fs from 'fs';
import path from 'path';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, imageFit } = req.body;
    const file = req.file;

    if (!name || !description || !price || !category || stock == null || !file) {
      if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Все поля и изображение обязательны' });
    }

    const imageUrl = '/uploads/' + file.filename;

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      images: [imageUrl],
      thumbnails: [imageUrl],
      imageFit: imageFit || 'cover'
    });

    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Ошибка при добавлении товара', details: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, imageFit } = req.body;
    const file = req.file;

    const updateData: any = { name, description, price, category, stock };
    if (file) {
      const imageUrl = '/uploads/' + file.filename;
      updateData.images = [imageUrl];
      updateData.thumbnails = [imageUrl];
    }
    if (imageFit !== undefined) {
      updateData.imageFit = imageFit;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Удаляем связанные изображения
    const imagesToDelete = [...(product.images || []), ...(product.thumbnails || [])];
    for (const image of imagesToDelete) {
      const imagePath = path.join(__dirname, '../../', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    const filter: any = {};

    if (query && String(query).trim() !== '') {
      filter.name = { $regex: String(query), $options: 'i' };
    }
    if (category && category !== 'все') {
      filter.category = category;
    }

    if ((minPrice && !isNaN(Number(minPrice))) || (maxPrice && !isNaN(Number(maxPrice)))) {
      filter.price = {};
      if (minPrice && !isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).limit(100);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка поиска товаров' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
}; 