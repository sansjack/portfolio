import {
  convertToPlainObject,
  serializeNonPOJOs,
  writeupModel,
} from '$lib/server/mongo'
export const load = async ({ params }) => {
  const { page } = params

  const parsedPage = page.replace(' ', '-').toLowerCase()

  const writeup = serializeNonPOJOs(
    await writeupModel.findOne({ title: parsedPage }, { _id: false })
  )

  return {
    writeup: writeup,
    page,
  }
}
