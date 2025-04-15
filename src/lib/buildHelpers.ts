import PDFParser from "pdf2json";
import { OpenAISDKHelper } from "./openAISDKHelper";
import { PdfParsingHelper } from "./pdfParsingHelper";

export const openAISDKHelper = new OpenAISDKHelper();

export const pdfParsingHelper = new PdfParsingHelper(openAISDKHelper);
