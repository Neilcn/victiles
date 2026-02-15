document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('masonry-grid');
  const items = Array.from(grid.querySelectorAll('.masonry-item'));
  const clearBtn = document.getElementById('clear-filters');
  
  const activeFilters = {
    room: null,
    colour: null,
    style: null
  };

  // Helper to normalize strings directly from data attributes
  // We use the exact string from input to allow case-insensitive matching if needed, 
  // but usually users want exact matches visually. We'll trim.
  // Data attributes are already populated.
  
  function getUniqueValues(attributeName) {
    const values = new Set();
    items.forEach(item => {
      const val = item.getAttribute(`data-${attributeName}`);
      if (val) {
        values.add(val.trim());
      }
    });
    return Array.from(values).sort();
  }

  function createButtons(groupName, values) {
    const container = document.querySelector(`#filter-group-${groupName} .filter-buttons`);
    if(!container) return;

    values.forEach(val => {
      if(!val) return;
      
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn';
      btn.textContent = val;
      btn.dataset.value = val;
      btn.dataset.group = groupName;
      
      btn.addEventListener('click', () => {
        toggleFilter(groupName, val, btn);
      });
      
      container.appendChild(btn);
    });
  }

  function toggleFilter(group, value, btnElement) {
    // If clicking active button, deselect it
    if (activeFilters[group] === value) {
      activeFilters[group] = null;
      btnElement.classList.remove('active');
    } else {
      // Deselect other buttons in same group
      const buttons = document.querySelectorAll(`#filter-group-${group} .filter-btn`);
      buttons.forEach(b => b.classList.remove('active'));
      
      // Select new
      activeFilters[group] = value;
      btnElement.classList.add('active');
    }
    
    applyFilters();
  }

  function applyFilters() {
    let hasActiveFilters = false;
    
    items.forEach(item => {
      let isVisible = true;
      
      for (const [key, filterValue] of Object.entries(activeFilters)) {
        if (filterValue) {
          hasActiveFilters = true;
          const itemValue = item.getAttribute(`data-${key}`);
          // Simple string match. Could be case-insensitive if desired: 
          // if (itemValue.toLowerCase() !== filterValue.toLowerCase())
          if (itemValue !== filterValue) {
            isVisible = false;
            break;
          }
        }
      }
      
      if (isVisible) {
        item.classList.remove('hidden');
        // Trigger a re-layout or animation if using a JS masonry library
      } else {
        item.classList.add('hidden');
      }
    });

    if (hasActiveFilters) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }
  }

  clearBtn.addEventListener('click', () => {
    // Reset state
    for (const key in activeFilters) {
      activeFilters[key] = null;
    }
    // Remove active classes
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    applyFilters();
  });

  // Initialize
  ['room', 'colour', 'style'].forEach(group => {
    const values = getUniqueValues(group);
    createButtons(group, values);
  });
});
