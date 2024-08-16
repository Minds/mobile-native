import { icons, spinner } from './pretty'

export async function spinnerAction(
  action: string,
  callback: () => Promise<any>
): Promise<any> {
  spinner.start(action)
  let result = null
  try {
    result = await callback()
  } catch (error) {
    spinner.stop(action, icons.failed)
    throw error
  }

  spinner.stop(action, icons.done)
  return result
}
