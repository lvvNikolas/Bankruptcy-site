// src/app/layout/Shell.tsx
import Header from "@widgets/Header/Header";
import Footer from "@widgets/Footer/Footer";
import FloatingCTA from "@widgets/FloatingCTA/FloatingCTA";
import styles from "./Shell.module.css";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}