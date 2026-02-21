import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Gift, Home, LogOut, BookOpen, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import NotificationCenter from "@/components/shared/NotificationCenter";
import CurrencyToggle from "@/components/shared/CurrencyToggle";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, unreadCount } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return <>{children}</>;

  const navItems = getNavItems(currentUser.role);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <span className="text-xl font-bold text-primary">GiftForge</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-colors ${location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CurrencyToggle />
            <NotificationCenter />
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
              <span className="text-2xl font-medium">{currentUser.name[0]}</span>
              <span className="text-sm font-medium">{currentUser.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }} aria-label="Logout">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

function getNavItems(role: string) {
  switch (role) {
    case "grandparent":
      return [
        { path: "/grandparent", label: "Dashboard", icon: <Home size={20} /> },
        { path: "/grandparent/create-gift", label: "Create Gift", icon: <Gift size={20} /> },
        { path: "/educational", label: "Learn", icon: <BookOpen size={20} /> },
      ];
    case "grandchild":
      return [
        { path: "/grandchild", label: "My Gifts", icon: <Gift size={20} /> },
        { path: "/educational", label: "Learn", icon: <BookOpen size={20} /> },
      ];
    case "trustee":
      return [
        { path: "/trustee", label: "Oversight", icon: <Users size={20} /> },
      ];
    default:
      return [];
  }
}

export default AppLayout;
