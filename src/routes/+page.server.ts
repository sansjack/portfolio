import { serializeNonPOJOs, writeupModel } from '$lib/server/mongo'

export const load = async () => {
  const writeups = serializeNonPOJOs(
    await writeupModel.find({}, { _id: false }).sort({ date: -1 })
  )
  return { writeups }
}
