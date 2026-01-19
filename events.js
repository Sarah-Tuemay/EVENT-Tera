let currentPage = 1;
let eventsPerPage = 6;
let filteredEvents = [];

// When page loads
window.onload = function() {
    console.log("Events page loaded!");
    
    // Setup everything
    setupFilters();
    setupSearch();
    
    // Wait for events to load, then show them
    setTimeout(function() {
        showEvents();
    }, 500);
};


function setupFilters() {
    // Filter toggle button
    const filterBtn = document.getElementById('filters-btn');
    const filterPanel = document.getElementById('filter-panel');
    
    if (filterBtn && filterPanel) {
        filterBtn.onclick = function() {
            filterPanel.classList.toggle('active');
            filterBtn.classList.toggle('active');
        };
    }
    
    // All filter dropdowns
    const filters = ['category-filter', 'location-filter', 'from-date', 'to-date', 'sort-select'];
    
    filters.forEach(function(filterId) {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.onchange = function() {
                currentPage = 1;
                showEvents();
            };
        }
    });
}


function setupSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        // When user types in search
        searchInput.oninput = function() {
            currentPage = 1;
            showEvents();
        };
    }
}

function showEvents() {
    const container = document.getElementById('events-grid-container');
    const resultsCount = document.getElementById('results-count');
    
    if (!container) return;
    

    const search = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const location = document.getElementById('location-filter').value;
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;
    const sort = document.getElementById('sort-select').value;
    

    filteredEvents = allEvents.filter(function(event) {

        if (search && !event.title.toLowerCase().includes(search)) {
            return false;
        }
        
        if (category && event.category !== category) {
            return false;
        }
        
        if (location && event.city !== location) {
            return false;
        }
        
        if (fromDate && event.date < fromDate) {
            return false;
        }
        
        if (toDate && event.date > toDate) {
            return false;
        }
        
        return true;
    });
    

    filteredEvents.sort(function(a, b) {
        switch(sort) {
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });
    
    if (resultsCount) {
        resultsCount.textContent = 'Found ' + filteredEvents.length + ' events';
    }
    
    if (filteredEvents.length === 0) {
        container.innerHTML = '<p>No events found.</p>';
        return;
    }
    
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const eventsToShow = filteredEvents.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    eventsToShow.forEach(function(event) {
        const card = createEventCard(event);
        container.appendChild(card);
    });

    updatePagination();
}


function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    card.onclick = function() {
        window.location.href = 'landingpage.html?id=' + event.id;
    };
    
    const niceDate = formatDate(event.date);
    
    card.innerHTML = `
        <img src="${event.imageUrl}" alt="${event.title}">
        <span class="category">${event.category}</span>
        <div class="content">
            <h3>${event.title}</h3>
            <p class="meta">📅 ${niceDate} • 🕒 ${event.time}</p>
            <p class="meta">📍 ${event.locationName}</p>
            <p class="meta">🏙️ ${event.city}</p>
        </div>
    `;
    
    return card;
}


function updatePagination() {
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const paginationContainer = document.getElementById('pagination-container');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    prevBtn.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            showEvents();
            window.scrollTo(0, 0);
        }
    };
    
    nextBtn.onclick = function() {
        if (currentPage < totalPages) {
            currentPage++;
            showEvents();
            window.scrollTo(0, 0);
        }
    };

    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number';
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.onclick = function() {
            currentPage = i;
            showEvents();
            window.scrollTo(0, 0);
        };
        pageNumbers.appendChild(pageBtn);
    }
}

function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('location-filter').value = '';
    document.getElementById('from-date').value = '';
    document.getElementById('to-date').value = '';
    document.getElementById('sort-select').value = 'date-asc';
    
    currentPage = 1;
    showEvents();
}