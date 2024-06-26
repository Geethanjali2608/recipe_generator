// routes.js
const express = require('express');
const router = express.Router();
const { login, register, getRecipes, addRecipe, deleteRecipe } = require('./controllers');

// Authentication routes
router.post('/login', login);
router.post('/register', register);

// Recipe routes
router.get('/recipes', getRecipes);
router.post('/recipes', addRecipe);
router.delete('/recipes/:id', deleteRecipe);

module.exports = router;

