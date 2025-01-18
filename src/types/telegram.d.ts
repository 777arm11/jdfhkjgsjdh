interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface WebAppInitData {
  user?: TelegramUser;
}

interface WebApp {
  initDataUnsafe: WebAppInitData;
}

interface TelegramWebApp {
  WebApp: WebApp;
}

interface TelegramGameProxy {
  setScore: (score: number) => void;
}

declare global {
  interface Window {
    Telegram?: TelegramWebApp;
    TelegramGameProxy?: TelegramGameProxy;
  }
}

export {};