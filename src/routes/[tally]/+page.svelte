<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<Card.Root class="w-[400px] relative">
	<Card.Header>
		<Card.Title>Expenses</Card.Title>
		<Card.Description>Expenses in this tally</Card.Description>
		<Button href="/{data.tally.id}/new" variant="outline" class="absolute !mt-0 top-6 right-6">New</Button>
	</Card.Header>
	<Card.Content class="max-h-[500px] overflow-auto">
		{#if data.tally.expenses.length === 0}
			<p class="text-sm text-center p-2">There are no expenses yet</p>
		{/if}
		{#each data.tally.expenses as expense, i}
			<a href="/{data.tally.id}/{expense.id}" class="flex justify-between hover:bg-muted/50 p-2 rounded {i > 0 && 'border-t'}">
				<div class="flex flex-col text-sm">
					<span>{expense.title}</span>
					<span class="text-muted-foreground">
						{expense.type === 'expense' ? 'Paid by' : expense.type === 'income' ? 'Received by' : 'From'}
						<b>{expense.primaryParticipant.name}</b>
					</span>
				</div>
				<div class="flex flex-col text-sm items-end">
					<span>{expense.amount.toFixed(2)} {expense.currency}</span>
					<span class="text-muted-foreground">{expense.createdAt.toLocaleDateString()}</span>
				</div>
			</a>
		{/each}
	</Card.Content>
</Card.Root>