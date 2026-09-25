import TopBar from "@/components/shared/Header";
import UserProfile from "../components/profile";
import { RoleGuard } from "@/components/shared/RoleGuard";

export function Profile() {
    return (
        <>
            <TopBar showDatePicker={false} />
            <div className=" bg-background text-foreground">
                <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px] max-w-[1180px] mx-auto">
                    <RoleGuard rootOnly>
                        <UserProfile />
                    </RoleGuard>
                </main>
            </div>
        </>
    );
}

export const ProfilePage = Profile;
export default Profile;