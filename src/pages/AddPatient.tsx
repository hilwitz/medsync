
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PatientForm } from "@/components/PatientForm";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AddPatient = () => {
  const navigate = useNavigate();
  const { addPatient } = useAppContext();

  const handleSubmit = async (patientData: any) => {
    try {
      const newPatient = await addPatient(patientData);
      navigate(`/patients/${newPatient.id}`);
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        </div>

        <div className="bg-white rounded-md shadow-sm border p-6">
          <PatientForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/")}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default AddPatient;
