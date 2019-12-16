import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getuserId } from '../../BusinessLogic/userauthentication'
import { PhotoExists, getUploadUrl, updateuploadurl} from '../../DataLayer/PhotoAccess'

const logger = createLogger('generateuploadurl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId
  const userId = getuserId(event)
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const validPhotoId = await PhotoExists(photoId, userId)
  logger.info("validphotoid", validPhotoId)

  if (!validPhotoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Photo does not exist'
      })
    }
  }
  const uploadUrl = getUploadUrl(photoId)
  logger.info("url", uploadUrl)
 
  const updatedurldb = await updateuploadurl(photoId, userId)
  logger.info("updatedurldb", updatedurldb)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}


 // https://winterwindsoftware.com/serverless-photo-upload-api/
 // https://github.com/BaineGames/udacity-nd9990-p5/tree/master/backend/src/lambda/http
 // https://github.com/CodeUnicornMartha/serverless_todo_app.git