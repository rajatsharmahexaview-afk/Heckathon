import React from "react";
import { useApp } from "@/contexts/AppContext";
import { useGifts } from "@/hooks/useGifts";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle, PauseCircle, ArrowRightCircle, Eye, Shield, Loader2, AlertTriangle } from "lucide-react";
import { TRUSTEE_AUTO_APPROVAL } from "@/config/constants";
import { toast } from "sonner";

const TrusteeDashboard: React.FC = () => {
  const { currentUser } = useApp();
  const { gifts, isLoading, submitMilestone, isSubmitting } = useGifts(currentUser?.id, 'trustee');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-xl font-medium text-muted-foreground">Syncing governance records...</p>
      </div>
    );
  }

  const handleApprove = async (gift: any) => {
    // For demo, we just approve the first pending milestone
    const pendingMilestone = gift.milestones?.find((m: any) => m.status === 'Pending');
    if (!pendingMilestone) {
      toast.error("No pending milestones found for this gift.");
      return;
    }

    try {
      await submitMilestone(pendingMilestone.id);
      toast.success(`Milestone '${pendingMilestone.type}' approved successfully!`);
    } catch (err) {
      toast.error("Failed to approve milestone.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            Oversight Center <Shield className="text-primary" size={36} />
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Managing <span className="text-primary font-bold">{gifts?.length || 0}</span> protected legacies
          </p>
        </div>
        {TRUSTEE_AUTO_APPROVAL && (
          <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-sm">
            <AlertTriangle size={24} />
            <div>
              <p className="font-black leading-none">Simulation Mode</p>
              <p className="text-sm font-medium mt-1">Actions bypass manual review</p>
            </div>
          </div>
        )}
      </div>

      {(!gifts || gifts.length === 0) ? (
        <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed">
          <Shield size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-2xl font-bold text-muted-foreground/50">No legacies requiring oversight</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {gifts.map((gift) => (
            <div key={gift.id} className="bg-card rounded-3xl border-2 p-8 shadow-soft hover:shadow-xl transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-4xl shadow-inner">
                    🎁
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-foreground">{gift.grandchild_name || 'Grandchild'}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs font-bold uppercase tracking-widest bg-secondary px-3 py-1 rounded-full">{gift.rule_type}</span>
                      <span className="text-xs font-bold uppercase tracking-widest bg-primary/5 text-primary px-3 py-1 rounded-full">{gift.risk_profile} Strategy</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Asset Value</p>
                    <p className="text-3xl font-black text-primary">
                      <CurrencyDisplay amount={Number(gift.corpus)} originalCurrency={gift.currency} />
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border hidden sm:block" />
                  <StatusBadge status={gift.status} />
                </div>
              </div>

              {/* Gift Details Table */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-secondary/20 rounded-3xl p-6 border border-border/50">
                <DetailItem label="Total Corpus" value={<CurrencyDisplay amount={Number(gift.corpus)} originalCurrency={gift.currency} />} />
                <DetailItem label="Next Threshold" value={gift.milestones?.find((m: any) => m.status === 'Pending')?.type || "None Pending"} />
                <DetailItem label="Rule Compliance" value="100% Secure" success />
                <DetailItem label="Auto-Disburse" value="Active" success />
              </div>

              {/* Governance Actions */}
              <div className="flex flex-wrap gap-4 pt-6 border-t">
                <Button size="xl" variant="warm" className="rounded-2xl h-14 px-8 font-black shadow-lg hover:scale-105 transition-transform"
                  onClick={() => handleApprove(gift)}
                  disabled={isSubmitting || gift.status === 'Completed'}
                >
                  <CheckCircle className="mr-2" size={20} />
                  {isSubmitting ? "Processing..." : "Approve Milestone"}
                </Button>
                <Button size="xl" variant="outline" className="rounded-2xl h-14 px-8 border-2 font-bold hover:bg-secondary">
                  <Eye className="mr-2" size={20} /> Audit Proofs
                </Button>
                <div className="flex-1" />
                <Button size="xl" variant="ghost" className="rounded-2xl h-14 px-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <PauseCircle className="mr-2" size={20} /> Suspend Rule
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: React.ReactNode; success?: boolean }> = ({ label, value, success }) => (
  <div>
    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-lg font-black ${success ? "text-success" : "text-foreground"}`}>{value}</p>
  </div>
);

export default TrusteeDashboard;
