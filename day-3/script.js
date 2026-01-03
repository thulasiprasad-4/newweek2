// Counter state
let counter = 0;
let step = 1;
let maxValue = 0;
let minValue = 0;
let totalOperations = 0;
let history = [];

// DOM Elements
const counterValueEl = document.getElementById('counter-value');
const currentStepEl = document.getElementById('current-step');
const maxValueEl = document.getElementById('max-value');
const minValueEl = document.getElementById('min-value');
const totalOpsEl = document.getElementById('total-ops');
const historyListEl = document.getElementById('history-list');

// Initialize counter
function initCounter() {
    updateDisplay();
    updateStats();
    addToHistory("Counter initialized", 0);
}

// Update counter display
function updateDisplay() {
    counterValueEl.textContent = counter;
    currentStepEl.textContent = step;
    
    // Color change based on value
    if (counter > 0) {
        counterValueEl.style.color = "#48bb78";
    } else if (counter < 0) {
        counterValueEl.style.color = "#f56565";
    } else {
        counterValueEl.style.color = "#4a5568";
    }
}

// Update statistics
function updateStats() {
    maxValue = Math.max(maxValue, counter);
    minValue = Math.min(minValue, counter);
    
    maxValueEl.textContent = maxValue;
    minValueEl.textContent = minValue;
    totalOpsEl.textContent = totalOperations;
}

// Add to history
function addToHistory(action, value) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = {
        time: timestamp,
        action: action,
        value: value
    };
    
    history.unshift(historyItem); // Add to beginning
    
    // Update history display
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    historyListEl.innerHTML = '';
    
    // Show only last 10 items
    const recentHistory = history.slice(0, 10);
    
    recentHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        let color = '#4a5568';
        if (item.action.includes('+')) color = '#48bb78';
        if (item.action.includes('-')) color = '#f56565';
        if (item.action.includes('Reset')) color = '#ed8936';
        
        historyItem.innerHTML = `
            <span style="color: ${color}">${item.action}</span>
            <span>${item.value}</span>
            <span style="color: #a0aec0">${item.time}</span>
        `;
        
        historyListEl.appendChild(historyItem);
    });
}

// Increment counter
function increment() {
    counter += step;
    totalOperations++;
    updateDisplay();
    updateStats();
    addToHistory(`+${step}`, counter);
    
    // Animation
    counterValueEl.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counterValueEl.style.transform = 'scale(1)';
    }, 200);
}

// Decrement counter
function decrement() {
    counter -= step;
    totalOperations++;
    updateDisplay();
    updateStats();
    addToHistory(`-${step}`, counter);
    
    // Animation
    counterValueEl.style.transform = 'scale(0.9)';
    setTimeout(() => {
        counterValueEl.style.transform = 'scale(1)';
    }, 200);
}

// Reset counter
function resetCounter() {
    counter = 0;
    totalOperations++;
    updateDisplay();
    updateStats();
    addToHistory("Reset", counter);
    
    // Animation
    counterValueEl.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        counterValueEl.style.transform = 'rotate(0deg)';
    }, 500);
}

// Set step value
function setStep(newStep) {
    step = newStep;
    updateDisplay();
    addToHistory(`Step changed to ${newStep}`, counter);
    
    // Highlight active step button
    document.querySelectorAll('.step-buttons button').forEach(btn => {
        if (parseInt(btn.textContent.replace('Step ', '')) === newStep) {
            btn.style.background = '#2b6cb0';
        } else {
            btn.style.background = '#4299e1';
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case '+':
        case '=':
            increment();
            break;
        case '-':
        case '_':
            decrement();
            break;
        case 'r':
        case 'R':
            resetCounter();
            break;
        case '1':
            setStep(1);
            break;
        case '5':
            setStep(5);
            break;
        case '0':
            setStep(10);
            break;
    }
});

// Initialize on load
window.onload = initCounter;