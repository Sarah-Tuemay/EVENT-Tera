//This js apply for all pages
let allEvents = [];

// This function runs when the page is ready
function pageReady() {
    console.log("=== PAGE READY ===");
    
    setupMobileMenu();
    
    setYear();
    
    loadEvents();
}

// Wait for page to load, then run pageReady
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pageReady);
} else {
    pageReady();
}

// MOBILE MENU
function setupMobileMenu() {
    console.log("Setting up mobile menu...");
    
    // Find the hamburger button
    const hamburger = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('main-nav');
    
    console.log("Hamburger button:", hamburger);
    console.log("Nav menu:", navMenu);
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            console.log("Hamburger clicked!");
            
            // Toggle active class
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            console.log("Menu active:", navMenu.classList.contains('active'));
        });
        
        // When any link is clicked, close menu
        const links = navMenu.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                console.log("Link clicked, closing menu");
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        console.log("✅ Mobile menu setup complete");
    } else {
        console.error("❌ Could not find hamburger button or nav menu");
    }
}

// SET YEAR
function setYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log("Year set to:", new Date().getFullYear());
    }
}

// LOAD EVENTS
function loadEvents() {
    console.log("Loading events...");
    
    fetch('events-data.json')
        .then(function(response) {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            allEvents = data;
            console.log("✅ Events loaded successfully:", allEvents.length, "events");
            
            // Tell other scripts that events are ready
            window.eventsLoaded = true;
            
            // Trigger a custom event
            const event = new CustomEvent('eventsLoaded', { detail: allEvents });
            document.dispatchEvent(event);
        })
        .catch(function(error) {
            console.error("❌ Error loading events:", error);
            showError("Failed to load events. Please check if events-data.json exists.");
        });
}

// HELPER FUNCTIONS
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showError(message) {
    console.error("Error:", message);
    const errorBox = document.getElementById('error-container');
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        setTimeout(function() {
            errorBox.style.display = 'none';
        }, 5000);
    }
}
