import ProfileEditClient from "./ProfileEditClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Edit",
  description: "Edit your profile on NoteHubApp",
};

export default function ProfileEditPage() {
  return <ProfileEditClient />;
}
