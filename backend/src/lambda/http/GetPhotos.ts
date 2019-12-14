import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getuserId } from '../../BusinessLogic/userauthentication'
import { getphotoitems } from '../../DataLayer/PhotoAccess'

const logger = createLogger('getPhotoDescription')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getuserId(event)
  const resultget = await getphotoitems(userId)
  let statusCode = 201
  if (!resultget) {
    logger.error("Unable to get Photos")
    statusCode = 404
  } 
  else {
    logger.info("Get Photos succeeded:")
    }
  const items = resultget.Items
  logger.info("items",items)
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}

  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://github.com/BaineGames/udacity-nd9990-p5/tree/master/backend/src/lambda/http
  

