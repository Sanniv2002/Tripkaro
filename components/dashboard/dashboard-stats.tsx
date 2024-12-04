'use client';

import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, IndianRupee, TrendingUp, Users, Wallet } from 'lucide-react';

export function DashboardStats({metrics, loading} : {metrics:any, loading:boolean}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '---' : `${formatCurrency(metrics.totalExpense)}`}
          </div>
          {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        </CardContent>
      </Card>

      {/* Active Trips */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '---' : metrics.activeTripsCount}
          </div>
          {/* <p className="text-xs text-muted-foreground">1 ending this week</p> */}
        </CardContent>
      </Card>

      {/* Total Participants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '---' : metrics.totalParticipants}
          </div>
          <p className="text-xs text-muted-foreground">Across all trips</p>
        </CardContent>
      </Card>

      {/* Average Per Trip */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Per Trip</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading
              ? '---'
              : `${formatCurrency(metrics.averageCostPerActiveTrip)}`}
          </div>
          <p className="text-xs text-muted-foreground">Based on active trips</p>
        </CardContent>
      </Card>
    </div>
  );
}
