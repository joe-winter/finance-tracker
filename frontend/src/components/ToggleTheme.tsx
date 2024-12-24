import { useEffect, useState } from "react";

export default function ToggleTheme () {
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => {
    setDarkMode((mode) => !mode)
  }

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
    )
  }, [darkMode]);
  return <button onClick={toggleTheme}>Click Me</button>
}