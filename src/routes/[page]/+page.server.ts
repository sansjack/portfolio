import { getModels } from "$lib/server/mongo"
import { redirect } from "@sveltejs/kit"

export const load = async ({ params }) => {
	const { page } = params

	const parsedPage = page.replace(" ", "-").toLowerCase()

	const { writeupModel } = await getModels()

	const writeup = (await writeupModel
		.findOne({ title: parsedPage }, { _id: false })
		.lean()) as Writeup

	if (!writeup) {
		throw redirect(307, "/")
	}

	return {
		writeup: writeup,
		page,
	}
}
