export declare function aggregate(result: {
    [key: string]: Array<{
        [key: string]: number;
    }>;
}, testCount: number): {
    [key: string]: {
        [key: string]: number;
    }[];
};
