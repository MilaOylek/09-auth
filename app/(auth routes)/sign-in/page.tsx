"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/types/user";
import { login } from "@/lib/api/clientApi";
import { useAuth } from "@/lib/store/authStore";
import css from "./SignIn.module.css";

const Login = () => {
  const router = useRouter();
  const setUser = useAuth((state) => state.setUser);
  const [error, setError] = useState("");

  const handleLogin = async (formData: FormData) => {
    try {
      const payload = Object.fromEntries(formData) as LoginRequest;
      const res = await login(payload);
      if (res) {
        setUser(res);
        router.push("/profile");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Unexpected error occurred");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleLogin}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default Login;
