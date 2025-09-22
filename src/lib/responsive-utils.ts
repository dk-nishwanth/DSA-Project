// Responsive Design Utilities for DSA Project
// Provides consistent responsive breakpoints and utilities across the entire website

export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const RESPONSIVE_CLASSES = {
  // Container classes for different screen sizes
  container: {
    mobile: 'px-4 py-3',
    tablet: 'sm:px-6 sm:py-4',
    desktop: 'lg:px-8 lg:py-6',
  },
  
  // Grid layouts
  grid: {
    // Responsive grid for code editors
    codeEditor: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    webEditor: 'grid grid-cols-1 xl:grid-cols-2 gap-4',
    
    // Responsive grid for cards/components
    cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
    twoColumn: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  },
  
  // Text sizing
  text: {
    heading: 'text-lg sm:text-xl lg:text-2xl',
    subheading: 'text-base sm:text-lg lg:text-xl',
    body: 'text-sm sm:text-base',
    caption: 'text-xs sm:text-sm',
  },
  
  // Spacing
  spacing: {
    section: 'py-8 sm:py-12 lg:py-16',
    component: 'p-3 sm:p-4 lg:p-6',
    tight: 'p-2 sm:p-3',
  },
  
  // Button sizes
  button: {
    responsive: 'px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base',
    icon: 'p-2 sm:p-3',
  },
  
  // Editor heights
  editor: {
    small: 'h-48 sm:h-64',
    medium: 'h-64 sm:h-80',
    large: 'h-80 sm:h-96',
    maximized: 'h-[40vh] sm:h-[50vh] lg:h-[60vh]',
  },
  
  // Flex utilities
  flex: {
    responsive: 'flex flex-col sm:flex-row',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    wrap: 'flex flex-wrap items-center',
  },
} as const;

// Utility function to combine responsive classes
export const combineResponsiveClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Hook for detecting screen size
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      screenSize: 'desktop' as const,
    };
  }

  const width = window.innerWidth;
  
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    screenSize: width < 640 ? 'mobile' as const : 
               width < 1024 ? 'tablet' as const : 
               'desktop' as const,
  };
};

// Responsive configuration for different components
export const COMPONENT_RESPONSIVE_CONFIG = {
  codePlayground: {
    container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    header: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
    tabs: 'flex flex-col sm:flex-row flex-wrap gap-2',
    editor: 'w-full p-3 sm:p-4 text-sm sm:text-base',
    preview: 'h-64 sm:h-80 md:h-96',
  },
  
  dashboard: {
    container: 'container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12',
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
    card: 'p-4 sm:p-6 rounded-lg border',
  },
  
  navigation: {
    container: 'flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4',
    menu: 'hidden md:flex items-center space-x-6',
    mobileMenu: 'md:hidden',
  },
  
  forms: {
    container: 'space-y-4 sm:space-y-6',
    input: 'w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base',
    button: 'w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3',
  },
} as const;

// Media query helpers
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.sm})`,
  tablet: `(min-width: ${BREAKPOINTS.sm}) and (max-width: ${BREAKPOINTS.lg})`,
  desktop: `(min-width: ${BREAKPOINTS.lg})`,
  
  // Specific breakpoints
  xs: `(min-width: ${BREAKPOINTS.xs})`,
  sm: `(min-width: ${BREAKPOINTS.sm})`,
  md: `(min-width: ${BREAKPOINTS.md})`,
  lg: `(min-width: ${BREAKPOINTS.lg})`,
  xl: `(min-width: ${BREAKPOINTS.xl})`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']})`,
} as const;

// Responsive font sizes
export const FONT_SIZES = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-3xl sm:text-4xl',
} as const;

// Responsive spacing
export const SPACING = {
  xs: 'p-2 sm:p-3',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-12',
} as const;

// Export default responsive configuration
export const DEFAULT_RESPONSIVE_CONFIG = {
  breakpoints: BREAKPOINTS,
  classes: RESPONSIVE_CLASSES,
  components: COMPONENT_RESPONSIVE_CONFIG,
  mediaQueries: MEDIA_QUERIES,
  fontSizes: FONT_SIZES,
  spacing: SPACING,
} as const;
