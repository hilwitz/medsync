
import React from "react";
import { Link } from "react-router-dom";
import { Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const getBadgeColorClass = (tag: string) => {
    // Map common medical tags to specific colors
    const tagColors: Record<string, string> = {
      diabetes: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      hypertension: "bg-red-100 text-red-800 hover:bg-red-200",
      asthma: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      copd: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      cardiac: "bg-red-100 text-red-800 hover:bg-red-200",
      "mental-health": "bg-green-100 text-green-800 hover:bg-green-200",
      elderly: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      urgent: "bg-red-200 text-red-800 hover:bg-red-300",
      priority: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      "new-patient": "bg-green-100 text-green-800 hover:bg-green-200"
    };

    return tagColors[tag] || "bg-medblue-100 text-medblue-800 hover:bg-medblue-200";
  };

  return (
    <Link to={`/patients/${patient.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{patient.name}</CardTitle>
          <div className="text-sm text-muted-foreground">
            DOB: {formatDate(patient.dob)} | {calculateAge(patient.dob)} y/o
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Chronic Conditions:</p>
              <p className="text-sm">{patient.chronicConditions || "None"}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.tags.map((tag) => (
                <Badge key={tag} variant="outline" className={getBadgeColorClass(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Helper function to calculate age from DOB
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
