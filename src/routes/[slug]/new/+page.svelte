<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Popover from '$lib/components/ui/popover';
	import { formSchema } from './schema';
	import type { PageData } from './$types';
	import { currencies, types, categories } from '$lib/enums';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import { CalendarIcon } from 'lucide-svelte';
	import { Calendar } from '$lib/components/ui/calendar';
	import { DateFormatter, getLocalTimeZone, parseDateTime, today } from '@internationalized/date';
	import { superForm } from 'sveltekit-superforms/client';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let data: PageData;
	const form = superForm(data.form, { validators: formSchema, taintedMessage: null, dataType: 'json' });
	const { form: formStore, errors } = form;
	$formStore.date = new Date;
	$formStore.amount = '0.00';
	$formStore.addedBy = data.participants[0].id; // TODO: read from store
	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	$: console.log({ values: $formStore, errors: $errors });

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
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<!-- Amount -->
			<Form.Field {config} name="amount">
				<Form.Item>
					<Form.Label>Amount</Form.Label>
					<div class="flex gap-1">
						<Form.Input type="number" step="any" min={0} on:blur={() => $formStore.amount = parseFloat($formStore.amount).toFixed(2)} />
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
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<!-- Conversion rate -->
			{#if $formStore.currency !== data?.form?.data?.currency}
				<Form.Field {config} name="conversionRate">
					<Form.Item>
						<div class="flex gap-8">
							<span class="whitespace-nowrap text-sm text-muted-foreground">= {($formStore.amount * $formStore.conversionRate).toFixed(2)} {data?.form?.data?.currency}</span>
							<div class="flex items-center gap-1">
								<span class="whitespace-nowrap">1 {$formStore.currency} =</span>
								<Form.Input type="number" step="any" min={0} placeholder="1.00" />
								{data?.form?.data?.currency}
							</div>
						</div>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{/if}
			<!-- Date -->
			<Form.Field {config} name="date">
				<Form.Item>
					<Form.Label for="date">Date</Form.Label>
					<Popover.Root>
						<div class="flex gap-2">
							<Form.Control id="date" let:attrs>
								<Popover.Trigger id="date" {...attrs} class={cn(buttonVariants({ variant: 'outline' }), 'grow justify-start text-left font-normal', !$formStore.date && 'text-muted-foreground')} >
									{df.format($formStore.date)}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
							</Form.Control>
							<div class="grow">
								<Input type="time" on:input={e => $formStore.date = new Date(`${$formStore.date.toISOString().slice(0, 11)}${e.target.value}`)} value={$formStore.date.toISOString().slice(11, 16)} />
							</div>
						</div>
						<Popover.Content class="w-auto p-0" side="top">
							<Calendar maxValue={today(getLocalTimeZone())} value={parseDateTime($formStore.date.toISOString().slice(0, -1))}
								onValueChange={v => { if (v) $formStore.date = v.toDate(getLocalTimeZone()); }}
							/>
						</Popover.Content>
					</Popover.Root>
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
							{#each data.participants as { id, name }}
								<Form.SelectItem value={id}>{name}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<!-- Distribution -->
			<Label>{$formStore.type === 'transfer' ? 'To' : 'For'}</Label>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-8">
							{@const checked = data.participants.filter(({ id }) => $formStore.distribution[id]?.parts || $formStore.distribution[id]?.amount)}
							<Checkbox
								checked="{checked.length === data.participants.length ? true : checked.length === 0 ? false : 'indeterminate'}"
								on:click={() => {
									if (checked.length === data.participants.length) {
										$formStore.distribution = {};
									} else {
										data.participants.forEach(({ id }) => { if (!$formStore.distribution[id]?.amount) $formStore.distribution[id] = { parts: 1 }; });
									}
								}}
							/></Table.Head>
						<Table.Head>Participant</Table.Head>
						<Table.Head class="w-20 text-right">Parts</Table.Head>
						<Table.Head class="w-24 text-right">Amount</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body class="w-full">
					{#each data.participants as { id, name }}
						{@const entry = $formStore.distribution[id]}
						<Table.Row>
							<Table.Cell>
								<Checkbox
									checked={!!entry}
									on:click={() => {
										if (entry) {
											delete $formStore.distribution[id];
											$formStore.distribution = $formStore.distribution;
										} else {
											$formStore.distribution[id] = { parts: 1 };
										}
									}}
								/>
							</Table.Cell>
							<Table.Cell class="{entry ? '' : 'text-muted-foreground'}">{name}</Table.Cell>
							<Table.Cell><Input class="{entry?.parts ? '' : 'text-muted-foreground'} text-right" type="number" step="any" min={0}
								value={entry?.parts ? entry?.parts : entry?.amount ? '' : 0}
								on:input={e => {
									$formStore.distribution[id] = { parts: e.target.value };
									if (e.target.value == 0) delete $formStore.distribution[id];
								} }
							/></Table.Cell>
							{@const sumParts = Math.max(1, Object.values($formStore.distribution).map(d => d.parts ? Number(d.parts) : 0).reduce((a, b) => a + b, 0))}
							{@const sumAmount = Object.values($formStore.distribution).map(d => parseFloat(d.amount ?? 0)).reduce((a, b) => a + b, 0)}
							<Table.Cell><Input class="{entry?.amount ? '' : 'text-muted-foreground'} text-right" type="number" step="any" min={0} max={$formStore.amount - (sumAmount - (entry?.amount ? entry?.amount : 0))}
								value={entry?.amount ? entry?.amount : (($formStore.amount - sumAmount) * (entry?.parts ? entry?.parts : 0) / sumParts).toFixed(2)}
								on:input={e => {
									$formStore.distribution[id] = { amount: e.target.value };
									if (e.target.value == 0) delete $formStore.distribution[id];
								}}
								on:blur={() => { if ($formStore.distribution[id]?.amount) $formStore.distribution[id] = { amount: parseFloat(entry?.amount).toFixed(2) }; }}
							/></Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			{#if $errors?._errors?.[0]}
				<span class="text-[0.8rem] font-medium text-destructive">{$errors._errors[0]}</span><br>
			{/if}
			<Form.Button class="mt-5">Add</Form.Button>
		</Form.Root>
	</Card.Content>
</Card.Root>