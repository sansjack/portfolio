import mongoose from 'mongoose'
import { MONGO_URI } from '$env/static/private'
const connection = await mongoose.connect(MONGO_URI)

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

export const projectModel =
  connection.models.projects ?? mongoose.model('projects', projectSchema)

const writeupSchema = new mongoose.Schema<Writeup>(
  {
    title: String,
    description: String,
    link: String,
    data: String,
    date: Number,
  },
  {
    _id: false,
  }
)

export const writeupModel =
  connection.models.writeups ?? mongoose.model('writeups', writeupSchema)

export function convertToPlainObject<T>(models: any[]): T[] {
  return models.map((model) => model.toObject())
}

export const serializeNonPOJOs = (value: object | null) => {
  return JSON.parse(JSON.stringify(value))
}
