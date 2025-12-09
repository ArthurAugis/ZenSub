"use client";

import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonProps {
    data: any[];
}

export function ExportButton({ data }: ExportButtonProps) {
    const handleCSVExport = () => {
        const headers = ["Name", "Price", "Currency", "Frequency", "Category", "Next Renewal", "Is Shared", "Shared Count"];
        const csvContent = [
            headers.join(","),
            ...data.map(item => [
                `"${item.name}"`,
                item.price,
                item.currency,
                `${item.frequencyValue} ${item.frequencyUnit}`,
                `"${item.category || ''}"`,
                new Date(item.nextRenewalDate).toLocaleDateString(),
                item.isShared ? "Yes" : "No",
                item.sharedCount
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `zensub_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePDFExport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("ZenSub Subscription Report", 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["Name", "Price", "Currency", "Frequency", "Category", "Next Renewal", "Shared"];
        const tableRows: any[] = [];

        data.forEach(item => {
            const subscriptionData = [
                item.name,
                item.price.toFixed(2),
                item.currency,
                `${item.frequencyValue} ${item.frequencyUnit}`,
                item.category || "-",
                new Date(item.nextRenewalDate).toLocaleDateString(),
                item.isShared ? `Yes (${item.sharedCount})` : "No",
            ];
            tableRows.push(subscriptionData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [24, 24, 27] }
        });

        doc.save(`zensub_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={handleCSVExport}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
            >
                <Download size={16} />
                Export CSV
            </button>
            <button
                onClick={handlePDFExport}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
            >
                <FileText size={16} />
                Export PDF
            </button>
        </div>
    );
}
