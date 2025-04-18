import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-100 dark:to-dark-200">
      <SignIn />
    </div>
  );
}
