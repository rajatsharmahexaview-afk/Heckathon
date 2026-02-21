import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";

import { useGifts } from "@/hooks/useGifts";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { PieChart, Plus, UserPlus, Gift, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const FamilyCoverage: React.FC = () => {
    const { currentUser, grandchildren: allGrandchildren, addGrandchild } = useApp();
    const { gifts } = useGifts(currentUser?.id, "grandparent");

    const [showAddModal, setShowAddModal] = useState(false);
    const [newGcName, setNewGcName] = useState("");
    const [newGcAge, setNewGcAge] = useState("");

    const grandchildren = allGrandchildren.filter((gc) => gc.linkedGrandparentId === currentUser?.id);

    // Stats calculation
    const getGiftCount = (gcId: string) =>
        gifts?.filter((g) => g.status === 'Active' && g.grandchild_id === gcId).length || 0;

    const getGiftValue = (gcId: string) =>
        gifts?.filter((g) => g.status === 'Active' && g.grandchild_id === gcId)
            .reduce((sum, g) => sum + Number(g.corpus), 0) || 0;

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGcName || !newGcAge) return;

        addGrandchild({
            id: crypto.randomUUID(),
            name: newGcName,
            linkedGrandparentId: currentUser!.id,
            age: parseInt(newGcAge) || 0,
            dateOfBirth: "Unknown",
        });

        toast.success(`${newGcName} added successfully! (Demo Mode)`);
        setShowAddModal(false);
        setNewGcName("");
        setNewGcAge("");
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <Link to="/grandparent" className="inline-flex items-center text-primary font-bold hover:underline mb-2">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <PieChart className="text-blue-600" size={36} /> Family Coverage
                    </h1>
                    <p className="text-xl text-muted-foreground mt-2">
                        Managing gifts for <span className="text-primary font-bold">{grandchildren.length}</span> grandchildren
                    </p>
                </div>
                <Button size="xl" variant="warm" className="rounded-2xl font-black h-16 px-8 shadow-lg" onClick={() => setShowAddModal(true)}>
                    <UserPlus className="mr-2 h-6 w-6" /> Add Grandchild
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grandchildren.map((gc) => {
                    const count = getGiftCount(gc.id);
                    const value = getGiftValue(gc.id);
                    // Assuming USD as base currency for aggregate display
                    const currency = gifts?.find((g) => g.grandchild_id === gc.id)?.currency || "USD";

                    return (
                        <div key={gc.id} className="bg-card rounded-3xl border-2 p-6 shadow-soft hover:shadow-xl transition-all hover:border-primary/20 flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-secondary/30 flex items-center justify-center text-4xl mb-4 border-4 border-background shadow-sm">
                                {gc.name[0] || "👶"}
                            </div>
                            <h3 className="text-2xl font-black text-foreground">{gc.name}</h3>
                            <p className="text-muted-foreground mb-6">Age {gc.age}</p>

                            <div className="w-full bg-secondary/20 rounded-2xl p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                        <Gift size={12} /> Gifts
                                    </p>
                                    <p className="text-2xl font-black text-foreground">{count}</p>
                                </div>
                                <div className="border-l-2 border-border/50">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Value</p>
                                    <p className="text-2xl font-black text-primary">
                                        <CurrencyDisplay amount={value} originalCurrency={currency} />
                                    </p>
                                </div>
                            </div>

                            <Link to="/grandparent/create-gift" className="w-full mt-4">
                                <Button variant="outline" className="w-full rounded-xl border-2 font-bold group">
                                    <Plus className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> New Gift for {gc.name}
                                </Button>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-card w-full max-w-md rounded-3xl border-2 shadow-2xl p-8 animate-in zoom-in-95">
                        <h2 className="text-2xl font-black mb-1">Add Grandchild</h2>
                        <p className="text-muted-foreground mb-6">Bring another family member into your legacy.</p>

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-muted-foreground mb-2 block">Full Name</label>
                                <input
                                    type="text"
                                    value={newGcName}
                                    onChange={(e) => setNewGcName(e.target.value)}
                                    required
                                    placeholder="e.g. Meera"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-muted-foreground mb-2 block">Age</label>
                                <input
                                    type="number"
                                    value={newGcAge}
                                    onChange={(e) => setNewGcAge(e.target.value)}
                                    required
                                    min="0"
                                    max="100"
                                    placeholder="e.g. 12"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <Button type="button" variant="outline" className="border-2 rounded-xl h-12 font-bold" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="warm" className="rounded-xl h-12 font-bold text-base">
                                    Save Member
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyCoverage;
