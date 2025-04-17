import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { chunk } from "lodash";
import { OpenAISDKHelper } from "./openAISDKHelper";
import axios from "axios";
import PdfParse from "pdf-parse";
import { Document, LlamaParseReader } from "llamaindex";

export class PdfParsingHelper {
  private reader: LlamaParseReader;
  constructor(private openAISDKHelper: OpenAISDKHelper) {
    this.reader = new LlamaParseReader({ resultType: "markdown" });
  }

  async parsePdf(pdfUrl: string) {
    try {
      const responseBuffer = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
      });
      const pages: string[] = [];
      const customRenderPage = (pageData: any) => {
        return pageData.getTextContent().then((textContent: any) => {
          const pageNumber = pageData.pageIndex + 1;
          const strings = textContent.items.map((item: any) => item.str);
          const text = strings.join("\n");
          pages.push(text);
          return `=== Page ${pageNumber} ===\n${text}\n\n`;
        });
      };
      const loadDataWithTimeout = async (
        reader: LlamaParseReader,
        file: string,
        timeoutMs = 1000 * 20,
      ) => {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("load_data timed out")), timeoutMs);
        });

        return Promise.race([reader.loadData(file), timeoutPromise]);
      };

      const dataBuffer = Buffer.from(responseBuffer.data);
      const pdfData = await PdfParse(dataBuffer, {
        pagerender: customRenderPage,
      });

      if (pdfData.numpages > 50) {
        return pages;
      }
      try {
        const parsedPages = (await loadDataWithTimeout(
          this.reader,
          pdfUrl,
          1000 * 30,
        )) as Document[];
        if (parsedPages.length > 0) {
          return parsedPages.map((page) => page.text);
        }
        return pages;
      } catch (error) {
        console.error(
          "Error parsing PDF with LlamaParseReader, fallback to pdf-parse:",
          error,
        );
        return pages;
      }
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Error while parsing PDF");
    }
  }

  async getFileRelevancy(pdfUrl: string, query: string) {
    const relevantPages = [];
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("load_data timed out")), 1000 * 40);
    });
    const pageTexts = (await Promise.race([
      this.parsePdf(pdfUrl),
      timeoutPromise,
    ])) as string[];

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
            }),
            prompt: `based on the query: "${query}" and the page text: "${pageText}", 
            1. decide a relevance score between 0 and 1 based on how relevant the page text is to the query.
            2. when deciding the relevancy please flag out (return a score of 0) any pages that contains unnecessary chapters like introduction, table of contents, etc.`,
            system: `You are a helpful assistant that is given a query and a page of text from a PDF. You need to decide if the page is relevant to the query.`,
            model: openai("gpt-4o-mini"),
          });
          console.log("testingResponse", testingResponse);
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
