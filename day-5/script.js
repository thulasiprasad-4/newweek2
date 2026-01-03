// DOM Elements
const form = document.getElementById('loginForm');
const validationSummary = document.getElementById('validationSummary');
const dataOutput = document.getElementById('dataOutput');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

// Validation patterns
const patterns = {
    name: /^[A-Za-z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Password strength levels
const strengthLevels = [
    { level: 0, text: "Very Weak", color: "#e53e3e" },
    { level: 1, text: "Weak", color: "#ed8936" },
    { level: 2, text: "Fair", color: "#ecc94b" },
    { level: 3, text: "Good", color: "#48bb78" },
    { level: 4, text: "Strong", color: "#38a169" }
];

// Initialize form
function initForm() {
    // Add event listeners for real-time validation
    document.getElementById('fullName').addEventListener('input', validateName);
    document.getElementById('email').addEventListener('input', validateEmail);
    document.getElementById('phone').addEventListener('input', validatePhone);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirmPassword').addEventListener('input', validateConfirmPassword);
    document.getElementById('dob').addEventListener('change', validateDOB);
    document.getElementById('country').addEventListener('change', validateCountry);
    document.getElementById('terms').addEventListener('change', validateTerms);
    
    // Form submit event
    form.addEventListener('submit', handleSubmit);
    
    updateValidationSummary();
}

// Validate name
function validateName() {
    const input = document.getElementById('fullName');
    const error = document.getElementById('nameError');
    const value = input.value.trim();
    
    if (!value) {
        showError(input, error, "Full name is required");
        return false;
    }
    
    if (!patterns.name.test(value)) {
        showError(input, error, "Name must be 2-50 characters (letters and spaces only)");
        return false;
    }
    
    showSuccess(input, error);
    return true;
}

// Validate email
function validateEmail() {
    const input = document.getElementById('email');
    const error = document.getElementById('emailError');
    const value = input.value.trim();
    
    if (!value) {
        showError(input, error, "Email is required");
        return false;
    }
    
    if (!patterns.email.test(value)) {
        showError(input, error, "Please enter a valid email address");
        return false;
    }
    
    showSuccess(input, error);
    return true;
}

// Validate phone
function validatePhone() {
    const input = document.getElementById('phone');
    const error = document.getElementById('phoneError');
    const value = input.value.trim();
    
    if (!value) {
        // Phone is optional
        clearError(input, error);
        return true;
    }
    
    if (!patterns.phone.test(value)) {
        showError(input, error, "Please enter a valid phone number");
        return false;
    }
    
    showSuccess(input, error);
    return true;
}

// Validate password
function validatePassword() {
    const input = document.getElementById('password');
    const error = document.getElementById('passwordError');
    const value = input.value;
    
    if (!value) {
        showError(input, error, "Password is required");
        updatePasswordStrength(0);
        return false;
    }
    
    // Check password strength
    let strength = 0;
    
    // Length check
    if (value.length >= 8) strength++;
    
    // Lowercase check
    if (/[a-z]/.test(value)) strength++;
    
    // Uppercase check
    if (/[A-Z]/.test(value)) strength++;
    
    // Number check
    if (/\d/.test(value)) strength++;
    
    // Special char check
    if (/[@$!%*?&]/.test(value)) strength++;
    
    updatePasswordStrength(strength);
    
    if (!patterns.password.test(value)) {
        showError(input, error, "Password doesn't meet requirements");
        return false;
    }
    
    showSuccess(input, error);
    return true;
}

// Update password strength indicator
function updatePasswordStrength(strength) {
    const level = strengthLevels[Math.min(strength, 4)];
    
    strengthBar.style.width = `${(strength / 4) * 100}%`;
    strengthBar.style.backgroundColor = level.color;
    strengthText.textContent = `Strength: ${level.text}`;
    strengthText.style.color = level.color;
}

// Validate confirm password
function validateConfirmPassword() {
    const input = document.getElementById('confirmPassword');
    const password = document.getElementById('password').value;
    const error = document.getElementById('confirmPasswordError');
    const value = input.value;
    
    if (!value) {
        showError(input, error, "Please confirm your password");
        return false;
    }
    
    if (value !== password) {
        showError(input, error, "Passwords do not match");
        return false;
    }
    
    showSuccess(input, error);
    return true;
}

// Validate date of birth
function validateDOB() {
    const input = document.getElementById('dob');
    const error = document.getElementById('dobError');
    const value = input.value;
    
    if (!value) {
        // DOB is optional
        clearError(input, error);
        return true;
    }
    
    const dob = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    
    if (age < 13) {
        showError(input, error, "You must be at least 13 years old");
        return false;
    }
    
    if (age > 120) {
        showError(input, error, "Please enter a valid date of birth");
        return false;
    }
    
    showSuccess(input, error);
    return true;
}

// Validate country
function validateCountry() {
    const input = document.getElementById('country');
    const error = document.getElementById('countryError');
    const value = input.value;
    
    if (!value) {
        // Country is optional
        clearError(input, error);
        return true;
    }
    
    showSuccess(input, error);
    return true;
}

// Validate terms
function validateTerms() {
    const input = document.getElementById('terms');
    const error = document.getElementById('termsError');
    
    if (!input.checked) {
        showError(input, error, "You must accept the terms and conditions");
        return false;
    }
    
    clearError(input, error);
    return true;
}

// Show error state
function showError(input, errorElement, message) {
    input.classList.remove('success');
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    updateValidationSummary();
}

// Show success state
function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    updateValidationSummary();
}

// Clear error state
function clearError(input, errorElement) {
    input.classList.remove('error', 'success');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    updateValidationSummary();
}

// Update validation summary
function updateValidationSummary() {
    const errors = document.querySelectorAll('.error-message:not(:empty)');
    
    if (errors.length === 0) {
        validationSummary.textContent = "No validation errors";
        validationSummary.className = "validation-summary";
    } else {
        validationSummary.textContent = `${errors.length} validation error(s) found`;
        validationSummary.className = "validation-summary error";
    }
}

// Toggle password visibility
function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    // Validate all fields
    const isValid = 
        validateName() &&
        validateEmail() &&
        validatePhone() &&
        validatePassword() &&
        validateConfirmPassword() &&
        validateDOB() &&
        validateCountry() &&
        validateTerms();
    
    if (isValid) {
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || 'Not provided',
            dob: document.getElementById('dob').value || 'Not provided',
            country: document.getElementById('country').value || 'Not provided',
            newsletter: document.getElementById('newsletter').checked,
            timestamp: new Date().toLocaleString()
        };
        
        // Display form data
        displayFormData(formData);
        
        // Show success message
        showSuccessMessage();
        
        // In a real application, you would send data to server here
        console.log('Form submitted:', formData);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            clearAllErrors();
            updateValidationSummary();
            updatePasswordStrength(0);
        }, 3000);
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        validationSummary.textContent = "Please fix the errors above";
        validationSummary.className = "validation-summary error";
    }
}

