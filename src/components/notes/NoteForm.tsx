
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Note, TEMPLATES, Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface NoteFormProps {
  patientId: string;
  patient?: Patient;
  initialData?: Partial<Note>;
  onSubmit: (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
}

interface FormData {
  templateType: "SOAP" | "H&P" | "Free" | "Follow-up";
  content: string;
  tags: string;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  patientId,
  patient,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [currentTags, setCurrentTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState<string>("");
  
  // Move the function definition before it's used
  const getTemplateDefault = (templateType: string) => {
    switch (templateType) {
      case "SOAP":
        return "Subjective:\n\nObjective:\n\nAssessment:\n\nPlan:";
      case "H&P":
        return "History:\n\nPhysical:\n\nAssessment:\n\nPlan:";
      case "Follow-up":
        return "Interval History:\n\nFindings:\n\nAssessment:\n\nPlan:";
      case "Free":
        return "";
      default:
        return "";
    }
  };
  
  const form = useForm<FormData>({
    defaultValues: {
      templateType: initialData?.templateType || "SOAP",
      content: initialData?.content || getTemplateDefault("SOAP"),
      tags: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      patientId,
      templateType: data.templateType,
      content: data.content,
      tags: currentTags,
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag) {
      e.preventDefault();
      if (!currentTags.includes(currentTag.trim())) {
        setCurrentTags([...currentTags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTemplateChange = (value: string) => {
    form.setValue("templateType", value as "SOAP" | "H&P" | "Free" | "Follow-up");
    form.setValue("content", getTemplateDefault(value));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {patient && (
          <div className="p-4 bg-medblue-50 rounded-md">
            <h3 className="font-medium">Patient: {patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              DOB: {patient.dob} | Allergies: {patient.allergies || "None"}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="templateType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Type</FormLabel>
              <Select
                onValueChange={(value) => handleTemplateChange(value)}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select note type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SOAP">SOAP Note</SelectItem>
                  <SelectItem value="H&P">H&P</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Free">Free Note</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Content</FormLabel>
              <FormControl>
                <Textarea 
                  className="min-h-[300px] font-mono"
                  placeholder="Enter your notes here..."
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {currentTags.map((tag) => (
              <div
                key={tag}
                className="bg-medblue-100 text-medblue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-medblue-600 hover:text-medblue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Type tag and press Enter"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
          <p className="text-xs text-muted-foreground">
            Press Enter to add a tag
          </p>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-medblue-500 hover:bg-medblue-600">
            {initialData ? "Update Note" : "Save Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
