import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
} from "lucide-react";

import { Transaction } from "@/types/transaction";

export default function TransactionTab({
  transactions = [],
  formatDate,
}: {
  transactions: Transaction[];
  formatDate: (date: string | Date) => string;
}) {
  return (
    <TabsContent value="transactions" className="p-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => {
            const category = transaction.category;
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4">
                  <Avatar className={`h-10 w-10 text-gray-700`}>
                    <AvatarFallback className="font-medium">
                      {category?.slice(0, 2) || "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(transaction.date)}
                      </span>
                      <Badge variant="outline" className={`text-xs py-0 px-2 `}>
                        {category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mb-1 text-lg font-medium">No transactions yet</p>
              <p className="text-sm mb-4">
                Track your income and expenses to see them here
              </p>
            </div>
          </div>
        )}

        {transactions && transactions.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" size="sm" className="text-sm">
              View All Transactions
            </Button>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
