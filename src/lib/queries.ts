import { db } from './db';
import { transactions, categories, budgets, aiInsights, users } from './schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { currentUser } from "@clerk/nextjs/server";

// Helper function to get the current user ID
export const getUserId = () => {
  const user  = currentUser();
  if (!user.id) throw new Error('Unauthorized');
  return user.id;
};

// User related queries
export async function getOrCreateUser(userId: string, email: string, firstName?: string, lastName?: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (existingUser) return existingUser;

  const newUser = await db.insert(users).values({
    id: userId,
    email,
    firstName,
    lastName,
  }).returning();

  return newUser[0];
}

// Transactions related queries
export async function getTransactions(
  startDate?: Date, 
  endDate?: Date, 
  type?: string, 
  categoryId?: number,
  limit = 20,
  offset = 0
) {
  const userId = getUserId();
  
  let query = db.select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(transactions.date));
  
  if (startDate) {
    query = query.where(gte(transactions.date, startDate));
  }
  
  if (endDate) {
    query = query.where(lte(transactions.date, endDate));
  }
  
  if (type) {
    query = query.where(eq(transactions.type, type));
  }
  
  if (categoryId) {
    query = query.where(eq(transactions.categoryId, categoryId));
  }
  
  return query;
}

export async function createTransaction(
  amount: number,
  type: string,
  description: string,
  date: Date,
  categoryId?: number
) {
  const userId = getUserId();
  
  const result = await db.insert(transactions).values({
    userId,
    amount,
    type,
    description,
    date,
    categoryId,
  }).returning();
  
  return result[0];
}

export async function updateTransaction(
  id: number,
  data: {
    amount?: number;
    type?: string;
    description?: string;
    date?: Date;
    categoryId?: number;
  }
) {
  const userId = getUserId();
  
  const result = await db.update(transactions)
    .set(data)
    .where(and(
      eq(transactions.id, id),
      eq(transactions.userId, userId)
    ))
    .returning();
  
  return result[0];
}

export async function deleteTransaction(id: number) {
  const userId = getUserId();
  
  await db.delete(transactions)
    .where(and(
      eq(transactions.id, id),
      eq(transactions.userId, userId)
    ));
}

// Categories related queries
export async function getCategories(type?: string) {
  const userId = getUserId();
  
  let query = db.select().from(categories).where(eq(categories.userId, userId));
  
  if (type) {
    query = query.where(eq(categories.type, type));
  }
  
  return query;
}

export async function createCategory(
  name: string,
  type: string,
  color: string,
  icon?: string
) {
  const userId = getUserId();
  
  const result = await db.insert(categories).values({
    userId,
    name,
    type,
    color,
    icon,
  }).returning();
  
  return result[0];
}

// Budget related queries
export async function getBudgets() {
  const userId = getUserId();
  return db.select().from(budgets).where(eq(budgets.userId, userId));
}

export async function createBudget(
  categoryId: number,
  amount: number,
  period: string,
  startDate: Date,
  endDate?: Date
) {
  const userId = getUserId();
  
  const result = await db.insert(budgets).values({
    userId,
    categoryId,
    amount,
    period,
    startDate,
    endDate,
  }).returning();
  
  return result[0];
}

// AI Insights related queries
export async function getAiInsights() {
  const userId = getUserId();
  return db.select()
    .from(aiInsights)
    .where(eq(aiInsights.userId, userId))
    .orderBy(desc(aiInsights.createdAt));
}

export async function createAiInsight(content: string, type: string) {
  const userId = getUserId();
  
  const result = await db.insert(aiInsights).values({
    userId,
    content,
    type,
  }).returning();
  
  return result[0];
}