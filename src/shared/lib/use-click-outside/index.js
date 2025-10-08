import { useEffect } from 'react';

export const useClickOutside = (elRef, setter) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!elRef.current?.contains(target)) {
        setter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
};
