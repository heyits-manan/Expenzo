import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const user = await currentUser();
    console.log("Clerk User:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const name = user.fullName;
    console.log("User Email:", email);
    console.log("User Name:", name);

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    console.log("Existing User:", existingUser);

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User already exists" });
    }

    await db.insert(users).values({ id: user.id, email, name }).execute();
    console.log("User inserted into database");

    return NextResponse.json({ message: "User created" });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
