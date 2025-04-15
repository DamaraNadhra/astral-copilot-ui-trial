import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import pdfjs from "pdfjs-dist";
import { db } from "~/server/db";
import axios from "axios";
import { LlamaParseReader } from "llamaindex";
import { pdfParsingHelper } from "~/lib/buildHelpers";

export async function GET(request: NextRequest) {
  // trying to parse with llamaparseindex
  try {
    const documents = await pdfParsingHelper.parsePdf(
      "https://www.carlisleschools.org/common/pages/UserFile.aspx?fileId=61125167",
    );
    if (!documents || documents.length === 0)
      throw new Error("Error parsing PDF");
    return NextResponse.json({ data: documents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error parsing PDF" }, { status: 500 });
  }
}
