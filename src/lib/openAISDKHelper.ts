import { z } from "zod";
import { generateObject, type CoreMessage, type LanguageModel } from "ai";

export class OpenAISDKHelper {
  async generateObject<T extends z.ZodSchema>({
    schema,
    seed,
    prompt,
    model,
    temperature,
    system,
    maxTokens,
    imageUrls,
  }: {
    schema: T;
    prompt: string;
    seed?: number;
    model: LanguageModel;
    temperature?: number;
    system?: string;
    maxTokens?: number;
    imageUrls?: string[];
  }): Promise<z.infer<T>> {
    const maxRetries = 3;
    let retries = 0;
    let matchingResult;
    let summaryResult;

    const imageBlobs: Buffer[] = [];

    if (imageUrls) {
      for (const imageUrl of imageUrls) {
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(imageBlob);

        const supportedFormats = ["png", "jpeg", "gif", "webp"];
        const contentType = imageResponse.headers.get("content-type");
        const format = contentType?.split("/")[1];

        if (!format || !supportedFormats.includes(format)) {
          console.warn(`Unsupported image format: ${format}`);
          continue;
        }
        console.log(`downloaded image ${imageUrl}`);
        imageBlobs.push(buffer);
      }
    }

    while (retries < maxRetries) {
      try {
        const messages: CoreMessage[] = [
          {
            role: "user",
            content:
              imageBlobs.length > 0
                ? [
                    {
                      type: "text",
                      text: prompt,
                    },
                    ...imageBlobs.map((imageBlob) => ({
                      type: "image" as const,
                      image: imageBlob,
                    })),
                  ]
                : prompt,
          },
        ];

        const requirementExtractor = await generateObject({
          model,
          seed,
          temperature,
          maxTokens,
          system,
          messages,
          schema,
        });
        return schema.parse(requirementExtractor.object);
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw error; // If all retries failed, throw the last error
        }
        // Wait for a short time before retrying (e.g., 1 second)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
}
