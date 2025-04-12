import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import path as needed
import { users } from "@/lib/schema"; // Adjust the import path as needed
import { currentUser } from "@clerk/nextjs/server"; // Import Clerk's getAuth function
import { eq } from "drizzle-orm"; // Import the 'eq' helper from Drizzle ORM

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    const email = user.emailAddresses[0].emailAddress;
    const name = user.fullName;
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Check if user already exists in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User already exists" });
    }

    // Insert the user if not found
    await db.insert(users).values({ id: user.id, email, name }).execute();
    return NextResponse.json({ message: "User created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}