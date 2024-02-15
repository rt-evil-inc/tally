import { PrismaClient } from '@prisma/client';
import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

const prisma = new PrismaClient;

export const load: PageServerLoad = async ({ params }) => {
	const tally = await prisma.tally.findUnique({ where: { id: params.slug } });

	if (!tally) {
		return { status: 404, error: new Error('Tally not found') };
	}

	const form = await superValidate(formSchema);
	form.data['currency'] = tally.currency;

	return {
		form,
		participants: await prisma.participant.findMany({ where: { tallyId: tally.id } }),
		tallyId: params.slug,
	};
};

export const actions: Actions = {
	default: async event => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const tally = await prisma.tally.findUnique({ where: { id: event.params.slug } });
		if (!tally) {
			return fail(404, { form, message: 'Tally not found' });
		}

		await prisma.expense.create({
			data: {
				tally: { connect: { id: event.params.slug } },
				title: form.data.title,
				type: form.data.type,
				amount: form.data.amount,
				currency: form.data.currency,
				conversionRate: tally.currency === form.data.currency ? 1 : form.data.conversionRate,
				createdAt: form.data.date,
				updatedAt: form.data.date,
				category: form.data.category,
				primaryParticipant: { connect: { id: parseInt(form.data.primaryParticipant) } },
				shares: {
					create: Object.entries(form.data.distribution).map(([participant, data]) => ({
						participant: { connect: { id: parseInt(participant) } },
						amount: data.amount,
						parts: data.parts,
					})),
				},
				addedBy: { connect: { id: parseInt(form.data.addedBy) } },
			},
		}).catch(e => {
			console.error(e);
			return error(500, { message: 'Failed to create expense' });
		});

		return {
			form,
		};
	},
};