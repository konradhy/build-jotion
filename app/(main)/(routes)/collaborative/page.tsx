"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const CollaborativeDocuments = () => {
  const collaboratorsList = useQuery(api.documents.getDocumentsByEditorEmail);
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl mx-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Collaborative Documents
        </h1>
        {collaboratorsList && collaboratorsList.length === 0 && (
          <p className="text-gray-600 mb-4">
            You are not collaborating on any documents.
          </p>
        )}
        <ul className="list-none divide-y divide-gray-200">
          {collaboratorsList?.map((document, index) => (
            <li
              key={document._id}
              className={`cursor-pointer p-4 hover:bg-gray-100 rounded transition ease-in-out duration-150 flex justify-between items-center ${
                index !== collaboratorsList.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
              onClick={() => router.push(`/documents/${document._id}`)}
            >
              <span className="font-medium text-gray-800">
                {document.title}
              </span>
              <span className="text-sm text-gray-500">
                Created at: {new Date(document._creationTime).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollaborativeDocuments;
