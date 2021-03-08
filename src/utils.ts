import dayjs from "dayjs"

export const formatTimestamp = (timestampSeconds: number) => dayjs.unix(timestampSeconds).format("HH:mm")

export const distinct = <T>(items: T[]) => [...new Set(items)]

export const intersect = <T extends unknown>(a: T[], b: T[]): T[] => {
    const setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
};

export const promiseMinimumExecutionTime = async <T>(time: number, promise: Promise<T>) => {
    await Promise.all([new Promise(resolve => setTimeout(resolve, time)), promise]);
    return await promise;
}