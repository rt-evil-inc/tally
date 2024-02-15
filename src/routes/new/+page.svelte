<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { currencies } from '$lib/enums';
	import { formSchema } from './schema';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const form = superForm(data.form, {
		validators: formSchema,
		taintedMessage: null,
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success('Tally created successfully');
				goto(`/`);
			}
		},
		onError: ({ result }) => {
			toast.error(result.error.message);
		},
	});
	const { form: formStore, errors } = form;
	$: console.log({ values: $formStore, errors: $errors });
</script>

<Card.Root class="w-[400px]">
	<Card.Header>
		<Card.Title>New Tally</Card.Title>
		<Card.Description>Create a new Tally</Card.Description>
	</Card.Header>
	<Card.Content>
		<Form.Root method="POST" controlled {form} schema={formSchema} let:config>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label>Name</Form.Label>
					<Form.Input />
					<Form.Description>The name of your Tally.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="description">
				<Form.Item class="mt-4">
					<Form.Label>Description</Form.Label>
					<Form.Textarea />
					<Form.Description>The description of your Tally.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="currency" let:attrs>
				{@const { value } = attrs.input}
				<Form.Item class="mt-4">
					<Form.Label>Currency</Form.Label>
					<Form.Select>
						<Form.SelectTrigger class="{value ? '' : 'text-muted-foreground'}" placeholder="Select a currency" />
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
			<div class="flex flex-col gap-1 mt-4">
				{#each $formStore.participants.length > 0 ? $formStore.participants : ['', ''] as _, i}
					<Form.Field {config} name={`participants[${i}]`}>
						<Form.Item>
							{#if i === 0}
								<Form.Label>Participants ({$formStore.participants.length})</Form.Label>
							{/if}
							<div class="grow relative">
								<Form.Input placeholder="{i === 0 ? 'Your name' : 'Other participant name'}" />
								<Form.Validation />
								{#if i > 0}
									<Button class="absolute right-1 top-1 h-7 w-7 p-0 border-0 font-[\'Segoe_UI_Symbol\'] text-muted-foreground" variant="outline" on:click={() => $formStore.participants = $formStore.participants.filter((_, index) => index !== i)}>✖</Button>
								{/if}
							</div>
						</Form.Item>
					</Form.Field>
				{/each}
				{#if $errors?.participants?._errors?.[0]}
					<span class="text-[0.8rem] font-medium text-destructive">{$errors.participants._errors[0]}</span>
				{/if}
				<Button class="mr-auto" variant="outline" on:click={() => $formStore.participants = [...$formStore.participants, ''] }>Add</Button>
			</div>
			<Form.Button class="mt-5">Create</Form.Button>
		</Form.Root>
	</Card.Content>
</Card.Root>