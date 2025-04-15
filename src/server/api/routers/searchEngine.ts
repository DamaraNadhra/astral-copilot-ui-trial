import { z } from "zod";
import { google } from "googleapis";
import { type SearchResultType } from "~/lib/data";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Grade } from "@prisma/client";
import { pdfParsingHelper } from "~/lib/buildHelpers";

export const searchEngineRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        query: z.object({
          text: z.string(),
          grade: z.nativeEnum(Grade),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existingSearchHistory = await ctx.db.searchHistory.findFirst({
        where: {
          query: input.query.text.trim(),
          grade: input.query.grade,
          createdById: ctx.session?.user.id,
        },
        select: {
          id: true,
          query: true,
          grade: true,
          response: {
            select: {
              id: true,
              relevantPages: true,
              searchHistory: true,
              document: true,
            },
          },
        },
      });
      if (existingSearchHistory) {
        console.log("the query already exists");
        return existingSearchHistory;
      }

      try {
        const fullQuery = `${input.query.text.trim()} ${input.query.grade === Grade.ALL ? "" : "for students in " + input.query.grade.toLowerCase().replace("_", " ")} filetype:pdf`;
        console.log("Searching for: ", fullQuery);
        const customSearch = google.customsearch({
          version: "v1",
          auth: process.env.CSE_API_KEY,
        });
        const response = await customSearch.cse.list({
          q: fullQuery,
          cx: process.env.CUSTOM_SEARCH_ENGINE_ID,
        });
        const data = response.data;
        const documents =
          data.items
            ?.map((item) => {
              const filename = item.title;
              const downloadKey = item.link;
              if (!filename || !downloadKey) {
                return null;
              }
              return {
                filename,
                downloadKey,
              };
            })
            .filter((doc) => doc !== null) || [];

        const existingDocuments = await ctx.db.document.findMany({
          where: {
            downloadKey: { in: documents?.map((doc) => doc.downloadKey) || [] },
          },
        });

        const newDocuments = documents?.filter(
          (doc) =>
            !existingDocuments.some(
              (existingDoc) => existingDoc.downloadKey === doc.downloadKey,
            ),
        );
        console.log(
          "documents: ",
          documents.map((doc) => doc.filename),
        );
        console.log(
          "new documents: ",
          newDocuments.map((doc) => doc.filename),
        );
        const createdDocuments = await ctx.db.document.createManyAndReturn({
          data: newDocuments || [],
          skipDuplicates: true,
        });

        const createdSearchHistory = await ctx.db.searchHistory.create({
          data: {
            query: input.query.text.trim(),
            grade: input.query.grade,
            createdById: ctx.session?.user.id,
          },
        });
        // create the many to many relationship between the documents and the search history
        const createdDocumentToSearchHistory =
          await ctx.db.documentToSearchHistory.createManyAndReturn({
            data: [...existingDocuments, ...createdDocuments].map((doc) => ({
              documentId: doc.id,
              searchHistoryId: createdSearchHistory.id,
              relevantPages: [],
            })),
            select: {
              id: true,
              relevantPages: true,
              searchHistory: true,
              document: true,
            },
            skipDuplicates: true,
          });
        return {
          query: input.query.text.trim(),
          grade: input.query.grade,
          response: createdDocumentToSearchHistory,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    }),

  getRelevantPages: publicProcedure
    .input(
      z.object({
        query: z.string(),
        url: z.string(),
        filename: z.string(),
        grade: z.nativeEnum(Grade),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
        relevantPages: z.array(z.number()).optional(),
        error: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const doc = await ctx.db.document.findUnique({
          where: {
            downloadKey_filename: {
              downloadKey: input.url,
              filename: input.filename,
            },
          },
          select: {
            searchHistory: {
              where: {
                searchHistory: {
                  query: input.query.trim(),
                  grade: input.grade,
                },
              },
              select: {
                id: true,
                isParsed: true,
                relevantPages: true,
              },
            },
            id: true,
          },
        });

        if (
          doc &&
          doc.searchHistory[0] &&
          doc.searchHistory[0].relevantPages &&
          (doc.searchHistory[0].relevantPages.length > 0 ||
            doc.searchHistory[0].isParsed)
        ) {
          console.log("returning relevant pages from db");
          return {
            success: true,
            relevantPages: doc.searchHistory[0].relevantPages,
          };
        }
        const relevantPages = await pdfParsingHelper.getFileRelevancy(
          input.url,
          input.query.trim(),
        );

        await ctx.db.documentToSearchHistory.upsert({
          where: {
            id: doc?.searchHistory[0]?.id,
          },
          update: {
            relevantPages: relevantPages
              ?.map((page) => page?.pageIndex)
              .filter((page) => page !== undefined && page !== null),
            isParsed: true,
          },
          create: {
            documentId: doc?.id || "",
            searchHistoryId: doc?.searchHistory[0]?.id || "",
            relevantPages: relevantPages
              ?.map((page) => page?.pageIndex)
              .filter((page) => page !== undefined && page !== null),
            isParsed: true,
          },
        });
        return {
          success: true,
          relevantPages: relevantPages
            ?.map((page) => page?.pageIndex)
            .filter((page) => page !== undefined && page !== null),
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  getSearchHistory: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const searchHistory = await ctx.db.searchHistory.findMany({
        where: {
          createdById: input.userId,
        },
        select: {
          query: true,
          grade: true,
        },
      });
      return searchHistory;
    }),

  setDocumentValidity: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        isValid: z.boolean(),
        documentToSearchHistoryId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.document.update({
        where: { id: input.documentId },
        data: { isValid: input.isValid },
      });

      if (input.isValid === false && input.documentToSearchHistoryId) {
        await ctx.db.documentToSearchHistory.delete({
          where: {
            id: input.documentToSearchHistoryId,
          },
        });
      }
    }),
});
