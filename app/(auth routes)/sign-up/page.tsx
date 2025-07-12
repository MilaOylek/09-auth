"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { useAuth } from "@/lib/store/authStore";
import css from "./SignUp.module.css";
import { AxiosError } from "axios";

const Register = () => {
  const router = useRouter();
  const setUser = useAuth((state) => state.setUser);
  const [error, setError] = useState("");

  const handleRegister = async (formData: FormData) => {
    try {
      const payload = Object.fromEntries(formData) as RegisterRequest;
      const res = await register(payload);
      if (res) {
        setUser(res);
        router.push("/profile");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleRegister}>
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
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default Register;
