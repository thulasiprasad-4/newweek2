// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const themeToggle = document.getElementById('themeToggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const validationError = document.getElementById('validationError');
const emptyState = document.getElementById('emptyState');

// To-Do App State
let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
let currentFilter = 'all';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize the app
function init() {
    // Set theme based on saved preference
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    // Load tasks from localStorage
    updateTaskCounters();
    renderTasks();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Add task event
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Theme toggle event
    themeToggle.addEventListener('click', toggleTheme);
    
    // Filter button events
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Set filter and re-render tasks
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Input validation
    if (!validateTaskInput(taskText)) {
        validationError.style.display = 'block';
        return;
    }
    
    validationError.style.display = 'none';
    
    // Create new task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input and render tasks
    taskInput.value = '';
    updateTaskCounters();
    renderTasks();
    
    // Focus back to input
    taskInput.focus();
}

// Validate task input
function validateTaskInput(taskText) {
    return taskText.length >= 3 && taskText.length <= 100;
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    updateTaskCounters();
    renderTasks();
}

// Edit a task
function editTask(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const taskText = taskItem.querySelector('.task-text');
    const task = tasks.find(t => t.id === id);
    
    // Replace text with input field
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.text;
    
    taskText.replaceWith(editInput);
    editInput.focus();
    
    // Handle edit completion
    function finishEdit() {
        const newText = editInput.value.trim();
        
        if (validateTaskInput(newText)) {
            task.text = newText;
            saveTasks();
            renderTasks();
        } else {
            validationError.textContent = 'Please enter a valid task (3-100 characters)';
            validationError.style.display = 'block';
            editInput.focus();
        }
    }
    
    editInput.addEventListener('blur', finishEdit);
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') finishEdit();
    });
}

// Toggle task completion status
function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        updateTaskCounters();
        
        // Re-render only if filtered view requires it
        if (currentFilter !== 'all') {
            renderTasks();
        } else {
            // Just update the class for the specific task
            const taskItem = document.querySelector(`[data-id="${id}"]`);
            if (taskItem) {
                taskItem.classList.toggle('completed', task.completed);
                const checkbox = taskItem.querySelector('.task-checkbox');
                if (checkbox) checkbox.checked = task.completed;
            }
        }
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Update task counters
function updateTaskCounters() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    totalTasksSpan.textContent = totalTasks;
    completedTasksSpan.textContent = completedTasks;
    pendingTasksSpan.textContent = pendingTasks;
}

// Render tasks based on current filter
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.appendChild(emptyState);
        
        // Update empty state message based on filter
        let message = 'No tasks yet';
        if (currentFilter === 'pending') {
            message = 'No pending tasks';
        } else if (currentFilter === 'completed') {
            message = 'No completed tasks';
        }
        emptyState.querySelector('h3').textContent = message;
    } else {
        emptyState.style.display = 'none';
        
        // Create and append task items
        filteredTasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    }
}

// Create a task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);
    
    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHtml(task.text)}</span>
        </div>
        <div class="task-actions">
            <button class="action-btn edit-btn" title="Edit task">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners to the buttons
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
    
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editTask(task.id));
    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return li;
}

// Toggle light/dark mode
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Update button text
    if (isDarkMode) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
}

// Helper function to escape HTML (prevent XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);