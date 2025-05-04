
import React from "react";
import { Note, Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  patient?: Patient;
  onClick?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, patient, onClick }) => {
  // Format the content for preview (first 100 characters)
  const previewContent = note.content.length > 100
    ? `${note.content.substring(0, 100)}...`
    : note.content;

  const formatTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">
              {note.templateType} Note
            </CardTitle>
            {patient && (
              <p className="text-sm text-muted-foreground">{patient.name}</p>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTimeAgo(note.createdAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3 line-clamp-3">{previewContent}</p>
        
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
