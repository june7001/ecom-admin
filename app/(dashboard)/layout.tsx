import Link from "next/link";
import React from "react";

import { UserButton } from "@clerk/nextjs";

// Add routes here and they will be added to the nav bar
const routes: { href: string; label: string }[] = [
  { href: "/overview", label: "Overview" },
  { href: "/product", label: "Products" },
];

// General layout for the dashboard
// elements in "routes" will be added to the navbar
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex justify-between p-4 border-b-2">
        <nav className="flex items-center gap-4">
          {routes.map((route, i) => (
            <Link key={(route.href, i)} href={route.href}>
              {route.label}
            </Link>
          ))}
        </nav>
        <UserButton afterSignOutUrl="/" />
      </header>
      {children}
    </div>
  );
}
