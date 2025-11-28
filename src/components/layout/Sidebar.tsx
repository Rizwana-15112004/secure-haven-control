import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  Map, 
  Settings as SettingsIcon, 
  Bell,
  Sliders,
  FileText,
  HelpCircle,
  Siren,
  Activity
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'cctv', label: 'CCTV', icon: Video },
  { id: 'occupants', label: 'Occupants', icon: Users },
  { id: 'map', label: 'Building Map', icon: Map },
  { id: 'controls', label: 'Controls', icon: Sliders },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'rescue', label: 'Rescue Teams', icon: Siren },
];

const bottomItems = [
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const handleClick = (id: string) => {
    onTabChange(id);
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border z-40 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Main Nav */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isActive && "bg-primary/90"
                  )}
                  onClick={() => handleClick(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Bottom Nav */}
          <div className="border-t border-border pt-4 space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive && "bg-primary/90"
                  )}
                  onClick={() => handleClick(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* System Info */}
          <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">System Status</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Sensors</span>
                <span className="text-safe">All Active</span>
              </div>
              <div className="flex justify-between">
                <span>UPS Battery</span>
                <span className="text-safe">98%</span>
              </div>
              <div className="flex justify-between">
                <span>Local Storage</span>
                <span>42% Used</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
