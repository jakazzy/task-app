import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
 const result = updateTodo(updatedTodo, todoId, todosTable)



return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      result
    })
}
}

async function updateTodo( updatedTodo,todoId, todosTable){
    console.log(`Updated Todo value: ${updatedTodo.name} , ${updatedTodo.dueDate} ${updatedTodo.done}`)
    await docClient
    .update({
            TableName: todosTable,
    Key: {  todoId },
    UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
    ExpressionAttributeValues:{
      ":a": updatedTodo.name,
      ":b": updatedTodo.dueDate,
      ":c": updatedTodo.done
    },
    ExpressionAttributeNames:{
      "#n": "name"
    },
    ReturnValues:"UPDATED_NEW"
    }).promise()
}