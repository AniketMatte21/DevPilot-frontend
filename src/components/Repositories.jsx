import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import IndexButton from "./indexing/IndexButton";
import IndexStatusDialog from "./indexing/IndexStatusDialog";

import {
  RefreshCw,
  GitBranch,
  Lock,
  Globe,
  ExternalLink,
  CheckCircle2,
  Clock3,
  Loader2,
  XCircle,
  MessageCircle,
  AlertCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Adjust this import path to match your project


const Repositories = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ================= FILTER STATE =================

  const [filter, setFilter] = useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");


  // ================= DIALOG STATE =================

  const [statusDialogOpen, setStatusDialogOpen] =
    useState(false);

  const [selectedRepo, setSelectedRepo] =
    useState(null);


  // ================= INDEX ERROR =================

  const [indexError, setIndexError] =
    useState(null);


  // ================= FETCH REPOSITORIES =================

  const {
    data: repositories = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({

    queryKey: ["repositories"],

    queryFn: async () => {

      const response = await api.get(
        "/repos?refresh=false"
      );

      console.log(
        "📦 Repositories response:",
        response
      );

      console.log(
        "📊 Number of repositories:",
        response?.length
      );

      return response ?? [];
    },

    retry: false,
  });


  // ================= SYNC =================

  const handleSync = async () => {

    try {

      console.log("🔄 Sync started...");

      setIndexError(null);

      const response = await api.get(
        "/repos?refresh=true"
      );

      console.log(
        "✅ Sync response:",
        response
      );

      console.log(
        "📊 Synced repositories:",
        response?.length
      );

      await queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });

      console.log(
        "🔃 Repository query refreshed"
      );

    } catch (error) {

      console.error(
        "❌ Sync failed:",
        error
      );

    }
  };


  // =================================================
  // OPEN INDEX STATUS DIALOG
  // =================================================

  const handleOpen = (repo) => {

    console.log(
      "📂 Opening repository:",
      repo
    );

    console.log(
      "🆔 Repository ID:",
      repo.id
    );

    setSelectedRepo(repo);

    setStatusDialogOpen(true);
  };


  // =================================================
  // CHAT
  // =================================================

