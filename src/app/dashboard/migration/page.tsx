"use client";

import { useState } from "react";
import { Download, Upload, ArrowRight } from "lucide-react";
import { InstanceManagement } from "@/components/migration/InstanceManagement";
import { DirectTransfer } from "@/components/migration/DirectTransfer";
import { ExportCard } from "@/components/migration/ExportCard";
import { ImportCard } from "@/components/migration/ImportCard";
import { MigrationHistory } from "@/components/migration/MigrationHistory";

export default function MigrationPage() {
    const [activeTab, setActiveTab] = useState<"direct" | "import-export">("direct");

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Migration</h1>
                <p className="text-muted-foreground mt-2">
                    Transfer data between your instances or export/import backups.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 border-b border-border">
                <button
                    onClick={() => setActiveTab("direct")}
                    className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${activeTab === "direct"
                            ? "border-primary text-primary font-medium"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <ArrowRight className="w-4 h-4" />
                    Direct Transfer
                </button>
                <button
                    onClick={() => setActiveTab("import-export")}
                    className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${activeTab === "import-export"
                            ? "border-primary text-primary font-medium"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <Download className="w-4 h-4" />
                    Export/Import
                </button>
            </div>

            {/* Direct Transfer Tab */}
            {activeTab === "direct" && (
                <div className="space-y-6">
                    <InstanceManagement />
                    <DirectTransfer />
                </div>
            )}

            {/* Import/Export Tab */}
            {activeTab === "import-export" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ExportCard />
                        <ImportCard />
                    </div>
                    <MigrationHistory />
                </div>
            )}
        </div>
    );
}
