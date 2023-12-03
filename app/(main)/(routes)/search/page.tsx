"use client";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const searchResults =
    useQuery(api.documents.searchDocuments, { query: searchText }) || [];
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl mx-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Search Documents
        </h1>
        <input
          className="w-full p-4 mb-6 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search for documents..."
        />
        {searchText && searchResults.length === 0 && (
          <p className="text-gray-600 mb-4">
            No documents found containing &quot;{searchText}&quot;.
          </p>
        )}
        <ul className="list-none divide-y divide-gray-200">
          {searchResults.map((searchResult, index) => (
            <li
              key={searchResult._id}
              className={`cursor-pointer p-4 hover:bg-gray-100 rounded transition ease-in-out duration-150 flex justify-between items-center ${
                index === searchResults.length - 1
                  ? "border-b-0"
                  : "border-b border-gray-200"
              }`}
              onClick={() => router.push(`/documents/${searchResult._id}`)}
            >
              <span className="font-medium text-gray-800">
                {searchResult.title}
              </span>
              <span className="text-sm text-gray-500">
                Created at:{" "}
                {new Date(searchResult._creationTime).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
