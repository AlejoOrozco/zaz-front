import { z } from "zod";
import {
  emailFieldSchema,
  messageFieldSchema,
  nameFieldSchema,
  phoneFieldSchema,
} from "@/lib/validation/fields";

export const createContactSchema = z.object({
  name: nameFieldSchema,
  email: emailFieldSchema,
  phone: phoneFieldSchema,
  message: messageFieldSchema,
});
