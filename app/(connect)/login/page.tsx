import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  const isRegistered = params?.registered === "true";

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-stone-900 flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <span className="text-3xl font-bold text-primary mb-2">
            Sign in to Kubera
          </span>
          {isRegistered && (
            <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              Account created successfully! Please sign in.
            </div>
          )}
        </div>
        <LoginForm />
        <div className="text-center text-sm text-muted-foreground mt-2">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}