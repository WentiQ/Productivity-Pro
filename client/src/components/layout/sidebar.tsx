import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Gamepad2, 
  Shield, 
  StickyNote, 
  Droplet, 
  ListTodo, 
  Bolt, 
  Rocket 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "ListTodo", href: "/tasks", icon: ListTodo },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Pomodoro", href: "/pomodoro", icon: Clock },
  { name: "Notes", href: "/notes", icon: StickyNote },
  { name: "Water Tracker", href: "/water", icon: Droplet },
  { name: "Habits", href: "/habits", icon: CheckCircle },
  { name: "Distraction Blocker", href: "/blocker", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Bolt", href: "/tools", icon: Bolt },
  { name: "Time Pass", href: "/timepass", icon: Gamepad2 },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                ProductivityPro
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
          
          {/* User Profile */}
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <img 
                  className="inline-block h-9 w-9 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" 
                  alt="User Avatar"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">John Doe</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pro Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
