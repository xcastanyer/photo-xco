import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try {

        const { resources } = await cloudinary.api.resources({
            type: "upload",
            resource_type: "image",
            //prefix: folder + "/", // busca dentro de esa carpeta
            max_results: 100,
        });


        const urls = resources.map((res: { public_id: string; secure_url: string }, index: number) => ({
            id: index + 1,
            url: cloudinary.url(res.public_id, { width: 1600, crop: "scale" }),
        }));



        return NextResponse.json({ urls });
    } catch (error: unknown) {
        let message = "Unknown error";
        if (error instanceof Error) message = error.message;
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
