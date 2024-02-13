<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { formSchema } from './schema';
	import type { PageData } from './$types';
	import { currencies, types, categories } from '$lib/enums';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import { CalendarIcon } from 'lucide-svelte';
	import { Calendar } from '$lib/components/ui/calendar';
	import { DateFormatter, getLocalTimeZone, parseDateTime, today } from '@internationalized/date';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageData;
	const form = superForm(data.form, { validators: formSchema, taintedMessage: null });
	const { form: formStore, errors } = form;
	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	const participants = {
		0: 'Person 1',
		1: 'Person 2',
		2: 'Person 3',
		3: 'Person 4',
		4: 'Person 5',
	};

	$: console.log($errors);

	$: if ($formStore.type === 'transfer' && !$formStore.title) {
		$formStore.title = 'Transfer';
	} else if ($formStore.title === 'Transfer') {
		$formStore.title = '';
	}

	function capitalize(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
</script>

<Card.Root class="w-[400px]">
	<Card.Header>
		<Card.Title>New {capitalize($formStore.type)}</Card.Title>
		<Card.Description>Add a new {$formStore.type}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Form.Root method="POST" controlled {form} schema={formSchema} let:config>
			<div class="flex gap-2">
				<!-- Type -->
				<Form.Field {config} name="type">
					<Form.Item class="w-1/2">
						<Form.Label>Type</Form.Label>
						<Form.Select>
							<Form.SelectTrigger placeholder={capitalize($formStore.type)} />
							<Form.SelectContent>
								{#each types as type}
									<Form.SelectItem value={type}>{capitalize(type)}</Form.SelectItem>
								{/each}
							</Form.SelectContent>
						</Form.Select>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<!-- Category -->
				<Form.Field {config} name="category">
					<Form.Item class="w-1/2">
						<Form.Label>Category</Form.Label>
						<Form.Select>
							<Form.SelectTrigger placeholder="No category" class="{$formStore.category ? '' : 'text-muted-foreground'}" />
							<Form.SelectContent>
								<Form.SelectItem value={null} class="text-muted-foreground">No category</Form.SelectItem>
								{#each categories as category}
									<Form.SelectItem value={category}>{capitalize(category)}</Form.SelectItem>
								{/each}
							</Form.SelectContent>
						</Form.Select>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</div>
			<!-- Title -->
			<Form.Field {config} name="title">
				<Form.Item>
					<Form.Label>Title</Form.Label>
					<Form.Input />
					<Form.Description>The title of your {$formStore.type}.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<!-- Amount -->
			<Form.Field {config} name="amount">
				<Form.Item>
					<Form.Label>Amount</Form.Label>
					<div class="flex gap-1">
						<Form.Input type="number" step="any" min={0} />
						<!-- Currency -->
						<Form.Field {config} name="currency">
							<Form.Item>
								<Form.Select>
									<Form.SelectTrigger placeholder={$formStore.currency} />
									<Form.SelectContent>
										{#each currencies as currency}
											<Form.SelectItem value={currency}>{currency}</Form.SelectItem>
										{/each}
									</Form.SelectContent>
								</Form.Select>
							</Form.Item>
						</Form.Field>
					</div>
					<Form.Description>The amount of your {$formStore.type}.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<!-- Date -->
			<Form.Field {config} name="date">
				<Form.Item class="flex flex-col">
					<Form.Label for="date">Date</Form.Label>
					<Popover.Root>
						<Form.Control id="date" let:attrs>
							<Popover.Trigger id="date" {...attrs} class={cn(buttonVariants({ variant: 'outline' }), 'justify-start text-left font-normal', !$formStore.date && 'text-muted-foreground')} >
								{df.format($formStore.date)}
								<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
							</Popover.Trigger>
						</Form.Control>
						<Popover.Content class="w-auto p-0" side="top">
							<Calendar maxValue={today(getLocalTimeZone())} value={parseDateTime($formStore.date.toISOString().slice(0, -1))}
								onValueChange={v => { if (v) $formStore.date = v.toDate(getLocalTimeZone()); }}
							/>
						</Popover.Content>
					</Popover.Root>
					<Form.Description>Date of your {$formStore.type}.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<!-- Primary participant -->
			<Form.Field {config} name="primaryParticipant">
				<Form.Item>
					<Form.Label>{$formStore.type === 'expense' ? 'Paid by' : $formStore.type === 'income' ? 'Received by' : 'From'}</Form.Label>
					<Form.Select>
						<Form.SelectTrigger placeholder="Select a participant" class="{$formStore.primaryParticipant ? '' : 'text-muted-foreground'}" />
						<Form.SelectContent>
							{#each Object.entries(participants) as [id, participant]}
								<Form.SelectItem value={id}>{participant}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Button class="mt-5">Add</Form.Button>
		</Form.Root>
	</Card.Content>
</Card.Root>