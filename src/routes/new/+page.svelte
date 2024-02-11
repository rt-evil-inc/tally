<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { currencies, formSchema } from './schema';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	export let data: PageData;
	let participants = [Math.random()];
</script>

<Card.Root class="w-[400px]">
	<Card.Header>
		<Card.Title>New Tally</Card.Title>
		<Card.Description>Create a new Tally</Card.Description>
	</Card.Header>
	<Card.Content>
		<Form.Root method="POST" form={data.form} schema={formSchema} let:config>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label>Name</Form.Label>
					<Form.Input />
					<Form.Description>The name of your Tally.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="description">
				<Form.Item>
					<Form.Label>Description</Form.Label>
					<Form.Input />
					<Form.Description>The description of your Tally.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="currency" let:attrs>
				{@const { value } = attrs.input}
				<Form.Item>
					<Form.Label>Currency</Form.Label>
					<Form.Select>
						<Form.SelectTrigger class="w-[180px] {!value && 'text-muted-foreground'}" placeholder="Select a currency" />
						<Form.SelectContent>
							{#each currencies as currency}
								<Form.SelectItem value={currency}>{currency}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Description>Default currency for your Tally.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<div class="mb-5">
				{#each participants as rnd, i (rnd)}
					<Form.Field {config} name={`participants[${i}]`}>
						<Form.Item class="flex items-center gap-1 mt-2">
							<Form.Input />
							<Form.Validation />
							<Button class="!mt-0 font-[\'Segoe_UI_Symbol\']" variant="outline" on:click={() => { participants = participants.filter((partNum, _) => partNum !== rnd); }}>✖&#xFE0E;</Button>
						</Form.Item>
					</Form.Field>
				{/each}
				<Button class="mt-2" variant="outline" on:click={() => { participants = [...participants, Math.random()]; }}>Add</Button>
			</div>
			<Form.Button>Create</Form.Button>
		</Form.Root>
	</Card.Content>
</Card.Root>