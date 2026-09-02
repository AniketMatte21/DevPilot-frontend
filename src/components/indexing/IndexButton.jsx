import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, GitBranch } from "lucide-react";

import api from "@/api/api";
import { Button } from "@/components/ui/button";

const IndexButton = ({ repo , onError}) => {
  const queryClient = useQueryClient();

  const [isIndexing, setIsIndexing] = useState(false);

  const handleIndex = async () => {
    try {
      setIsIndexing(true);

      console.log("🔄 Indexing repository:", repo.fullName);
      console.log("🆔 Repository UUID:", repo.id);

      const response = await api.post(
        `/repos/${repo.id}/index`
      );

      console.log("✅ Index response:", response);

      // Repository status refresh
      await queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });

    } catch (error) {
      console.error("❌ Index failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to index repository.";

      // Error ko parent component ko bhejo
      if (onError) {
        onError({
          repo: repo.fullName,
          message,
        });
      }

    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <Button
      size="sm"
      className="gap-1.5"
      onClick={handleIndex}
      disabled={isIndexing}
    >
      {isIndexing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Indexing...
        </>
      ) : (
        <>
          <GitBranch className="h-4 w-4" />
          Index
        </>
      )}
    </Button>
  );
};

export default IndexButton;