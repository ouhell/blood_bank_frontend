import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import {
  // createBrowserRouter,
  // RouterProvider,
  BrowserRouter,
} from "react-router-dom";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
import App from "@/App";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//   },
// ]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
