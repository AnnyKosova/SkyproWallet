import { Outlet } from 'react-router-dom';
import { Header } from '@/shared/ui/header';

export const Layout = () => {
  return (
    <div>
      <Header isMain={true} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
