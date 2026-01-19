// ============================================
// RSVP.JS - Code for RSVP page
// ============================================

let currentEvent = null;

// When page loads
window.onload = function() {
    console.log("RSVP page loaded!");
    
    // Load event details
    loadEventDetails();
    
    // Setup form
    setupForm();
};

// ============================================
// LOAD EVENT DETAILS
// ============================================

function loadEventDetails() {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    console.log("RSVP Event ID from URL:", eventId);
    console.log("RSVP Event ID as number:", parseInt(eventId, 10));
    
    if (!eventId) {
        showError('No event selected. Please go back and choose an event.');
        return;
    }
    
    // Try to load event details immediately
    tryLoadEventDetails(eventId);
    
    // Also try again after events are loaded
    document.addEventListener("eventsLoaded", function () {
        console.log("RSVP: Events loaded event received");
        tryLoadEventDetails(eventId);
    });
    
    // Final backup attempt
    setTimeout(function () {
        tryLoadEventDetails(eventId);
    }, 2000);
}

function tryLoadEventDetails(eventId) {
    if (typeof allEvents === "undefined" || !Array.isArray(allEvents) || allEvents.length === 0) {
        console.log("RSVP: Events not loaded yet");
        return;
    }
    
    if (currentEvent) {
        return; // Already loaded
    }
    
    // Find the event
    currentEvent = allEvents.find(function(event) {
        return event.id === parseInt(eventId, 10);
    });
    
    console.log("RSVP: Found event:", currentEvent);
    
    if (!currentEvent) {
        console.log("RSVP: Available event IDs:", allEvents.map(e => e.id));
        showError('Event not found.');
        return;
    }
    
    // Show event details
    showEventDetails();
}

// ============================================
// SHOW EVENT DETAILS
// ============================================

function showEventDetails() {
    const container = document.getElementById('event-preview');
    
    if (!container || !currentEvent) return;
    
    const niceDate = formatDate(currentEvent.date);
    const imageUrl = currentEvent.imageUrl || "images/placeholder.svg";
    
    container.innerHTML = `
        <img src="${imageUrl}" alt="${currentEvent.title}" onerror="this.src='images/placeholder.svg'">
        <h3>${currentEvent.title}</h3>
        <div class="event-detail-item">
            <strong>Date:</strong> ${niceDate}
        </div>
        <div class="event-detail-item">
            <strong>Time:</strong> ${currentEvent.time}
        </div>
        <div class="event-detail-item">
            <strong>Location:</strong> ${currentEvent.locationName}
        </div>
        <div class="event-detail-item">
            <strong>City:</strong> ${currentEvent.city}
        </div>
        <div class="event-detail-item">
            <strong>Organizer:</strong> ${currentEvent.organizer || 'Community Organizer'}
        </div>
        <div class="admission-badge">Admission: FREE</div>
    `;
}

// ============================================
// SETUP FORM
// ============================================

function setupForm() {
    const form = document.getElementById('rsvp-form');
    
    if (form) {
        // When form is submitted
        form.onsubmit = function(event) {
            event.preventDefault();
            
            // Check if form is valid
            if (validateForm()) {
                submitForm();
            }
        };
    }
}

// ============================================
// VALIDATE FORM
// ============================================

function validateForm() {
    const form = document.getElementById('rsvp-form');
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Check each required field
    inputs.forEach(function(input) {
        const formGroup = input.parentElement;
        const errorMsg = formGroup.querySelector('.error-message');
        
        // Remove previous error
        formGroup.classList.remove('error');
        if (errorMsg) errorMsg.textContent = '';
        
        // Check if empty
        if (!input.value.trim()) {
            formGroup.classList.add('error');
            if (errorMsg) errorMsg.textContent = 'This field is required';
            isValid = false;
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                formGroup.classList.add('error');
                if (errorMsg) errorMsg.textContent = 'Please enter a valid email';
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^(\+251|0)?[9][0-9]{8}$/;
            if (!phoneRegex.test(input.value.replace(/[\s-]/g, ''))) {
                formGroup.classList.add('error');
                if (errorMsg) errorMsg.textContent = 'Please enter a valid phone number';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// ============================================
// SUBMIT FORM
// ============================================

function submitForm() {
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('rsvp-submit-btn');
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Get form data
    const formData = new FormData(form);
    const rsvpData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        attendees: formData.get('attendees'),
        message: formData.get('message')
    };
    
    // Simulate sending (in real app, this would go to a server)
    setTimeout(function() {
        console.log('RSVP submitted:', rsvpData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm RSVP';
    }, 1500);
}

// ============================================
// SHOW SUCCESS MESSAGE
// ============================================

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
        <strong>✅ RSVP Confirmed!</strong><br>
        Thank you for registering for ${currentEvent.title}.
    `;
    
    const form = document.getElementById('rsvp-form');
    form.parentNode.insertBefore(successDiv, form);
    
    // Hide after 5 seconds
    setTimeout(function() {
        successDiv.remove();
    }, 5000);
}
