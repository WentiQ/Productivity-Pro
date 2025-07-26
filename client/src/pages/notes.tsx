import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NoteEditor from "@/components/notes/note-editor";
import { insertNoteSchema, type Note } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, StickyNote, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes'],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string; tags: string[]; attachments: string[] }) => {
      const response = await apiRequest('POST', '/api/notes', noteData);
      return response.json();
    },
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setSelectedNote(newNote);
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Note> }) => {
      const response = await apiRequest('PUT', `/api/notes/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setSelectedNote(updatedNote);
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/notes/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setSelectedNote(null);
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });

  const handleCreateNote = () => {
    setIsCreating(true);
    setSelectedNote(null);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleSaveNote = (title: string, content: string, tags: string[], attachments: string[]) => {
    if (isCreating) {
      createNoteMutation.mutate({ title, content, tags, attachments });
    } else if (selectedNote) {
      updateNoteMutation.mutate({
        id: selectedNote.id,
        data: { title, content, tags, attachments }
      });
    }
  };

  const handleDeleteNote = (note: Note) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(note.id);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notes</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create and organize your professional notes</p>
          </div>
          <Button onClick={handleCreateNote} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Notes Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <div className="overflow-y-auto h-[calc(100vh-320px)]">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Loading notes...
                    </div>
                  ) : filteredNotes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No notes found' : 'No notes yet'}
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => handleSelectNote(note)}
                          className={cn(
                            "p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer border-l-2 transition-colors",
                            selectedNote?.id === note.id
                              ? "border-primary bg-primary/5"
                              : "border-transparent"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {note.title || 'Untitled'}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(note.updatedAt)}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                {note.content.substring(0, 100)}...
                              </p>
                              {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {note.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {note.tags.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{note.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Note Editor */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              {selectedNote || isCreating ? (
                <NoteEditor
                  title={selectedNote?.title || ""}
                  content={selectedNote?.content || ""}
                  tags={selectedNote?.tags || []}
                  attachments={selectedNote?.attachments || []}
                  onTitleChange={(title) => {
                    if (selectedNote) {
                      handleSaveNote(title, selectedNote.content, selectedNote.tags, selectedNote.attachments);
                    }
                  }}
                  onContentChange={(content) => {
                    if (selectedNote) {
                      handleSaveNote(selectedNote.title, content, selectedNote.tags, selectedNote.attachments);
                    }
                  }}
                  onTagsChange={(tags) => {
                    if (selectedNote) {
                      handleSaveNote(selectedNote.title, selectedNote.content, tags, selectedNote.attachments);
                    }
                  }}
                  onAttachmentsChange={(attachments) => {
                    if (selectedNote) {
                      handleSaveNote(selectedNote.title, selectedNote.content, selectedNote.tags, attachments);
                    }
                  }}
                />
              ) : (
                <CardContent className="h-full flex flex-col items-center justify-center text-center">
                  <StickyNote className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a note to view
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Choose a note from the sidebar to view and edit, or create a new one.
                  </p>
                  <Button onClick={handleCreateNote} className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Note
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