// Display form data
function displayFormData(data) {
    const formattedData = JSON.stringify(data, null, 2);
    dataOutput.textContent = formattedData;
    dataOutput.style.color = '#48bb78';
}

// Show success message
function showSuccessMessage() {
    validationSummary.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        Form submitted successfully! Redirecting...
    `;
    validationSummary.className = "validation-summary";
    validationSummary.style.color = "#48bb78";
}

// Clear form
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        form.reset();
        clearAllErrors();
        updateValidationSummary();
        updatePasswordStrength(0);
        dataOutput.textContent = 'No data submitted yet';
        dataOutput.style.color = 'white';
    }
}

// Clear all errors
function clearAllErrors() {
    document.querySelectorAll('input, select').forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
}

// Fill demo data for testing
function fillDemoData() {
    document.getElementById('fullName').value = 'John Doe';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phone').value = '123-456-7890';
    document.getElementById('password').value = 'SecurePass123!';
    document.getElementById('confirmPassword').value = 'SecurePass123!';
    document.getElementById('dob').value = '1990-01-01';
    document.getElementById('country').value = 'US';
    document.getElementById('terms').checked = true;
    document.getElementById('newsletter').checked = true;
    
    // Trigger validation
    validateName();
    validateEmail();
    validatePhone();
    validatePassword();
    validateConfirmPassword();
    validateDOB();
    validateCountry();
    validateTerms();
}

// Initialize on load
window.onload = initForm;