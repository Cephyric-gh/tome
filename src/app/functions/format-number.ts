export const formatNumber = (value: number | string): string => {
    if (typeof value === "string") {
        return value;
    }

    // Handle very large numbers with scientific notation
    if (Math.abs(value) > 999999999) {
        return value.toExponential(2);
    }

    // Format with commas for thousands
    if (Number.isInteger(value)) {
        return value.toLocaleString("en-US");
    }

    // Format decimals appropriately
    if (Math.abs(value) >= 1000) {
        return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }

    return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
};
