import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <nav className="px-4 pt-4">
      <div className="max-w-6xl mx-auto bg-white shadow-sm border border-gray-100 rounded-full px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-lg font-bold text-gray-900">DocuSense AI</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
          >
            Dashboard
          </Link>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
