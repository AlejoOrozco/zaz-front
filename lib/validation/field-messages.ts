import type { FieldMessages } from "@/lib/validation/fields";

export const fieldMessagesByLocale: Record<"en" | "es", FieldMessages> = {
  en: {
    nameRequired: "Name is required.",
    nameLetters: "Name can only contain letters.",
    nameMax: "Name is too long.",
    emailRequired: "Email is required.",
    emailInvalid: "Enter a valid email like name@example.com.",
    emailMax: "Email is too long.",
    phoneRequired: "Phone is required.",
    phoneDigits: "Phone can only contain numbers.",
    phoneMin: "Phone must be at least 7 digits.",
    phoneMax: "Phone is too long.",
    messageRequired: "Message is required.",
    messageMax: "Message is too long.",
  },
  es: {
    nameRequired: "El nombre es obligatorio.",
    nameLetters: "El nombre solo puede contener letras.",
    nameMax: "El nombre es demasiado largo.",
    emailRequired: "El correo es obligatorio.",
    emailInvalid: "Ingresa un correo válido como nombre@ejemplo.com.",
    emailMax: "El correo es demasiado largo.",
    phoneRequired: "El teléfono es obligatorio.",
    phoneDigits: "El teléfono solo puede contener números.",
    phoneMin: "El teléfono debe tener al menos 7 dígitos.",
    phoneMax: "El teléfono es demasiado largo.",
    messageRequired: "El mensaje es obligatorio.",
    messageMax: "El mensaje es demasiado largo.",
  },
};
