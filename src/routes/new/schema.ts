import { z } from 'zod';

export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'] as const;
export const currencyEnum = z.enum(currencies);
export type Currency = z.infer<typeof currencyEnum>;

export const formSchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().max(500),
	currency: currencyEnum,
	participants: z.array(z.string().min(1).max(50)),
});

export type FormSchema = typeof formSchema;