
/// <reference types="vite/client" />

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date: string;
    hash: string;
  };
}

declare interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
