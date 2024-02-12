export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'] as const;
export type Currency = typeof currencies[number];