import { PrismaClient } from '@prisma/client';
import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

const prisma = new PrismaClient;

export const load: PageServerLoad = async ({ params }) => {
	const tally = await prisma.tally.findUnique({ where: { id: params.tally } });

	if (!tally) {
		return { status: 404, error: new Error('Tally not found') };
	}

	const form = await superValidate(formSchema);
	form.data['currency'] = tally.currency;

	const expense = await prisma.expense.findUnique({
		where: { id: parseInt(params.expense) || -1 },
		include: { primaryParticipant: true, shares: true },
	});

	if (expense) {
		form.data['title'] = expense.title;
		form.data['type'] = expense.type;
		form.data['amount'] = expense.amount;
		form.data['currency'] = expense.currency;
		form.data['conversionRate'] = expense.conversionRate;
		form.data['date'] = expense.createdAt;
		form.data['category'] = expense.category;
		form.data['primaryParticipant'] = expense.primaryParticipant.id;
		form.data['distribution'] = expense.shares.reduce((acc, share) => {
			acc[share.participantId] = {
				amount: share.amount,
				parts: share.parts,
			};
			return acc;
		}, {});
		form.data['addedBy'] = expense.addedById;
	}

	return {
		form,
		expense,
		tally: await prisma.tally.findUnique({ where: { id: params.tally }, include: { participants: true } }),
	};
};

export const actions: Actions = {
	default: async event => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const tally = await prisma.tally.findUnique({ where: { id: event.params.tally } });
		if (!tally) {
			return fail(404, { form, message: 'Tally not found' });
		}

		const data = {
			tally: { connect: { id: event.params.tally } },
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
		};

		await prisma.expense.upsert({
			create: data,
			update: data,
			where: { id: parseInt(event.params.expense) || -1 },
		}).catch(e => {
			console.error(e);
			return error(500, { message: 'Failed to create expense' });
		});

		return {
			form,
		};
	},
};