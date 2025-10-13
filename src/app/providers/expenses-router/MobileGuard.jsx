import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const CHANGE_VIEW = 1200;

export const MobileGuardProvider = ({children}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= CHANGE_VIEW);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= CHANGE_VIEW);
    document.addEventListener('resize', handler);
    return () => document.removeEventListener('resize', handler);
  }, []);

  if (!isMobile) return <Navigate to={'/expenses'} replace />;

  return children
};
