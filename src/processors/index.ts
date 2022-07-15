export const toNumber = (value: string) => Number(value);
export const toInteger = (value: string) => parseInt(value);
export const toFloat = (value: string) => parseFloat(value);

export const processors = {
    toNumber,
    toInteger,
    toFloat,
};