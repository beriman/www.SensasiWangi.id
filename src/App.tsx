import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Forum from "./pages/forum";
import Profile from "./pages/profile";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
