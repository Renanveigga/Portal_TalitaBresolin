import { useState, useEffect } from "react";

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const salvo = localStorage.getItem("tema");
    return salvo ? salvo === "dark" : true;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema", "light");
    }
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return { dark, toggleTheme };
}