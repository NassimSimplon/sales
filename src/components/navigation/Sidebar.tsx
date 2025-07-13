import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sales", label: "Sales", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">ShoeCorp Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Sales Management System</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-lg text-white">
          <h3 className="font-medium text-sm">Upgrade to Pro</h3>
          <p className="text-xs opacity-90 mt-1">
            Get advanced analytics and reporting features
          </p>
        </div>
      </div>
    </div>
  );
}
