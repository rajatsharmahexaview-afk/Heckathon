import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, Gift, Notification, Currency, Grandchild } from "@/types/gift";
import { DEMO_USERS, DEMO_GIFTS, DEMO_NOTIFICATIONS, DEMO_GRANDCHILDREN } from "@/data/mockData";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  gifts: Gift[];
  notifications: Notification[];
  currency: Currency;
  login: (userId: string) => void;
  logout: () => void;
  switchRole: (userId: string) => void;
  toggleCurrency: () => void;
  addGift: (gift: Gift) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  unreadCount: number;
  grandchildren: Grandchild[];
  addGrandchild: (gc: Grandchild) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gifts, setGifts] = useState<Gift[]>(DEMO_GIFTS);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [grandchildren, setGrandchildren] = useState<Grandchild[]>(() => {
    const saved = localStorage.getItem("giftforge_grandchildren");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_GRANDCHILDREN;
      }
    }
    return DEMO_GRANDCHILDREN;
  });

  useEffect(() => {
    localStorage.setItem("giftforge_grandchildren", JSON.stringify(grandchildren));
  }, [grandchildren]);

  const login = useCallback((userId: string) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);
  const switchRole = useCallback((userId: string) => login(userId), [login]);
  const toggleCurrency = useCallback(() => setCurrency((c) => (c === "USD" ? "INR" : "USD")), []);

  const addGift = useCallback((gift: Gift) => {
    setGifts((prev) => [...prev, gift]);
    addNotification({
      id: `notif-${Date.now()}`,
      recipient_id: gift.grandparent_id,
      role: "grandparent",
      event_type: "gift_created",
      message: `Gift for ${gift.grandchild_name} created successfully!`,
      is_read: false,
      created_at: new Date().toISOString(),
    });
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
  }, []);

  const userNotifications = currentUser
    ? notifications.filter((n) => n.recipient_id === currentUser.id)
    : [];

  const unreadCount = userNotifications.filter((n) => !n.is_read).length;

  const addGrandchild = useCallback((gc: Grandchild) => {
    setGrandchildren((prev) => [...prev, gc]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: DEMO_USERS,
        gifts,
        notifications: userNotifications,
        currency,
        login,
        logout,
        switchRole,
        toggleCurrency,
        addGift,
        addNotification,
        markNotificationRead,
        unreadCount,
        grandchildren,
        addGrandchild,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
