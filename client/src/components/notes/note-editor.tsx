import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Paperclip, 
  Image, 
  Link,
  Download,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  title: string;
  content: string;
  tags: string[];
  attachments: string[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onTagsChange: (tags: string[]) => void;
  onAttachmentsChange: (attachments: string[]) => void;
  readOnly?: boolean;
}

export default function NoteEditor({
  title,
  content,
  tags,
  attachments,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onAttachmentsChange,
  readOnly = false
}: NoteEditorProps) {
  const [newTag, setNewTag] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => file.name);
      onAttachmentsChange([...attachments, ...newAttachments]);
    }
  };

  const formatText = (format: string) => {
    // Simple text formatting - in a real app, you'd use a rich text editor like TipTap
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `<u>${selectedText}</u>`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newContent = content.substring(0, start) + formattedText + content.substring(end);
      onContentChange(newContent);
    }
  };

  const insertList = (ordered: boolean) => {
    const prefix = ordered ? '1. ' : '- ';
    const newContent = content + '\n' + prefix;
    onContentChange(newContent);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <Input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl font-semibold border-none bg-transparent placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none mb-4"
          readOnly={readOnly}
        />
        
        {!readOnly && (
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {/* Formatting Tools */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('bold')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('italic')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('underline')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Underline className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertList(false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertList(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Link className="w-4 h-4" />
            </Button>
            
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start writing your note..."
          className="note-editor w-full border-none bg-transparent resize-none focus:outline-none"
          readOnly={readOnly}
        />

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attachments</h4>
            <div className="space-y-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Paperclip className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{attachment}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Attached just now</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      {!readOnly && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onAttachmentsChange(attachments.filter((_, i) => i !== index))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {!readOnly && (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1"
              />
              <Button onClick={handleAddTag} size="sm">Add</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
