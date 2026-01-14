import { getCurrentUser } from "@/lib/actions/user";
import { ProfileSettings } from "./profile-settings";

export default async function ProfilePage() {
  const userResult = await getCurrentUser();
  const user = userResult.success && userResult.data ? userResult.data : null;

  return (
    <ProfileSettings initialUser={user} />
  );
}
