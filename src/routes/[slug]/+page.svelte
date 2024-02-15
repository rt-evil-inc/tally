<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';

	export let data;
</script>

<Card.Root class="w-[400px] relative">
	<Card.Header>
		<Card.Title>Expenses</Card.Title>
		<Card.Description>Expenses in this tally</Card.Description>
		<Button href="/{data.tallyId}/new" variant="outline" class="absolute !mt-0 top-6 right-6">New</Button>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head class="text-right">Amount</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head class="text-right">Date</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.expenses as expense}
					<Table.Row>
						<Table.Cell>{expense.title}</Table.Cell>
						<Table.Cell class="text-right">{expense.amount.toFixed(2)} {expense.currency}</Table.Cell>
						<Table.Cell>{expense.category}</Table.Cell>
						<Table.Cell class="text-right">{expense.createdAt.toLocaleDateString()}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>