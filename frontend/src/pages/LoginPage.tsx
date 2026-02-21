import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { DEMO_USERS } from "@/data/mockData";

const roleDescriptions: Record<string, string> = {
  grandparent: "Create gifts, manage your portfolio, and leave messages for your grandchildren.",
  grandchild: "View your gifts, track progress, and submit milestone proofs.",
  trustee: "Oversee gift governance and milestone approvals.",
};

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (userId: string) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    login(userId);
    if (user?.role === "grandparent") navigate("/grandparent");
    else if (user?.role === "grandchild") navigate("/grandchild");
    else if (user?.role === "trustee") navigate("/trustee");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <span className="text-6xl block mb-4">🎁</span>
          <h1 className="text-4xl font-extrabold text-primary mb-2">GiftForge</h1>
          <p className="text-xl text-muted-foreground">
            Create meaningful gifts for the ones you love
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-lg font-semibold text-foreground mb-2">
            Choose your role to continue
          </p>
          {DEMO_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.id)}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-border bg-card hover:border-primary hover:shadow-warm transition-all text-left group"
            >
              <span className="text-4xl">{user.avatar}</span>
              <div className="flex-1">
                <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {user.name}
                </p>
                <p className="text-base text-muted-foreground capitalize mb-1">{user.role}</p>
                <p className="text-sm text-muted-foreground">{roleDescriptions[user.role]}</p>
              </div>
              <span className="text-2xl text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          This is a demo application. Choose any role to explore.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
