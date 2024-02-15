import { PrismaClient } from '@prisma/client';
import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

const prisma = new PrismaClient;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(formSchema),
	};
};

export const actions: Actions = {
	default: async event => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		await prisma.tally.create({
			data: {
				name: form.data.name,
				description: form.data.description,
				currency: form.data.currency,
				participants: {
					create: form.data.participants.map(name => ({ name })),
				},
			},
		}).catch(e => {
			console.error(e);
			return error(500, { message: 'Failed to create tally' });
		});

		return {
			form,
		};
	},
};