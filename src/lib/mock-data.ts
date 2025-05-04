
import { Patient, Note } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock data for patients
export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "John Smith",
    dob: "1980-05-15",
    contactInfo: "+1 555-123-4567",
    allergies: "Penicillin, Sulfa",
    chronicConditions: "Hypertension, Type 2 Diabetes",
    tags: ["diabetes", "hypertension", "regular"],
    createdAt: "2023-05-10T14:30:00Z",
    updatedAt: "2023-05-10T14:30:00Z"
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    dob: "1992-11-23",
    contactInfo: "+1 555-987-6543",
    allergies: "None",
    chronicConditions: "Asthma",
    tags: ["asthma", "new-patient"],
    createdAt: "2023-06-15T09:45:00Z",
    updatedAt: "2023-06-15T09:45:00Z"
  },
  {
    id: "p3",
    name: "Robert Chen",
    dob: "1965-03-08",
    contactInfo: "+1 555-456-7890",
    allergies: "Shellfish",
    chronicConditions: "COPD, Arthritis",
    tags: ["copd", "elderly", "priority"],
    createdAt: "2023-04-22T11:20:00Z",
    updatedAt: "2023-05-20T15:10:00Z"
  },
  {
    id: "p4",
    name: "Maria Garcia",
    dob: "1978-09-12",
    contactInfo: "+1 555-234-5678",
    allergies: "Latex",
    chronicConditions: "Migraine, Anxiety",
    tags: ["migraine", "mental-health"],
    createdAt: "2023-06-05T13:15:00Z",
    updatedAt: "2023-06-05T13:15:00Z"
  },
  {
    id: "p5",
    name: "David Williams",
    dob: "1950-12-03",
    contactInfo: "+1 555-345-6789",
    allergies: "Aspirin, Ibuprofen",
    chronicConditions: "Coronary Artery Disease, Osteoporosis",
    tags: ["cardiac", "elderly", "osteoporosis"],
    createdAt: "2023-05-28T10:00:00Z",
    updatedAt: "2023-06-12T16:30:00Z"
  }
];

// Mock data for notes
export const mockNotes: Note[] = [
  {
    id: "n1",
    patientId: "p1",
    templateType: "SOAP",
    content: `Subjective: Patient reports increased thirst and fatigue over the past week. Denies chest pain or shortness of breath.
Objective: BP 142/88, HR 78, RR 16, Temp 98.6F. Blood glucose reading 210 mg/dL (high).
Assessment: Poorly controlled Type 2 Diabetes
Plan: Increase Metformin to 1000mg BID. Review diet and exercise routine. Schedule A1C test within 2 weeks.`,
    tags: ["diabetes", "medication-change"],
    createdAt: "2023-06-18T14:30:00Z",
    updatedAt: "2023-06-18T14:30:00Z"
  },
  {
    id: "n2",
    patientId: "p1",
    templateType: "Follow-up",
    content: `Interval History: Blood pressure has been elevated in home readings (145-155/90-95). Reports adherence to medication regimen.
Findings: BP 146/92 in office. Cardiac exam unremarkable.
Assessment: Hypertension - suboptimal control
Plan: Add Amlodipine 5mg daily. Continue Lisinopril. Follow-up in 2 weeks for BP check.`,
    tags: ["hypertension", "medication-change"],
    createdAt: "2023-06-10T11:15:00Z",
    updatedAt: "2023-06-10T11:15:00Z"
  },
  {
    id: "n3",
    patientId: "p2",
    templateType: "SOAP",
    content: `Subjective: Reports recent onset of wheezing and shortness of breath, especially at night. Using rescue inhaler 2-3 times per week.
Objective: Lung exam reveals mild expiratory wheezes bilaterally. Peak flow at 80% predicted.
Assessment: Asthma - mild persistent
Plan: Start Fluticasone inhaler BID. Continue albuterol as needed. Review proper inhaler technique.`,
    tags: ["asthma", "new-prescription"],
    createdAt: "2023-06-15T10:00:00Z",
    updatedAt: "2023-06-15T10:00:00Z"
  },
  {
    id: "n4",
    patientId: "p3",
    templateType: "H&P",
    content: `History: 58yo male with COPD presents with increased cough and yellow sputum for 3 days. Reports slight fever yesterday. Current smoker, 1ppd for 40 years.
Physical: Temp 100.1F, RR 22, O2 sat 92% on RA. Lung exam with rhonchi in right middle lobe, decreased breath sounds at bases.
Assessment: Acute COPD exacerbation with likely superimposed bacterial infection
Plan: Prednisone 40mg daily for 5 days, Azithromycin 500mg day 1, 250mg days 2-5. Increase albuterol nebulizer. Strongly counseled on smoking cessation.`,
    tags: ["copd", "infection", "urgent"],
    createdAt: "2023-05-20T15:10:00Z",
    updatedAt: "2023-05-20T15:10:00Z"
  },
  {
    id: "n5",
    patientId: "p4",
    templateType: "SOAP",
    content: `Subjective: Reports 3 migraine episodes in past month, each lasting 12-24 hours. Photophobia, nausea. Sumatriptan helps but causes mild chest tightness.
Objective: Vitals normal. Neurologic exam without focal deficits.
Assessment: Migraine without aura, moderate frequency. Medication side effects concerning.
Plan: Switch from sumatriptan to rizatriptan. Start propranolol 40mg daily for prevention. Headache journal. Refer to neurology if no improvement.`,
    tags: ["migraine", "medication-change", "referral"],
    createdAt: "2023-06-05T13:30:00Z",
    updatedAt: "2023-06-05T13:30:00Z"
  }
];

