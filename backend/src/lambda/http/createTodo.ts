import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = uuid.v4()
  const item = await createTodo(userId, todoId, event)


  // TODO: Implement creating a new TODO item
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
        item
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
      ...newTodo
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

 