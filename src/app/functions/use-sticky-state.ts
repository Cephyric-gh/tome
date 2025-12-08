import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export const useStickyState = <T = any>(defaultValue: T, name: string): [T, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined" || !window.localStorage) {
            return defaultValue;
        }

        let persistedValue = window.localStorage.getItem(name);

        if (!persistedValue) {
            return defaultValue;
        }

        try {
            return JSON.parse(persistedValue);
        } catch (_) {
            return defaultValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(name, JSON.stringify(value));
    }, [name, value]);

    return [value, setValue];
};
