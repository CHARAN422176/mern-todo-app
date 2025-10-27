const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  description: { // <-- NEW
    type: String,
    default: '',
  },
  dueDate: { // <-- NEW
    type: Date,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Todo', TodoSchema);