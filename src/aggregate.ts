export function aggregate(result: { [key: string]: Array<{ [key: string]: number }> }, length: number) {
    for (let [name, arr] of Object.entries(result)) {
        if (arr.length !== length) {
            throw new Error(`${length} !== ${arr.length}`)
        }
        const agg = arr.reduce((acc: any, curr: any) => {
            if (!acc) {
                return curr;
            }
            for (let [key, value] of Object.entries(curr)) {
                acc[key] = acc[key] + value;
            }
            return acc;
        }, null);
        for (let [key, value] of Object.entries<number>(agg)) {
            agg[key] = value / length;
            if (key == 'time') {
                agg[key] = agg[key] + 'ms';
            }
            else {
                agg[key] = Math.round(agg[key] / 1e6 * 100) / 100 + 'mb';
            }
        }
        result[name] = agg;
    }
    return result;
}
