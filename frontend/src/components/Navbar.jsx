import { Link, useNavigate } from "react-router-dom";

function getUserInitial() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.name?.charAt(0)?.toUpperCase() || "U";
  } catch {
    return "U";
  }
}

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
          D
        </div>
        <span className="text-lg font-bold text-gray-900">DocuSense AI</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
          {getUserInitial()}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-indigo-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
