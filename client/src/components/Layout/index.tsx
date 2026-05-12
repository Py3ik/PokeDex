import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import pikachuImg from "../../assets/gengar-theme.png";
import gengarImg from "../../assets/pika-theme.png";

type Theme = "synthwave" | "cyberpunk";

const Layout = () => {
  const { pathname } = useLocation();

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "synthwave";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "cyberpunk";
  const toggleTheme = () => setTheme(isDark ? "synthwave" : "cyberpunk");

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4">
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-primary">PokeDex App</span>
          </Link>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <Link to="/" className={pathname === "/" ? "active" : ""}>
                My Collections
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className={pathname === "/create" ? "active" : ""}
              >
                Create List
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost"
            title={`Switch to ${isDark ? "Synthwave" : "Cyberpunk"}`}
          >
            <img
              src={isDark ? gengarImg : pikachuImg}
              alt={isDark ? "Gengar" : "Pikachu"}
              className="w-14 h-14 object-contain"
            />
          </button>
          <Link to="/create" className="btn btn-primary btn-sm">
            + Create New List
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
