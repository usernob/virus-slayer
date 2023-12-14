export const arrayRemove = <T>(arr: T[], id: number): T[] => {
    if (id < 0 || id >= arr.length) return arr;
    delete arr[id];
    return arr.filter((_, i) => i !== id);
}


export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
}