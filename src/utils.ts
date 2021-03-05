import dayjs from "dayjs"

export const formatTimestamp = (timestampSeconds: number) => dayjs.unix(timestampSeconds).format("HH:mm")

export const distinct = <T>(items: T[]) => [...new Set(items)]

// const convertArrayToObject = (array, key) => array.reduce((acc, item) => (acc[item[key]] = item, acc), {});

export const intersect = <T extends unknown>(a: T[], b: T[]): T[] => {
    const setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
};