// Local storage keys
const PATIENTS_STORAGE_KEY = "mednote-patients";
const NOTES_STORAGE_KEY = "mednote-notes";

// Helper functions to load and save data from/to localStorage
export const loadPatients = (): Patient[] => {
  try {
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    return savedPatients ? JSON.parse(savedPatients) : mockPatients;
  } catch (error) {
    console.error("Error loading patients from localStorage:", error);
    return mockPatients;
  }
};

export const savePatients = (patients: Patient[]): void => {
  try {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  } catch (error) {
    console.error("Error saving patients to localStorage:", error);
  }
};

export const loadNotes = (): Note[] => {
  try {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : mockNotes;
  } catch (error) {
    console.error("Error loading notes from localStorage:", error);
    return mockNotes;
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to localStorage:", error);
  }
};

// CRUD operations for patients
export const getPatients = (): Patient[] => {
  return loadPatients();
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = loadPatients();
  return patients.find(patient => patient.id === id);
};

export const createPatient = (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Patient => {
  const patients = loadPatients();
  const newPatient: Patient = {
    ...patient,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
};

export const updatePatient = (id: string, updates: Partial<Patient>): Patient | undefined => {
  const patients = loadPatients();
  const index = patients.findIndex(patient => patient.id === id);
  
  if (index !== -1) {
    patients[index] = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    savePatients(patients);
    return patients[index];
  }
  
  return undefined;
};

export const deletePatient = (id: string): boolean => {
  const patients = loadPatients();
  const filteredPatients = patients.filter(patient => patient.id !== id);
  
  if (filteredPatients.length < patients.length) {
    savePatients(filteredPatients);
    
    // Also delete all notes for this patient
    const notes = loadNotes();
    const filteredNotes = notes.filter(note => note.patientId !== id);
    saveNotes(filteredNotes);
    
    return true;
  }
  
  return false;
};

// CRUD operations for notes
export const getNotes = (): Note[] => {
  return loadNotes();
};

export const getNotesByPatientId = (patientId: string): Note[] => {
  const notes = loadNotes();
  return notes.filter(note => note.patientId === patientId);
};

export const getNoteById = (id: string): Note | undefined => {
  const notes = loadNotes();
  return notes.find(note => note.id === id);
};

export const createNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
  const notes = loadNotes();
  const newNote: Note = {
    ...note,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

export const updateNote = (id: string, updates: Partial<Note>): Note | undefined => {
  const notes = loadNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveNotes(notes);
    return notes[index];
  }
  
  return undefined;
};

export const deleteNote = (id: string): boolean => {
  const notes = loadNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length < notes.length) {
    saveNotes(filteredNotes);
    return true;
  }
  
  return false;
};
