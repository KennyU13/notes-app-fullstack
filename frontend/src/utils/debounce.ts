import { useEffect, useState } from 'react';

export function useDebounce<T>(valeur: T, delai = 300) {
  const [debounced, setDebounced] = useState(valeur);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(valeur), delai);
    return () => window.clearTimeout(timer);
  }, [valeur, delai]);
  return debounced;
}
