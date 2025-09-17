import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File;
  console.log("post");
  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ resource_type: "image" }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
