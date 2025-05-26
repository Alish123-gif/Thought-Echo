
"use client";
import { RecentPosts, Featured, Menu } from "@/components";
import styles from "./homepage.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "adminAccess") {
      setError("You don't have permission to access the admin area.");
      // Clear the error parameter after 5 seconds
      const timer = setTimeout(() => {
        setError(null);
        // Remove the error from URL without page refresh
        if (window.history.replaceState) {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError(null)} className={styles.closeError}>×</button>
        </div>
      )}
      <Featured />
      <div className={styles.content}>
        <RecentPosts />
        <Menu />
      </div>
    </div>
  );
}
