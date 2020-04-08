import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'




export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const evnt = JSON.parse(event.body)
  console.log(`Processing event: ${evnt} todoId:  ${todoId}`)

  // TODO: Remove a TODO item by id
    const result = await deleteTodo(todoId).then(response => response)
    console.log("delete result",result)
  
  return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: ""
  }
}
