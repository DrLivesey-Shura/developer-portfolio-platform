"use client";
// src/components/dashboard/sidebar.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Settings,
  User,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FolderGit2, label: "Projects", href: "/dashboard/projects" },
    { icon: BookOpen, label: "Blog Posts", href: "/dashboard/blog" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="w-64 h-full bg-white border-r flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">Portfolio Builder</h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    isActive ? "bg-gray-100 text-blue-600" : "text-gray-600"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/portfolio/preview"
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <User className="w-5 h-5" />
          <span>View Portfolio</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
