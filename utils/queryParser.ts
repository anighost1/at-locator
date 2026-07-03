export const parsePositiveInteger = (value: unknown, defaultValue: number, maxValue?: number) => {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        return defaultValue;
    }

    return maxValue ? Math.min(parsedValue, maxValue) : parsedValue;
};

export const parseBoolean = (value: unknown, fieldName = "value") => {
    if (value === undefined) {
        return undefined;
    }

    if (value === "true" || value === true) {
        return true;
    }

    if (value === "false" || value === false) {
        return false;
    }

    throw new Error(`${fieldName} must be true or false`);
};

export const parseDate = (value: unknown, fieldName: string) => {
    if (!value) {
        return undefined;
    }

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
        throw new Error(`${fieldName} must be a valid date`);
    }

    return date;
};
