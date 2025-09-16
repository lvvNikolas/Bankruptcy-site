import { useEffect, useState } from "react";
import s from "./ScrollTopButton.module.css";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300); // показываем после 300px прокрутки
    };
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      className={`btn btn-primary ${s.scrollBtn}`}
      onClick={scrollToTop}
      aria-label="Наверх"
    >
      ↑
    </button>
  );
}