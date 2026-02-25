// Detecta si el dispositivo es móvil mediante user agent
export function isMobileDevice() {
    if (typeof window === 'undefined') return false;
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );
  }
  
  // Calcula altura de tabla según número de páginas
  export function calculateTableHeight(pageCount) {
    return pageCount > 1 ? '64vh' : '67.3vh';
  }
  
  // Trunca texto largo mostrando inicio y puntos suspensivos
  export function truncateText(text, maxLength = 50) {
    if (!text) return '';
    return text.length > maxLength 
      ? '${text.substring(0, maxLength / 2)}...'
      : text;
  }