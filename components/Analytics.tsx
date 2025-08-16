"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  getInvoiceAnalytics,
  type InvoiceAnalytics,
} from "@/lib/invoice-service";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "sent":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "draft":
      return <FileText className="w-4 h-4 text-gray-600" />;
    case "overdue":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<InvoiceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getInvoiceAnalytics(
          selectedPeriod as "30days" | "6months" | "1year"
        );
        setAnalytics(data);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600">
            Create some invoices to see your analytics dashboard.
          </p>
        </div>
      </Card>
    );
  }

  const collectionRate =
    analytics.totalInvoices > 0
      ? (analytics.paidInvoices / analytics.totalInvoices) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Track your invoice performance and business insights
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPeriod === "30days" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("30days")}
            className="text-xs sm:text-sm"
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === "6months" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("6months")}
            className="text-xs sm:text-sm"
          >
            6 Months
          </Button>
          <Button
            variant={selectedPeriod === "1year" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("1year")}
            className="text-xs sm:text-sm"
          >
            1 Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">
                  Total Revenue
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">
                  Total Invoices
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                  {analytics.totalInvoices}
                </p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600">
                  Collection Rate
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                  {collectionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-orange-600">
                  Avg Invoice Value
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">
                  {formatCurrency(analytics.averageInvoiceValue)}
                </p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Invoice Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Invoice Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.statusBreakdown.map((status) => (
              <div key={status.status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status.status)}
                    <span className="font-medium capitalize">
                      {status.status}
                    </span>
                    <Badge className={getStatusColor(status.status)}>
                      {status.count}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {status.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={status.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyRevenue.map((month, index) => {
                const maxRevenue = Math.max(
                  ...analytics.monthlyRevenue.map((m) => m.revenue)
                );
                const percentage =
                  maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;

                return (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{month.month}</span>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(month.revenue)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {month.count} invoices
                        </div>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Clients by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topClients.length > 0 ? (
                analytics.topClients.map((client, index) => (
                  <div
                    key={client.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-600">
                          {client.invoiceCount} invoice
                          {client.invoiceCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(client.totalRevenue)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No client data available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-l-4 border-purple-200 bg-purple-50 rounded-r-lg"
                  >
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-gray-600">
                        Invoice #{activity.invoice}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(activity.date)}
                      </div>
                    </div>
                    <div className="font-semibold text-purple-600">
                      {formatCurrency(activity.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
              {analytics.paidInvoices}
            </p>
            <p className="text-xs sm:text-sm text-green-600">Paid Invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-600 mx-auto mb-2" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">
              {analytics.pendingInvoices}
            </p>
            <p className="text-xs sm:text-sm text-yellow-600">Pending Invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
              {analytics.overdueInvoices}
            </p>
            <p className="text-xs sm:text-sm text-red-600">Overdue Invoices</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
