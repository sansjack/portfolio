import { serializeNonPOJOs, writeupModel } from '$lib/server/mongo'

export const load = async () => {
  const writeups = serializeNonPOJOs(
    await writeupModel.find({}, { _id: false })
  )
  return { writeups }
}
