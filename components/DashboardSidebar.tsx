"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Plus,
  X,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar = ({
  activeTab,
  onTabChange,
  isOpen = true,
  onClose,
}: DashboardSidebarProps) => {
  const mainItems: SidebarItem[] = [
    {
      id: "history",
      label: "Invoices",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "create",
      label: "Create Invoice",
      icon: <Plus className="w-5 h-5" />,
    },
    {
      id: "clients",
      label: "Clients",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const secondaryItems: SidebarItem[] = [
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  const renderSidebarItem = (item: SidebarItem, isActive: boolean) => (
    <Button
      key={item.id}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-11 px-3",
        isActive
          ? "bg-primary/10 text-primary border-r-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      onClick={() => onTabChange(item.id)}
    >
      {item.icon}
      <span className="font-medium">{item.label}</span>
      {item.count && (
        <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
          {item.count}
        </span>
      )}
    </Button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-48 bg-card border-r border-primary/30 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        {onClose && (
          <div className="lg:hidden flex justify-between p-4">
            {/* Logo using project theme */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  Invoicr
                </h1>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="px-4 py-6 space-y-2 flex-1">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Main
            </h2>
            <div className="space-y-1">
              {mainItems.map((item) =>
                renderSidebarItem(item, activeTab === item.id)
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Tools
            </h2>
            <div className="space-y-1">
              {secondaryItems.map((item) =>
                renderSidebarItem(item, activeTab === item.id)
              )}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white">
            <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-primary-foreground/80 mb-3">
              Unlock advanced features and unlimited invoices
            </p>
            <Button
              size="sm"
              className="w-full bg-white text-primary hover:bg-muted"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
