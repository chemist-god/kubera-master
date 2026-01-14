export const dynamic = "force-dynamic";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div>{children}</div>
    </div>
  );
}
