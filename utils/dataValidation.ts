import { z } from "zod";
import statusCodes from "./statusCodes";

const allowedStatusCodes = statusCodes.map((status) => status.code);

const responseStatusValidator = (val: number) => {
  if (!allowedStatusCodes.includes(val)) {
    throw new Error(
      `Invalid status code. Allowed status codes are: ${allowedStatusCodes.join(
        ", "
      )}`
    );
  }
  return val;
};

const headerSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const bodySchema = z.record(z.any());

const responseSchema = z.object({
  name: z.string({ required_error: "Response name is required!" }),
  status: z
    .number({ required_error: "Response status is required!" })
    .refine(responseStatusValidator),
  body: z.record(z.any({ required_error: "Response body is required!" })),
});

const requestItemSchema = z.object({
  name: z.string({ required_error: "Request name is required!" }),
  type: z.literal("request"),
  url: z.string({ required_error: "Request URL is required!" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  description: z.string({ required_error: "Request description is required!" }),
  body: bodySchema.optional(),
  headers: z.array(headerSchema).optional(),
  responses: z.array(responseSchema).optional(),
});

const folderItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string({ required_error: "Folder name is required!" }),
    type: z.literal("folder"),
    description: z.string({
      required_error: "Folder description is required!",
    }),
    items: z.array(itemSchema),
  })
);

const itemSchema = z.union([requestItemSchema, folderItemSchema]);

const inputSchema = z.object({
  collection: z.string({ required_error: "Collection name is required!" }),
  folder: z.string({ required_error: "Folder name is required!" }),
  description: z.string({ required_error: "Folder description is required!" }),
  items: z.array(itemSchema),
});

export default inputSchema;
