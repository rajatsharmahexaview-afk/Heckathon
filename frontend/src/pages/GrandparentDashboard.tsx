import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useGifts } from "@/hooks/useGifts";
import { useSimulation } from "@/hooks/useSimulation";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Gift, TrendingUp, Wallet, PieChart, Plus, Mic, Globe, Loader2, Info } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { toast } from "sonner";

const GrandparentDashboard: React.FC = () => {
  const { currentUser, toggleCurrency, currency } = useApp();
  const { gifts, isLoading: giftsLoading } = useGifts(currentUser?.id, 'grandparent');
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const { projection, isLoading: simLoading } = useSimulation(selectedGiftId || (gifts && gifts.length > 0 ? gifts[0].id : undefined));

  if (giftsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-xl font-medium text-muted-foreground">Analyzing your legacy portfolio...</p>
      </div>
    );
  }

  const activeGiftsCount = gifts?.filter(g => g.status === 'Active').length || 0;
  const totalCorpus = gifts?.reduce((sum, g) => sum + Number(g.corpus), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header with Global Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            Legacy Portal 👋
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Managing <span className="text-primary font-bold">{gifts?.length || 0}</span> generational gifts
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Button size="xl" variant="outline" className="flex-1 md:flex-none rounded-2xl border-2 font-bold h-16 px-8" onClick={toggleCurrency}>
            <Globe className="mr-2 h-5 w-5" /> View in {currency === "USD" ? "INR (₹)" : "USD ($)"}
          </Button>
          <Link to="/grandparent/create-gift" className="flex-1 md:flex-none">
            <Button size="xl" variant="warm" className="w-full rounded-2xl font-black h-16 px-8 shadow-lg">
              <Plus className="mr-2 h-6 w-6" /> Create Gift
            </Button>
          </Link>
          <Link to="/grandparent/voice-gift" className="flex-1 md:flex-none">
            <Button size="xl" variant="outline" className="w-full rounded-2xl border-2 border-primary/20 font-bold h-16 px-8">
              <Mic className="mr-2 h-5 w-5 text-primary" /> Voice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PortfolioCard
          icon={<div className="p-3 bg-primary/10 rounded-2xl"><Wallet className="text-primary" size={24} /></div>}
          label="Estimated Net Value"
          amount={totalCorpus}
          currency="USD"
        />
        <PortfolioCard
          icon={<div className="p-3 bg-accent/10 rounded-2xl"><Gift className="text-accent" size={24} /></div>}
          label="Active Protections"
          count={activeGiftsCount}
        />
        <PortfolioCard
          icon={<div className="p-3 bg-success/10 rounded-2xl"><TrendingUp className="text-success" size={24} /></div>}
          label="Projected Yield"
          percentage="+9.2%"
        />
        <PortfolioCard
          icon={<div className="p-3 bg-blue-100 rounded-2xl"><PieChart className="text-blue-600" size={24} /></div>}
          label="Family Coverage"
          count={gifts?.length || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gift Explorer (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Gift className="text-primary" /> Your Active Gifts
            </h2>
            <p className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full flex items-center gap-1">
              <Info size={14} /> Tap a gift to see projections
            </p>
          </div>

          <div className="grid gap-4">
            {(!gifts || gifts.length === 0) ? (
              <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-primary/20">
                <Gift size={64} className="mx-auto mb-4 text-primary/20" />
                <p className="text-2xl font-bold text-muted-foreground/50">Start your legacy today</p>
                <Link to="/grandparent/create-gift">
                  <Button variant="link" className="text-primary text-lg mt-2 underline">Create your first gift →</Button>
                </Link>
              </div>
            ) : (
              gifts.map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => setSelectedGiftId(gift.id)}
                  className={`group relative overflow-hidden bg-card rounded-3xl border-2 p-6 transition-all hover:shadow-xl text-left ${selectedGiftId === gift.id ? "border-primary ring-4 ring-primary/5" : "border-border hover:border-primary/30"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {gift.grandchild_name?.[0] || '🎁'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-foreground">{gift.grandchild_name || 'Grandchild'}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs font-bold uppercase tracking-wider bg-primary/5 text-primary-700 px-2 py-1 rounded-md">
                            {gift.rule_type}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider bg-secondary px-2 py-1 rounded-md">
                            {gift.risk_profile}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">
                        <CurrencyDisplay amount={Number(gift.corpus)} originalCurrency={gift.currency} />
                      </p>
                      <StatusBadge status={gift.status} />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Growth Simulation (1/3 width) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <TrendingUp className="text-success" /> Projection
          </h2>
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl min-h-[400px] flex flex-col">
            {simLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-bold">Calculating returns...</p>
              </div>
            ) : projection && projection.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Simulated Future Value</p>
                  <h3 className="text-4xl font-black mt-1 text-success">
                    <CurrencyDisplay amount={projection[projection.length - 1].value} originalCurrency="USD" />
                  </h3>
                  <p className="text-slate-500 text-sm mt-2">Projection for 15 years based on {gifts?.find(g => g.id === selectedGiftId)?.risk_profile || 'Balanced'} strategy.</p>
                </div>

                <div className="flex-1 h-48 -mx-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projection}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                        itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#4ade80"
                        fill="url(#chartGrad)"
                        strokeWidth={4}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between text-sm font-bold text-slate-400">
                  <span>Year 0</span>
                  <span>Year 15</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <TrendingUp size={64} />
                <p className="text-xl font-bold">Select a gift <br />to see growth</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  amount?: number;
  currency?: "USD" | "INR";
  count?: number;
  percentage?: string;
}> = ({ icon, label, amount, currency: cur, count, percentage }) => (
  <div className="bg-card rounded-3xl border-2 p-6 shadow-soft hover:border-primary/20 transition-all">
    <div className="flex items-center gap-4 mb-4">
      {icon}
      <span className="text-base font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
    {amount !== undefined ? (
      <p className="text-3xl font-black text-foreground">
        <CurrencyDisplay amount={amount} originalCurrency={cur || "USD"} />
      </p>
    ) : percentage ? (
      <p className="text-3xl font-black text-success">{percentage}</p>
    ) : (
      <p className="text-3xl font-black text-foreground">{count}</p>
    )}
  </div>
);

export default GrandparentDashboard;
