"use client";

import { GradeDropdown } from "../../components/GradeDropdown";
import { SearchBar } from "../../components/SearchBar";
import { useState } from "react";
import { SearchResults } from "../../components/SearchResults";
import { api } from "~/trpc/react";
import { Grade } from "@prisma/client";
import { Loader2 } from "lucide-react";
import {
  createEnumParam,
  ObjectParam,
  StringParam,
  useQueryParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
export default function Home() {
  const [searchQuery, setSearchQuery] = useState<{
    text: string;
    grade: Grade;
  }>({
    text: "",
    grade: Grade.ALL,
  });
  const [finalQuery, setFinalQuery] = useQueryParams({
    text: withDefault(StringParam, ""),
    grade: withDefault(createEnumParam(Object.values(Grade)), Grade.ALL),
  });

  const { data: searchResultsQuery, isLoading } =
    api.searchEngine.search.useQuery(
      {
        query: {
          text: finalQuery.text,
          grade: finalQuery.grade,
        },
      },
      {
        enabled: !!finalQuery && finalQuery.text.length > 0,
        refetchOnWindowFocus: false,
      },
    );

  return (
    <div className="mx-auto flex w-full max-w-full flex-col items-center pt-6 sm:w-3/4">
      <div className="relative w-full px-4">
        <h1 className="mb-4 text-2xl font-semibold">PDF Search</h1>
        {/* Search bar and grade dropdown container */}
        <div className="flex flex-col gap-2">
          <div className="flex items-stretch">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={setFinalQuery}
                placeholder="Search..."
              />
            </div>
            <div className="relative z-10 ml-4 h-12">
              <GradeDropdown
                value={searchQuery.grade}
                onChange={(value) =>
                  setSearchQuery({ ...searchQuery, grade: value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search results section */}
      <div className="mt-6 w-full px-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <SearchResults result={searchResultsQuery} />
        )}
      </div>
    </div>
  );
}
