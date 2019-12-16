import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { UpdatePhotoRequest } from '../../requests/UpdatePhotoRequest'
import { getuserId } from '../../BusinessLogic/userauthentication'
import { updatephotoitems } from '../../DataLayer/PhotoAccess'

const logger = createLogger('updatePhotoDescription')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId
  const updatedPhotoDescription: UpdatePhotoRequest = JSON.parse(event.body)
  const userId = getuserId(event)

  const resultupdate = await updatephotoitems(updatedPhotoDescription, photoId, userId)
  
  let statusCode = 201
  if (!resultupdate) {
    logger.error("Unable to update Photo Description")
    statusCode = 404
} else {
    logger.info("Update Photo Description succeeded:", resultupdate)
  }
      
return {
  statusCode: statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    resultupdate
  })
}
}

  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://github.com/BaineGames/udacity-nd9990-p5/tree/master/backend/src/lambda/http
  // https://github.com/CodeUnicornMartha/serverless_todo_app.git