
import React, { createContext, useState, useContext, useEffect } from "react";
import { Patient, Note } from "@/types";
import {
  getPatients,
  getNotes,
  createPatient,
  updatePatient,
  deletePatient,
  createNote,
  updateNote,
  deleteNote,
  getNotesByPatientId,
  getPatientById,
} from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType {
  // Data
  patients: Patient[];
  notes: Note[];
  selectedPatient: Patient | null;
  
  // State management
  isLoading: boolean;
  
  // CRUD operations
  fetchPatients: () => void;
  fetchNotes: (patientId?: string) => void;
  selectPatient: (patientId: string | null) => void;
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => Promise<Patient>;
  editPatient: (id: string, updates: Partial<Patient>) => Promise<Patient | undefined>;
  removePatient: (id: string) => Promise<boolean>;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<Note>;
  editNote: (id: string, updates: Partial<Note>) => Promise<Note | undefined>;
  removeNote: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    fetchPatients();
    fetchNotes();
    setIsLoading(false);
  }, []);

  const fetchPatients = () => {
    try {
      const data = getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    }
  };

  const fetchNotes = (patientId?: string) => {
    try {
      const data = patientId ? getNotesByPatientId(patientId) : getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    }
  };

  const selectPatient = (patientId: string | null) => {
    if (!patientId) {
      setSelectedPatient(null);
      return;
    }
    
    const patient = getPatientById(patientId);
    if (patient) {
      setSelectedPatient(patient);
      fetchNotes(patientId);
    } else {
      setSelectedPatient(null);
      toast({
        title: "Error",
        description: "Patient not found",
        variant: "destructive",
      });
    }
  };

  const addPatient = async (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newPatient = createPatient(patient);
      setPatients(prev => [...prev, newPatient]);
      toast({
        title: "Success",
        description: "Patient added successfully",
      });
      return newPatient;
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      });
      throw error;
    }
  };

  const editPatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updatedPatient = updatePatient(id, updates);
      if (updatedPatient) {
        setPatients(prev => 
          prev.map(patient => patient.id === id ? updatedPatient : patient)
        );
        
        // Update selected patient if it's the one being edited
        if (selectedPatient && selectedPatient.id === id) {
          setSelectedPatient(updatedPatient);
        }
        
        toast({
          title: "Success",
          description: "Patient updated successfully",
        });
      }
      return updatedPatient;
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removePatient = async (id: string) => {
    try {
      const success = deletePatient(id);
      if (success) {
        setPatients(prev => prev.filter(patient => patient.id !== id));
        
        // Clear selected patient if it's the one being deleted
        if (selectedPatient && selectedPatient.id === id) {
          setSelectedPatient(null);
        }
        
        // Remove associated notes from state
        setNotes(prev => prev.filter(note => note.patientId !== id));
        
        toast({
          title: "Success",
          description: "Patient deleted successfully",
        });
      }
      return success;
    } catch (error) {
      console.error("Error removing patient:", error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newNote = createNote(note);
      setNotes(prev => [...prev, newNote]);
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      return newNote;
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
      throw error;
    }
  };

  const editNote = async (id: string, updates: Partial<Note>) => {
    try {
      const updatedNote = updateNote(id, updates);
      if (updatedNote) {
        setNotes(prev => 
          prev.map(note => note.id === id ? updatedNote : note)
        );
        toast({
          title: "Success",
          description: "Note updated successfully",
        });
      }
      return updatedNote;
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeNote = async (id: string) => {
    try {
      const success = deleteNote(id);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id));
        toast({
          title: "Success",
          description: "Note deleted successfully",
        });
      }
      return success;
    } catch (error) {
      console.error("Error removing note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        patients,
        notes,
        selectedPatient,
        isLoading,
        fetchPatients,
        fetchNotes,
        selectPatient,
        addPatient,
        editPatient,
        removePatient,
        addNote,
        editNote,
        removeNote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
