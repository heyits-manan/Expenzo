"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {

  ArrowUpRight,
  ArrowDownRight,

  LightbulbIcon,
  BarChart3,
  MoreHorizontal,
  Calendar,
  Plus,

} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserButton } from "@clerk/nextjs";

// Type definitions
interface Transaction {
  id?: number;
  amount: string;
  description: string;
  type: "income" | "expense";
  date: string;
  categoryId?: number;
}

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
}

interface Budget {
  id: number;
  categoryId: number;
  amount: number;
}

interface Insight {
  id: number;
  content: string;
  createdAt: string;
}

interface MonthlyData {
  name: string;
  income: number;
  expenses: number;
}

interface NewTransaction {
  amount: string;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
}

// Database utility functions
const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch("/api/transactions");
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const fetchBudgets = async (): Promise<Budget[]> => {
  try {
    const response = await fetch("/api/budgets");
    if (!response.ok) throw new Error("Failed to fetch budgets");
    return await response.json();
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
};

const fetchAiInsights = async (): Promise<Insight[]> => {
  try {
    const response = await fetch("/api/ai-insights");
    if (!response.ok) throw new Error("Failed to fetch AI insights");
    return await response.json();
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return [];
  }
};

const addTransaction = async (transactionData: { 
  amount: number | string; 
  description: string; 
  category: string; 
  type: string; 
  date: string; 
}): Promise<Transaction> => {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) throw new Error("Failed to add transaction");
    const data = await response.json();
    return data;
  };

