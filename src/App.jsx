import ThemeProvider from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";

import GithubLogin from "./components/login/GithubLogin";
import Authcallback from "./components/auth/Authcallback";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./Route/ProtectedRoutes";
import PublicRoute from "./Route/PubicRoute";
import Repositories from "./components/Repositories";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <QueryProvider>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="vite-ui-theme"
      >
        <BrowserRouter>
          <Routes>

            {/* Landing Page */}
            <Route
              path="/"
              element={<LandingPage />}
            />

                  <Route
        path="/chat/:id"
        element={<ChatPage />}
      />

            {/* Public */}
            <Route element={<PublicRoute />}>
              <Route
                path="/login"
                element={<GithubLogin />}
              />
            </Route>

            {/* OAuth Callback */}
            <Route
              path="/auth/callback"
              element={<Authcallback />}
            />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />}>
    {/* <Route index element={<Overview />} /> */}
    <Route path="repositories" element={<Repositories />} />
    {/* <Route path="settings" element={<Settings />} /> */}
  </Route>
</Route>

            {/* Unknown route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;