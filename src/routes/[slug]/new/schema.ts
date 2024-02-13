import { categories, currencies, types } from '$lib/enums';
import { z } from 'zod';

export const formSchema = z.object({
	title: z.string().min(1).max(50),
	type: z.enum(types).default('expense'),
	amount: z.coerce.number().positive(),
	currency: z.enum(currencies).default('EUR'), // TODO: set default tally currency
	date: z.date(),
	category: z.enum(categories).nullable(),
	// TODO: validate against participants in the tally
	primaryParticipant: z.string().min(1),
	distribution: z.record(z.string().min(1), z.object({
		amount: z.coerce.number().nonnegative(),
	}).or(z.object({
		parts: z.coerce.number().nonnegative(),
	}))),
	addedBy: z.string().min(1), // TODO: set default to current user
});

export type FormSchema = typeof formSchema;