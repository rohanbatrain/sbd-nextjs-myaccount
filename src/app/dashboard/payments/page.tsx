"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-utils";
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, Filter, Download } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
    transaction_id: string;
    type: "send" | "receive" | "purchase" | "refund";
    amount: number;
    from_username?: string;
    to_username?: string;
    description: string;
    timestamp: string;
    note?: string;
}

export default function EnhancedPaymentsPage() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSendModal, setShowSendModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [sendData, setSendData] = useState({ recipient: "", amount: "", note: "" });
    const [requestData, setRequestData] = useState({ amount: "", reason: "" });
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [filter, setFilter] = useState<"all" | "send" | "receive">("all");

    useEffect(() => {
        fetchData().catch(console.error);
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [balanceRes, transactionsRes] = await Promise.all([
                apiClient.get("/sbd-tokens/my-tokens"),
                apiClient.get("/sbd-tokens/my-transactions"),
            ]);
            setBalance(balanceRes.data.balance || 0);
            setTransactions(transactionsRes.data.transactions || []);
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to fetch data") });
        } finally {
            setIsLoading(false);
        }
    };

    const sendTokens = async () => {
        if (!sendData.recipient || !sendData.amount) {
            setMessage({ type: "error", text: "Recipient and amount are required" });
            return;
        }

        try {
            await apiClient.post("/sbd-tokens/send", {
                recipient_username: sendData.recipient,
                amount: parseFloat(sendData.amount),
                note: sendData.note,
            });
            setMessage({ type: "success", text: "Tokens sent successfully" });
            setShowSendModal(false);
            setSendData({ recipient: "", amount: "", note: "" });
            await fetchData();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to send tokens") });
        }
    };

    const requestTokens = async () => {
        if (!requestData.amount) {
            setMessage({ type: "error", text: "Amount is required" });
            return;
        }

        try {
            await apiClient.post("/sbd-tokens/request", {
                amount: parseFloat(requestData.amount),
                reason: requestData.reason,
            });
            setMessage({ type: "success", text: "Token request submitted to family admin" });
            setShowRequestModal(false);
            setRequestData({ amount: "", reason: "" });
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to request tokens") });
        }
    };

    const addTransactionNote = async (transactionId: string, note: string) => {
        try {
            await apiClient.post(`/sbd-tokens/transaction/${transactionId}/note`, { note });
            setMessage({ type: "success", text: "Note added successfully" });
            await fetchData();
        } catch (error: unknown) {
            setMessage({ type: "error", text: getErrorMessage(error, "Failed to add note") });
        }
    };

    const exportTransactions = () => {
        const csv = [
            ["Date", "Type", "Amount", "From/To", "Description", "Note"].join(","),
            ...transactions.map((t) =>
                [
                    new Date(t.timestamp).toLocaleDateString(),
                    t.type,
                    t.amount,
                    t.from_username || t.to_username || "-",
                    t.description,
                    t.note || "",
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const filteredTransactions = transactions.filter((t) => {
        if (filter === "all") return true;
        if (filter === "send") return t.type === "send";
        if (filter === "receive") return t.type === "receive";
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SBD Tokens</h1>
                    <p className="text-muted-foreground mt-2">Manage your token balance and transactions.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Request
                    </button>
                    <button
                        onClick={() => setShowSendModal(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        Send Tokens
                    </button>
                </div>
            </div>

            {message && (
                <div
                    className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-border rounded-xl p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                        <p className="text-4xl font-bold">{balance.toLocaleString()} SBD</p>
                    </div>
                    <Wallet className="w-16 h-16 text-primary opacity-50" />
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <div className="flex gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as "all" | "send" | "receive")}
                            className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="send">Sent</option>
                            <option value="receive">Received</option>
                        </select>
                        <button
                            onClick={exportTransactions}
                            className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">Loading...</div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">No transactions yet</div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.transaction_id}
                                onClick={() => {
                                    setSelectedTransaction(transaction);
                                    setShowDetailsModal(true);
                                }}
                                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === "send" ? "bg-red-500/10" : "bg-green-500/10"
                                                }`}
                                        >
                                            {transaction.type === "send" ? (
                                                <ArrowUpRight className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <ArrowDownLeft className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{transaction.description}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(transaction.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-semibold ${transaction.type === "send" ? "text-red-500" : "text-green-500"
                                                }`}
                                        >
                                            {transaction.type === "send" ? "-" : "+"}
                                            {transaction.amount} SBD
                                        </p>
                                        {transaction.note && <p className="text-xs text-muted-foreground mt-1">Has note</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Send Modal */}
            {showSendModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                    >
                        <h2 className="text-xl font-bold mb-4">Send Tokens</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Recipient Username</label>
                                <input
                                    type="text"
                                    value={sendData.recipient}
                                    onChange={(e) => setSendData({ ...sendData, recipient: e.target.value })}
                                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2"
                                    placeholder="username"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Amount</label>
                                <input
                                    type="number"
                                    value={sendData.amount}
                                    onChange={(e) => setSendData({ ...sendData, amount: e.target.value })}
                                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Note (optional)</label>
                                <textarea
                                    value={sendData.note}
                                    onChange={(e) => setSendData({ ...sendData, note: e.target.value })}
                                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 min-h-[80px]"
                                    placeholder="Add a note..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowSendModal(false);
                                        setSendData({ recipient: "", amount: "", note: "" });
                                    }}
                                    className="flex-1 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendTokens}
                                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                    >
                        <h2 className="text-xl font-bold mb-4">Request Tokens</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Amount</label>
                                <input
                                    type="number"
                                    value={requestData.amount}
                                    onChange={(e) => setRequestData({ ...requestData, amount: e.target.value })}
                                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Reason</label>
                                <textarea
                                    value={requestData.reason}
                                    onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                                    className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 min-h-[80px]"
                                    placeholder="Why do you need these tokens?"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowRequestModal(false);
                                        setRequestData({ amount: "", reason: "" });
                                    }}
                                    className="flex-1 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={requestTokens}
                                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Request
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Transaction Details Modal */}
            {showDetailsModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
                    >
                        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-medium capitalize">{selectedTransaction.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium">{selectedTransaction.amount} SBD</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                            </div>
                            {selectedTransaction.from_username && (
                                <div>
                                    <p className="text-sm text-muted-foreground">From</p>
                                    <p className="font-medium">{selectedTransaction.from_username}</p>
                                </div>
                            )}
                            {selectedTransaction.to_username && (
                                <div>
                                    <p className="text-sm text-muted-foreground">To</p>
                                    <p className="font-medium">{selectedTransaction.to_username}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{selectedTransaction.description}</p>
                            </div>
                            {selectedTransaction.note && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Note</p>
                                    <p className="font-medium">{selectedTransaction.note}</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="w-full mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
