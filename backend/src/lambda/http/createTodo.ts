import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const userId = "1"
  const todoId = uuid.v4()
  const newItem = await createTodo(userId, todoId, event)


  // TODO: Implement creating a new TODO item
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        newItem
    })
  }
}

async function createTodo(userId: string, todoId: string, event: any) {
    const createdAt = new Date().toISOString()
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
    const newItem = {
      userId,
      createdAt,
      todoId,
      ...newTodo,
      attachmentUrl: `this should be attachment url`
    }
    console.log('Storing new item: ', newItem)
  
    await docClient
      .put({
        TableName: todosTable,
        Item: newItem
      })
      .promise()
  
    return newItem
  }
