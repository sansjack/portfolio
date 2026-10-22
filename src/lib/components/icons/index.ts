import type { Component } from 'svelte';
import PythonIcon from './PythonIcon.svelte';
import TypeScriptIcon from './TypeScriptIcon.svelte';
import JavaScriptIcon from './JavaScriptIcon.svelte';
import GoIcon from './GoIcon.svelte';
import RustIcon from './RustIcon.svelte';
import SvelteIcon from './SvelteIcon.svelte';
import ReactIcon from './ReactIcon.svelte';
import TailwindIcon from './TailwindIcon.svelte';
import FastApiIcon from './FastApiIcon.svelte';
import DockerIcon from './DockerIcon.svelte';
import LinuxIcon from './LinuxIcon.svelte';
import PostgresIcon from './PostgresIcon.svelte';
import GrpcIcon from './GrpcIcon.svelte';
import GitIcon from './GitIcon.svelte';
import HonoIcon from './HonoIcon.svelte';
import BetterAuthIcon from './BetterAuthIcon.svelte';
import CloudflareIcon from './CloudflareIcon.svelte';
import GoogleCloudIcon from './GoogleCloudIcon.svelte';
import AwsIcon from './AwsIcon.svelte';

export {
	PythonIcon,
	TypeScriptIcon,
	JavaScriptIcon,
	GoIcon,
	RustIcon,
	SvelteIcon,
	ReactIcon,
	TailwindIcon,
	FastApiIcon,
	DockerIcon,
	LinuxIcon,
	PostgresIcon,
	GrpcIcon,
	GitIcon,
	HonoIcon,
	BetterAuthIcon,
	CloudflareIcon,
	GoogleCloudIcon,
	AwsIcon
};

// Skill name (as written in profile.json) -> its icon
export const skillIcons: Record<string, Component<{ class?: string }>> = {
	Python: PythonIcon,
	TypeScript: TypeScriptIcon,
	JavaScript: JavaScriptIcon,
	Go: GoIcon,
	Rust: RustIcon,
	SvelteKit: SvelteIcon,
	React: ReactIcon,
	Tailwind: TailwindIcon,
	FastAPI: FastApiIcon,
	Docker: DockerIcon,
	Linux: LinuxIcon,
	Postgres: PostgresIcon,
	gRPC: GrpcIcon,
	Git: GitIcon,
	Hono: HonoIcon,
	'Better Auth': BetterAuthIcon,
	Cloudflare: CloudflareIcon,
	GCP: GoogleCloudIcon,
	AWS: AwsIcon
};
