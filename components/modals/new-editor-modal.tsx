import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useNewEditor } from "@/hooks/use-new-editor";

export const NewEditorModal = () => {
  const [editorEmail, setEditorEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const addEditorMutation = useMutation(api.documents.update);
  const removeEditorMutation = useMutation(api.documents.updateEditor);
  const newEditor = useNewEditor();

  const { documentId } = useParams();

  const data = useQuery(api.documents.getById, {
    documentId: documentId as Id<"documents">,
  });
  const currentEditors = data?.editors;

  const addEditor = () => {
    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const promise = addEditorMutation({
      id: documentId as Id<"documents">,
      editor: editorEmail,
    });

    toast.promise(promise, {
      loading: "Adding editor...",
      success: "Editor added!",
      error: "Failed to add editor.",
    });
  };

  const removeEditor = (editorToRemove: string) => {
    const promise = removeEditorMutation({
      id: documentId as Id<"documents">,
      editorEmail: editorToRemove,
      shouldAdd: false,
    });

    toast.promise(promise, {
      loading: "Removing editor...",
      success: "Editor removed!",
      error: "Failed to remove editor.",
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEditorEmail(email);

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(validEmail || email === "");
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
            className={`p-3 text-sm border-2 ${
              isEmailValid ? "border-gray-300" : "border-red-500"
            } rounded-lg focus:outline-none focus:border-primary-500`}
            value={editorEmail}
            onChange={handleEmailChange}
          />
          <button
            onClick={addEditor}
            className="p-3 mt-2 bg-primary text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Add User
          </button>
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">
              Current Collaborators:
            </h3>
            <ul className="list-disc pl-5">
              {currentEditors?.map((editor, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm py-1"
                >
                  {editor}
                  <button
                    onClick={() => removeEditor(editor)}
                    className="ml-2 text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
