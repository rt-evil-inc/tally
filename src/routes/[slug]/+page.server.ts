import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient;

export const load: PageServerLoad = async ({ params }) => {
	const tally = await prisma.tally.findUnique({	where: { id: params.slug as string	} });

	if (!tally) {
		return { status: 404, error: new Error('Tally not found') };
	}

	return {
		expenses: await prisma.expense.findMany({
			where: { tallyId: params.slug as string },
			include: { primaryParticipant: true },
		}),
		tallyId: params.slug as string,
	};
};