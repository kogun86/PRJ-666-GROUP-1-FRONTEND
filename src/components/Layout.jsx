'use client';

import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

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
