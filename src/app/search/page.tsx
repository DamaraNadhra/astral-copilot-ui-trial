"use client";

import { GradeDropdown } from "../../components/GradeDropdown";
import { SearchBar } from "../../components/SearchBar";
import { Suspense, useState } from "react";
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
import { signIn, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<{
    text: string;
    grade: Grade;
  }>({
    text: "",
    grade: Grade.ALL,
  });
  const { data: session } = useSession();
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
  if (!session) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Button onClick={() => signIn("github")}>Login</Button>
      </div>
    );
  }
  return (
    <div className="container mx-auto items-center px-4 pt-6">
      <div className="relative w-full px-4">
        <h1 className="mb-4 text-2xl font-semibold">PDF Search</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={setFinalQuery}
              placeholder="Search..."
            />
          </div>
          <div className="relative z-10 h-12">
            <GradeDropdown
              value={searchQuery.grade}
              onChange={(value) =>
                setSearchQuery({ ...searchQuery, grade: value })
              }
            />
          </div>
        </div>
      </div>

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
