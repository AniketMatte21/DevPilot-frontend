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

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >

                      <Button
                        size="sm"
                        variant={
                          filter === "all"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setFilter("all")
                        }
                      >
                        All
                      </Button>


                      <Button
                        size="sm"
                        variant={
                          filter === "public"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setFilter("public")
                        }
                        className="gap-1.5"
                      >
                        <Globe className="h-4 w-4" />
                        Public
                      </Button>


                      <Button
                        size="sm"
                        variant={
                          filter === "private"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setFilter("private")
                        }
                        className="gap-1.5"
                      >
                        <Lock className="h-4 w-4" />
                        Private
                      </Button>

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

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >

                      <Button
                        size="sm"
                        variant={
                          statusFilter === "all"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setStatusFilter("all")
                        }
                      >
                        All
                      </Button>


                      <Button
                        size="sm"
                        variant={
                          statusFilter === "READY"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setStatusFilter("READY")
                        }
                        className="gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Ready
                      </Button>


                      <Button
                        size="sm"
                        variant={
                          statusFilter === "INDEXING"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setStatusFilter("INDEXING")
                        }
                        className="gap-1.5"
                      >
                        <Loader2 className="h-4 w-4" />
                        Indexing
                      </Button>


                      <Button
                        size="sm"
                        variant={
                          statusFilter === "PENDING"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setStatusFilter("PENDING")
                        }
                        className="gap-1.5"
                      >
                        <Clock3 className="h-4 w-4" />
                        New
                      </Button>


                      <Button
                        size="sm"
                        variant={
                          statusFilter === "FAILED"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setStatusFilter("FAILED")
                        }
                        className="gap-1.5"
                      >
                        <XCircle className="h-4 w-4" />
                        Failed
                      </Button>

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

              <div
                className="
                  grid
                  gap-5
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >

                {filteredRepositories.map(
                  (repo) => (

                    <Card
                      key={repo.id}
                      className="
                        group
                        transition-shadow
                        hover:shadow-md
                      "
                    >


                      {/* ================= CARD HEADER ================= */}

                      <CardHeader className="pb-3">

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-3
                            "
                          >

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

                              <CardTitle
                                className="
                                  mt-1
                                  truncate
                                  text-xs
                                  text-muted-foreground
                                "
                              >
                                {repo.name}
                              </CardTitle>


                              <p
                                className="
                                  truncate
                                  text-sm
                                "
                              >
                                {repo.owner}
                              </p>

                            </div>

                          </div>


                          {/* VISIBILITY ICON */}

                          {repo.isPrivate ? (

                            <Lock
                              className="
                                h-4
                                w-4
                                shrink-0
                                text-muted-foreground
                              "
                            />

                          ) : (

                            <Globe
                              className="
                                h-4
                                w-4
                                shrink-0
                                text-muted-foreground
                              "
                            />

                          )}

                        </div>

                      </CardHeader>


                      {/* ================= CARD CONTENT ================= */}

                      <CardContent
                        className="space-y-4"
                      >

                        {/* Full Name */}

                        <p
                          className="
                            truncate
                            text-sm
                            text-muted-foreground
                          "
                        >
                          {repo.fullName}
                        </p>


                        {/* Description */}

                        <p
                          className="
                            line-clamp-2
                            min-h-10
                            text-xs
                          "
                        >
                          {repo.description ||
                            "No description available."}
                        </p>


                        {/* ================= DETAILS ================= */}

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >

                          {repo.language && (

                            <Badge variant="secondary">
                              {repo.language}
                            </Badge>

                          )}


                          <Badge variant="outline">

                            {repo.isPrivate
                              ? "Private"
                              : "Public"}

                          </Badge>


                          {getStatusBadge(
                            repo.indexStatus
                          )}

                        </div>


                        {/* ================================================= */}
                        {/* ACTIONS */}
                        {/* ================================================= */}

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >


                          {/* ================= PENDING ================= */}

                          {(
                            repo.indexStatus === "PENDING" ||
                            !repo.indexStatus
                          ) && (

                            <IndexButton
                              repo={repo}
                              onError={setIndexError}
                            />

                          )}


                          {/* ================= FAILED ================= */}

                          {repo.indexStatus === "FAILED" && (

                            <IndexButton
                              repo={repo}
                              onError={setIndexError}
                            />

                          )}


                          {/* ================= INDEXING ================= */}

                          {repo.indexStatus === "INDEXING" && (

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleOpen(repo)
                              }
                            >
                              Open
                            </Button>

                          )}


                          {/* ================= READY ================= */}

                          {repo.indexStatus === "READY" && (

                            <>

                              <Button
                                type="button"
                                size="sm"
                                className="gap-1.5"
                                onClick={() =>
                                  handleChat(repo)
                                }
                              >

                                <MessageCircle
                                  className="h-4 w-4"
                                />

                                Chat

                              </Button>


                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() =>
                                  handleOpen(repo)
                                }
                              >

                                <ExternalLink
                                  className="h-4 w-4"
                                />

                                Open

                              </Button>

                            </>

                          )}

                        </div>


                        {/* ================= BOTTOM ================= */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            border-t
                            pt-4
                          "
                        >

                          {/* GitHub Link */}

                          {repo.htmlUrl && (

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="gap-1"
                            >

                              <a
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                "
                              >

                                <span>
                                  GitHub
                                </span>

                                <ExternalLink
                                  className="
                                    h-3.5
                                    w-3.5
                                    shrink-0
                                  "
                                />

                              </a>

                            </Button>

                          )}

                        </div>

                      </CardContent>

                    </Card>

                  )
                )}

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