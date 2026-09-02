import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/api";

import {
  User,
  GitBranch,
  ShieldCheck,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ExternalLink,
  Loader2,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


// =====================================================
// SETTING PAGE
// =====================================================

function SettingPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===================================================
  // LOAD USER
  // ===================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/auth/me");

        console.log("👤 User:", response);

        setUser(response);
      } catch (err) {
        console.error("❌ Failed to load user:", err);

        setError(
          err?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setError(null);

      await api.post("/auth/logout");

      console.log("✅ Logout successful");

      // Go to landing page
      navigate("/", {
        replace: true,
      });
    } catch (err) {
      console.error("❌ Logout failed:", err);

      setError(
        err?.message ||
          "Failed to logout."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  // ===================================================
  // USER DATA
  // ===================================================

  const username =
    user?.username ||
    user?.login ||
    user?.githubUsername ||
    "GitHub User";

  const name =
    user?.name ||
    user?.displayName ||
    username;

  const githubId =
    user?.githubId ||
    user?.githubUserId ||
    user?.id ||
    "—";

  const avatarUrl =
    user?.avatarUrl ||
    user?.avatar ||
    user?.picture ||
    "";

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="mx-auto w-full max-w-4xl">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Settings className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Settings
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage your profile and application preferences.
            </p>
          </div>
        </div>
      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Card className="mb-6 border-destructive/50">
          <CardContent className="py-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}


      {/* =================================================
          PROFILE
      ================================================= */}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>

          <CardDescription>
            Your GitHub account information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* USER PROFILE */}

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={avatarUrl}
                alt={name}
              />

              <AvatarFallback className="text-lg">
                {name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold">
                {name}
              </h2>

              <p className="text-sm text-muted-foreground">
                @{username}
              </p>
            </div>
          </div>

          <Separator />

          {/* USERNAME */}

          <SettingRow
            icon={User}
            title="Username"
            description="Your GitHub username"
            value={`@${username}`}
          />

          {/* GITHUB ID */}

          <SettingRow
            icon={GitBranch}
            title="GitHub ID"
            description="Connected GitHub account ID"
            value={githubId}
            mono
          />

          {/* AUTHENTICATION */}

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Authentication
                </p>

                <p className="text-sm text-muted-foreground">
                  Authentication provider
                </p>
              </div>

            </div>

            <Badge
              variant="secondary"
              className="gap-2"
            >
              <GitBranch className="h-3.5 w-3.5" />
              GitHub Auth
            </Badge>
          </div>

        </CardContent>
      </Card>


      {/* =================================================
          APPLICATION THEME
      ================================================= */}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Application Theme
          </CardTitle>

          <CardDescription>
            Choose how DevPilot should look.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>


      {/* =================================================
          MANAGE APPLICATION
      ================================================= */}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Manage Application
          </CardTitle>

          <CardDescription>
            Manage your account and GitHub connection.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">

          {/* MANAGE ON GITHUB */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium">
                Manage on GitHub
              </p>

              <p className="text-sm text-muted-foreground">
                Open your GitHub profile.
              </p>
            </div>

            <Button
              variant="outline"
              disabled={!username}
              onClick={() => {
                window.open(
                  `https://github.com/${username}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <GitBranch className="mr-2 h-4 w-4" />

              Manage on GitHub

              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>

          </div>

          <Separator />

          {/* LOGOUT */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium">
                Logout
              </p>

              <p className="text-sm text-muted-foreground">
                Sign out of your DevPilot account.
              </p>
            </div>

            <Button
              variant="destructive"
              disabled={logoutLoading}
              onClick={handleLogout}
            >
              {logoutLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}

              {logoutLoading
                ? "Logging out..."
                : "Logout"}
            </Button>

          </div>

        </CardContent>
      </Card>

      {/* Bottom spacing */}
      <div className="h-8" />

    </div>
  );
}


// =====================================================
// SETTING ROW
// =====================================================

function SettingRow({
  icon: Icon,
  title,
  description,
  value,
  mono = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

      </div>

      <p
        className={`
          max-w-[200px]
          truncate
          text-right
          text-sm
          font-medium
          ${mono
            ? "font-mono text-xs text-muted-foreground"
            : ""
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}


// =====================================================
// THEME SELECTOR
// =====================================================

function ThemeSelector() {

  const [theme, setTheme] = useState(
    localStorage.getItem("vite-ui-theme") ||
      "dark"
  );

  // ===================================================
  // APPLY THEME
  // ===================================================

  useEffect(() => {

    const root =
      document.documentElement;

    root.classList.remove(
      "light",
      "dark"
    );

    if (theme === "system") {

      const systemTheme =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light";

      root.classList.add(
        systemTheme
      );

    } else {

      root.classList.add(theme);

    }

    localStorage.setItem(
      "vite-ui-theme",
      theme
    );

  }, [theme]);


  // ===================================================
  // THEME OPTIONS
  // ===================================================

  const themes = [
    {
      id: "light",
      label: "Light",
      description:
        "Use a light appearance.",
      icon: Sun,
    },

    {
      id: "dark",
      label: "Dark",
      description:
        "Use a dark appearance.",
      icon: Moon,
    },

    {
      id: "system",
      label: "System",
      description:
        "Follow your system preference.",
      icon: Monitor,
    },
  ];


  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="grid gap-3 sm:grid-cols-3">

      {themes.map((item) => {

        const Icon = item.icon;

        const selected =
          theme === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setTheme(item.id)
            }
            className={`
              rounded-xl
              border
              p-4
              text-left
              transition-all
              hover:bg-muted
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              ${
                selected
                  ? "border-primary bg-muted shadow-sm"
                  : "border-border"
              }
            `}
          >

            <div className="flex items-center justify-between">

              <div
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
              </div>

              {selected && (
                <Badge
                  variant="secondary"
                  className="text-[10px]"
                >
                  Active
                </Badge>
              )}

            </div>

            <div className="mt-3">

              <p className="text-sm font-medium">
                {item.label}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>

            </div>

          </button>
        );
      })}

    </div>
  );
}


export default SettingPage;