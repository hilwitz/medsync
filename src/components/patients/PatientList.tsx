
import React, { useState } from "react";
import { Patient } from "@/types";
import { PatientCard } from "./PatientCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PatientListProps {
  patients: Patient[];
}

export const PatientList: React.FC<PatientListProps> = ({ patients }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get all unique tags from patients
  const allTags = Array.from(
    new Set(patients.flatMap(patient => patient.tags))
  ).sort();

  // Filter patients based on search term and selected tag
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === "" || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.chronicConditions.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || patient.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedTag === tag
                  ? "bg-medblue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      
      {filteredPatients.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
};
