import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Check, Edit, Gift, Loader2 } from "lucide-react";
import { DEMO_GRANDCHILDREN } from "@/data/mockData";
import { useVoiceGift } from "@/hooks/useVoiceGift";
import api from "@/lib/api";
import { toast } from "sonner";

type VoiceState = "idle" | "listening" | "parsing" | "parsed" | "confirmed" | "conversing";

const VoiceGiftCreation: React.FC = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [sessionData, setSessionData] = useState<any>(null);
  const { startListening, stopListening, isListening, isParsing, error } = useVoiceGift();

  const [parsedGift, setParsedGift] = useState({
    grandchildName: "",
    grandchildId: "",
    riskProfile: "Balanced" as const,
    corpus: 0,
    currency: "USD" as const,
    releaseCondition: "",
    message: "",
  });

  const handleToggleListening = async () => {
    if (isListening) {
      setVoiceState("parsing");
      const result = await stopListening();
      if (result) {
        if (result.is_confirmed) {
          const finalGift = result.gift_data;
          setParsedGift({
            grandchildName: finalGift.grandchild_name || "Arjun",
            grandchildId: "22222222-2222-2222-2222-222222222222",
            riskProfile: finalGift.risk_profile || "Balanced",
            corpus: Number(finalGift.corpus) || 1000,
            currency: finalGift.currency || "USD",
            releaseCondition: finalGift.rule_detail?.value || finalGift.rule_detail?.type || "Graduation",
            message: finalGift.message || "",
          });
          setVoiceState("parsed");
        } else {
          setSessionData(result);
          setVoiceState("conversing");
        }
      } else {
        setVoiceState("idle");
      }
    } else {
      setVoiceState("listening");
      await startListening();
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await api.post(`/gifts?grandparent_id=${currentUser!.id}`, {
        grandchild_id: parsedGift.grandchildId,
        grandchild_name: parsedGift.grandchildName,
        corpus: parsedGift.corpus,
        currency: parsedGift.currency.toUpperCase(),
        message: parsedGift.message || undefined,
        risk_profile: parsedGift.riskProfile.charAt(0).toUpperCase() + parsedGift.riskProfile.slice(1).toLowerCase(),
        rule_type: "Milestone",
        milestones: [
          { type: parsedGift.releaseCondition, percentage: 100 }
        ]
      });

      if (response.status === 201) {
        setVoiceState("confirmed");
        toast.success("Gift created successfully!");
        setTimeout(() => navigate("/grandparent"), 2000);
      }
    } catch (err) {
      console.error("Failed to save gift:", err);
      toast.error("Failed to create gift. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Voice Gift Creation 🎙️</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Speak naturally to create a legacy — we'll handle the rest
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8">
        {/* Left Side: Mic interface */}
        <div className="flex flex-col items-center space-y-8 bg-card rounded-3xl border-2 p-10 shadow-soft">
          <div className="flex justify-center py-4">
            <button
              onClick={handleToggleListening}
              className={`h-40 w-40 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${isListening
                ? "bg-destructive/10 border-8 border-destructive animate-pulse"
                : isParsing
                  ? "bg-primary/10 border-8 border-primary rounded-full"
                  : "bg-primary/10 border-8 border-primary hover:bg-primary/20"
                }`}
            >
              {isListening ? (
                <MicOff size={64} className="text-destructive" />
              ) : isParsing ? (
                <Loader2 size={64} className="text-primary animate-spin" />
              ) : (
                <Mic size={64} className="text-primary" />
              )}
            </button>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-2xl font-medium">
              {isListening ? "Listening... speak now" :
                isParsing ? "Working our magic..." :
                  voiceState === "conversing" ? "Tap Mic to Reply" :
                    voiceState === "parsed" ? "Does this look right?" :
                      voiceState === "confirmed" ? "Success! 🎉" :
                        "Tap to start speaking"}
            </p>

            {error && <p className="text-destructive font-bold">{error}</p>}
          </div>
        </div>

        {/* Right Side: Conversation / Results / Tips */}
        <div className="w-full flex justify-center flex-col min-h-[400px]">
          {voiceState === "conversing" && sessionData && (
            <div className="bg-card rounded-3xl border-2 border-primary/20 p-8 text-left space-y-4 shadow-xl animate-in fade-in slide-in-from-right-8">
              <div className="bg-secondary/30 p-4 rounded-xl">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">You said:</p>
                <p className="text-lg italic text-foreground">"{sessionData.user_said}"</p>
              </div>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                  GiftForge Assistant
                </p>
                <p className="text-xl text-foreground font-medium whitespace-pre-wrap">{sessionData.assistant_reply}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {voiceState === "parsed" && (
            <div className="bg-card rounded-3xl border-2 border-primary/20 p-8 text-left space-y-6 shadow-2xl animate-in fade-in slide-in-from-right-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary">Gift Summary</h3>
                <p className="text-muted-foreground text-lg">We understood your request as:</p>
              </div>

              <div className="grid gap-4 bg-secondary/30 rounded-2xl p-6 border">
                <Row label="Recipient" value={parsedGift.grandchildName} />
                <Row label="Corpus" value={`${parsedGift.currency === 'USD' ? '$' : '₹'}${parsedGift.corpus.toLocaleString()}`} />
                <Row label="Condition" value={parsedGift.releaseCondition} />
                <Row label="Strategy" value={parsedGift.riskProfile} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="xl" variant="warm" className="flex-1 text-xl py-8 rounded-2xl" onClick={handleConfirm}>
                  <Check className="mr-2 h-6 w-6" /> Everything is Correct
                </Button>
                {/* <Button size="xl" variant="outline" className="text-xl py-8 rounded-2xl" onClick={() => navigate("/grandparent/create-gift")}>
                  <Edit className="mr-2 h-6 w-6" /> Edit Manually
                </Button> */}
              </div>
            </div>
          )}

          {/* Tips */}
          {voiceState === "idle" && !isListening && !isParsing && (
            <div className="bg-white rounded-3xl border-2 border-primary/10 p-8 text-left shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-primary/20 p-2 rounded-lg">💡</span>
                Try saying something like:
              </h3>
              <ul className="space-y-4 text-muted-foreground text-lg italic">
                <li className="flex gap-2">
                  <span>"I want to create a balanced gift of five thousand dollars for Arjun for his graduation."</span>
                </li>
                <li className="flex gap-2">
                  <span>"Set up ten lakhs for my granddaughter Meera in a growth-focused fund."</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-primary/10 last:border-0">
    <span className="text-xl text-muted-foreground">{label}</span>
    <span className="text-xl font-bold text-foreground">{value}</span>
  </div>
);

export default VoiceGiftCreation;
