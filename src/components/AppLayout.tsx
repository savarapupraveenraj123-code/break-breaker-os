import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  BarChart3,
  Bot,
  Shield,
  Settings,
  Bike,
  Menu,
  X,
  AlertTriangle,
  Power,
  Wifi,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/history', icon: History, label: 'Ride History' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/safety', icon: Shield, label: 'Safety' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  isRiding: boolean;
  onToggleRide: () => void;
  faultCount: number;
}

export default function AppLayout({ children, isRiding, onToggleRide, faultCount }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-20 border-r border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center justify-center h-16 border-b border-border/50">
          <Bike size={28} className="text-primary" />
        </div>
        <nav className="flex-1 flex flex-col items-center py-4 gap-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all group ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
                <item.icon size={20} />
                <span className="text-[9px] mt-1 font-body tracking-wider">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        {faultCount > 0 && (
          <div className="flex items-center justify-center pb-4">
            <div className="w-10 h-10 rounded-full bg-neon-red/10 border border-neon-red/30 flex items-center justify-center animate-pulse-glow">
              <AlertTriangle size={18} className="text-neon-red" />
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border/50 z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Bike size={24} className="text-primary" />
                <span className="font-display text-sm gradient-neon-text tracking-widest">BREAK BREAKER</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-body text-sm">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
              <Menu size={22} />
            </button>
            <h1 className="font-display text-lg font-bold gradient-neon-text tracking-widest">
              BREAK BREAKER
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <Wifi size={12} className="text-neon-green" />
              <span className="text-[10px] text-muted-foreground font-mono">CONNECTED</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {faultCount > 0 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30"
              >
                <AlertTriangle size={14} className="text-neon-red" />
                <span className="text-xs font-display text-neon-red">{faultCount}</span>
              </motion.div>
            )}
            <button
              onClick={onToggleRide}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-display text-xs tracking-wider transition-all ${
                isRiding
                  ? 'bg-neon-red/20 text-neon-red border border-neon-red/40 glow-red'
                  : 'bg-neon-green/20 text-neon-green border border-neon-green/40 glow-green'
              }`}
            >
              <Power size={14} />
              {isRiding ? 'STOP' : 'START'}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
