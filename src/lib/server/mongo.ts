import mongoose from "mongoose"
import { MONGO_URI } from "$env/static/private"

let connectionPromise: Promise<typeof mongoose> | null = null

const getConnection = async () => {
	if (!connectionPromise) {
		connectionPromise = mongoose.connect(MONGO_URI)
	}
	return connectionPromise
}

const projectSchema = new mongoose.Schema<Project>(
	{
		title: String,
		icon: String,
		description: String,
		link: String,
		date: Number,
	},
	{
		_id: false,
	}
)

const writeupSchema = new mongoose.Schema<Writeup>(
	{
		title: String,
		description: String,
		link: String,
		data: String,
		external_ref: String,
		date: Number,
	},
	{
		_id: false,
	}
)

const getModels = async () => {
	const connection = await getConnection()

	const projectModel =
		connection.models.projects ?? mongoose.model("projects", projectSchema)
	const writeupModel =
		connection.models.writeups ?? mongoose.model("writeups", writeupSchema)

	return { projectModel, writeupModel }
}

export { getModels }
