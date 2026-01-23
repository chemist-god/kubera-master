import { LoginForm } from "./login-form";

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-8">
      {/* Subtle Background Effects - Clean & Lit */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2" />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2" />

      <div className="w-full max-w-[400px] p-8 md:p-10 rounded-2xl shadow-2xl bg-background/80 backdrop-blur-xl border border-white/10 flex flex-col gap-8 relative z-10 transition-all duration-300 hover:shadow-primary/5 ring-1 ring-white/5">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            {/* Logo Placeholder */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" /></svg>
          </div>
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground text-center">
            Welcome Back
          </span>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Sign in to your Kubera account
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <a href="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}