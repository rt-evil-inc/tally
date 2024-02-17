import { categories, currencies, types } from '$lib/enums';
import { z } from 'zod';

const participant = z.coerce.string().min(1, 'Participant is required'); // TODO: validate against participants in the tally

export const formSchema = z.object({
	title: z.string().min(1).max(50),
	type: z.enum(types).default('expense'),
	amount: z.coerce.number().positive(),
	currency: z.enum(currencies),
	conversionRate: z.coerce.number().positive().default(1),
	date: z.date().refine(d => d <= new Date, {
		message: 'Date cannot be in the future',
	}),
	category: z.enum(categories).nullable(),
	primaryParticipant: participant,
	distribution: z.record(participant, z.object({
		amount: z.coerce.number().positive(),
	}).or(z.object({
		parts: z.number().nonnegative(),
	}))),
	addedBy: participant,
}).refine(schema => {
	const sumAmount = Object.values(schema.distribution).map(d => parseFloat(d.amount ?? 0)).reduce((a, b) => a + b, 0);
	return sumAmount <= schema.amount;
}, {
	message: 'The sum of the amounts cannot exceed the total amount',
}).refine(schema => {
	const sumAmount = Object.values(schema.distribution).map(d => parseFloat(d.amount ?? 0)).reduce((a, b) => a + b, 0);
	const sumParts = Object.values(schema.distribution).map(d => parseFloat(d.parts ?? 0)).reduce((a, b) => a + b, 0);
	return sumAmount == schema.amount || sumParts >= 1;
}, {
	message: 'The amount is not fully distributed among the participants',
}).refine(schema => {
	return Object.values(schema.distribution).every(d => (d.amount ?? 0) >= 0);
}, {
	message: 'Amounts cannot be negative',
});

export type FormSchema = typeof formSchema;