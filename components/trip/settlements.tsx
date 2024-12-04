'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ArrowRightFromLine, MoveRight } from 'lucide-react';

export function Settlements({ settlements }: any) {
  // Transform the input data into the required format
  const transformedSettlements = settlements.map((item: any) => ({
    from: {
      name: item.from,
      image: item.fromAvatar,
    },
    to: {
      name: item.to,
      image: item.toAvatar,
    },
    amount: item.amount,
  }));

  return (
    <Card className="col-span-2">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Outstanding Payments</h3>
        <div className="space-y-4">
          {transformedSettlements.map((debt: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={debt.from.image} alt={debt.from.name} />
                  <AvatarFallback>{debt.from.name[0]}</AvatarFallback>
                </Avatar>
                <MoveRight className='mx-6'/>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={debt.to.image} alt={debt.to.name} />
                  <AvatarFallback>{debt.to.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {debt.from.name} owes {debt.to.name}
                </span>
                <span className="font-bold">{formatCurrency(debt.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
