import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient;

export const load: PageServerLoad = async () => {
	return {
		tallies: await prisma.tally.findMany(),
	};
};