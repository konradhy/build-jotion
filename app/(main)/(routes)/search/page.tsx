"use client";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation"; // Adjusted import for Next.js routing

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const searchResults =
    useQuery(api.documents.searchDocuments, { query: searchText }) || [];
  const router = useRouter();

  return (
    <div className="mx-auto my-8 bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 className="text-xl font-semibold mb-4">Search</h1>
      <input
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search for documents..."
      />
      {searchText && searchResults.length > 0 && (
        <p className="text-gray-600 mb-4">
          Found documents with &quot;{searchText}&quot; in their content:
        </p>
      )}
      {searchText && searchResults.length === 0 && (
        <p className="text-gray-600 mb-4">
          No documents found containing &quot;{searchText}&quot;.
        </p>
      )}
      <ul className="list-none space-y-2">
        {searchResults.map((searchResult) => (
          <li
            key={searchResult._id}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded transition duration-150 ease-in-out"
            onClick={() => router.push(`/documents/${searchResult._id}`)}
          >
            <span className="font-medium text-gray-800">
              {searchResult.title}
            </span>
            <span className="block text-sm text-gray-500 pt-1">
              Created at:{" "}
              {new Date(searchResult._creationTime).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
