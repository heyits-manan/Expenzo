"use client"

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      try {
        fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.id,
            email: user?.emailAddresses[0].emailAddress,
            name: user?.fullName,
          }),
        });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }, [isSignedIn]);

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-100 dark:to-dark-200">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-5xl font-bold text-primary-800 dark:text-primary-200 mb-8">
          Smart Expense Tracker
        </h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Take control of your finances with our AI-powered expense tracking
          app. Track expenses, analyze spending patterns, and get personalized
          insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 bg-white hover:bg-gray-100 dark:bg-dark-300 dark:hover:bg-dark-400 text-primary-600 dark:text-primary-300 font-medium rounded-lg border border-primary-200 dark:border-primary-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
