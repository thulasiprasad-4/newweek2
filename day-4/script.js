// Theme Configuration
const themes = {
    light: {
        name: 'Light',
        icon: 'fa-sun',
        color: '#667eea'
    },
    dark: {
        name: 'Dark',
        icon: 'fa-moon',
        color: '#63b3ed'
    },
    blue: {
        name: 'Blue',
        icon: 'fa-water',
        color: '#3182ce'
    },
    green: {
        name: 'Green',
        icon: 'fa-leaf',
        color: '#38a169'
    }
};

// Theme state
let currentTheme = 'light';
let themeHistory = [];
let autoThemeInterval = null;
let isAutoTheme = false;

// DOM Elements
const body = document.body;
const currentThemeEl = document.getElementById('current-theme');
const themeNameEl = document.getElementById('theme-name');
const themePreviewEl = document.getElementById('theme-preview');
const lastChangeEl = document.getElementById('last-change');
const themeHistoryEl = document.getElementById('theme-history');
const autoToggleBtn = document.getElementById('auto-toggle');
const brightnessSlider = document.getElementById('brightness');
const brightnessValue = document.getElementById('brightness-value');

// Initialize theme from localStorage or default
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedBrightness = localStorage.getItem('brightness') || '100';
    
    setTheme(savedTheme);
    changeBrightness(savedBrightness);
    
    // Add initial theme to history
    addToThemeHistory(savedTheme);
}

// Set theme
function setTheme(theme) {
    if (!themes[theme]) return;
    
    // Remove all theme classes
    body.classList.remove('light-theme', 'dark-theme', 'blue-theme', 'green-theme');
    
    // Add new theme class
    body.classList.add(`${theme}-theme`);
    
    // Update state
    currentTheme = theme;
    
    // Update UI
    updateThemeUI();
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Add to history
    addToThemeHistory(theme);
    
    // Update last change time
    updateLastChange();
}

// Toggle between light and dark
function toggleTheme() {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
}

// Set random theme
function randomTheme() {
    const themeKeys = Object.keys(themes);
    const randomIndex = Math.floor(Math.random() * themeKeys.length);
    const randomTheme = themeKeys[randomIndex];
    setTheme(randomTheme);
}

// Cycle through themes
function cycleTheme() {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
}

// Update theme UI
function updateThemeUI() {
    const theme = themes[currentTheme];
    
    // Update text
    currentThemeEl.textContent = theme.name;
    themeNameEl.textContent = currentTheme;
    
    // Update preview color
    themePreviewEl.style.backgroundColor = theme.color;
    
    // Update theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const btnTheme = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (btnTheme === currentTheme) {
            btn.style.background = theme.color;
            btn.style.color = 'white';
            btn.style.borderColor = theme.color;
        } else {
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    });
    
    // Update auto toggle button
    if (isAutoTheme) {
        autoToggleBtn.style.animation = 'pulse 2s infinite';
        autoToggleBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto';
    } else {
        autoToggleBtn.style.animation = '';
        autoToggleBtn.innerHTML = '<i class="fas fa-magic"></i> Auto';
    }
}

// Add theme change to history
function addToThemeHistory(theme) {
    const historyItem = {
        theme: theme,
        name: themes[theme].name,
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now()
    };
    
    themeHistory.unshift(historyItem);
    
    // Keep only last 10 items
    if (themeHistory.length > 10) {
        themeHistory.pop();
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    themeHistoryEl.innerHTML = '';
    
    themeHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.style.borderLeftColor = themes[item.theme].color;
        
        historyItem.innerHTML = `
            <div>
                <span class="history-theme" style="color: ${themes[item.theme].color}">
                    <i class="fas ${themes[item.theme].icon}"></i> ${item.name}
                </span>
                <div class="history-time">${item.time}</div>
            </div>
            <i class="fas fa-chevron-right" style="color: ${themes[item.theme].color}"></i>
        `;
        
        themeHistoryEl.appendChild(historyItem);
    });
}

// Update last change time
function updateLastChange() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    lastChangeEl.textContent = timeString;
}

// Change brightness
function changeBrightness(value) {
    document.documentElement.style.filter = `brightness(${value}%)`;
    brightnessValue.textContent = `${value}%`;
    localStorage.setItem('brightness', value);
}

// Toggle auto theme cycling
function toggleAutoTheme() {
    if (isAutoTheme) {
        // Stop auto theme
        clearInterval(autoThemeInterval);
        isAutoTheme = false;
        autoToggleBtn.innerHTML = '<i class="fas fa-magic"></i> Auto';
        autoToggleBtn.style.animation = '';
    } else {
        // Start auto theme
        isAutoTheme = true;
        autoToggleBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto';
        autoToggleBtn.style.animation = 'pulse 2s infinite';
        
        autoThemeInterval = setInterval(() => {
            cycleTheme();
        }, 3000); // Change every 3 seconds
    }
    
    updateThemeUI();
}

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case '1': setTheme('light'); break;
        case '2': setTheme('dark'); break;
        case '3': setTheme('blue'); break;
        case '4': setTheme('green'); break;
        case ' ': toggleTheme(); break;
        case 'r': randomTheme(); break;
        case 'c': cycleTheme(); break;
        case 'a': toggleAutoTheme(); break;
        case '+': 
            brightnessSlider.value = Math.min(150, parseInt(brightnessSlider.value) + 10);
            changeBrightness(brightnessSlider.value);
            break;
        case '-':
            brightnessSlider.value = Math.max(50, parseInt(brightnessSlider.value) - 10);
            changeBrightness(brightnessSlider.value);
            break;
    }
});

// Initialize on load
window.onload = initTheme;

// Add initial CSS for brightness control
document.documentElement.style.transition = 'filter 0.3s ease';