// Form validation functions
const validators = {
    // Required field validation
    required: (value) => ({
        isValid: value.trim() !== '',
        message: 'This field is required'
    }),

    // Email validation
    email: (value) => ({
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    }),

    // Date validation
    birthDate: (value) => {
        const date = new Date(value);
        const today = new Date();
        return {
            isValid: date < today,
            message: 'Birth date must be in the past'
        };
    },

    // Migration year validation
    migrationYear: (value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return {
            isValid: year >= 1900 && year <= currentYear,
            message: `Year must be between 1900 and ${currentYear}`
        };
    },

    // Country selection validation
    country: (value) => ({
        isValid: value !== '',
        message: 'Please select a country'
    })
};

// Function to validate a field
function validateField(field, rules) {
    const value = field.value;
    let errors = [];

    rules.forEach(rule => {
        const validation = validators[rule](value);
        if (!validation.isValid) {
            errors.push(validation.message);
        }
    });

    return errors;
}

// Function to show validation errors
function showErrors(field, errors) {
    // Remove any existing error messages
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Remove error styling
    field.classList.remove('error');

    if (errors.length > 0) {
        // Add error styling
        field.classList.add('error');

        // Create and append error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errors[0]; // Show first error only
        field.parentElement.appendChild(errorDiv);
    }

    return errors.length === 0;
}

// Function to validate the entire form
function validateForm(formData) {
    const errors = {};

    // Personal Information
    errors.firstName = validateField(formData.firstName, ['required']);
    errors.lastName = validateField(formData.lastName, ['required']);
    errors.email = validateField(formData.email, ['required', 'email']);
    errors.dob = validateField(formData.dob, ['required', 'birthDate']);
    errors.countryOfBirth = validateField(formData.countryOfBirth, ['required', 'country']);
    errors.generation = validateField(formData.generation, ['required']);

    // Current Location
    errors.origin = validateField(formData.origin, ['required', 'country']);
    errors.residence = validateField(formData.residence, ['required', 'country']);

    // Migration dates for 1st/1.5 gen
    if (formData.generation === '1st' || formData.generation === '1.5') {
        errors.migrationYear = validateField(formData.migrationYear, ['required', 'migrationYear']);
    }

    // Migration history validation if enabled
    if (formData.hasMigrationHistory) {
        formData.migrationHistory.forEach((entry, index) => {
            errors[`fromCountry${index}`] = validateField(entry.fromCountry, ['required', 'country']);
            errors[`toCountry${index}`] = validateField(entry.toCountry, ['required', 'country']);
            errors[`migrationYear${index}`] = validateField(entry.migrationYear, ['required', 'migrationYear']);
        });
    }

    return Object.values(errors).every(isValid => isValid);
}

// Export validation functions
export { validateField, showErrors, validateForm }; 