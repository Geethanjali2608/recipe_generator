// controllers.js
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  const { username, password } = req.body;

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Insert user into database
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.run(sql, [username, hashedPassword], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Registration failed' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  // Fetch user from database
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Login failed' });
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  });
};

const getRecipes = (req, res) => {
  const userId = req.userId;

  // Fetch user's recipes from database
  const sql = 'SELECT * FROM recipes WHERE userId = ?';
  db.all(sql, [userId], (err, recipes) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch recipes' });
    }
    res.json(recipes);
  });
};

const addRecipe = (req, res) => {
  const { title, description, instructions } = req.body;
  const userId = req.userId;

  // Insert recipe into database
  const sql = 'INSERT INTO recipes (title, description, instructions, userId) VALUES (?, ?, ?, ?)';
  db.run(sql, [title, description, instructions, userId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to add recipe' });
    }
    res.status(201).json({ message: 'Recipe added successfully' });
  });
};

const deleteRecipe = (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  // Delete recipe from database
  const sql = 'DELETE FROM recipes WHERE id = ? AND userId = ?';
  db.run(sql, [id, userId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete recipe' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  });
};

module.exports = {
  register,
  login,
  getRecipes,
  addRecipe,
  deleteRecipe,
};
