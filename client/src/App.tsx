// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import AppRoutes from "./AppRoutes";
import NavBar from "./pagesComponents/NavBar";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen ">
          <NavBar />
          <main className=" mx-auto   ">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
