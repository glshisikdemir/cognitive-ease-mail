import { createServerFn } from "@tanstack/react-start";

export type ConnectionStatus = {
  slack: boolean;
  telegram: boolean;
  whatsapp: boolean;
  whatsappFrom: boolean;
};

export const getConnectionStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConnectionStatus> => {
    return {
      slack: !!process.env.SLACK_API_KEY && !!process.env.LOVABLE_API_KEY,
      telegram: !!process.env.TELEGRAM_API_KEY && !!process.env.LOVABLE_API_KEY,
      whatsapp: !!process.env.TWILIO_API_KEY && !!process.env.LOVABLE_API_KEY,
      whatsappFrom: !!process.env.TWILIO_WHATSAPP_FROM,
    };
  },
);
