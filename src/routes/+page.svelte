<script lang="ts">
	import dayjs from 'dayjs'
	import {
		SvelteIcon,
		PostgresIcon,
		TypescriptIcon,
		CloudflareIcon,
		MongoIcon,
		PythonIcon,
		AWSIcon,
	} from '$lib/icons'

	import { jobExperiences, projects } from './content'

	import relativeTime from 'dayjs/plugin/relativeTime'

	dayjs.extend(relativeTime)

	const { data } = $props()

	const { writeups } = data
</script>

<title>Jack Sansom's Portfolio</title>
<div
	class="flex flex-col w-full overflow-y-scroll overflow-x-hidden sm:flex items-center justify-center">
	<div class="mt-[3rem] lg:mt-[5rem]">
		<div
			class="py-4 px-4 max-w-5xl flex flex-col items-center space-y-0 leading-tight gap-2">
			<div class="flex flex-col items-center justify-center">
				<div class="flex flex-row items-center gap-4">
					<h1 class="text-4xl text-start">Jack Sansom</h1>

					<div class="avatar mb-2">
						<div class="w-16 rounded-full">
							<img
								src="/images/me.webp"
								alt="picture of jack sansom"
								class="scale-150" />
						</div>
					</div>
				</div>
				<h2 class="text-md opacity-80 text-center">
					full stack software engineer
				</h2>
				<span class="text-sm md:text-md opacity-80 text-center mt-2">
					📍 London, United Kingdom
				</span>
			</div>
		</div>
	</div>
	<div
		id="tech-list"
		class="tech-list flex flex-row items-center gap-2 md:gap-3 mb-4 px-4 mx-2">
		<div><SvelteIcon class="size-10" /></div>
		<div><PythonIcon class="size-10" /></div>
		<div><TypescriptIcon class="size-10 rounded-sm" /></div>
		<div><PostgresIcon class="size-10" /></div>
		<div><MongoIcon class="size-10" /></div>
		<div><CloudflareIcon class="size-10" /></div>
		<div><AWSIcon class="size-10" /></div>
	</div>
	<div
		class="flex flex-col m-3 sm:m-4 md:m-1 w-full px-2 md:w-3/4 lg:max-w-[1110px] gap-4">
		<div class="w-full my-4">
			<h3>Work Experience 💼</h3>
			<div class="divider !my-1" />
			<ul
				class="w-full space-y-4 gap-8 sm:space-y-0 my-2 max-h-[10rem] md:max-h-[10rem] overflow-y-auto overflow-x-hidden px-2">
				{#each jobExperiences.sort((a, b) => b.startDate - a.startDate) as job}
					<li
						class="flex flex-row items-center justify-between hover:bg-text -mx-1 px-1 gap-1">
						<div class="flex flex-row items-center gap-2 my-1 group text-sm">
							<a
								href={job.href}
								target="_blank"
								class="tooltip tooltip-right tool hover:cursor-pointer hover:scale-125 ease-in-out duration-200"
								data-tip={job.company}>
								{#if job.img && typeof job.companyIcon === 'string'}
									<img
										src={job.companyIcon}
										class="size-10 md:size-12 mr-1 rounded-md"
										alt={job.company} />
								{:else if typeof job.companyIcon !== 'string'}
									<job.companyIcon class="size-12 mr-1" />
								{/if}
							</a>

							{job.position}
						</div>

						<span
							class={[
								'hidden md:flex badge badge-neutral text-nowrap',
								{
									'badge-primary': dayjs().isSame(
										dayjs.unix(job.endDate),
										'day'
									),
								},
							]}>
							{dayjs.unix(job.startDate).format('MMM YYYY')} -
							{#if dayjs().isSame(dayjs.unix(job.endDate), 'day')}
								Current
							{:else}
								{dayjs.unix(job.endDate).format('MMM YYYY')}
							{/if}
						</span>

						<span
							class={[
								'flex md:hidden badge badge-neutral text-nowrap',
								{
									'badge-primary': dayjs().isSame(
										dayjs.unix(job.endDate),
										'day'
									),
								},
							]}>
							{#if dayjs().isSame(dayjs.unix(job.endDate), 'day')}
								Current
							{:else}
								{dayjs.unix(job.startDate).format('YYYY MMM')}
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="w-full flex items-center justify-center">
		<div
			class="flex flex-col m-3 sm:m-4 md:m-1 w-[90%] md:w-3/4 lg:max-w-[1110px] gap-4">
			<div class="flex flex-col items-center justify-center">
				<h3 class="justify-start self-start text-center">Writeups ✏️</h3>
				<div class="divider !my-1" />
				<!-- need to make it scrollable without breaking tootips :) -->
				<ul
					class="relative w-full space-y-2 items-center justify-center sm:space-y-0">
					{#each writeups as writeup}
						<li
							class="flex flex-row justify-between gap-0 hover:bg-text text-sm md:text-base">
							<div class="items-start text-start md:w-[90%]">
								<a
									href={writeup.link}
									data-sveltekit-preload-data
									data-sveltekit-preload-code
									class="tooltip tooltip-top link link-primary font-bold"
									data-tip={writeup.description}
									>{writeup.title}
								</a>
							</div>
							<p class="text-xs min-w-24">
								{dayjs.unix(writeup.date).fromNow()}
							</p>
						</li>
					{/each}
				</ul>
			</div>
			<div class="w-full my-4">
				<h3>Projects / SaaS 🏗️</h3>
				<div class="divider !my-1" />
				<ul class="relative w-full space-y-4 gap-8 sm:space-y-0 my-2">
					{#each projects.sort((a, b) => b.date - a.date) as project}
						<li
							class="flex flex-row justify-between hover:bg-text -mx-2 px-2 space-x-5">
							<div
								class="flex flex-row gap-2 my-1 group tooltip"
								data-tip={project.description}>
								<project.Icon
									class="relative size-7 grayscale group-hover:grayscale-0 " />

								<a
									target="_blank"
									href={project.link}
									class="link hover:link-primary font-bold">
									{project.title}</a>
							</div>
							<p class="text-xs">
								{#if typeof project.date === 'number'}
									{dayjs.unix(project.date).fromNow()}
								{:else}
									<span class="badge badge-accent"> {project.date}</span>
								{/if}
							</p>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.tech-list > * {
		opacity: 0;
		transform: translateY(20px);
		animation: fadeInUp 0.6s ease-in-out forwards;
		animation-delay: calc(var(--i) * 0.3s);
		--i: 0;
	}

	.tech-list > *:nth-child(1) {
		--i: 1;
	}
	.tech-list > *:nth-child(2) {
		--i: 2;
	}
	.tech-list > *:nth-child(3) {
		--i: 3;
	}
	.tech-list > *:nth-child(4) {
		--i: 4;
	}
	.tech-list > *:nth-child(5) {
		--i: 5;
	}
	.tech-list > *:nth-child(6) {
		--i: 6;
	}
	.tech-list > *:nth-child(7) {
		--i: 7;
	}
	.tech-list > *:nth-child(8) {
		--i: 8;
	}
	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
