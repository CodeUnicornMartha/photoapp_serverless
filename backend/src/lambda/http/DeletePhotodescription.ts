import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getuserId } from '../../BusinessLogic/userauthentication'
import { deletePhotoDescription } from '../../DataLayer/PhotoAccess'

const logger = createLogger('deletePhotoDescription')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getuserId(event)
  logger.info("userid", userId)
  
  const photoId = event.pathParameters.photoId
  logger.info("photoId", photoId)
  
  const resultdelete = await deletePhotoDescription(userId, photoId)
  logger.info("resultdeletehttp", resultdelete)
  let statusCode = 200
  if (!resultdelete) {
    logger.error("Unable to delete Photo description")
    statusCode = 404
  } 
  else {
    logger.info("DeleteItem succeeded:", resultdelete)
  }
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: "Removing item"

  }
}
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-2c214fc0-8307-11e9-8c0b-bb3f327e9dbb-1503309?contextType=room
  
