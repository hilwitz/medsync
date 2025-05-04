
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PatientList } from "@/components/patients/PatientList";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const { patients, fetchPatients } = useAppContext();
  
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <Link to="/patients/new">
            <Button className="bg-medblue-500 hover:bg-medblue-600">
              <Plus className="h-4 w-4 mr-1" /> New Patient
            </Button>
          </Link>
        </div>
        
        {patients.length > 0 ? (
          <PatientList patients={patients} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">No patients yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first patient
            </p>
            <Link to="/patients/new">
              <Button className="bg-medblue-500 hover:bg-medblue-600">
                <Plus className="h-4 w-4 mr-1" /> Add Patient
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
