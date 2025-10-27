import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// const API_BASE_URL = 'http://localhost:5000';
// const API_BASE_URL = 'http://localhost:5000'; // Before
const API_BASE_URL = 'https://mern-todo-api-xxxx.onrender.com'; // After (Paste your URL) // Or your deployed Render URL

function App() {
  const [todos, setTodos] = useState([]);
  
  // State for the "Add New" form
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    dueDate: ''
  });

  // All 'editing' state has been removed.

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Handler for the "Add New" form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!formData.task.trim()) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/todo/new`, formData);
      setTodos([...todos, response.data]);
      // Reset the form
      setFormData({ task: '', description: '', dueDate: '' });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todo/delete/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todo/complete/${id}`);
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed: response.data.completed } : todo
      ));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // All 'editing' functions have been removed.

  return (
    <div className="App">
      <h1>To-Do List</h1>
      
      {/* --- ADD NEW TASK FORM --- */}
      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          name="task"
          placeholder="New task..."
          value={formData.task}
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description..."
          value={formData.description}
          onChange={handleFormChange}
        />
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleFormChange}
        />
        <button type="submit">Add Task</button>
      </form>
      
      {/* --- TODO LIST --- */}
      <h2 className="tasks-header">Your Tasks</h2> {/* <-- ADDED THIS HEADER */}

      <div className="todo-list">
        {todos.map(todo => (
          <div
            key={todo._id}
            className={`todo-item ${todo.completed ? 'is-complete' : ''}`}
          >
            {/* Removed the conditional rendering for editing */}
            <div className="task-details" onClick={() => toggleComplete(todo._id)}>
              <span className="task-text">{todo.task}</span>
              {todo.description && <span className="task-desc">{todo.description}</span>}
              {todo.dueDate && <span className="task-date">{new Date(todo.dueDate).toLocaleDateString()}</span>}
            </div>

            <div className="task-buttons">
              {/* Removed the "Edit" button */}
              <button 
                className="delete-btn"
                onClick={() => deleteTodo(todo._id)}
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;