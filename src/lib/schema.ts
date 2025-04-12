
import { pgTable, serial, text, timestamp, integer, real , varchar} from 'drizzle-orm/pg-core';

// User Table (synced with Clerk)
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(), // Use Clerk's user ID or a UUID
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  name: varchar("name", { length: 255 }),
});
// Categories Table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // expense or income
  color: text('color').notNull(),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Transactions Table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  amount: real('amount').notNull(),
  description: text('description'),
  type: text('type').notNull(), // expense or income
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Budgets Table
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id),
  amount: real('amount').notNull(),
  period: text('period').notNull(), // monthly, yearly
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// AI Insights Table
export const aiInsights = pgTable('ai_insights', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  type: text('type').notNull(), // saving_opportunity, spending_pattern, budget_warning
  createdAt: timestamp('created_at').defaultNow(),
});