export default function ExpenseTrackerDashboard() {
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [isAddingTransaction, setIsAddingTransaction] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for data from database
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [aiInsights, setAiInsights] = useState<Insight[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    amount: "",
    description: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });
  
  const fallbackCategories: Category[] = [
    { id: 1, name: "Groceries", type: "expense", color: "#34D399" },
    { id: 2, name: "Rent", type: "expense", color: "#F87171" },
    { id: 3, name: "Salary", type: "income", color: "#60A5FA" },
    { id: 4, name: "Investments", type: "income", color: "#FBBF24" },
  ];
  
  // Derived data
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

  const balance = totalIncome - totalExpenses;

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [transactionsData, categoriesData, budgetsData, insightsData] =
          await Promise.all([
            fetchTransactions(),
            fetchCategories(),
            fetchBudgets(),
            fetchAiInsights(),
          ]);

        setTransactions(transactionsData);
        setCategories(categoriesData);
        setBudgets(budgetsData);
        setAiInsights(insightsData);

        // Generate monthly data
        const monthlyDataCalculated = generateMonthlyData(transactionsData);
        setMonthlyData(monthlyDataCalculated);
      } catch (error) {
        console.error("Error loading data:", error);
        // In a real app, you'd show error states
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to generate monthly data for charts
  const generateMonthlyData = (transactionsData: Transaction[]): MonthlyData[] => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    // Get the last 6 months
    const relevantMonths = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      relevantMonths.push(months[monthIndex]);
    }

    // Calculate income and expenses for each month
    return relevantMonths.map((month) => {
      const monthIndex = months.indexOf(month);

      // Filter transactions for this month
      const monthTransactions = transactionsData.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === monthIndex;
      });

      const monthIncome = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const monthExpenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

      return {
        name: month,
        income: monthIncome,
        expenses: monthExpenses,
      };
    });
  };

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setNewTransaction((prev) => ({
      ...prev,
      category: value,
    }));
  };

  // Handle transaction type selection
  const handleTypeChange = (value: "income" | "expense") => {
    setNewTransaction((prev) => ({
      ...prev,
      type: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (
      !newTransaction.amount ||
      !newTransaction.description ||
      !newTransaction.category
    ) {
      // You could integrate with a toast notification system here
      alert("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);

      // Format amount - for expenses, store as negative value
      const formattedAmount =
        newTransaction.type === "expense"
          ? -Math.abs(parseFloat(newTransaction.amount))
          : Math.abs(parseFloat(newTransaction.amount));

      // Prepare transaction data
      const transactionData = {
        ...newTransaction,
        amount: formattedAmount,
      };

      console.log(transactionData);
      // Send data to API
      await addTransaction(transactionData);

      // Refresh transactions data
      const updatedTransactions = await fetchTransactions();
      setTransactions(updatedTransactions);

      // Reset form and close dialog
      setNewTransaction({
        amount: "",
        description: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
      setIsAddingTransaction(false);

      // Show success notification
      alert("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      // Show error notification
      alert("Failed to add transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `${date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })}, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  // Get category details by ID
  const getCategoryById = (categoryId: number | undefined): Category => {
    return (
      categories.find((cat) => cat.id === categoryId) || {
        id: 0,
        name: "Uncategorized",
        type: "expense" as const,
        color: "#888888",
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Finance Tracker</h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsAddingTransaction(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Add Transaction
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <Tabs
            defaultValue="overview"
            value={currentTab}
            onValueChange={setCurrentTab}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="budgets">Budgets</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Button>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${balance.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+14.2% from last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Monthly Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${totalIncome.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+2.5% from last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Monthly Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${totalExpenses.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm text-red-600 mt-1">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span>-3.8% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle>Income vs Expenses</CardTitle>
                      <CardDescription>
                        Your financial trends over the past 6 months
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Download CSV</DropdownMenuItem>
                        <DropdownMenuItem>Print Report</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart
                          data={monthlyData}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#888888"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis stroke="#888888" tick={{ fontSize: 12 }} />
                          <Tooltip
                            formatter={(value) => [
                              `$${typeof value === "number" ? value.toFixed(2) : value}`,
                              undefined,
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Income"
                          />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#f43f5e"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Expenses"
                          />
                        </ReLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Budget Status</CardTitle>
                    <CardDescription>
                      Current period spending vs budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {budgets.length > 0 ? (
                      <div className="space-y-4">
                        {budgets.map((budget) => {
                          const category = getCategoryById(budget?.categoryId);
                          const spent = transactions
                            .filter(
                              (t) =>
                                t.categoryId === budget.categoryId &&
                                t.type === "expense"
                            )
                            .reduce(
                              (sum, t) => sum + Math.abs(parseFloat(t.amount)),
                              0
                            );

                          const percentSpent = (spent / budget.amount) * 100;

                          return (
                            <div key={budget.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">
                                  {category.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ${spent.toFixed(2)} / $
                                  {budget.amount.toFixed(2)}
                                </span>
                              </div>
                              <Progress
                                value={percentSpent}
                                className="h-2"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No budgets set up yet</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Create Budget
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View All Budgets
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>
                        Your latest financial activities
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.slice(0, 5).map((transaction, idx) => {
                          const category = getCategoryById(
                            transaction.categoryId
                          );
                          return (
                            <div
                              key={transaction.id || idx}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar
                                  className="h-9 w-9"
                                  style={{
                                    backgroundColor: `${category.color}20`,
                                  }}
                                >
                                  <AvatarFallback
                                    style={{ color: category.color }}
                                  >
                                    {category.name.charAt(0) +
                                      category.name.charAt(1)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {transaction.description}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(transaction.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span
                                  className={`font-semibold ${
                                    transaction.type === "income"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {transaction.type === "income" ? "+" : "-"}$
                                  {Math.abs(
                                    parseFloat(transaction.amount)
                                  ).toFixed(2)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {category.name}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No transactions yet</p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => setIsAddingTransaction(true)}
                        >
                          Add Your First Transaction
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setCurrentTab("transactions")}
                    >
                      View Transaction History
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>AI Financial Insights</CardTitle>
                    <CardDescription>
                      Personalized recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {aiInsights.length > 0 ? (
                      <div className="space-y-4">
                        {aiInsights.slice(0, 3).map((insight) => (
                          <div
                            key={insight.id}
                            className="bg-blue-50 p-3 rounded-lg border border-blue-100"
                          >
                            <div className="flex gap-2 mb-1">
                              <LightbulbIcon className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                              <p className="text-sm text-gray-700">
                                {insight.content}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">
                              {new Date(insight.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No insights available yet</p>
                        <p className="text-xs mt-1">
                          Add more transactions to get personalized insights
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setCurrentTab("insights")}
                    >
                      View All Insights
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">
                  Transactions tab content would go here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="budgets">
              <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">
                  Budgets tab content would go here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="insights">
              <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">
                  AI Insights tab content would go here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your transaction below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value: string) => handleTypeChange(value as "income" | "expense")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="e.g., Grocery shopping"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {fallbackCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingTransaction(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
