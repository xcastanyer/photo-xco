import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const folder = "mbr501"; // 👈 cambia por tu carpeta de Cloudinary

    const { resources } = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      //prefix: folder + "/", // busca dentro de esa carpeta
      max_results: 100,
    });

    // const urls = resources.map((file: any) => file.secure_url);
        // Creamos el array de objetos con id y url
    const urls = resources.map((res: any, index: number) => ({
      id: index + 1,
      url: cloudinary.url(res.public_id, { width: 1600, crop: "scale" })
    }));

 
    return NextResponse.json({ urls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
