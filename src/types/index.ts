
export interface Patient {
  id: string;
  name: string;
  dob: string;
  contactInfo: string;
  allergies: string;
  chronicConditions: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  patientId: string;
  templateType: "SOAP" | "H&P" | "Free" | "Follow-up";
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export const TEMPLATES = {
  SOAP: {
    name: "SOAP",
    sections: [
      { name: "Subjective", description: "Patient's complaints and history" },
      { name: "Objective", description: "Examination findings and test results" },
      { name: "Assessment", description: "Diagnosis and clinical impressions" },
      { name: "Plan", description: "Treatment plan and follow-up" }
    ]
  },
  HP: {
    name: "H&P",
    sections: [
      { name: "History", description: "Patient's medical history" },
      { name: "Physical", description: "Physical examination findings" },
      { name: "Assessment", description: "Assessment and diagnosis" },
      { name: "Plan", description: "Treatment plan" }
    ]
  },
  FOLLOWUP: {
    name: "Follow-up",
    sections: [
      { name: "Interval History", description: "Changes since last visit" },
      { name: "Findings", description: "New examination findings" },
      { name: "Assessment", description: "Updated assessment" },
      { name: "Plan", description: "Adjusted treatment plan" }
    ]
  },
  FREE: {
    name: "Free",
    sections: [
      { name: "Notes", description: "Free-form notes" }
    ]
  }
};
