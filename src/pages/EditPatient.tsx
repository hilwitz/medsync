
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PatientForm } from "@/components/PatientForm";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EditPatient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPatient, selectPatient, editPatient } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      selectPatient(id);
      setIsLoading(false);
    }
  }, [id, selectPatient]);

  const handleSubmit = async (patientData: any) => {
    try {
      if (id) {
        await editPatient(id, patientData);
        navigate(`/patients/${id}`);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
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

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to={`/patients/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
        </div>

        <div className="bg-white rounded-md shadow-sm border p-6">
          <PatientForm
            initialData={selectedPatient}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/patients/${id}`)}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditPatient;
