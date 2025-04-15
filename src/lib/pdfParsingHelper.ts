import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { chunk } from "lodash";
import { OpenAISDKHelper } from "./openAISDKHelper";
import axios from "axios";
import PdfParse from "pdf-parse";

export class PdfParsingHelper {
  constructor(private openAISDKHelper: OpenAISDKHelper) {}

  async parsePdf(pdfUrl: string) {
    try {
      const responseBuffer = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
      });

      const dataBuffer = Buffer.from(responseBuffer.data);
      const pdfData = await PdfParse(dataBuffer);

      if (pdfData.numpages > 50) {
        throw new Error("PDF is too large to be processed");
      }

      // Split the text into pages based on the page markers
      const pages = pdfData.text.split(/\f/).map((page) => page.trim());
      return pages.filter((page) => page.length > 0);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Error while parsing PDF");
    }
  }

  async getFileRelevancy(pdfUrl: string, query: string) {
    const relevantPages = [];
    const pageTexts = await this.parsePdf(pdfUrl);

    if (!pageTexts) {
      throw new Error("Error while parsing PDF");
    }

    const chunks = chunk(pageTexts, 7);
    let chunkIndex = 0;
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(async (pageText: any, index: number) => {
          const testingResponse = await this.openAISDKHelper.generateObject({
            schema: z.object({
              relevanceScore: z.number(),
              reasoning: z.string(),
            }),
            prompt: `based on the query: "${query}" and the page text: "${pageText}", 
      1. decide a relevance score between 0 and 1 based on how relevant the page text is to the query.
      2. give the reasoning behind the relevance score.`,
            model: openai("gpt-4o-mini"),
          });
          if (!testingResponse) {
            return null;
          }
          if (testingResponse.relevanceScore < 0.5) {
            return null;
          }

          return {
            pageIndex: chunkIndex * 7 + index + 1,
            ...testingResponse,
          };
        }),
      );
      const filteredChunkResults = chunkResults.filter(
        (result: any) => result !== null,
      );
      relevantPages.push(...filteredChunkResults);
      chunkIndex++;
    }
    return relevantPages.filter((page) => page !== null);
  }
}
