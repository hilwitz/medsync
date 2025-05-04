
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NoteForm } from "@/components/notes/NoteForm";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AddNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPatient, selectPatient, addNote } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      selectPatient(id);
      setIsLoading(false);
    }
  }, [id, selectPatient]);

  const handleSubmit = async (noteData: any) => {
    try {
      const newNote = await addNote(noteData);
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-medblue-600">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!selectedPatient) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-medium mb-2">Patient not found</h2>
          <p className="text-muted-foreground mb-4">
            The patient you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Patients
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to={`/patients/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Note</h1>
        </div>

        <div className="bg-white rounded-md shadow-sm border p-6">
          <NoteForm
            patientId={id as string}
            patient={selectedPatient}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/patients/${id}`)}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default AddNote;
