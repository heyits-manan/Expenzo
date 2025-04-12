import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // Import your database instance
import { transactions } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Fetch all transactions
export async function GET(req: Request) {
  try {
    const user = await currentUser(); // Get the authenticated user's ID
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.id));

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// Add a new transaction
export async function POST(req: Request) {
  try {
    const  user  = await currentUser(); // Get the authenticated user's ID

    if (!user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category, amount, description, type, date } = body;
    console.log(body)


    // Validate required fields
    if (!category || !amount || !type || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTransaction = await db.insert(transactions).values({
      userId: user.id,
      amount,
      category,
      description,
      type,
      date: new Date(date),
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}