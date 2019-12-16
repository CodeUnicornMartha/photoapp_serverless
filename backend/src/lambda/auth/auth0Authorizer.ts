import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'



const logger = createLogger('auth')


// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-so9n1gu3.auth0.com/.well-known/jwks.json'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

export async function verifyToken(authHeader: string): Promise<JwtPayload> {

  const token = getToken(authHeader)
  logger.info("token", token)

  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info("jwt", jwt)

  const kidheader = jwt.header.kid
  logger.info("kidheader", kidheader)

  const certificate = await getkeys(jwksUrl,kidheader)
  logger.info("certificate", certificate)

  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-4601288877-1137793?contextType=room
  
  const certformat = certToPEM(certificate)
  logger.info("cert", certformat)
  logger.error("cert", certformat)
  return verify(token, certformat, { algorithms: ['RS256'] }) as JwtPayload
  }


function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

 function certToPEM(cert) {

  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`;

  return cert;

};
async function getkeys(jwksUrl: string, kidheader: string){
  const reply = await Axios.get(jwksUrl) 
  const keys: any[] = reply.data.keys

  const key = keys.find(key => key.kid === kidheader && key.kty === 'RSA') 
  if (!key) 
  throw new Error('Key not found')

  return key.x5c[0]
}
// https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L7-L28
// https://gist.github.com/chatu/7738411c7e8dcf604bc5a0aad7937299
// https://auth0.com/blog/navigating-rs256-and-jwks/
// https://auth0.com/blog/navigating-rs256-and-jwks/
// https://github.com/auth0/node-jwks-rsa/blob/master/src/utils.js#L1-L5
// https://github.com/auth0/node-jwks-rsa/blob/master/src/JwksClient.js
// https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/utils.js
// https://auth0.com/blog/navigating-rs256-and-jwks/
// https://github.com/auth0/node-jsonwebtoken
// https://github.com/CodeUnicornMartha/serverless_todo_app.git
 // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-4601288877-1137793?contextType=room
// http://zetcode.com/javascript/axios/