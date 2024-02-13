import { categories, currencies, types } from '$lib/enums';
import { z } from 'zod';

const participant = z.string({ invalid_type_error: 'Participant required' }).pipe(z.coerce.number().int().nonnegative());

export const formSchema = z.object({
	title: z.string().min(1).max(50),
	type: z.enum(types).default('expense'),
	amount: z.coerce.number().positive(),
	currency: z.enum(currencies).default('EUR'), // TODO: set default tally currency
	date: z.date().default(new Date),
	category: z.enum(categories).nullable(),
	// TODO: validate against participants in the tally
	primaryParticipant: participant,
	distribution: z.array(z.object({
		participant: participant,
		amount: z.coerce.number().nonnegative(),
	})).nonempty(),
});

export type FormSchema = typeof formSchema;