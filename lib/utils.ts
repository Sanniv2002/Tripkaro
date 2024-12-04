import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Member = {
  name: string;
  avatar: string;
  spent: number;
};

type Settlement = {
  from: string;
  to: string;
  amount: number;
  fromAvatar: string,
  toAvatar: string;
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatCurrency(amount: number, currency: 'USD' | 'INR' = 'INR') {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // Sun, Mon, etc.
    year: "numeric",  // 2024
    month: "short",   // Dec
    day: "2-digit",   // 01
    hour: "2-digit",  // 08
    minute: "2-digit", // 15
    hour12: true,     // 12-hour format
  };

  return date.toLocaleDateString("en-US", options);
}

//Function to calculate the settlements amond trip members uses Greedy Approach
function calculateSettlements(totalCost: number, members: Member[]): Settlement[] {
  const n = members.length; // Total members
  const perHead = totalCost / n; // Share per head
  const settlements: Settlement[] = [];

  // Step 1: Calculate balances
  const balances = members.map(member => ({
    name: member.name,
    balance: member.spent - perHead,
    avatar: member.avatar
  }));

  // Separate creditors and debtors
  const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

  // Step 2: Settle balances
  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const settlementAmount = Math.min(creditor.balance, -debtor.balance);

    // Record the settlement
    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: settlementAmount,
      fromAvatar: debtor.avatar,
      toAvatar: creditor.avatar
    });

    // Update balances
    creditor.balance -= settlementAmount;
    debtor.balance += settlementAmount;

    // Remove settled members
    if (creditor.balance === 0) creditors.shift();
    if (debtor.balance === 0) debtors.shift();
  }

  return settlements;
}

export { cn, formatDate, formatCurrency, calculateSettlements }