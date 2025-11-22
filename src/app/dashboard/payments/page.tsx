"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2, Wallet, ArrowUpRight, ArrowDownLeft, Send, History } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
    transaction_id: string;
    amount: number;
    type: "credit" | "debit";
    description: string;
    created_at: string;
    counterparty?: string;
}

export default function PaymentsPage() {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [balanceRes, historyRes] = await Promise.all([
                apiClient.get("/sbd-tokens/my-tokens"),
                apiClient.get("/sbd-tokens/my-transactions"),
            ]);
            setBalance(balanceRes.data.balance);
            setTransactions(historyRes.data.transactions || []);
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await apiClient.post("/sbd-tokens/send", {
                recipient_username: recipient,
                amount: parseFloat(sendAmount),
            });
            alert("Tokens sent successfully!");
            setSendAmount("");
            setRecipient("");
            fetchData(); // Refresh data
        } catch (error: any) {
            console.error("Failed to send tokens", error);
            alert(error.response?.data?.detail || "Failed to send tokens");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments & Subscriptions</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your SBD tokens and digital assets.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Wallet Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 opacity-80">
                                <Wallet className="w-5 h-5" />
                                <span className="font-medium">SBD Balance</span>
                            </div>
                            <div className="text-5xl font-bold tracking-tight mb-8">
                                {balance?.toLocaleString()} <span className="text-2xl opacity-60">SBD</span>
                            </div>

                            <div className="flex gap-4">
                                <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
                                    <ArrowUpRight className="w-4 h-4" />
                                    Top Up
                                </button>
                                <button className="bg-white/10 text-white border border-white/20 px-6 py-2 rounded-full font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                                    <ArrowDownLeft className="w-4 h-4" />
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <History className="w-5 h-5 text-muted-foreground" />
                                Recent Transactions
                            </h2>
                            <button className="text-sm text-primary hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-border">
                            {transactions.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No transactions yet.
                                </div>
                            ) : (
                                transactions.map((tx) => (
                                    <div key={tx.transaction_id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                }`}>
                                                {tx.type === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium">{tx.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(tx.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`font-semibold ${tx.type === "credit" ? "text-green-500" : "text-foreground"
                                            }`}>
                                            {tx.type === "credit" ? "+" : "-"}{tx.amount} SBD
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {/* Send Tokens Widget */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Send className="w-4 h-4 text-primary" />
                            Send Tokens
                        </h3>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Recipient Username</label>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="@username"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Amount (SBD)</label>
                                <input
                                    type="number"
                                    value={sendAmount}
                                    onChange={(e) => setSendAmount(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Now"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
