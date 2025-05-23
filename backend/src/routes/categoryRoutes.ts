import express from 'express';
import { Category } from '../models/Category';
import { auth, adminAuth } from '../middleware/auth';
import { Product } from '../models/Product';

const router = express.Router();

// Получить все категории
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий' });
  }
});

// Создать категорию
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Название обязательно' });
    
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Такая категория уже есть' });
    
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании категории' });
  }
});

// Редактировать категорию
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Название обязательно' });

    const exists = await Category.findOne({ name, _id: { $ne: req.params.id } });
    if (exists) return res.status(400).json({ message: 'Такая категория уже есть' });

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    
    if (!category) return res.status(404).json({ message: 'Категория не найдена' });
    
    // Обновляем категорию у всех товаров
    await Product.updateMany(
      { category: category.name },
      { category: name }
    );
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении категории' });
  }
});

// Получить все уникальные категории из товаров
router.get('/from-products', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий из товаров' });
  }
});
export default router; 