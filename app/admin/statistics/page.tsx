"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useAdminStore } from "@/store/admin-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, MapPin, BookOpen } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function AdminStatisticsPage() {
  const { statistics, fetchStatistics, isLoading } = useAdminStore()
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  // Determine current theme (resolvedTheme handles 'system' preference)
  const currentTheme = resolvedTheme || theme || 'light'
  const isDark = currentTheme === 'dark'

  const stats = [
    {
      title: "Tổng người dùng",
      value: statistics?.total_users || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/20",
    },
    {
      title: "Tổng cảnh báo",
      value: statistics?.total_alerts || 0,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-red-500/10 dark:bg-red-500/20",
    },
    {
      title: "Tổng địa điểm",
      value: statistics?.total_locations || 0,
      icon: MapPin,
      color: "text-success",
      bgColor: "bg-success/10 dark:bg-success/20",
    },
    {
      title: "Tổng bài viết",
      value: statistics?.total_articles || 0,
      icon: BookOpen,
      color: "text-warning",
      bgColor: "bg-warning/10 dark:bg-warning/20",
    },
  ]

  // Theme-aware chart colors
  const CHART_COLORS = isDark
    ? ["#60a5fa", "#f87171", "#4ade80", "#fbbf24"] // Lighter colors for dark mode
    : ["#2563eb", "#dc2626", "#16a34a", "#f59e0b"] // Standard colors for light mode

  // Dữ liệu cho biểu đồ cột
  const barChartData = [
    {
      name: "Người dùng",
      value: statistics?.total_users || 0,
      color: CHART_COLORS[0],
    },
    {
      name: "Cảnh báo",
      value: statistics?.total_alerts || 0,
      color: CHART_COLORS[1],
    },
    {
      name: "Địa điểm",
      value: statistics?.total_locations || 0,
      color: CHART_COLORS[2],
    },
    {
      name: "Bài viết",
      value: statistics?.total_articles || 0,
      color: CHART_COLORS[3],
    },
  ]

  // Dữ liệu cho biểu đồ tròn
  const pieChartData = [
    { name: "Người dùng", value: statistics?.total_users || 0 },
    { name: "Cảnh báo", value: statistics?.total_alerts || 0 },
    { name: "Địa điểm", value: statistics?.total_locations || 0 },
    { name: "Bài viết", value: statistics?.total_articles || 0 },
  ].filter((item) => item.value > 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Thống kê hệ thống</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Tổng quan về hệ thống và dữ liệu
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Biểu đồ cột */}
            <Card>
              <CardHeader>
                <CardTitle>So sánh tổng số</CardTitle>
                <CardDescription>
                  Biểu đồ cột so sánh các loại dữ liệu trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                    <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        color: isDark ? "#f3f4f6" : "#111827"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Biểu đồ tròn */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bổ dữ liệu</CardTitle>
                <CardDescription>
                  Biểu đồ tròn thể hiện tỷ lệ phân bổ các loại dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={100}
                      fill={CHART_COLORS[0]}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        color: isDark ? "#f3f4f6" : "#111827"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

