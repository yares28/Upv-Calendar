(function() {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  // Add preloading class to prevent transition flashes
  document.documentElement.classList.add('theme-preloading');
  
  try {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem('theme');
    
    // Check system preference if no stored preference
    if (!storedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } else if (storedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Remove preloading class after a short delay to enable transitions
    window.addEventListener('load', function() {
      setTimeout(function() {
        document.documentElement.classList.remove('theme-preloading');
      }, 300);
    });
  } catch (error) {
    console.warn('Theme initialization error:', error);
  }
})(); 