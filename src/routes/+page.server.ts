import { writeupModel } from '$lib/server/mongo'

export const load = async () => {
  const writeups = await writeupModel
    .find({}, { _id: false })
    .sort({ date: -1 })
    .lean()

  return { writeups }
}
