import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import { RequireAdmin } from "./RequireAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}
