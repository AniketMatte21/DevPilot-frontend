import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function QueryProvider({ children }) {
  const [query] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={query}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;