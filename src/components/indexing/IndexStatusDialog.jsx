import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  XCircle,
  FileCode2,
  Boxes,
  GitBranch,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import api from "@/api/api";

const IndexStatusDialog = ({
  open,
  onOpenChange,
  id,
  repoName,
}) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !id) return;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/repos/${id}/status`
        );

        console.log("📊 Index status:", response);

        setStatus(response);
      } catch (err) {
        console.error("❌ Failed to fetch index status:", err);

        setError(
          err?.message ||
            "Failed to load repository index status."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [open, id]);

  // Calculate percentage
  const percentage =
    status?.filesTotal > 0
      ? Math.min(
          100,
          Math.round(
            (status.filesProcessed / status.filesTotal) * 100
          )
        )
      : 0;

  const getStatusBadge = () => {
    switch (status?.indexStatus) {
      case "READY":
        return (
          <Badge className="gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready
          </Badge>
        );

      case "INDEXING":
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Indexing
          </Badge>
        );

      case "PENDING":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            New
          </Badge>
        );

      case "FAILED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">

        {/* ================= HEADER ================= */}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />

            {repoName || "Repository"}
          </DialogTitle>

          <DialogDescription>
            Repository indexing information
          </DialogDescription>
        </DialogHeader>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="flex min-h-[200px] items-center justify-center">

            <div className="flex items-center gap-2 text-muted-foreground">

              <Loader2 className="h-5 w-5 animate-spin" />

              Loading index status...

            </div>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <Card className="border-destructive">

            <CardContent className="flex items-center gap-3 py-5">

              <XCircle className="h-5 w-5 text-destructive" />

              <p className="text-sm text-destructive">
                {error}
              </p>

            </CardContent>

          </Card>
        )}

        {/* ================= DATA ================= */}

        {!loading && !error && status && (

          <div className="space-y-5">

            {/* STATUS */}

            <div className="flex items-center justify-between">

              <span className="text-sm text-muted-foreground">
                Status
              </span>

              {getStatusBadge()}

            </div>


            {/* ================= PROGRESS ================= */}

            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-sm font-medium">
                  Indexing Progress
                </span>

                <span className="text-sm font-semibold">
                  {percentage}%
                </span>

              </div>

              <Progress value={percentage} />

              <p className="text-xs text-muted-foreground">
                {status.filesProcessed ?? 0} of{" "}
                {status.filesTotal ?? 0} files processed
              </p>

            </div>


            {/* ================= STATS ================= */}

            <div className="grid grid-cols-2 gap-3">

              {/* Total Files */}

              <Card>

                <CardContent className="flex items-center gap-3 p-4">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">

                    <FileCode2 className="h-4 w-4" />

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Total Files
                    </p>

                    <p className="text-lg font-semibold">
                      {status.filesTotal ?? 0}
                    </p>

                  </div>

                </CardContent>

              </Card>


              {/* Processed */}

              <Card>

                <CardContent className="flex items-center gap-3 p-4">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">

                    <CheckCircle2 className="h-4 w-4" />

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Processed
                    </p>

                    <p className="text-lg font-semibold">
                      {status.filesProcessed ?? 0}
                    </p>

                  </div>

                </CardContent>

              </Card>


              {/* Chunks */}

              <Card>

                <CardContent className="flex items-center gap-3 p-4">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">

                    <Boxes className="h-4 w-4" />

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Chunks
                    </p>

                    <p className="text-lg font-semibold">
                      {status.chunkCount ?? 0}
                    </p>

                  </div>

                </CardContent>

              </Card>


              {/* Repository ID */}

              <Card>

                <CardContent className="p-4">

                  <p className="text-xs text-muted-foreground">
                    Repository ID
                  </p>

                  <p className="mt-1 truncate text-xs font-medium">
                    {status.repositoryId}
                  </p>

                </CardContent>

              </Card>

            </div>


            {/* ================= INDEXED AT ================= */}

            {status.indexedAt && (
              <div className="border-t pt-4">

                <p className="text-xs text-muted-foreground">
                  Indexed At
                </p>

                <p className="mt-1 text-sm">
                  {new Date(
                    status.indexedAt
                  ).toLocaleString()}
                </p>

              </div>
            )}


            {/* ================= ERROR MESSAGE ================= */}

            {status.errorMessage && (
              <Card className="border-destructive">

                <CardContent className="p-4">

                  <div className="flex items-center gap-2">

                    <XCircle className="h-4 w-4 text-destructive" />

                    <p className="text-sm font-medium text-destructive">
                      Indexing Error
                    </p>

                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {status.errorMessage}
                  </p>

                </CardContent>

              </Card>
            )}

          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default IndexStatusDialog;