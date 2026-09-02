import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Sparkles,
  MessageSquareCode,
  GitBranch,
  ShieldCheck,
  Code2,
  Check,
  Bot
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import DevPilotLogo from "./logo/DevPilotLogo";
import api from "@/api/api";

const LandingPage = () => {
  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me"),
    retry: false,
  });

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">

      {/* ================= NAVBAR ================= */}
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

      {/* ================= HERO ================= */}
      <main>

        <section className="relative overflow-hidden">

          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">

            <div className="absolute left-1/2 top-[-150px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

            <div className="absolute left-[10%] top-[40%] h-40 w-40 rounded-full bg-blue-500/10 blur-[80px]" />

            <div className="absolute right-[10%] top-[50%] h-40 w-40 rounded-full bg-violet-500/10 blur-[80px]" />

          </div>


          <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-4xl text-center">

              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-2 text-sm shadow-sm backdrop-blur">

                <Sparkles className="h-4 w-4 text-primary" />

                <span className="text-muted-foreground">
                  AI-powered development workspace
                </span>

                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />

              </div>


              {/* Heading */}
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">

                Understand your

                <span className="block bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                  code better.
                </span>

              </h1>


              {/* Description */}
              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">

                DevPilot connects to your GitHub repositories and gives you
                an intelligent way to explore, understand, and chat with
                your codebase.

              </p>


              {/* CTA */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                {/* Main button */}
                <Button
                  size="lg"
                  asChild
                  className="h-12 w-full rounded-lg px-7 text-base shadow-lg shadow-primary/20 sm:w-auto"
                >
                  <Link
                    to={isLoggedIn ? "/dashboard" : "/login"}
                  >
                    {isLoggedIn ? "Go to Dashboard" : "Get Started"}

                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>


                {/* GitHub button only for logged-out users */}
                {!isLoading && !isLoggedIn && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-12 w-full rounded-lg px-7 text-base backdrop-blur sm:w-auto"
                  >
                    <Link to="/login">

                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.805c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.625-5.475 5.922.43.372.823 1.103.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.696.825.577C20.565 21.796 24 17.297 24 12 24 5.37 18.63 0 12 0Z" />
                      </svg>

                      Continue with GitHub

                    </Link>
                  </Button>
                )}

              </div>


              {/* Trust */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Secure authentication
                </div>

                <div className="hidden h-4 w-px bg-border sm:block" />

                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  Built for developers
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="border-y bg-muted/20 py-24"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <div className="mb-4 inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                FEATURES
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to
                <span className="text-primary"> understand your code.</span>
              </h2>

              <p className="mt-4 text-muted-foreground">
                DevPilot brings your GitHub projects and AI together in one
                developer-focused workspace.
              </p>

            </div>


            <div className="mt-14 grid gap-6 md:grid-cols-3">

              {/* Card 1 */}
              <div className="group rounded-2xl border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <MessageSquareCode className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Chat with your code
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  Ask questions about your codebase and understand how
                  different parts of your project work together.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  <Check className="h-4 w-4" />
                  AI-powered code conversations
                </div>

              </div>


              {/* Card 2 */}
              <div className="group rounded-2xl border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  GitHub integration
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  Connect your GitHub account and access your repositories
                  directly from your DevPilot workspace.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  <Check className="h-4 w-4" />
                  Your repositories in one place
                </div>

              </div>


              {/* Card 3 */}
              <div className="group rounded-2xl border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Developer focused
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  A clean workspace designed specifically for developers
                  working with real-world codebases.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  <Check className="h-4 w-4" />
                  Simple and distraction-free
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}
        <section className="relative overflow-hidden py-24">

          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">

            <Sparkles className="mx-auto h-8 w-8 text-primary" />

            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
              Your codebase.
              <span className="block text-primary">
                Your AI companion.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Stop spending hours searching through files.
              Start understanding your code with DevPilot.
            </p>

            <Button
              size="lg"
              asChild
              className="mt-8 h-12 rounded-lg px-8 shadow-lg shadow-primary/20"
            >
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}

                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-muted/20">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">

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


          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevPilot. Built for developers.
          </p>

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;