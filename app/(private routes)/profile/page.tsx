import { getServerMe } from "@/lib/api/serverApi";
import { Metadata } from "next";
import css from "./ProfilePage.module.css";
import Image from "next/image";
import { type User } from "@/types/user";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View and edit your profile information",
  openGraph: {
    title: "User Profile",
    description: "View and edit your profile information",
    url: "https://09-auth-plum.vercel.app/private-routes/profile",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - User Profile",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteHubApp | User Profile",
    description: "Manage your profile information in NoteHubApp",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ProfilePage() {
  const user: User = await getServerMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
