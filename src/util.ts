export const arrayRemove = <T>(arr: T[], id: number): T[] => {
    if (id < 0 || id >= arr.length) return arr;
    delete arr[id];
    return arr.filter((_, i) => i !== id);
};

export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const formatTime = (seconds: number): string => {
    const hours: number = Math.floor(seconds / 3600);
    const minutes: number = Math.floor((seconds % 3600) / 60);
    const remainingSeconds: number = seconds % 60;

    const formattedHours: string = hours > 0 ? `${hours}:` : "";
    const formattedMinutes: string =
        minutes > 0 || hours > 0 ? `${String(minutes).padStart(2, "0")}:` : "";
    const formattedSeconds: string = String(Math.round(remainingSeconds));

    return formattedHours + formattedMinutes + formattedSeconds;
};
