/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdatePhotoRequest {
  name: string
  dueDate: string
  done: boolean
}