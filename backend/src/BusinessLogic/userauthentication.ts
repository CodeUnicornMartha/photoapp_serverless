
import { parseUserId } from '../auth/utils'
import { APIGatewayProxyEvent} from 'aws-lambda'
import { createLogger } from '../utils/logger'


export function getuserId(event: APIGatewayProxyEvent) {
    const logger = createLogger('getuserId')
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = parseUserId(jwtToken)

    logger.info("userId", userId)

    return userId

}

// https://github.com/CodeUnicornMartha/serverless_todo_app.git