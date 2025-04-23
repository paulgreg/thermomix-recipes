export const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timerId: ReturnType<typeof setTimeout> | undefined
    return (...args: Parameters<T>) => {
        if (timerId !== undefined) {
            clearTimeout(timerId)
        }

        timerId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
