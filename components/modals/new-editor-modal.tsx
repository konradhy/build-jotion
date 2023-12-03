import React, { useState } from "react"; // Import useState
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { useNewEditor } from "@/hooks/use-new-editor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export const NewEditorModal = () => {
  const [editorEmail, setEditorEmail] = useState(""); // State for email
  const editor = useMutation(api.documents.update);
  const newEditor = useNewEditor();
  const { documentId } = useParams();

  const addEditor = () => {
    const promise = editor({
      id: documentId as Id<"documents">,
      editor: editorEmail,
    }); // Use the email from state
    toast.promise(promise, {
      loading: "Adding editor...",
      success: "Editor added!",
      error: "Failed to add editor.",
    });
  };

  return (
    <Dialog open={newEditor.isOpen} onOpenChange={newEditor.onClose}>
      <DialogContent className="p-6">
        <DialogHeader className="border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold">
            Add a collaborator to this document
          </h2>
        </DialogHeader>
        <div className="flex flex-col gap-y-3">
          <label htmlFor="editorEmail" className="text-sm font-medium">
            New Editor
          </label>
          <input
            id="editorEmail"
            type="email"
            placeholder="Enter email"
            className="p-3 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            style={{ minWidth: "100%" }}
            value={editorEmail} // Bind state to input
            onChange={(e) => setEditorEmail(e.target.value)} // Update state on change
          />
          <button
            onClick={addEditor}
            className="p-3 mt-2 bg-primary text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Add User
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
