import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { setupSDRRSDoc, addFooter, drawTable } from "@/lib/pdfHelper";
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  AlertTriangle, 
  Activity,
  Clock,
  FileBarChart,
  FileCheck,
  Printer
} from "lucide-react";
import { EmergencyStats } from "@/types";
import { toast } from "@/hooks/use-toast";

interface ReportsPanelProps {
  stats: EmergencyStats;
  alertCount: number;
}

export function ReportsPanel({ stats, alertCount }: ReportsPanelProps) {
  const reports = [
    {
      id: 'incident',
      name: 'Incident Summary Report',
      description: 'Complete overview of current emergency situation',
      icon: FileBarChart,
      data: [
        `Total Occupants: ${stats.totalOccupants}`,
        `Safe: ${stats.safeOccupants + stats.rescuedOccupants}`,
        `Stuck: ${stats.stuckOccupants}`,
        `Injured: ${stats.injuredOccupants}`,
      ],
      lastGenerated: new Date(),
    },
    {
      id: 'occupant',
      name: 'Occupant Status Report',
      description: 'Detailed list of all occupants with current status and locations',
      icon: Users,
      data: [
        `Rescued: ${stats.rescuedOccupants}`,
        `Awaiting Rescue: ${stats.stuckOccupants}`,
        `Evacuation Progress: ${stats.evacuationProgress}%`,
      ],
      lastGenerated: new Date(Date.now() - 300000),
    },
    {
      id: 'alerts',
      name: 'Alert Log Report',
      description: 'Complete log of all alerts triggered during this incident',
      icon: AlertTriangle,
      data: [
        `Active Alerts: ${alertCount}`,
        `Floors Affected: ${stats.floorsAffected}`,
      ],
      lastGenerated: new Date(Date.now() - 600000),
    },
    {
      id: 'rescue',
      name: 'Rescue Operations Report',
      description: 'Timeline and status of all rescue team activities',
      icon: Activity,
      data: [
        'Internal Team: On Scene',
        'Fire Department: Dispatched',
        'Medical Services: Alerted',
      ],
      lastGenerated: new Date(Date.now() - 900000),
    },
    {
      id: 'compliance',
      name: 'Compliance & Audit Report',
      description: 'Safety compliance status and audit trail for regulatory purposes',
      icon: FileCheck,
      data: [
        'Last Safety Drill: 14 days ago',
        'Equipment Check: Passed',
        'Staff Training: Current',
      ],
      lastGenerated: new Date(Date.now() - 86400000),
    },
  ];

  const handleDownload = (reportId: string, reportName: string) => {
    toast({
      title: "Generating Report...",
      description: `Preparing ${reportName} for download.`,
    });

    const doc = setupSDRRSDoc(
      reportId === 'all' ? "Complete Report Package" : reportName
    );
    
    let currentY = 90;
    
    if (reportId === 'all') {
      reports.forEach((report, index) => {
        if (index > 0) {
          doc.addPage();
          currentY = 40; // Reset Y for new page (below header)
          
          // Add header strip on subsequent pages
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F');
        }
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(report.name, 20, currentY);
        currentY += 8;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(report.description, 20, currentY);
        currentY += 15;
        
        // Convert text data points into table rows
        const tableBody = report.data.map(item => {
          const [key, ...rest] = item.split(': ');
          return [key, rest.length > 0 ? rest.join(': ') : 'Active'];
        });

        currentY = drawTable(doc, currentY, {
          head: [['Metric', 'Value/Status']],
          body: tableBody,
          theme: 'grid'
        });
      });
      
      addFooter(doc);
      doc.save("SDRRS_Complete_Report_Package.pdf");

    } else {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(report.description, 20, currentY);
      currentY += 15;
      
      const tableBody = report.data.map(item => {
        const [key, ...rest] = item.split(': ');
        return [key, rest.length > 0 ? rest.join(': ') : 'Active'];
      });

      drawTable(doc, currentY, {
        head: [['Metric', 'Value/Status']],
        body: tableBody,
        theme: 'grid'
      });
      
      addFooter(doc);
      doc.save(`${report.name.replace(/\s+/g, '_')}.pdf`);
    }

    toast({
      title: "Report Downloaded",
      description: `${reportName} has been downloaded securely.`,
    });
  };

  const handlePrint = (reportId: string, reportName: string) => {
    toast({
      title: "Printing Report",
      description: `${reportName} sent to printer.`,
    });
  };

  const handleGenerateAll = () => {
    toast({
      title: "Generating All Reports",
      description: "All reports are being generated. This may take a moment.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-info" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" onClick={handleGenerateAll}>
              <FileBarChart className="w-4 h-4 mr-2" />
              Generate All Reports
            </Button>
            <Button variant="secondary" onClick={() => handleDownload('all', 'Complete Report Package')}>
              <Download className="w-4 h-4 mr-2" />
              Download All (PDF)
            </Button>
            <Button variant="secondary" onClick={() => handlePrint('all', 'Complete Report Package')}>
              <Printer className="w-4 h-4 mr-2" />
              Print Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:border-info/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5 text-info" />
                  {report.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardHeader>
              <CardContent>
                {/* Report Data Preview */}
                <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                  <ul className="space-y-1 text-sm">
                    {report.data.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-info rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Last Generated */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3 h-3" />
                  Last generated: {report.lastGenerated.toLocaleTimeString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(report.id, report.name)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handlePrint(report.id, report.name)}
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-info" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium">Daily Safety Summary</p>
                <p className="text-xs text-muted-foreground">Sent to: safety-team@company.com</p>
              </div>
              <span className="text-xs bg-safe/20 text-safe px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium">Weekly Compliance Report</p>
                <p className="text-xs text-muted-foreground">Sent to: compliance@company.com</p>
              </div>
              <span className="text-xs bg-safe/20 text-safe px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium">Emergency Incident Report</p>
                <p className="text-xs text-muted-foreground">Auto-generated during emergencies</p>
              </div>
              <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">Triggered</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
