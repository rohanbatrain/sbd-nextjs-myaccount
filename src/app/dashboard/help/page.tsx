"use client";

import { useState } from "react";
import { HelpCircle, Search, ChevronDown, ChevronUp, Mail, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: "Account",
        question: "How do I change my password?",
        answer: "Go to Security settings and click 'Change Password'. You'll need to enter your current password and then your new password twice.",
    },
    {
        category: "Account",
        question: "How do I enable two-factor authentication?",
        answer: "Navigate to Security settings, click 'Setup 2FA', and follow the instructions to scan the QR code with your authenticator app.",
    },
    {
        category: "Account",
        question: "Can I delete my account?",
        answer: "Yes, go to Settings > Data & Privacy and click 'Request Account Deletion'. Note that this action is permanent and cannot be undone.",
    },
    {
        category: "Family",
        question: "How do I create a family?",
        answer: "Go to the Family page and click 'Create Family'. Enter a name for your family and you'll become the admin.",
    },
    {
        category: "Family",
        question: "How do I invite family members?",
        answer: "As a family admin, go to the Family page and click 'Invite Member'. Enter their email address to send an invitation.",
    },
    {
        category: "Family",
        question: "Can I leave a family?",
        answer: "Yes, click the 'Leave Family' button on the Family page. You'll need to be invited again to rejoin.",
    },
    {
        category: "Tokens",
        question: "What are SBD Tokens?",
        answer: "SBD Tokens are the virtual currency used within the Second Brain Database ecosystem for purchases and transactions.",
    },
    {
        category: "Tokens",
        question: "How do I send tokens to another user?",
        answer: "Go to SBD Tokens page, click 'Send Tokens', enter the recipient's username and amount, then confirm.",
    },
    {
        category: "Tokens",
        question: "Can I request tokens from my family?",
        answer: "Yes, click 'Request' on the SBD Tokens page, enter the amount and reason, and it will be sent to your family admin for approval.",
    },
    {
        category: "Security",
        question: "What are backup codes?",
        answer: "Backup codes are one-time use codes that let you access your account if you lose access to your 2FA device.",
    },
    {
        category: "Security",
        question: "How do I view my login history?",
        answer: "Go to Login History in the dashboard to see all login attempts, devices, and locations.",
    },
    {
        category: "Tenants",
        question: "What are tenants?",
        answer: "Tenants are workspaces or organizations that help you organize your work and collaborate with team members.",
    },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({ subject: "", message: "" });

    const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))];

    const filteredFAQs = faqs.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleContactSubmit = () => {
        // TODO: Implement contact form submission
        alert("Contact form submitted! We'll get back to you soon.");
        setShowContactForm(false);
        setContactForm({ subject: "", message: "" });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
                <p className="text-muted-foreground mt-2">
                    Find answers to common questions or contact support
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help..."
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                ? "bg-primary text-primary-foreground"
                                : "bg-background border border-border hover:bg-muted"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* FAQs */}
            <div className="space-y-3">
                {filteredFAQs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No results found. Try a different search term.
                    </div>
                ) : (
                    filteredFAQs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card border border-border rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                                        {faq.category}
                                    </span>
                                    <span className="font-medium">{faq.question}</span>
                                </div>
                                {expandedFAQ === index ? (
                                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                            </button>
                            <AnimatePresence>
                                {expandedFAQ === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 text-muted-foreground">{faq.answer}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Contact Support */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <div>
                        <h2 className="font-semibold text-lg">Still need help?</h2>
                        <p className="text-sm text-muted-foreground">Contact our support team</p>
                    </div>
                </div>
                {!showContactForm ? (
                    <button
                        onClick={() => setShowContactForm(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Subject</label>
                            <input
                                type="text"
                                value={contactForm.subject}
                                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2"
                                placeholder="Brief description of your issue"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 min-h-[120px]"
                                placeholder="Describe your issue in detail..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="flex-1 bg-background border border-border px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleContactSubmit}
                                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
