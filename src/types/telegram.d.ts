
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface WebAppInitData {
  user?: TelegramUser;
  query_id?: string;
  start_param?: string;
}

interface ThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  button_color: string;
  button_text_color: string;
}

interface WebApp {
  initDataUnsafe: WebAppInitData;
  initData: string;
  version: '5.10.7';  // Changed to string literal type
  platform: string;   // Changed to string type since Telegram type isn't defined
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  themeParams: ThemeParams;
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
