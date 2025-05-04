
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NoteCard } from "@/components/notes/NoteCard";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare,
  Phone
} from "lucide-react";
import { formatDate, openWhatsApp } from "@/lib/utils";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    selectedPatient,
    selectPatient,
    notes,
    removePatient,
  } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      selectPatient(id);
      setIsLoading(false);
    }
    
    return () => {
      // Clear selected patient when leaving this page
      selectPatient(null);
    };
  }, [id, selectPatient]);

  const handleDelete = async () => {
    if (id) {
      await removePatient(id);
      navigate("/");
    }
  };

  const handleContactClick = () => {
    if (selectedPatient?.contactInfo) {
      openWhatsApp(selectedPatient.contactInfo);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-medblue-600">Loading patient...</div>
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

  const patientNotes = notes.filter(note => note.patientId === id);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h1>
        </div>
        
        <div className="bg-white rounded-md shadow-sm border p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>{formatDate(selectedPatient.dob)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  <div className="flex items-center gap-2">
                    <p>{selectedPatient.contactInfo}</p>
                    {selectedPatient.contactInfo && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={handleContactClick}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => window.open(`tel:${selectedPatient.contactInfo}`)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Allergies</p>
                  <p>{selectedPatient.allergies || "None"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Chronic Conditions</p>
                  <p>{selectedPatient.chronicConditions || "None"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-medblue-100 text-medblue-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <Link to={`/patients/${id}/add-note`}>
                  <Button className="w-full bg-medgreen-500 hover:bg-medgreen-600">
                    <Plus className="h-4 w-4 mr-1" /> Add Note
                  </Button>
                </Link>
                
                <Link to={`/patients/${id}/edit`}>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-1" /> Edit Patient
                  </Button>
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete Patient
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {selectedPatient.name}'s record and all associated notes.
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
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4">Patient Notes</h2>
          {patientNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => navigate(`/notes/${note.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-md">
              <p className="text-muted-foreground mb-4">No notes for this patient yet</p>
              <Link to={`/patients/${id}/add-note`}>
                <Button className="bg-medgreen-500 hover:bg-medgreen-600">
                  <Plus className="h-4 w-4 mr-1" /> Create First Note
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PatientDetail;
