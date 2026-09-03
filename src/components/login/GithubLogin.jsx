import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import DevPilotLogo from "../logo/DevPilotLogo";
import { ModeToggle } from "../ui/ModeToggle";
import { Loader2 } from "lucide-react";
import { Bot } from "lucide-react";

const GithubIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mr-2 h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.805c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.625-5.475 5.922.43.372.823 1.103.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.696.825.577C20.565 21.796 24 17.297 24 12 24 5.37 18.63 0 12 0Z" />
    </svg>
  );
};

const GithubLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGithubLogin = () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);

   
    window.location.href =
       `${import.meta.env.VITE_API_OAUTH2_REDIRECT_URI}/oauth2/authorization/github`;  
  };

  return (
    <div className="min-h-screen w-full bg-background">

      {/* ================= HEADER ================= */}
<header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

    {/* DevPilot Logo */}
    <div className="flex items-center gap-2">
      
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                      <Bot className="h-4.5 w-4.5" />
        
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    </div>
        

      <span className="text-lg font-bold tracking-tight">
        DevPilot
      </span>
    </div>

    <ModeToggle />

  </div>
</header>

      {/* ================= LOGIN CONTENT ================= */}
      <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-8">

        <Card className="w-full max-w-md shadow-lg">

          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold sm:text-3xl">
              Welcome To DevPilot
            </CardTitle>

            <CardDescription className="text-sm sm:text-base">
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* ================= GITHUB LOGIN ================= */}
            <Button
              onClick={handleGithubLogin}
              disabled={isLoggingIn}
              className="h-11 w-full sm:h-12"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting to GitHub...
                </>
              ) : (
                <>
                  <GithubIcon />
                  Continue with GitHub
                </>
              )}
            </Button>

            {/* ================= SECURE LOGIN ================= */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />

              <span className="whitespace-nowrap text-xs text-muted-foreground">
                SECURE LOGIN
              </span>

              <Separator className="flex-1" />
            </div>

          </CardContent>

        </Card>

      </main>

    </div>
  );
};

export default GithubLogin;