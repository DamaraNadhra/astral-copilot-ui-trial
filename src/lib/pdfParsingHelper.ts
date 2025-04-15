import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { chunk } from "lodash";
import { LlamaParseReader } from "llamaindex";
import { OpenAISDKHelper } from "./openAISDKHelper";
import axios from "axios";
import PdfParse from "pdf-parse";

export class PdfParsingHelper {
  private reader: LlamaParseReader;
  constructor(private openAISDKHelper: OpenAISDKHelper) {
    this.reader = new LlamaParseReader({ resultType: "markdown" });
  }

  async parsePdf(pdfUrl: string) {
    const responseBuffer = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });
    const pdfParsePages: string[] = [];
    async function render_page(pageData: any) {
      //check documents https://mozilla.github.io/pdf.js/
      const render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false,
      };

      return pageData.getTextContent(render_options).then(function (
        textContent: any,
      ) {
        let lastY,
          text = "";
        for (const item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += "\n" + item.str;
          }
          lastY = item.transform[5];
        }
        pdfParsePages.push(text);
        return text;
      });
    }
    const dataBuffer = Buffer.from(responseBuffer.data);
    const defaultPdfParsePages = await PdfParse(dataBuffer, {
      pagerender: render_page,
    });
    if (defaultPdfParsePages.numpages > 50) {
      throw new Error("PDF is too large to be processed");
    }
    const pages = await this.reader.loadData(pdfUrl);
    if (!pages || pages.length === 0) {
      // fallback to pdf-parse
      return pdfParsePages;
    }
    return pages?.map((page) => page.text);
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
