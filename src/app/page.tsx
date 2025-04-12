"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, user } = useUser();
  console.log("user: ", user);
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
  }, [isSignedIn, user]);

  useEffect(() => {
    if (isSignedIn && user) {
      redirect("/dashboard");
    }
  }, [isSignedIn, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-purple-100 blur-3xl opacity-30 dark:bg-purple-900 dark:opacity-20"></div>
        <div className="absolute -left-40 top-1/2 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-30 dark:bg-blue-900 dark:opacity-20"></div>
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-cyan-100 blur-3xl opacity-30 dark:bg-cyan-900 dark:opacity-20"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-screen flex-col items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="mb-12">
            <div className="inline-block p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-6">
              <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Smart{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Expense Tracker
              </span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Take control of your finances with our AI-powered expense tracking
            app. Get real-time insights and reach your financial goals faster.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/sign-in"
              className="group relative px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gain insights into your spending habits with AI-powered
                analytics.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your expenses in real-time and stay on top of your
                budget.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Suggestions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized recommendations to optimize your financial
                health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
