"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateProfile } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";

type User = {
  username: string;
  email: string;
  avatar?: string;
};

export default function ProfileEditClient() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getMe();
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
        setAvatar(data.avatar || "");
      } catch {
        setError("Failed to load user data");
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProfile({ username, email, avatar });
      router.push("/profile");
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        {error && <p className={css.error}>{error}</p>}
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Avatar URL:
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
