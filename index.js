// Registration form functionality
class RegistrationForm {
    constructor() {
        this.users = [];
        this.init();
    }

    init() {
        // Load existing users from localStorage
        this.loadUsers();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render initial table
        this.renderTable();
    }

    setupEventListeners() {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    loadUsers() {
        const savedUsers = localStorage.getItem('registeredUsers');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
    }

    saveUsers() {
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
    }

    calculateAge(dobString) {
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        return age;
    }

    validateAge(dobString) {
        const age = this.calculateAge(dobString);
        return age >= 18 && age <= 55;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    validateForm(formData) {
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const password = formData.get('password');
        const dob = formData.get('dob');
        const terms = formData.get('terms') === 'on';
        
        let isValid = true;
        this.clearErrors();

        // Validate name
        if (!name) {
            this.showError('name', 'Name is required');
            isValid = false;
        }

        // Validate email
        if (!email) {
            this.showError('email', 'Email is required');
            isValid = false;
        } else if (!this.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!password) {
            this.showError('password', 'Password is required');
            isValid = false;
        }

        // Validate date of birth and age
        if (!dob) {
            this.showError('dob', 'Date of birth is required');
            isValid = false;
        } else if (!this.validateAge(dob)) {
            const age = this.calculateAge(dob);
            this.showError('dob', `Age must be between 18 and 55 years. Your age: ${age}`);
            isValid = false;
        }

        // Validate terms
        if (!terms) {
            this.showError('terms', 'You must accept the terms and conditions');
            isValid = false;
        }

        return {
            isValid,
            data: { name, email, password, dob, terms: terms ? 'true' : 'false' }
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const validation = this.validateForm(formData);
        
        if (validation.isValid) {
            // Add user to the list
            this.users.push(validation.data);
            
            // Save to localStorage
            this.saveUsers();
            
            // Re-render table
            this.renderTable();
            
            // Reset form
            e.target.reset();
            
            // Show success message (optional)
            alert('Registration successful!');
        }
    }

    renderTable() {
        const tableBody = document.getElementById('userTableBody');
        if (!tableBody) return;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add each user as a row
        this.users.forEach(user => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = user.name;
            row.insertCell(1).textContent = user.email;
            row.insertCell(2).textContent = user.password;
            row.insertCell(3).textContent = user.dob;
            row.insertCell(4).textContent = user.terms;
        });
    }
}

// Initialize the registration form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationForm();
});

// Export for potential testing (if running in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegistrationForm;
}
