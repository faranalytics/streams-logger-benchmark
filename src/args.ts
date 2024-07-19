export default process.argv.slice(2).reduce((prev: Record<string, string>, curr: string) => ({ ...prev, ...Object.fromEntries([curr.trim().split('=')]) }), {});
