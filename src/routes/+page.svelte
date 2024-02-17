<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<Card.Root class="w-[400px] relative">
	<Card.Header>
		<Card.Title>Tallies</Card.Title>
		<Card.Description>Choose one of the tallies</Card.Description>
		<Button href="/new" variant="outline" class="absolute !mt-0 top-6 right-6">New</Button>
	</Card.Header>
	<Card.Content class="max-h-[500px] overflow-auto">
		{#if data.tallies.length === 0}
			<p class="text-sm text-center p-2">You don't have any tallies yet</p>
		{/if}
		{#each data.tallies as tally, i}
			<a href="/{tally.id}" class="flex flex-col text-sm hover:bg-muted/50 p-2 rounded {i > 0 && 'border-t'}">
				<span>{tally.name}</span>
				<span class="text-muted-foreground">{tally.description}</span>
			</a>
		{/each}
	</Card.Content>
</Card.Root>