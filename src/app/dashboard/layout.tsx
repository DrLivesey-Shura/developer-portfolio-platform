// src/app/dashboard/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="fixed inset-y-0">
        <Sidebar />
      </div>

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
