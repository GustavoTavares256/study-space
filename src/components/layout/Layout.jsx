import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";
import { cx } from "../../lib/utils";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(true)} onToggle={() => setSidebarOpen((v) => !v)} />

      <TopBar />

      <main className={cx(sidebarOpen ? "md:pl-72" : "md:pl-20", "pt-16 md:pt-0 min-h-screen")}>
        {children || <Outlet />}
      </main>

      <MobileNav />
    </div>
  );
}
