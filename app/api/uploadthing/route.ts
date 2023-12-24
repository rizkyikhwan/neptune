import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi()

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

export async function DELETE(request: Request) {
  const data = await request.json();
  const newUrl = data.url.split("/").pop();

  await utapi.deleteFiles(newUrl);

  return Response.json({ message: "OK" });
}