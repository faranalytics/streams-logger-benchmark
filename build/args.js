export default process.argv.slice(2).reduce((prev, curr) => ({ ...prev, ...Object.fromEntries([curr.trim().split('=')]) }), {});
