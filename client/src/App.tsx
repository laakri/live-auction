// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import AppRoutes from "./AppRoutes";
import Sidebar from "./pagesComponents/Sidebar";
import { Toaster } from "./components/ui/toaster";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col lg:flex-row">
          <div className="w-60 ">
            <Sidebar />
          </div>
          <main className="flex-grow mx-auto">
            <AppRoutes />
          </main>
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
};

export default App;
