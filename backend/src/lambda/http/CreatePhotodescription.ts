import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { CreatePhotoRequest } from '../../requests/CreatePhotoRequest'
import { getuserId } from '../../BusinessLogic/userauthentication'
import * as uuid from 'uuid'
import { createphotodescription } from '../../DataLayer/PhotoAccess'

const logger = createLogger('createPhotoDescription')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newPhoto: CreatePhotoRequest = JSON.parse(event.body)
  const PhotoTable = process.env.Photo_TABLE
  const userId = getuserId(event)
  const photoId = uuid.v4()
  logger.info("key", photoId)
  const newPhotoitem = await createphotodescription(userId, newPhoto, photoId)
  let statusCode = 201
      if (!newPhotoitem) {
        logger.error("Unable to create To Do")
        statusCode = 404
    } else {
        logger.info("CreateItem succeeded:")
      }
  logger.info("newPhotoitem", newPhotoitem)
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: {
          photoId: photoId,
          PhotoTable: PhotoTable,
          userId: userId,
          ... newPhotoitem
        }
      })

    }

  }

  
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06      
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-3193378732-1992673?contextType=room
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
 
 
