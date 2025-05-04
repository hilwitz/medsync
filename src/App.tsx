
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientDetail from "./pages/PatientDetail";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";
import AddNote from "./pages/AddNote";
import NoteDetail from "./pages/NoteDetail";
import NotesPage from "./pages/NotesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/new" element={<AddPatient />} />
            <Route path="/patients/:id/edit" element={<EditPatient />} />
            <Route path="/patients/:id/add-note" element={<AddNote />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
