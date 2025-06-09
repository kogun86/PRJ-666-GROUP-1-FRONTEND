'use client';

import Sidebar from '../features/sidebar/components/Sidebar';
import MobileNav from '../features/sidebar/components/MobileNav';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">{children}</main>
      <MobileNav />
    </div>
  );
};

export default Layout;
