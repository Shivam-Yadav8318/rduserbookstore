import { useContext } from "react";
import { Button } from "react-bootstrap";
import { MoonStarsFill, SunFill } from "react-bootstrap-icons";
import { ThemeContext } from "../Context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      variant={theme === "light"? "dark" : "light"}
      className="rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: "42px", height: "42px" }}
      onClick={toggleTheme}
      title="Change Theme"
    >
      {theme === "light"? <MoonStarsFill size={18} /> : <SunFill size={18} />}
    </Button>
  );
}

export default ThemeToggle;