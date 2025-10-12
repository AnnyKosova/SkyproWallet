import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  const DEBOUNCE_TIME = 150;

  const debounce = (fn, ms) => {
    let timerId;
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  useEffect(() => {
    const debouncedResizeHandler = debounce(
      () => setSize([window.innerWidth, window.innerHeight]),
      DEBOUNCE_TIME
    );
    window.addEventListener('resize', debouncedResizeHandler);
    return () => window.removeEventListener('resize', debouncedResizeHandler);
  }, []);

  return size;
};
