import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import 'source-map-support/register'

const docClient = new AWS.DynamoDB.DocumentClient()

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.TODOS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`TodoId: ${event.pathParameters.todoId}`, event)
  const todoId = event.pathParameters.todoId
  const imageId = uuid.v4()
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  console.log(`imageId: ${imageId}`)
  const url = getUploadUrl(imageId)
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

  updateItem(imageUrl, todoId, todosTable)
  const newItem ={
      iamgeUrl: imageUrl,
      uploadUrl: url
    }

  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        newItem
    })
}
}

async function updateItem(imageUrl:string, todoId:string,  todosTable:string){
    await docClient
    .update({
        TableName: todosTable,
        Key: { todoId },
        UpdateExpression: "set attachmentUrl = :v",
        ExpressionAttributeValues:{
      ":v": imageUrl
    }}).promise()
     ReturnValues:"ALL_NEW"
    }



// attachmentUrl: ``
function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: parseInt(urlExpiration, 10) 
    })
  }