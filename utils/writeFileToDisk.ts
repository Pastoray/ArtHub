import path from 'path'
import { writeFile } from 'fs/promises'

export const writeFileToDisk = async (file: File) => {
  if (!file) {
    return null
  }
  let buffer, filename
  if (typeof file !== 'string') {
    buffer = Buffer.from(await file.arrayBuffer())
    filename = Date.now() + file.name.replaceAll(' ', '_')
  } else {
    return null
  }
  try {
    await writeFile(
      path.join(process.cwd(), 'public/uploads/' + filename),
      buffer!
    )
    return filename
  } catch (error) {
    console.log('Error occured ', error)
    return null
  }
}
