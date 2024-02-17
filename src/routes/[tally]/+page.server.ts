import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient;

export const load: PageServerLoad = async ({ params }) => {
	const tally = await prisma.tally.findUnique({	where: { id: params.tally as string	} });

	if (!tally) {
		return { status: 404, error: new Error('Tally not found') };
	}

	return {
		tally: await prisma.tally.findUnique({
			where: { id: params.tally as string },
			include: {
				expenses: {
					include: { primaryParticipant: true },
				},
			},
		}),
	};
};