const handleChat = (repo) => {
  navigate(`/chat/${repo.id}`, {
    state: {
      id: repo.id,
      repoName: repo.name,
    },
  });
};


  // =================================================
  // STATUS BADGE
  // =================================================

  const getStatusBadge = (status) => {

    switch (status) {

      case "READY":

        return (
          <Badge
            variant="default"
            className="gap-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready
          </Badge>
        );


      case "INDEXING":

        return (
          <Badge
            variant="secondary"
            className="gap-1"
          >
            <Loader2
              className="h-3.5 w-3.5 animate-spin"
            />
            Indexing
          </Badge>
        );


      case "PENDING":

        return (
          <Badge
            variant="outline"
            className="gap-1"
          >
            <Clock3 className="h-3.5 w-3.5" />
            New
          </Badge>
        );


      case "FAILED":

        return (
          <Badge
            variant="destructive"
            className="gap-1"
          >
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </Badge>
        );


      default:

        return (
          <Badge
            variant="outline"
            className="gap-1"
          >
            <Clock3 className="h-3.5 w-3.5" />
            New
          </Badge>
        );
    }
  };


  // =================================================
  // FILTER REPOSITORIES
  // =================================================

  const filteredRepositories =
    repositories.filter((repo) => {

      // ================= VISIBILITY =================

      const visibilityMatch =
        filter === "all" ||
        (
          filter === "public" &&
          repo.isPrivate === false
        ) ||
        (
          filter === "private" &&
          repo.isPrivate === true
        );


      // ================= STATUS =================

      const statusMatch =
        statusFilter === "all" ||

        (
          statusFilter === "PENDING" &&
          (
            !repo.indexStatus ||
            repo.indexStatus === "PENDING"
          )
        ) ||

        repo.indexStatus === statusFilter;


      return (
        visibilityMatch &&
        statusMatch
      );
    });


  return (

    <div
      className="
        flex
        h-screen
        w-full
        flex-col
        overflow-hidden
        bg-background
      "
    >


      {/* ================================================= */}
      {/* FIXED HEADER */}
      {/* ================================================= */}

      <header
        className="
          shrink-0
          border-b
          bg-background
        "
      >

        <div className="px-6 py-5">

          <div
            className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-start
              md:justify-between
            "
          >


            {/* ================= LEFT ================= */}

            <div className="min-w-0 flex-1">

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                "
              >
                Repositories
              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                {repositories.length}{" "}

                {repositories.length === 1
                  ? "repository"
                  : "repositories"}
              </p>


              {/* ================= FILTERS ================= */}

              {!isLoading &&
                !isError &&
                repositories.length > 0 && (

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >

                    {/* ================= VISIBILITY ================= */}

<div className="flex flex-wrap items-center gap-2">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size="sm" variant="outline" className="gap-2">
        Visibility
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent align="start">
      <DropdownMenuItem
        onClick={() => setFilter("all")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span>All</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        onClick={() => setFilter("public")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Globe className="h-4 w-4" />
        <span>Public</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        onClick={() => setFilter("private")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Lock className="h-4 w-4" />
        <span>Private</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>


                    {/* SEPARATOR */}

                    <div
                      className="
                        hidden
                        h-6
                        w-px
                        bg-border
                        sm:block
                      "
                    />


                    {/* ================= STATUS ================= */}

                  <div className="flex flex-wrap items-center gap-2">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size="sm" variant="outline" className="gap-2">
        Status
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent align="start">
      <DropdownMenuItem
        onClick={() => setStatusFilter("all")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span>All</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        onClick={() => setStatusFilter("READY")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>Ready</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        onClick={() => setStatusFilter("INDEXING")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Loader2 className="h-4 w-4" />
        <span>Indexing</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => setStatusFilter("PENDING")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Clock3 className="h-4 w-4" />
        <span>New</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => setStatusFilter("FAILED")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <XCircle className="h-4 w-4" />
        <span>Failed</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

                  </div>
                )}

            </div>


            {/* ================= RIGHT / SYNC ================= */}

            <div
              className="
                w-full
                shrink-0
                md:w-auto
              "
            >

              <Button
                onClick={handleSync}
                disabled={isFetching}
                className="
                  w-full
                  gap-2
                  md:w-auto
                "
              >

                <RefreshCw
                  className={`
                    h-4 w-4
                    ${
                      isFetching
                        ? "animate-spin"
                        : ""
                    }
                  `}
                />

                {isFetching
                  ? "Syncing..."
                  : "Sync"}

              </Button>

            </div>

          </div>

        </div>

      </header>


      {/* ================================================= */}
      {/* INDEX ERROR */}
      {/* ================================================= */}

      {indexError && (

        <div className="shrink-0 px-6 pt-4">

          <Alert variant="destructive">

            <AlertCircle className="h-4 w-4" />

            <AlertTitle>
              Indexing Failed
            </AlertTitle>

            <AlertDescription>

              <span className="font-medium">
                {indexError.repo}
              </span>

              {" — "}

              {indexError.message}

            </AlertDescription>

          </Alert>

        </div>

      )}


      {/* ================================================= */}
      {/* ONLY THIS SECTION SCROLLS */}
      {/* ================================================= */}

      <main
        className="
          min-h-0
          flex-1
          overflow-y-auto
        "
      >

        <div className="p-6">


          {/* ================= LOADING ================= */}

          {isLoading && (

            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-muted-foreground
                "
              >

                <Loader2
                  className="
                    h-5 w-5
                    animate-spin
                  "
                />

                Loading repositories...

              </div>

            </div>

          )}


          {/* ================= FETCH ERROR ================= */}

          {isError &&
            !isLoading && (

              <Card
                className="
                  mx-auto
                  mt-6
                  max-w-md
                "
              >

                <CardContent
                  className="
                    flex
                    flex-col
                    items-center
                    py-10
                    text-center
                  "
                >

                  <XCircle
                    className="
                      h-10
                      w-10
                      text-destructive
                    "
                  />

                  <h2
                    className="
                      mt-4
                      text-lg
                      font-semibold
                    "
                  >
                    Failed to load repositories
                  </h2>


                  <p
                    className="
                      mt-2
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Something went wrong while
                    loading your repositories.
                  </p>


                  <Button
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["repositories"],
                      })
                    }
                    variant="outline"
                    className="mt-5"
                  >
                    Try Again
                  </Button>

                </CardContent>

              </Card>

            )}


          {/* ================= EMPTY ================= */}

          {!isLoading &&
            !isError &&
            repositories.length === 0 && (

              <Card className="mt-6">

                <CardContent
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-16
                    text-center
                  "
                >

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-muted
                    "
                  >

                    <GitBranch
                      className="
                        h-7
                        w-7
                        text-muted-foreground
                      "
                    />

                  </div>


                  <h2
                    className="
                      mt-5
                      text-lg
                      font-semibold
                    "
                  >
                    No repositories found
                  </h2>


                  <p
                    className="
                      mt-2
                      max-w-sm
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Your repositories haven't been
                    synced yet. Click the button below
                    to fetch them from GitHub.
                  </p>


                  <Button
                    onClick={handleSync}
                    disabled={isFetching}
                    className="mt-6 gap-2"
                  >

                    <RefreshCw
                      className={`
                        h-4 w-4
                        ${
                          isFetching
                            ? "animate-spin"
                            : ""
                        }
                      `}
                    />

                    {isFetching
                      ? "Syncing..."
                      : "Sync Repositories"}

                  </Button>

                </CardContent>

              </Card>

            )}


          {/* ================= FILTERED EMPTY ================= */}

          {!isLoading &&
            !isError &&
            repositories.length > 0 &&
            filteredRepositories.length === 0 && (

              <Card className="mt-6">

                <CardContent
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-16
                    text-center
                  "
                >

                  <GitBranch
                    className="
                      h-10
                      w-10
                      text-muted-foreground
                    "
                  />


                  <h2
                    className="
                      mt-4
                      text-lg
                      font-semibold
                    "
                  >
                    No repositories found
                  </h2>


                  <p
                    className="
                      mt-2
                      text-sm
                      text-muted-foreground
                    "
                  >
                    No repositories match the
                    selected filters.
                  </p>

                </CardContent>

              </Card>

            )}


          {/* ================================================= */}
          {/* REPOSITORY GRID */}
          {/* ================================================= */}

          {!isLoading &&
            !isError &&
            filteredRepositories.length > 0 && (

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-6">
  {filteredRepositories.map((repo) => (
    <Card
      key={repo.id}
      className="group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 border bg-card"
    >
      {/* ================= CARD HEADER ================= */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            
            {/* Styled Icon Container */}
<div

                              className="

                                flex

                                h-10

                                w-10

                                shrink-0

                                items-center

                                justify-center

                                rounded-lg

                                bg-muted

                              "

                            >



                              <GitBranch

                                className="h-5 w-5"

                              />



                            </div>


            <div className="min-w-0">
              <CardTitle className="truncate text-sm font-semibold text-foreground">
                {repo.name}
              </CardTitle>
              <p className="truncate text-base text-muted-foreground">
                {repo.owner}
              </p>
            </div>
          </div>

          {/* Visibility Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50">
            {repo.isPrivate ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {/* ================= CARD CONTENT ================= */}
      <CardContent className="flex flex-1 flex-col pb-4">
        {/* Full Name & Description */}
        <p className="mb-1 truncate text-xs text-muted-foreground/80">
          {repo.fullName}
        </p>
        <p className="mb-6 line-clamp-2 min-h-[2.5rem] text-sm text-foreground/80">
          {repo.description || "No description available for this repository."}
        </p>

        {/* Badges */}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {repo.language && (
            <Badge variant="secondary" className="bg-secondary/50 font-medium">
              {repo.language}
            </Badge>
          )}
          <Badge variant="outline" className="border-muted-foreground/20 text-muted-foreground">
            {repo.isPrivate ? "Private" : "Public"}
          </Badge>
          {getStatusBadge(repo.indexStatus)}
        </div>
      </CardContent>

      {/* ================= CARD FOOTER (ACTIONS) ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/10 p-4">
        
        {/* Left Side: Primary Actions */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          
          {/* PENDING or FAILED (Purple Button) */}
          {(repo.indexStatus === "PENDING" || !repo.indexStatus || repo.indexStatus === "FAILED") && (
            <Button
              type="button"
              size="sm"
              className="w-full sm:w-auto gap-2"
              /* onClick={() => startIndexingLogicHere(repo)} */
            >
              Start Indexing
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          )}

          {/* INDEXING */}
          {repo.indexStatus === "INDEXING" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto gap-2"
              onClick={() => handleOpen(repo)}
            >
              Open
            </Button>
          )}

          {/* READY (Dark Yellow Chat Button) */}
          {repo.indexStatus === "READY" && (
            <>
              <Button
                type="button"
                size="sm"
                className=" w-full sm:w-auto gap-2"
                onClick={() => handleChat(repo)}
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                Chat
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full sm:w-auto gap-2"
                onClick={() => handleOpen(repo)}
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                Open
              </Button>
            </>
          )}
        </div>

        {/* Right Side: GitHub Link */}
        {repo.htmlUrl && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
          >
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </Button>
        )}
      </div>
    </Card>
  ))}
</div>

            )}


        </div>

      </main>


      {/* ================================================= */}
      {/* INDEX STATUS DIALOG */}
      {/* ================================================= */}

      <IndexStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        id={selectedRepo?.id}
        repoName={selectedRepo?.name}
      />

    </div>
  );
};


export default Repositories;