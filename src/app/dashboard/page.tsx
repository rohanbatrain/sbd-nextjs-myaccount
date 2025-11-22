"use client";

import { motion } from "framer-motion";
import { Shield, User, Users, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, User</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your info, privacy, and security to make Second Brain work better for you.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <DashboardCard
                    href="/dashboard/profile"
                    icon={User}
                    title="Personal Info"
                    description="Update your photo and personal details."
                    color="bg-blue-500/10 text-blue-500"
                />
                <DashboardCard
                    href="/dashboard/security"
                    icon={Shield}
                    title="Security"
                    description="Settings and recommendations to help keep your account secure."
                    color="bg-green-500/10 text-green-500"
                />
                <DashboardCard
                    href="/dashboard/family"
                    icon={Users}
                    title="People & Sharing"
                    description="Manage your family group and share with others."
                    color="bg-purple-500/10 text-purple-500"
                />
                <DashboardCard
                    href="/dashboard/payments"
                    icon={CreditCard}
                    title="Payments & Subscriptions"
                    description="Manage your SBD tokens and digital assets."
                    color="bg-orange-500/10 text-orange-500"
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-semibold mb-4">Security Checkup</h3>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Your account is protected</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                No security issues found in the last 30 days.
                            </p>
                            <Link
                                href="/dashboard/security"
                                className="text-sm font-medium text-primary hover:underline mt-3 inline-flex items-center gap-1"
                            >
                                See details <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-semibold mb-4">Storage Usage</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>12.5 GB used</span>
                            <span className="text-muted-foreground">100 GB total</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[12.5%] rounded-full" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Manage your storage across Drive, Gmail, and Photos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({
    href,
    icon: Icon,
    title,
    description,
    color,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    color: string;
}) {
    return (
        <motion.div variants={item}>
            <Link
                href={href}
                className="block p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:shadow-sm group h-full"
            >
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </Link>
        </motion.div>
    );
}
