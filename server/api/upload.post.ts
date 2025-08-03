import { promises as fs } from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file provided.",
      });
    }

    const file = formData[0];

    if (!file.filename || !file.data) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid file data.",
      });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.filename);
    const newFilename = `${path.basename(
      file.filename,
      fileExtension
    )}-${uniqueSuffix}${fileExtension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, newFilename);

    await fs.writeFile(filePath, file.data);

    const publicUrl = `/uploads/${newFilename}`;

    return {
      url: publicUrl,
    };
  } catch (error) {
    console.error("Upload API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during file upload.",
    });
  }
});
