import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MobileDrawer from './MobileDrawer';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ivory-200 dark:bg-navy-950 text-navy-900 dark:text-ivory-100 transition-colors duration-300 flex flex-col font-arabic">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div key={location.pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ivory-300 dark:border-navy-800 bg-white/50 dark:bg-navy-900/50 py-6 text-center text-xs font-semibold text-navy-600 dark:text-navy-400">
        <div className="max-w-7xl mx-auto px-4">
          بيت الثقافة بحائل &copy; {new Date().getFullYear()} — نظام إدارة وتتبع الأجهزة الرقمية
        </div>
      </footer>
    </div>
  );
}
