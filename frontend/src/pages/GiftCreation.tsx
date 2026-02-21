import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { MILESTONES, BEHAVIOR_CONDITIONS, RISK_PROFILES, DEMO_NGOS } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Gift as GiftIcon, User, Settings, BarChart3, MessageSquare, Loader2 } from "lucide-react";
import type { RuleType, RiskProfile, Currency } from "@/types/gift";
import { useGifts } from "@/hooks/useGifts";
import { toast } from "sonner";
import api from "@/lib/api";

const STEPS = [
  { label: "Grandchild", icon: <User size={20} /> },
  { label: "Rule Type", icon: <Settings size={20} /> },
  { label: "Investment", icon: <BarChart3 size={20} /> },
  { label: "Message", icon: <MessageSquare size={20} /> },
  { label: "Confirm", icon: <Check size={20} /> },
];

const GiftCreation: React.FC = () => {
  const { currentUser, grandchildren: allGrandchildren } = useApp();
  const { createGift, isCreating } = useGifts(currentUser?.id, "grandparent");
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Form state
  const [selectedChild, setSelectedChild] = useState("");
  const [ruleType, setRuleType] = useState<RuleType>("Time");
  const [atAge, setAtAge] = useState("18");
  const [selectedMilestone, setSelectedMilestone] = useState<string>(MILESTONES[0]);
  const [selectedBehavior, setSelectedBehavior] = useState<string>(BEHAVIOR_CONDITIONS[0]);
  const [gpaThreshold, setGpaThreshold] = useState("3.5");
  const [fallback, setFallback] = useState<"push_next" | "redirect_ngo">("push_next");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Balanced");
  const [corpus, setCorpus] = useState("10000");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [ngoId, setNgoId] = useState(DEMO_NGOS[0].id);
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const grandchildren = allGrandchildren.filter((gc) => gc.linkedGrandparentId === currentUser?.id);
  const selectedChildObj = grandchildren.find((gc) => gc.id === selectedChild);

  const canProceed = () => {
    if (step === 0) return !!selectedChild;
    if (step === 1) return true;
    if (step === 2) return parseFloat(corpus) > 0;
    return true;
  };

  const handleCreate = async () => {
    try {
      const payload = {
        grandchild_id: selectedChild,
        grandchild_name: selectedChildObj?.name || "",
        corpus: parseFloat(corpus),
        currency,
        message,
        risk_profile: riskProfile,
        rule_type: ruleType,
        fallback_ngo_id: fallback === "redirect_ngo" ? ngoId : undefined,
        milestones: [
          {
            type: ruleType === "Time" ? `Age ${atAge}` : ruleType === "Milestone" ? selectedMilestone : selectedBehavior,
            percentage: 100
          }
        ]
      };

      const createdGift = await createGift(payload);

      if (mediaFile && currentUser) {
        toast.loading("Uploading media...");
        const fileType = mediaFile.type.startsWith("image/") ? "photo" :
          mediaFile.type.startsWith("video/") ? "video" :
            mediaFile.type.startsWith("audio/") ? "audio" : "text";

        const formData = new FormData();
        formData.append("gift_id", createdGift.id);
        formData.append("uploader_id", currentUser.id);
        formData.append("type", fileType);
        formData.append("file", mediaFile);

        await api.post("/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.dismiss();
      }

      toast.success("Gift created successfully!");
      navigate("/grandparent");
    } catch (error) {
      console.error("Failed to create gift:", error);
      toast.error("Failed to create gift. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Create a Gift 🎁</h1>
        <p className="text-lg text-muted-foreground mt-1">Set up a meaningful gift in a few easy steps</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`flex items-center justify-center h-10 w-10 rounded-full text-base font-bold transition-all ${i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
              {i < step ? <Check size={18} /> : i + 1}
            </div>
            <span className={`hidden sm:block text-sm font-medium ml-1 ${i === step ? "text-primary" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <div className={`w-6 sm:w-12 h-0.5 mx-1 ${i < step ? "bg-success" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl border p-6 shadow-soft min-h-[300px]">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Select Grandchild</h2>
            <p className="text-muted-foreground">Who is this gift for?</p>
            <div className="space-y-3">
              {grandchildren.map((gc) => (
                <button
                  key={gc.id}
                  onClick={() => setSelectedChild(gc.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${selectedChild === gc.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                >
                  <p className="text-lg font-bold">{gc.name}</p>
                  <p className="text-muted-foreground">Age: {gc.age} • Born: {gc.dateOfBirth}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Choose Rule Type</h2>
            <p className="text-muted-foreground">How should this gift be released?</p>
            <div className="space-y-3">
              {(["Time", "Milestone", "Behavior"] as RuleType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setRuleType(type)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${ruleType === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                >
                  <p className="text-lg font-bold capitalize">{type}-Based</p>
                  <p className="text-muted-foreground">
                    {type === "Time" && "Release at a specific age, after years, or on a date"}
                    {type === "Milestone" && "Release when a life milestone is achieved"}
                    {type === "Behavior" && "Release based on academic or financial behavior"}
                  </p>
                </button>
              ))}
            </div>

            {/* Rule Options */}
            <div className="mt-4 p-4 bg-secondary/50 rounded-xl space-y-3">
              {ruleType === "Time" && (
                <div>
                  <label className="text-base font-semibold block mb-2">Release at Age</label>
                  <input
                    type="number" min="1" max="100" value={atAge}
                    onChange={(e) => setAtAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-lg"
                  />
                </div>
              )}
              {ruleType === "Milestone" && (
                <div>
                  <label className="text-base font-semibold block mb-2">Select Milestone</label>
                  <select value={selectedMilestone} onChange={(e) => setSelectedMilestone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-base">
                    {MILESTONES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
              {ruleType === "Behavior" && (
                <>
                  <div>
                    <label className="text-base font-semibold block mb-2">Behavior Condition</label>
                    <select value={selectedBehavior} onChange={(e) => setSelectedBehavior(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-base">
                      {BEHAVIOR_CONDITIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {selectedBehavior === "Maintain GPA above threshold" && (
                    <div>
                      <label className="text-base font-semibold block mb-2">GPA Threshold</label>
                      <input type="number" step="0.1" min="0" max="4" value={gpaThreshold}
                        onChange={(e) => setGpaThreshold(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-lg" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Investment Setup</h2>
            <p className="text-muted-foreground">Choose how the gift should grow</p>
            <div>
              <label className="text-base font-semibold block mb-2">Risk Profile</label>
              <div className="grid grid-cols-3 gap-3">
                {RISK_PROFILES.map((profile) => (
                  <button key={profile} onClick={() => setRiskProfile(profile)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${riskProfile === profile ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}>
                    <p className="font-bold">{profile}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile === "Conservative" && "6% CAGR"}
                      {profile === "Balanced" && "10% CAGR"}
                      {profile === "Growth" && "14% CAGR"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-base font-semibold block mb-2">Gift Amount</label>
                <input type="number" min="100" value={corpus}
                  onChange={(e) => setCorpus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-lg" />
              </div>
              <div>
                <label className="text-base font-semibold block mb-2">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-lg">
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
            <div className="pt-4 border-t border-border mt-4 space-y-4">
              <label className="text-base font-semibold block leading-snug">
                Do you want to donate this gift to a charity of your liking in case the grandchild refuses the gift or is not able to achieve the milestone?
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFallback("redirect_ngo")}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${fallback === "redirect_ngo" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"
                    }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setFallback("push_next")}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${fallback === "push_next" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"
                    }`}
                >
                  No
                </button>
              </div>

              {fallback === "redirect_ngo" && (
                <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                  <label className="text-base font-semibold block mb-2">Select an NGO of your choice</label>
                  <select value={ngoId} onChange={(e) => setNgoId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-base">
                    {DEMO_NGOS.map((ngo) => <option key={ngo.id} value={ngo.id}>{ngo.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Add a Personal Message 💌</h2>
            <p className="text-muted-foreground">Write a heartfelt message for {selectedChildObj?.name || "your grandchild"}</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Dear grandchild, I'm creating this gift because..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-base resize-none"
            />

            <div className="mt-4 pt-4 border-t border-border">
              <label className="text-base font-semibold block mb-2">Attach Media File (optional)</label>
              <input
                type="file"
                accept="image/*, audio/*, video/*"
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary/10 file:text-primary
                  hover:file:bg-primary/20
                "
              />
              {mediaFile && <p className="text-sm mt-2 text-success">Selected: {mediaFile.name}</p>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Review & Confirm ✅</h2>
            <div className="space-y-3 bg-secondary/50 rounded-xl p-5">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Grandchild</span>
                <span className="font-bold">{selectedChildObj?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Rule Type</span>
                <span className="font-bold capitalize">{ruleType}-Based</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Risk Profile</span>
                <span className="font-bold">{riskProfile}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">{currency === "USD" ? "$" : "₹"}{parseFloat(corpus).toLocaleString()}</span>
              </div>
              {message && (
                <div className="py-2">
                  <span className="text-muted-foreground block mb-1">Message</span>
                  <p className="italic bg-primary/5 p-3 rounded-lg">"{message}"</p>
                </div>
              )}
              {mediaFile && (
                <div className="py-2 border-t border-border mt-2">
                  <span className="text-muted-foreground block mb-1">Attached Media</span>
                  <p className="font-bold">{mediaFile.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button size="lg" variant="outline" onClick={() => step > 0 ? setStep(step - 1) : navigate("/grandparent")} disabled={false}>
          <ChevronLeft size={20} /> {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button size="lg" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Next <ChevronRight size={20} />
          </Button>
        ) : (
          <Button size="lg" variant="warm" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? <Loader2 size={20} className="animate-spin" /> : <GiftIcon size={20} />}
            {isCreating ? "Creating..." : "Create Gift"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GiftCreation;
