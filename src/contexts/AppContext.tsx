
import React, { createContext, useState, useContext, useEffect } from "react";
import { Patient, Note } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AppContextType {
  // Data
  patients: Patient[];
  notes: Note[];
  selectedPatient: Patient | null;
  
  // State management
  isLoading: boolean;
  
  // CRUD operations
  fetchPatients: () => Promise<void>;
  fetchNotes: (patientId?: string) => Promise<void>;
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
  const { user } = useAuth();

  // Convert Supabase data to our app's format
  const mapPatient = (data: any): Patient => {
    return {
      id: data.id,
      name: data.name,
      dob: data.dob,
      contactInfo: data.contact_info,
      allergies: data.allergies || "",
      chronicConditions: data.chronic_conditions || "",
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  };

  const mapNote = (data: any): Note => {
    return {
      id: data.id,
      patientId: data.patient_id,
      templateType: data.template_type,
      content: data.content,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      fetchPatients();
      fetchNotes();
      setIsLoading(false);
    } else {
      // Clear state when user logs out
      setPatients([]);
      setNotes([]);
      setSelectedPatient(null);
    }
  }, [user]);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedPatients = data.map(mapPatient);
      setPatients(mappedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async (patientId?: string) => {
    try {
      setIsLoading(true);
      let query = supabase.from('notes').select('*');
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedNotes = data.map(mapNote);
      setNotes(mappedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectPatient = async (patientId: string | null) => {
    if (!patientId) {
      setSelectedPatient(null);
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
        
      if (error) throw error;
      
      const patient = mapPatient(data);
      setSelectedPatient(patient);
      
      // Also fetch this patient's notes
      await fetchNotes(patientId);
    } catch (error) {
      console.error("Error fetching patient:", error);
      setSelectedPatient(null);
      toast({
        title: "Error",
        description: "Patient not found",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPatient = async (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const patientData = {
        name: patient.name,
        dob: patient.dob,
        contact_info: patient.contactInfo,
        allergies: patient.allergies,
        chronic_conditions: patient.chronicConditions,
        tags: patient.tags,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();
        
      if (error) throw error;
      
      const newPatient = mapPatient(data);
      setPatients(prev => [newPatient, ...prev]);
      
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
      const patientData: any = {};
      
      if (updates.name !== undefined) patientData.name = updates.name;
      if (updates.dob !== undefined) patientData.dob = updates.dob;
      if (updates.contactInfo !== undefined) patientData.contact_info = updates.contactInfo;
      if (updates.allergies !== undefined) patientData.allergies = updates.allergies;
      if (updates.chronicConditions !== undefined) patientData.chronic_conditions = updates.chronicConditions;
      if (updates.tags !== undefined) patientData.tags = updates.tags;
      
      const { data, error } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      const updatedPatient = mapPatient(data);
      
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
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setPatients(prev => prev.filter(patient => patient.id !== id));
      
      // Clear selected patient if it's the one being deleted
      if (selectedPatient && selectedPatient.id === id) {
        setSelectedPatient(null);
      }
      
      // Notes will be automatically deleted via ON DELETE CASCADE in database
      setNotes(prev => prev.filter(note => note.patientId !== id));
      
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      
      return true;
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
      if (!user) throw new Error("User not authenticated");
      
      const noteData = {
        patient_id: note.patientId,
        template_type: note.templateType,
        content: note.content,
        tags: note.tags,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();
        
      if (error) throw error;
      
      const newNote = mapNote(data);
      setNotes(prev => [newNote, ...prev]);
      
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
      const noteData: any = {};
      
      if (updates.content !== undefined) noteData.content = updates.content;
      if (updates.templateType !== undefined) noteData.template_type = updates.templateType;
      if (updates.tags !== undefined) noteData.tags = updates.tags;
      
      const { data, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      const updatedNote = mapNote(data);
      
      setNotes(prev => 
        prev.map(note => note.id === id ? updatedNote : note)
      );
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      
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
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== id));
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      
      return true;
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
