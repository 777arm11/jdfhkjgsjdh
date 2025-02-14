
const BROWSER_ID_KEY = 'player_browser_id';

export const getBrowserId = (): string => {
  let browserId = localStorage.getItem(BROWSER_ID_KEY);
  
  if (!browserId) {
    browserId = crypto.randomUUID();
    localStorage.setItem(BROWSER_ID_KEY, browserId);
  }
  
  return browserId;
};
