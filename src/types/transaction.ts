export interface Transaction {
  id: number; // Unique identifier for the transaction
  amount: string; // Amount of the transaction
  date: string; // ISO string representation of the transaction date
  description: string; // Description or note for the transaction
  category: string; // Category of the transaction (e.g., Food, Rent, etc.)

  type: "income" | "expense"; // Type of transaction: income or expense
}
