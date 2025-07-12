"use client";
import { logOut } from "@/lib/api/clientApi";
import { useAuth } from "@/lib/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import css from "./Authnavigation.module.css";

const AuthNavigation = () => {
  const { isAuth, user, clearAuth } = useAuth();
  const router = useRouter();

  const handleLogOut = async () => {
    await logOut();
    clearAuth();
    router.replace("/sign-in");
  };

  return isAuth ? (
    <div style={{ display: "flex", gap: "12px" }}>
      <h3>{user?.email}</h3>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>User email</p>
        <button className={css.logoutButton}>Logout</button>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
};

export default AuthNavigation;
