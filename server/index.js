const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Todo = require('./models/Todo');

const app = express();

// Middleware
app.use(express.json());
// app.use(cors());
// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Your local dev environment
  'https://purutodolist.netlify.app' // YOUR LIVE NETLIFY URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type'
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- API ROUTES ---

// Get all tasks
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Create a new task
app.post('/todo/new', async (req, res) => {
  const newTodo = new Todo({
    task: req.body.task,
    description: req.body.description,
    dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
  });
  await newTodo.save();
  res.status(201).json(newTodo);
});

// Delete a task
app.delete('/todo/delete/:id', async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
});

// Toggle task completion
app.put('/todo/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).send('Todo not found.');
  
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Removed the EDIT route

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});