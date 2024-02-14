import { categories, currencies, types } from '$lib/enums';
import { z } from 'zod';

const participant = z.string().min(1, 'Participant is required');

export const formSchema = z.object({
	title: z.string().min(1).max(50),
	type: z.enum(types).default('expense'),
	amount: z.coerce.number().positive(),
	currency: z.enum(currencies).default('EUR'), // TODO: set default tally currency
	date: z.date(),
	category: z.enum(categories).nullable(),
	// TODO: validate against participants in the tally
	primaryParticipant: participant,
	distribution: z.record(participant, z.object({
		amount: z.coerce.number().nonnegative(),
	}).or(z.object({
		parts: z.coerce.number().nonnegative(),
	}))),
	addedBy: participant, // TODO: set default to current user
});

export type FormSchema = typeof formSchema;