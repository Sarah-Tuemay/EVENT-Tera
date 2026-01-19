console.log("Index.js loaded");

// Wait for events to be loaded
document.addEventListener('eventsLoaded', function(event) {
    console.log("Events are ready, showing featured events...");
    showFeaturedEvents();
});

// Also try to show events after a delay (backup)
setTimeout(function() {
    if (window.eventsLoaded) {
        console.log("Events already loaded from timeout");
    } else {
        console.log("Events not loaded yet, trying anyway...");
        showFeaturedEvents();
    }
}, 1000);

function showFeaturedEvents() {
    console.log("Showing featured events...");
    console.log("Total events available:", allEvents.length);
    
    const container = document.getElementById('featured-events-container');
    
    if (!container) {
        console.error("Could not find featured-events-container");
        return;
    }
    
    // If no events yet, show loading
    if (allEvents.length === 0) {
        container.innerHTML = '<p>Loading events...</p>';
        return;
    }
    
    // Get only featured events
    const featuredEvents = allEvents.filter(function(event) {
        return event.isFeatured === true;
    });
    
    console.log("Featured events found:", featuredEvents.length);
    
    if (featuredEvents.length === 0) {
        container.innerHTML = '<p>No featured events right now.</p>';
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Add each event
    featuredEvents.forEach(function(event) {
        const eventCard = createEventCard(event);
        container.appendChild(eventCard);
    });
    
    console.log("✅ Featured events displayed");
}


function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // When card is clicked, go to event page
    card.onclick = function() {
        window.location.href = 'landingpage.html?id=' + event.id;
    };
    
    const niceDate = formatDate(event.date);
    
    card.innerHTML = `
        <img src="${event.imageUrl}" alt="${event.title}">
        <span class="category">${event.category}</span>
        ${event.isFeatured ? '<span class="featured">★ Featured</span>' : ''}
        <div class="content">
            <h3>${event.title}</h3>
            <p class="meta">📅 ${niceDate} • 🕒 ${event.time}</p>
            <p class="meta">📍 ${event.locationName}</p>
            <p class="meta">🏙️ ${event.city}</p>
        </div>
    `;
    
    return card;
}

// Setup search when page loads
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('home-search');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const searchText = this.value.trim();
                if (searchText) {
                    window.location.href = 'events.html?search=' + encodeURIComponent(searchText);
                }
            }
        });
    }
});
