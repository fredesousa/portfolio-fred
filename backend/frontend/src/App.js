import { Link, Route, Routes, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="font-semibold text-xl">Portfolio / Frederico</Link>
          <div className="flex gap-4">
            {[
              ["/", "Accueil"],
              ["/projects", "Projets"],
              ["/about", "À propos"],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-full text-sm ${isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`
                }
                end
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}
