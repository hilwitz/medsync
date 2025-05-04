
import React from "react";
import { AppHeader } from "./AppHeader";
import { useAppContext } from "@/contexts/AppContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isLoading } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-pulse text-medblue-600">Loading...</div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};
