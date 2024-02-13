export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'] as const;
export type Currency = typeof currencies[number];

export const categories = ['Accommodation', 'Entertainment', 'Groceries', 'Healthcare', 'Rent & Charges', 'Restaurants & Bars', 'Shopping', 'Transport', 'Other'] as const;
export type Category = typeof categories[number];

export const types = ['income', 'expense', 'transfer'] as const;
export type Type = typeof types[number];