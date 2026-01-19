// ============================================
// LANDINGPAGE.JS - Safe working version
// ============================================

console.log("Landing page script loaded");

// Global variables - allEvents is declared in common.js
let currentEvent = null;

// When page loads
window.onload = function () {
  console.log("Page fully loaded");

  // Try to load event details immediately
  tryLoadEventDetails();

  // Also try again after events are loaded
  document.addEventListener("eventsLoaded", function () {
    console.log("Events loaded event received");
    tryLoadEventDetails();
  });

  // Final backup attempt
  setTimeout(function () {
    tryLoadEventDetails();
  }, 2000);
};

// ============================================
// TRY TO LOAD EVENT DETAILS (safely)
// ============================================

function tryLoadEventDetails() {
  if (typeof allEvents === "undefined") {
    console.warn("allEvents not defined yet, cannot load event details");
    return;
  }

  if (!currentEvent) {
    loadEventDetails();
  }
}

// ============================================
// LOAD EVENT DETAILS
// ============================================

function loadEventDetails() {
  console.log("=== Loading Event Details ===");

  // Get event ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

  console.log("Event ID from URL:", eventId);
  console.log("Event ID as number:", parseInt(eventId, 10));

  if (!eventId) {
    showError("No event selected. Please go back and choose an event.");
    return;
  }

  // Check if we have events
  console.log("Available events count:", allEvents.length);

  if (!Array.isArray(allEvents) || allEvents.length === 0) {
    console.log("No events loaded yet, showing loading...");
    showLoadingState();
    return;
  }

  // Find the event
  currentEvent = allEvents.find(function (event) {
    return event.id === parseInt(eventId, 10);
  });

  console.log("Found event:", currentEvent);

  if (!currentEvent) {
    console.log(
      "Available event IDs:",
      allEvents.map((e) => e.id),
    );
    showError(
      "Event not found. Available events: " +
        allEvents.map((e) => e.title).join(", "),
    );
    return;
  }

  // Show the event
  showEventDetails();
  showSimilarEvents();
}

// ============================================
// SHOW LOADING STATE
// ============================================

