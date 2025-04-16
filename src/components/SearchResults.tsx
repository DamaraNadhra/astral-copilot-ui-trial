"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Grade, type DocumentToSearchHistory } from "@prisma/client";
import { api } from "~/trpc/react";
import AttachmentPreviewCard from "./AttachmentPreviewCard";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// RelevancyInfo component
const RelevancyInfo = ({
  totalPages,
  query,
  filename,
  grade,
  link,
  id,
  onInvalid,
}: {
  totalPages: number;
  query: string;
  filename: string;
  grade: Grade;
  link: string;
  id: string;
  onInvalid: () => void;
}) => {
  const { data, isLoading } = api.searchEngine.getRelevantPages.useQuery({
    query,
    url: link,
    filename: filename,
    grade: grade,
  });
  useEffect(() => {
    if (
      data &&
      !data.success &&
      data.error !== "PDF is too large to be processed"
    ) {
      onInvalid();
    }
  }, [data]);
  if (isLoading) {
    return (
      <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking relevancy</span>
      </div>
    );
  }
  if (!data!.success) {
    return (
      <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
        <span>❌ {data?.error}</span>
      </div>
    );
  }

  if (data!.relevantPages!.length === 0) {
    return (
      <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
        <span>No relevant pages found</span>
      </div>
    );
  }

  function formatRanges(numbers: number[]) {
    numbers.sort((a, b) => a - b);

    const ranges = [];
    let start = numbers[0];
    let end = numbers[0];

    for (let i = 1; i <= numbers.length; i++) {
      if (numbers[i] === end! + 1) {
        end = numbers[i];
      } else {
        if (start === end) {
          ranges.push(`${start}`);
        } else {
          ranges.push(`${start}-${end}`);
        }
        start = numbers[i];
        end = numbers[i];
      }
    }

    if (ranges.length > 1) {
      return `${ranges.slice(0, -1).join(", ")}, and ${ranges[ranges.length - 1]}`;
    }

    return ranges[0];
  }

  const ranges = formatRanges(data!.relevantPages!);
  if (data!.relevantPages!.length === totalPages) {
    return (
      <div className="mt-2 text-sm text-gray-500">All pages are relevant</div>
    );
  }

  return (
    <div className="mt-2 text-sm text-gray-500">
      {data!.relevantPages!.length} relevant pages from page {ranges}
    </div>
  );
};

const SearchResult = ({
  theDoc,
  query,
  proxiedURL,
  grade,
  setValidResults,
  id,
}: {
  theDoc: any;
  query: string;
  proxiedURL: string;
  grade: Grade;
  setValidResults: (value: any) => void;
  id: string;
}) => {
  const setDocumentValidity =
    api.searchEngine.setDocumentValidity.useMutation();
  const [totalPages, setTotalPages] = useState(0);
  const handleInvalid = () => {
    setDocumentValidity.mutate({
      documentId: theDoc.id,
      isValid: false,
      documentToSearchHistoryId: id,
    });
    setValidResults((prev: any) =>
      prev.filter((result: any) => result.document.id !== theDoc.id),
    );
  };
  return (
    <div className="mb-4 flex flex-col overflow-hidden rounded-lg border bg-white md:flex-row">
      <div className="relative w-full md:w-72">
        <AttachmentPreviewCard
          setTotalPages={setTotalPages}
          totalPages={totalPages}
          url={proxiedURL}
          link={theDoc.downloadKey}
          onInvalid={handleInvalid}
        />
      </div>
      <div className="justify-senter flex w-full flex-col items-start p-4">
        <h3 className="mb-2 text-base font-medium">{theDoc.filename}</h3>
        <p className="text-sm text-gray-600">{theDoc.snippet}</p>

        <RelevancyInfo
          totalPages={totalPages}
          query={query}
          filename={theDoc.filename}
          grade={grade}
          link={theDoc.downloadKey}
          id={theDoc.id}
          onInvalid={handleInvalid}
        />
      </div>
    </div>
  );
};

// Search results container component
export const SearchResults = ({ result }: { result?: any }) => {
  const docResp = result?.response;
  const [validResults, setValidResults] = useState<DocumentToSearchHistory[]>(
    [],
  );
  useEffect(() => {
    if (docResp) {
      setValidResults(docResp.filter((result: any) => result.document.isValid));
    }
  }, [docResp]);
  return (
    <div>
      <h2 className="mb-4 text-xl font-medium">Results</h2>

      {validResults && validResults.length > 0 ? (
        <AnimatePresence>
          {validResults.map((resp: any, index: number) => {
            const theDoc = resp.document;
            const proxiedURL = `/api/proxy?url=${encodeURIComponent(
              theDoc.downloadKey,
            )}`;
            return (
              <motion.div
                key={theDoc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SearchResult
                  key={theDoc.id}
                  theDoc={theDoc}
                  proxiedURL={proxiedURL}
                  setValidResults={setValidResults}
                  query={result.query}
                  grade={result.grade}
                  id={resp.id}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-4 text-center text-gray-500">
              No results found, start querying something!
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
