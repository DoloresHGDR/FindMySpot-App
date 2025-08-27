
let offset = 0;

export const setTimeOffset = (backendNow: string) => {
  const serverNow = new Date(backendNow).getTime();
  const clientNow = Date.now();
  offset = clientNow - serverNow;
};

export const calculateRemainingTime = (startTime: string, duration: number): number => {
    const start = new Date(startTime).getTime();
    const end = start + duration * 60000;
    const now = Date.now() - offset;
    return Math.max(end - now, 0);
};

export const formatTime = (miliseconds: number): string => {
    const minutes = Math.floor(miliseconds / 60000);
    const seconds = Math.floor((miliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}