function showLoadingState() {
  const container = document.getElementById("event-detail-container");
  if (container) {
    container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="spinner"></div>
                <p style="color: #9aa9b1; margin-top: 1rem;">Loading event details...</p>
            </div>
        `;
  }
}

// ============================================
// SHOW EVENT DETAILS
// ============================================

function showEventDetails() {
  if (!currentEvent) return;

  const container = document.getElementById("event-detail-container");
  if (!container) return;

  const niceDate = formatDate(currentEvent.date);

  // Handle missing image gracefully
  const imageUrl = currentEvent.imageUrl || "images/placeholder.svg";
  const description = currentEvent.description || "Join us for an amazing community event!";
  const extendedDescription = currentEvent.extendedDescription || "Experience the vibrant culture and community spirit.";
  const organizer = currentEvent.organizer || "Community Organizer";

  container.innerHTML = `
        <div class="event-detail">
            <div class="event-main">
                <img src="${imageUrl}" alt="${currentEvent.title}" class="event-image" onerror="this.src='images/placeholder.svg'">
                <div class="event-content">
                    <div class="category-badge">${currentEvent.category}</div>
                    <h1 class="event-title">${currentEvent.title}</h1>
                    <div class="event-meta">
                        <div class="meta-item">📅 ${niceDate}</div>
                        <div class="meta-item">🕒 ${currentEvent.time}</div>
                        <div class="meta-item">📍 ${currentEvent.locationName}</div>
                        <div class="meta-item">🏙️ ${currentEvent.city}</div>
                    </div>
                    <div class="event-description">
                        <p>${description}</p>
                        <p>${extendedDescription}</p>
                    </div>
                    <div class="event-actions">
                        <a href="RSVP.html?id=${currentEvent.id}" class="btn btn-primary">✓ RSVP Now</a>
                        <button class="btn btn-secondary" onclick="shareEvent()">↗ Share Event</button>
                        <button class="btn btn-secondary" onclick="copyLink()">📋 Copy Link</button>
                    </div>
                </div>
            </div>
            <div class="event-sidebar">
                <div class="sidebar-card">
                    <h3>Event Details</h3>
                    <div class="info-item"><span class="info-label">Date</span><span class="info-value">${niceDate}</span></div>
                    <div class="info-item"><span class="info-label">Time</span><span class="info-value">${currentEvent.time}</span></div>
                    <div class="info-item"><span class="info-label">Location</span><span class="info-value">${currentEvent.locationName}</span></div>
                    <div class="info-item"><span class="info-label">City</span><span class="info-value">${currentEvent.city}</span></div>
                    <div class="info-item"><span class="info-label">Organizer</span><span class="info-value">${organizer}</span></div>
                    <div class="info-item"><span class="info-label">Admission</span><span class="admission-badge">FREE</span></div>
                </div>
            </div>
        </div>

        <div class="similar-events">
            <h2>Similar Events</h2>
            <div id="similar-events-grid" class="similar-events-grid">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// SHOW SIMILAR EVENTS
// ============================================

function showSimilarEvents() {
  if (!currentEvent || !Array.isArray(allEvents)) return;

  const grid = document.getElementById("similar-events-grid");
  if (!grid) return;

  const similarEvents = allEvents
    .filter(function (event) {
      return (
        event.id !== currentEvent.id &&
        (event.category === currentEvent.category ||
          event.city === currentEvent.city)
      );
    })
    .slice(0, 3);

  if (similarEvents.length === 0) {
    grid.innerHTML = '<p style="color: #9aa9b1;">No similar events found.</p>';
    return;
  }

  grid.innerHTML = "";

  similarEvents.forEach(function (event) {
    const card = createSimilarEventCard(event);
    grid.appendChild(card);
  });
}

// ============================================
// CREATE SIMILAR EVENT CARD
// ============================================

function createSimilarEventCard(event) {
  const card = document.createElement("div");
  card.className = "similar-event-card";
  card.onclick = function () {
    window.location.href = "landingpage.html?id=" + event.id;
  };

  const niceDate = formatDate(event.date);
  const imageUrl = event.imageUrl || "images/placeholder.svg";

  card.innerHTML = `
        <img src="${imageUrl}" alt="${event.title}" onerror="this.src='images/placeholder.svg'">
        <div class="similar-event-content">
            <h3>${event.title}</h3>
            <div class="similar-event-meta">
                <div>📅 ${niceDate}</div>
                <div>📍 ${event.locationName}</div>
            </div>
        </div>
    `;

  return card;
}

// ============================================
// SHARE FUNCTIONS
// ============================================

function shareEvent() {
  if (!currentEvent) return;

  if (navigator.share) {
    navigator
      .share({
        title: currentEvent.title,
        text: "Check out this event: " + currentEvent.title,
        url: window.location.href,
      })
      .catch(function (error) {
        console.log("Share cancelled");
      });
  } else {
    copyLink();
  }
}

function copyLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(function () {
      alert("Link copied to clipboard!");
    })
    .catch(function () {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Link copied to clipboard!");
      } catch (err) {
        alert("Could not copy link. Please copy manually: " + window.location.href);
      }
      document.body.removeChild(textArea);
    });
}

// ============================================
// ERROR HANDLING
// ============================================

function showError(message) {
  console.error("ERROR:", message);
  const container = document.getElementById("event-detail-container");
  if (container) {
    container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="color: #f44336; font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: #f44336;">Error</h3>
                <p style="color: #9aa9b1;">${message}</p>
                <button onclick="history.back()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #00bcd4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ← Go Back
                </button>
            </div>
        `;
  }
}

// ============================================
// HELPER: FORMAT DATE
// ============================================

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
