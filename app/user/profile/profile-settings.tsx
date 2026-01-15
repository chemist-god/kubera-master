"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type ProfileUser = {
  id?: string;
  username: string;
  email: string;
};

interface ProfileSettingsProps {
  initialUser: ProfileUser | null;
}

export function ProfileSettings({ initialUser }: ProfileSettingsProps) {
  const [savedUser, setSavedUser] = useState<ProfileUser | null>(initialUser);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileValues, setProfileValues] = useState({
    username: initialUser?.username ?? "",
    email: initialUser?.email ?? "",
  });
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isProfileDirty = useMemo(() => {
    return (
      profileValues.username !== (savedUser?.username ?? "") ||
      profileValues.email !== (savedUser?.email ?? "")
    );
  }, [profileValues.email, profileValues.username, savedUser?.email, savedUser?.username]);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileValues),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to update profile");
      }

      const updatedUser = result?.data ?? result;
      if (updatedUser?.username && updatedUser?.email) {
        setSavedUser(updatedUser);
        setProfileValues({
          username: updatedUser.username,
          email: updatedUser.email,
        });
      }

      toast.success("Profile updated", {
        description: "Your account details have been saved.",
      });
    } catch (error) {
      toast.error("Update failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingPassword(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordValues),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to update password");
      }

      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      toast.error("Password update failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Profile Settings</h1>
              <p className="text-muted-foreground text-lg font-light">
                Keep your profile information up to date and secure.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <CardTitle className="text-lg font-semibold">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-5" onSubmit={handleProfileSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                    <Input
                      id="username"
                      value={profileValues.username}
                      onChange={(event) =>
                        setProfileValues((prev) => ({ ...prev, username: event.target.value }))
                      }
                      placeholder="Choose a username"
                      autoComplete="username"
                      className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is visible to other users and on your activity.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileValues.email}
                      onChange={(event) =>
                        setProfileValues((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground">
                      We will send receipts and alerts to this email.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button type="submit" disabled={!isProfileDirty || isSavingProfile} className="h-10 rounded-full px-6 shadow-sm">
                      {isSavingProfile ? "Saving..." : "Save changes"}
                    </Button>
                    {!isProfileDirty && (
                      <span className="text-xs text-muted-foreground">
                        No changes to save.
                      </span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <CardTitle className="text-lg font-semibold">Security</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-5" onSubmit={handlePasswordSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordValues.currentPassword}
                      onChange={(event) =>
                        setPasswordValues((prev) => ({
                          ...prev,
                          currentPassword: event.target.value,
                        }))
                      }
                      autoComplete="current-password"
                      className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordValues.newPassword}
                        onChange={(event) =>
                          setPasswordValues((prev) => ({
                            ...prev,
                            newPassword: event.target.value,
                          }))
                        }
                        autoComplete="new-password"
                        className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm new password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordValues.confirmPassword}
                        onChange={(event) =>
                          setPasswordValues((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        autoComplete="new-password"
                        className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button type="submit" disabled={isSavingPassword} className="h-10 rounded-full px-6 shadow-sm">
                      {isSavingPassword ? "Updating..." : "Update password"}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Use at least 8 characters with letters and numbers.
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <CardTitle className="text-lg font-semibold">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm p-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Signed in as</p>
                  <p className="font-medium text-base truncate">{savedUser?.username || "Unknown user"}</p>
                </div>
                <Separator className="bg-border/50" />
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Contact email</p>
                  <p className="font-medium text-base truncate">{savedUser?.email || "Not available"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                  Need help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  If you notice unexpected changes or need assistance, reach out to our support team.
                </p>
                <Button variant="outline" type="button" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
                  Contact support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
