"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe, updateProfile } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";
import { useAuth } from "@/lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

type User = {
  username: string;
  email: string;
  avatar?: string;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await getMe();
        setUser(data);
        setUsername(data.username);
      } catch (err: unknown) {
        console.error("Failed to load user data:", err);
        setError("Failed to load user data. Please try again.");
        router.push("/profile");
      }
    }
    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedUserData = await updateProfile({ username });

      setAuthUser(updatedUserData);

      queryClient.invalidateQueries({ queryKey: ["me"] });

      router.push("/profile");
    } catch (err: unknown) {
      console.error("Failed to update profile:", String(err));
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    router.back();
  };

  if (loading || !user) {
    return <p>Loading user data...</p>;
  }

  return (
    <main className={css.mainContent}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        {error && <p className={css.error}>{error}</p>}

        {user.avatar && (
          <div className={css.avatarContainer}>
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={100}
              height={100}
              className={css.avatarImage}
            />
          </div>
        )}

        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={css.input}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={user.email}
            readOnly
            className={css.input}
          />
        </label>

        <div className={css.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className={css.submitButton}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
