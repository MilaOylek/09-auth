"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";

const fetchUser = async () => {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
};

const updateUsername = async (username: string) => {
  const res = await fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: username }),
  });
  if (!res.ok) throw new Error("Failed to update username");
  return res.json();
};

const ProfileEditClient = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser()
      .then((user) => {
        setUsername(user.userName);
        setEmail(user.email);
        setAvatar(user.avatar || "/default-avatar.png");
        setLoading(false);
      })
      .catch(() => {
        router.push("/profile");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUsername(username);
      router.push("/profile");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileEditClient;
