    // src/utils/helpers.js
    export const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));
    export const fmtMoney = (n) => {
    if (typeof n !== 'number') return n;
    return n.toLocaleString('id-ID');
    };
    export const H = (m) => ({ h: Math.floor((m % (24 * 60)) / 60), m: Math.floor(m % 60) });

    export const between = (m, start, end) => {
    const day = 24 * 60;
    const norm = x => ((x % day) + day) % day;
    m = norm(m); start = norm(start); end = norm(end);
    if (start <= end) {
        return m >= start && m <= end;
    }
    return m >= start || m <= end;
    };

    export const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
