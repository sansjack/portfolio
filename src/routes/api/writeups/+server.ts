import { json } from "@sveltejs/kit"
import { getModels } from "$lib/server/mongo"

export async function GET() {
	try {
		const { writeupModel } = await getModels()
		const writeups = await writeupModel
			.find({}, { _id: false })
			.sort({ date: -1 })
			.lean()

		return json({ writeups })
	} catch (error) {
		console.error("Failed to load writeups:", error)
		return json({ writeups: [] }, { status: 500 })
	}
}
