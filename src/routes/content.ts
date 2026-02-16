import { MonitroIcon, PortfoloIcon, DailyDebriefIcon } from "$lib/icons"
import { LayoutTemplate } from "lucide-svelte"
import {
	DunelmIcon,
	ArkivumIcon,
	CanopactIcon,
	CnickIcon,
	NovusIcon,
	NexyIcon,
	PersonaLogo,
} from "$lib/icons/jobs"
import dayjs from "dayjs"

export const projects = [
	{
		title: "boilermate",
		Icon: LayoutTemplate,
		description:
			"Share your code boilerplates to help everyone learn and deploy faster!",
    link: "https://boilermate.vercel.app",
		archived: true,
		date: 1714147200,
		
	},
	{
		title: "monitro.dev",
		Icon: MonitroIcon,
		description: "Simple & Cheap Log Monitoring",
    link: "https://monitro.vercel.app",
		archived: true,
		date: 1722413951,
	},
	{
		title: "portfolo.app",
		Icon: PortfoloIcon,
		description: "Create A Portfolio And Add Projects Using Markdown",
    link: "https://portfolo.app",
		archived: false,
		date: 1718121600,
	},
	{
		title: "dailydebrief.io",
		Icon: DailyDebriefIcon,
		description: "Daily Email digest for all your integrations",
    link: "dailydebreif.vercel.app",
		archived: true,
		date: 1742774482,
	},
]

export const jobExperiences = [
	{
		company: "Dunelm",
		companyIcon: DunelmIcon,
		href: "https://www.dunelm.com",
		position: "Site Reliability Engineer",
		startDate: 1648731600,
		endDate: 1704027600,
	},
	{
		company: "Arkivum",
		companyIcon: ArkivumIcon,
		href: "https://www.arkivum.com",
		position: "Junior Site Reliability Engineer",
		startDate: 1609419600,
		endDate: 1646053200,
	},
	{
		company: "Canopact",
		companyIcon: CanopactIcon,
		href: "https://www.canopact.com",
		position: "Python Software Engineer",
		startDate: 1704027600,
		endDate: 1709211600,
		img: true,
	},
	{
		company: "Cnick",
		companyIcon: CnickIcon,
		href: "https://www.cnick.io",
		position: "VueJs Mobile Developer",
		startDate: 1722434400,
		endDate: 1725112800,
		img: true,
	},
	{
		company: "Novus Studio",
		companyIcon: NovusIcon,
		href: "https://www.novus.studio",
		position: "Svelte Fullstack Developer",

		startDate: 1725112800,
		endDate: 1740784985,
		img: true,
	},
	{
		company: "Nexy Media",
		companyIcon: NexyIcon,
		href: "https://www.nexy.media",
		position: "Python / Svelte Fullstack Developer",
		startDate: 1740957785,
		endDate: 1746087241,
		img: true,
	},
	{
		company: "Persona AI",
		companyIcon: PersonaLogo,
		href: "https://getpersona.xyz",
		position: "Backend Engineer",
		startDate: 1746087241,
		endDate: dayjs().unix(),
		img: true,
	},
]
