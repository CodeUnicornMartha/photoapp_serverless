import { CreatePhotoRequest } from '../requests/CreatePhotoRequest'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'
import { UpdatePhotoRequest } from '../requests/UpdatePhotoRequest'
import * as AWSXRAY from 'aws-xray-sdk'
import * as uuid from 'uuid'

const logger = createLogger('DataLayer')
const XAWS = AWSXRAY.captureAWS(AWS)

export async function createphotodescription(userId: string, photo: CreatePhotoRequest, photoId: string) {
    const docClient = new XAWS.DynamoDB.DocumentClient
    const timestamp = (new Date()).toISOString()
    const PhotoTable = process.env.Photo_TABLE
    const newPhotoitem = {
        userId: userId,
        createdAt: timestamp,
        photoId: photoId,
        name: photo.name,
        dueDate: photo.dueDate
      }
      logger.info("newPhotoitem", newPhotoitem)
    const resultcreatedata = await docClient.put({
        TableName: PhotoTable,
        Item: newPhotoitem      
      }).promise()
    logger.info("resultcreate", resultcreatedata)
    return newPhotoitem
}

export async function deletePhotoDescription(userId: string, photoId: string) {
    const docClient = new XAWS.DynamoDB.DocumentClient
    const PhotoTable = process.env.Photo_TABLE
    const Key = {
        photoId: photoId,
        userId: userId
        }
    logger.info("Key", Key)
    const resultdeletedata = await docClient.delete({
        TableName: PhotoTable,
        Key: Key
      }).promise()
      logger.info("resultdelete", resultdeletedata)

      return resultdeletedata
}

export async function getphotoitems(userId: string){
    const docClient = new XAWS.DynamoDB.DocumentClient
    const PhotoTable = process.env.Photo_TABLE
    const UserIdINDEX = process.env.UserIdINDEX
    const resultgetdata = await docClient.query({
        PhotoTable: PhotoTable,
        IndexName: UserIdINDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise()
      logger.info("result", resultgetdata)
    
    return resultgetdata
}

export async function PhotoExists(photoId: string, userId: string) {
    const PhotoTable = process.env.Photo_TABLE
    const docClient = new XAWS.DynamoDB.DocumentClient()
    const result = await docClient.get({
        TableName: PhotoTable,
        Key: {
          photoId: photoId,
          userId: userId
        }
      }).promise()
  
    logger.info('Get Photos: ', result)
    return !!result.Item
  }
  
 export function getUploadUrl(photoId: string) {
    const s3 = new XAWS.S3({ signatureVersion: 'v4'})
    const bucketName = process.env.Photo_S3_BUCKET
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: photoId,
      Expires: urlExpiration
    })
  }

export async function updateuploadurl(photoId: string, userId: string){
    const PhotoTable = process.env.Photo_TABLE
    const bucketName = process.env.Photo_S3_BUCKET
    const docClient = new XAWS.DynamoDB.DocumentClient()
    const imageid = uuid.v4()
    const imageUrl =  `https://${bucketName}.s3.amazonaws.com/${imageid}`
    const resultuploadurldb = await docClient.update({
        TableName: PhotoTable,
        Key: {
          photoId: photoId,
          userId: userId
        },
        UpdateExpression: 'set uploadUrl = :uploadUrl',
        ExpressionAttributeValues: {
        ':uploadUrl': imageUrl
      },
      ReturnValues: "UPDATED_NEW"
      })
      .promise()
    logger.info("resultuploadurldb", resultuploadurldb)
    return resultuploadurldb
}

export async function updatephotoitems( updatedPhoto: UpdatePhotoRequest, photoId: string, userId: string){
  const PhotoTable = process.env.Photo_TABLE
  const docClient = new XAWS.DynamoDB.DocumentClient()
  const photoname = updatedPhoto.name
  const done = updatedPhoto.done
  const dueDate = updatedPhoto.dueDate

  const resultupdatedata = await docClient.update({
    TableName: PhotoTable,
    Key: {
      photoId: photoId,
      userId: userId
    },
    UpdateExpression: 'set photoname = :photoname, done = :done, dueDate = :dueDate',
    ExpressionAttributeValues: {
      ':photoname': photoname,
      ':done': done,
      ':dueDate': dueDate

    },
    ReturnValues: "UPDATED_NEW"     
      
  }).promise();

  logger.info("result", resultupdatedata)

  return resultupdatedata
  
}


  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06      
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-3193378732-1992673?contextType=room
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-2c214fc0-8307-11e9-8c0b-bb3f327e9dbb-1503309?contextType=room
  // https://winterwindsoftware.com/serverless-photo-upload-api/
  // https://github.com/BaineGames/udacity-nd9990-p5/tree/master/backend/src/lambda/http
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.03
  // https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/s3-example-presigned-urls.html
  // https://serverless.com/plugins/serverless-plugin-tracing/
  // https://github.com/alex-murashkin/serverless-plugin-tracing
  // https://medium.com/@glicht/using-aws-x-ray-to-achieve-least-privilege-permissions-93dfd6701318
