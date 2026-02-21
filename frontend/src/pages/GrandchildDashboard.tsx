import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useGifts } from "@/hooks/useGifts";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Gift, TrendingUp, Clock, Upload, AlertTriangle, BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MOCK_GROWTH_DATA } from "@/data/mockData";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const GrandchildDashboard: React.FC = () => {
  const { currentUser } = useApp();
  const { gifts, isLoading, submitMilestone, isSubmitting } = useGifts(currentUser?.id, 'grandchild');
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [gpaValue, setGpaValue] = useState("");
  const [gpaResult, setGpaResult] = useState<"pass" | "fail" | null>(null);

  const activeGift = selectedGiftId ? gifts?.find((g) => g.id === selectedGiftId) : null;

  const handleGpaCheck = (threshold: number) => {
    const gpa = parseFloat(gpaValue);
    if (isNaN(gpa)) return;
    setGpaResult(gpa >= threshold ? "pass" : "fail");
  };

  const handleSubmitProof = async (milestoneId: string) => {
    try {
      await submitMilestone(milestoneId);
      toast.success("Proof submitted and auto-approved! (Demo Mode)");
    } catch (err) {
      toast.error("Failed to submit proof. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-xl font-medium text-muted-foreground">Loading your gifts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">My Gifts 🎁</h1>
        <p className="text-lg text-muted-foreground mt-1">Track your growth and claim milestones</p>
      </div>

      {(!gifts || gifts.length === 0) ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed">
          <Gift size={56} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-xl font-medium text-muted-foreground">No gifts assigned to you yet</p>
          <p className="text-sm text-muted-foreground mt-2">When your grandparents create one, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gift Cards List */}
          <div className="space-y-4">
            {gifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => setSelectedGiftId(gift.id)}
                className={`w-full text-left bg-card rounded-3xl border-2 p-6 transition-all shadow-soft active:scale-[0.98] ${selectedGiftId === gift.id ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-primary/30"
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-inner">🎁</div>
                    <div>
                      <p className="font-extrabold text-xl capitalize">{gift.rule_type}-Based</p>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{gift.risk_profile} Strategy</p>
                    </div>
                  </div>
                  <StatusBadge status={gift.status} />
                </div>
                <div className="flex items-center justify-between bg-secondary/30 rounded-2xl p-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Current Value</p>
                    <p className="text-2xl font-black text-primary">
                      <CurrencyDisplay amount={gift.corpus} originalCurrency={gift.currency} />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Next Release</p>
                    <p className="text-base font-bold flex items-center gap-1 justify-end">
                      <Clock size={18} className="text-warm-600" /> {gift.milestones.find(m => m.status === 'Pending')?.type || "None"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="space-y-6">
            {activeGift ? (
              <>
                {/* Growth Visualization */}
                <div className="bg-card rounded-3xl border p-6 shadow-soft">
                  <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                    <TrendingUp size={24} className="text-success" /> Wealth Projection
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_GROWTH_DATA}>
                        <defs>
                          <linearGradient id="gcGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(35, 85%, 48%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(35, 85%, 48%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{ borderRadius: "16px", border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="hsl(35, 85%, 48%)" fill="url(#gcGrad)" strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="bg-card rounded-3xl border p-6 shadow-soft space-y-4">
                  <h3 className="text-xl font-extrabold flex items-center gap-2">
                    <CheckCircle2 size={24} className="text-primary" /> Milestones
                  </h3>
                  <div className="space-y-3">
                    {activeGift.milestones.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-primary/5">
                        <div>
                          <p className="font-bold text-lg">{m.type}</p>
                          <p className="text-sm text-muted-foreground">{m.percentage}% of total corpus</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {m.status === 'Pending' ? (
                            <Button
                              size="sm"
                              className="rounded-xl px-4 py-5 text-base font-bold"
                              onClick={() => handleSubmitProof(m.id)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? <Loader2 className="animate-spin" /> : <Upload size={18} className="mr-2" />}
                              Submit Proof
                            </Button>
                          ) : (
                            <div className="px-4 py-2 bg-success/10 text-success rounded-xl font-bold flex items-center gap-1">
                              <CheckCircle2 size={16} /> Approved
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-4">
                  <Button size="xl" variant="outline" className="flex-1 rounded-2xl text-lg h-16 font-extrabold" onClick={() => setShowWithdrawal(!showWithdrawal)}>
                    <AlertTriangle size={20} className="mr-2" /> Emergency Fund
                  </Button>
                </div>

                {showWithdrawal && (
                  <div className="bg-destructive/5 rounded-3xl border-2 border-destructive/20 p-6 animate-in zoom-in-95">
                    <h3 className="text-xl font-extrabold text-destructive mb-3">Emergency Access</h3>
                    <p className="text-muted-foreground mb-6">Restricted to medical emergencies or essential education. Requires trustee verification.</p>
                    <div className="space-y-4">
                      <select className="w-full px-5 py-4 rounded-2xl border-2 border-input bg-background text-lg font-medium focus:ring-2 ring-destructive/20 outline-none">
                        <option>Higher Education Fee</option>
                        <option>Medical Emergency</option>
                        <option>Critical Travel</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Amount to request"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-input bg-background text-lg font-medium outline-none"
                      />
                      <Button size="xl" variant="destructive" className="w-full h-16 rounded-2xl text-xl font-black">
                        Submit Request
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-card rounded-3xl border-4 border-dashed p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                <Gift size={64} className="opacity-10 mb-4" />
                <p className="text-2xl font-bold opacity-30">Select a gift to see your journey</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Educational Hub */}
      <div className="bg-gradient-to-r from-primary/10 to-warm-100 rounded-3xl border-2 border-primary/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">📘</div>
          <div>
            <h3 className="text-2xl font-black">Financial Literacy Hub</h3>
            <p className="text-lg text-muted-foreground">Master the art of wealth management and compound growth.</p>
          </div>
        </div>
        <Link to="/educational" className="w-full md:w-auto">
          <Button size="xl" className="w-full md:w-auto rounded-2xl font-black text-lg px-10 h-16 shadow-lg">
            Start Learning →
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GrandchildDashboard;
