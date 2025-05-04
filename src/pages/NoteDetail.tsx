
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NoteForm } from "@/components/notes/NoteForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Save,
  X
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getNoteById, getPatientById } from "@/lib/mock-data";

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { removeNote, editNote } = useAppContext();
  
  const [note, setNote] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedNote = getNoteById(id);
      if (fetchedNote) {
        setNote(fetchedNote);
        const fetchedPatient = getPatientById(fetchedNote.patientId);
        if (fetchedPatient) {
          setPatient(fetchedPatient);
        }
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      await removeNote(id);
      navigate(patient ? `/patients/${patient.id}` : "/notes");
    }
  };

  const handleEdit = async (updatedNote: any) => {
    if (id) {
      const updated = await editNote(id, updatedNote);
      if (updated) {
        setNote(updated);
        setIsEditing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-medblue-600">Loading note...</div>
        </div>
      </AppLayout>
    );
  }

  if (!note) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-medium mb-2">Note not found</h2>
          <p className="text-muted-foreground mb-4">
            The note you're looking for doesn't exist or has been removed.
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

  const formatContent = (content: string) => {
    // Split on double line breaks for major sections
    const sections = content.split("\n\n");
    
    return sections.map((section, index) => {
      // Check if this is a section header (ends with a colon)
      if (section.includes(":")) {
        const [header, ...rest] = section.split(":");
        return (
          <div key={index} className="mb-4">
            <h3 className="font-medium text-medblue-700">{header}:</h3>
            <p className="whitespace-pre-line">{rest.join(":")}</p>
          </div>
        );
      }
      return <p key={index} className="mb-4 whitespace-pre-line">{section}</p>;
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={patient ? `/patients/${patient.id}` : "/notes"}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-medium">
              {note.templateType} Note
            </h1>
          </div>
          
          {!isEditing && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this note.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          
          {isEditing && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="bg-white rounded-md shadow-sm border p-6">
            <NoteForm
              patientId={note.patientId}
              patient={patient}
              initialData={note}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-md shadow-sm border p-6">
              {patient && (
                <div className="mb-4 p-3 bg-medblue-50 rounded-md">
                  <Link to={`/patients/${patient.id}`}>
                    <h3 className="font-medium hover:text-medblue-600 transition-colors">
                      Patient: {patient.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    DOB: {formatDate(patient.dob)}
                  </p>
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Created: {formatDate(note.createdAt)}</span>
                    {note.createdAt !== note.updatedAt && (
                      <span>(Updated: {formatDate(note.updatedAt)})</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none mt-6">
                {formatContent(note.content)}
              </div>
              
              {note.tags.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag: string) => (
                      <Badge 
                        key={tag} 
                        variant="outline"
                        className="bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default NoteDetail;
