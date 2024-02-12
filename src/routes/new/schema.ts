import { currencies } from '$lib/currencies';
import { z } from 'zod';

const currencyEnum = z.enum(currencies);

export const formSchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().max(500),
	currency: currencyEnum,
	participants: z.array(z.string().min(1).max(50)).min(1).refine(items => new Set(items).size === items.length, {
		message: 'Participant names must be unique',
	}),
});

export type FormSchema = typeof formSchema;