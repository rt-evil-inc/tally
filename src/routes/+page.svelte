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
	<Card.Content>
		{#each data.tallies as tally}
			<Button href={`/${tally.id}`} variant="outline" class="w-full mb-2 flex-col items-start h-fit">
				{tally.name}
				<span class="text-muted-foreground font-normal">{tally.description}</span>
			</Button>
		{/each}
	</Card.Content>
</Card.Root>