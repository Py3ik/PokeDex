import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.ts";
import { ToastProvider } from "./context/ToastProvider";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </ToastProvider>
  </QueryClientProvider>,
);
