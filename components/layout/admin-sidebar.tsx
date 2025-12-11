"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  MapPin,
  BookOpen,
  BarChart3,
  LifeBuoy,
  MessageCircle,
} from "lucide-react";

// Định nghĩa thêm thuộc tính 'variant' để tùy biến style
const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Cảnh báo",
    href: "/admin/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Địa điểm",
    href: "/admin/locations",
    icon: MapPin,
  },
  {
    title: "Bài viết",
    href: "/admin/articles",
    icon: BookOpen,
  },
  {
    title: "Cộng đồng",
    href: "/admin/community",
    icon: MessageCircle,
  },
  {
    title: "Thống kê",
    href: "/admin/statistics",
    icon: BarChart3,
  },
  // --- [ĐÃ CHUYỂN XUỐNG CUỐI] ---
  {
    title: "Cứu trợ (SOS)",
    href: "/admin/rescue",
    icon: LifeBuoy,
    variant: "destructive", // Đánh dấu là mục đặc biệt
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 border-r bg-background p-4 h-full overflow-y-auto">
      <nav className="space-y-2 flex flex-col h-full">
        {/* Render các item bình thường */}
        <div className="space-y-2">
          {adminMenuItems.map((item, index) => {
            // @ts-ignore
            if (item.variant === "destructive") return null; // Bỏ qua item SOS ở vòng lặp này

            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </div>
        {/* Render mục SOS ở dưới cùng, tách biệt hẳn */}
        <div className="mt-auto pt-4 border-t">
          {adminMenuItems
            .filter((item) => (item as any).variant === "destructive")
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition-all duration-300 group bg-red-500 text-white"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", !isActive && "animate-pulse")}
                  />{" "}
                  {/* Icon nhấp nháy khi chưa chọn để gây chú ý */}
                  {item.title}
                </Link>
              );
            })}
        </div>
      </nav>
    </aside>
  );
}

export function AdminSidebarContent() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2 p-4 bg-background h-full flex flex-col">
      <div className="space-y-2">
        {adminMenuItems.map((item) => {
          // @ts-ignore
          if (item.variant === "destructive") return null;

          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </div>
      <p>HIHI</p>
      {/* Mục SOS trong Mobile Menu */}
      <div className="mt-4 pt-4 border-t">
        {adminMenuItems
          .filter((item) => (item as any).variant === "destructive")
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition-all",
                  isActive
                    ? "bg-red-500 text-destructive-foreground"
                    : "bg-red-500 text-destructive-foreground border border-destructive/20"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
