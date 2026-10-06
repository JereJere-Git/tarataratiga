import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,.16),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(251,146,60,.16),transparent_35%)]" />
      <Suspense fallback={<div className="glass h-[440px] w-full max-w-md rounded-[32px]" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
