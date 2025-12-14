type CustomAccount = {
    name: string;
    date: Date;
    scores: number[];
};

const CUSTOM_ACCOUNTS_KEY = "customComparisonAccounts";

export function getCustomAccounts(): CustomAccount[] {
    try {
        const stored = localStorage.getItem(CUSTOM_ACCOUNTS_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((acc: any) => ({
            ...acc,
            date: new Date(acc.date),
        }));
    } catch (error) {
        console.error("Failed to load custom accounts:", error);
        return [];
    }
}

export function saveCustomAccount(name: string, scores: number[]): void {
    const accounts = getCustomAccounts();
    const newAccount: CustomAccount = {
        name,
        date: new Date(),
        scores,
    };

    accounts.push(newAccount);
    localStorage.setItem(CUSTOM_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function deleteCustomAccount(index: number): void {
    const accounts = getCustomAccounts();
    accounts.splice(index, 1);
    localStorage.setItem(CUSTOM_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function renameCustomAccount(index: number, newName: string): void {
    const accounts = getCustomAccounts();
    if (accounts[index]) {
        accounts[index].name = newName;
        localStorage.setItem(CUSTOM_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
}
