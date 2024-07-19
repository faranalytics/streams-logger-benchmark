export default function run(log:{warn:(data:string)=>void}) {
    for (let i = 0; i < 1e4*2; i++) {
        log.warn('Hello, World!');
    }
}