import { Link, useNavigate } from "react-router-dom";

function getUserEmail() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.email || "";
  } catch {
    return "";
  }
}

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
          D
        </div>
        <span className="text-lg font-bold text-gray-900">DocuSense AI</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
          Dashboard
        </Link>
        <span className="text-sm text-gray-500 hidden sm:inline">{getUserEmail()}</span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
