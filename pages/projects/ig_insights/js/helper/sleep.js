const TIMEOUT = 1000;
export function sleep() {
    return new Promise(resolve => setTimeout(resolve, TIMEOUT));
}