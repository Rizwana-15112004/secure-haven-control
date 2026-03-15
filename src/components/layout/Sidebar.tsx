import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth, Role } from "@/contexts/AuthContext";
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
  Heart,
  Activity,
  Package,
  Zap
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
  { id: 'monitoring', label: 'Monitoring', icon: Activity, roles: ['admin', 'staff'] },
  { id: 'donors', label: 'Donors', icon: Heart, roles: ['admin', 'staff'] },
  { id: 'cctv', label: 'CCTV', icon: Video, roles: ['admin'] },
  { id: 'occupants', label: 'Occupants', icon: Users, roles: ['admin'] },
  { id: 'map', label: 'Building Map', icon: Map, roles: ['admin'] },
  { id: 'controls', label: 'Controls', icon: Sliders, roles: ['admin'] },
  { id: 'alerts', label: 'Alerts', icon: Bell, roles: ['admin'] },
  { id: 'rescue', label: 'Rescue Teams', icon: Siren, roles: ['admin'] },
  { id: 'supplies', label: 'Supplies', icon: Package, roles: ['admin'] },
  { id: 'circuits', label: 'Circuits', icon: Zap, roles: ['admin'] },
];

const bottomItems = [
  { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin'] },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, roles: ['admin', 'staff'] },
  { id: 'help', label: 'Help', icon: HelpCircle, roles: ['admin', 'staff'] },
];

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const { role } = useAuth();
  
  const handleClick = (id: string) => {
    onTabChange(id);
    onClose?.();
  };

  const visibleNavItems = navItems.filter(item => item.roles.includes(role as Role));
  const visibleBottomItems = bottomItems.filter(item => item.roles.includes(role as Role));

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
        "fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border z-50 transition-transform duration-300 overflow-y-auto",
        "lg:translate-x-0 lg:z-40",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Main Nav */}
          <nav className="space-y-1 flex-1">
            {visibleNavItems.map((item) => {
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
            {visibleBottomItems.map((item) => {
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
