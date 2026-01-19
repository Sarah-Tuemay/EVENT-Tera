// When page loads
window.onload = function() {
    console.log("Contact page loaded!");
    
    setupContactForm();
};

// SETUP CONTACT FORM
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.onsubmit = function(event) {
            event.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm();
            }
        };
    }
}

// VALIDATE CONTACT FORM
function validateContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Check each required field
    inputs.forEach(function(input) {
        const formGroup = input.parentElement;
        const errorMsg = formGroup.querySelector('.error-message');

        formGroup.classList.remove('error');
        if (errorMsg) errorMsg.textContent = '';
        
        if (!input.value.trim()) {
            formGroup.classList.add('error');
            if (errorMsg) errorMsg.textContent = 'This field is required';
            isValid = false;
        }
        
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                formGroup.classList.add('error');
                if (errorMsg) errorMsg.textContent = 'Please enter a valid email';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// SUBMIT CONTACT FORM
function submitContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    const formData = new FormData(form);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        reason: formData.get('reason'),
        message: formData.get('message')
    };
    
    setTimeout(function() {
        console.log('Contact form submitted:', contactData);
        
        showContactSuccessMessage();
        
        form.reset();
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }, 1500);
}

// SHOW SUCCESS MESSAGE
function showContactSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
        ✅ Thank you! Your message has been sent. We'll get back to you soon!
    `;
    
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(successDiv, form);
    

    setTimeout(function() {
        successDiv.remove();
    }, 5000);
}
