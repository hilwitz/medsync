
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface PatientFormProps {
  initialData?: Patient;
  onSubmit: (data: Omit<Patient, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  dob: string;
  contactInfo: string;
  allergies: string;
  chronicConditions: string;
  tagInput: string;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  
  const form = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      dob: initialData?.dob || "",
      contactInfo: initialData?.contactInfo || "",
      allergies: initialData?.allergies || "",
      chronicConditions: initialData?.chronicConditions || "",
      tagInput: "",
    },
  });

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tagInput = form.getValues("tagInput").trim().toLowerCase();
    
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      form.setValue("tagInput", "");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (data: FormData) => {
    const { tagInput, ...patientData } = data;
    onSubmit({
      ...patientData,
      tags,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Patient's full name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Information</FormLabel>
              <FormControl>
                <Input placeholder="Phone number or email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea placeholder="List patient allergies" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chronicConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chronic Conditions</FormLabel>
              <FormControl>
                <Textarea placeholder="List any chronic conditions" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-medblue-100 text-medblue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-medblue-600 hover:text-medblue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="tagInput"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      placeholder="Add tags (e.g., diabetes, urgent)"
                      onKeyDown={handleKeyDown}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              className="shrink-0"
            >
              Add Tag
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-medblue-500 hover:bg-medblue-600">
            {initialData ? "Update Patient" : "Save Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
