
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NoteCard } from "@/components/notes/NoteCard";
import { useAppContext } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getPatientById } from "@/lib/mock-data";

const NotesPage = () => {
  const navigate = useNavigate();
  const { notes, fetchNotes } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState("");
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Load patient data for each note
  const notesWithPatients = notes.map(note => {
    const patient = getPatientById(note.patientId);
    return { note, patient };
  });
  
  // Filter notes based on search
  const filteredNotes = notesWithPatients.filter(({ note, patient }) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      (patient && patient.name.toLowerCase().includes(searchLower))
    );
  });
  
  // Sort notes by date (newest first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    return new Date(b.note.createdAt).getTime() - new Date(a.note.createdAt).getTime();
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Recent Notes</h1>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes by content, tag, or patient name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {sortedNotes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {searchTerm ? "No notes match your search" : "No notes created yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedNotes.map(({ note, patient }) => (
              <NoteCard
                key={note.id}
                note={note}
                patient={patient}
                onClick={() => navigate(`/notes/${note.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default NotesPage;
