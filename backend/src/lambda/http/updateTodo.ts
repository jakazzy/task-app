import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
// import * as AWS from 'aws-sdk'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
 const result = await updateTodo(updatedTodo, todoId).then(response => response.Attributes)
 console.log('New updated item: ', result)


return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
}
}

// Reference for updating dynamo DB from : https://www.dynamodbguide.com/
// async function updateTodo( updatedTodo,todoId, todosTable){
//     console.log(`Updated Todo value: ${updatedTodo.name} , ${updatedTodo.dueDate}, ${updatedTodo.done}, ${todoId}, ${todosTable}`)
//     return await docClient
//     .update({
//             TableName: todosTable,
//             Key: {  "todoId": todoId },
//             ConditionExpression: 'attribute_exists(todoId)',
//             UpdateExpression: 'set #n = :x, dueDate = :y, done = :z',
//             ExpressionAttributeValues:{
//               ":x": updatedTodo['name'],
//               ":y": updatedTodo.dueDate,
//               ":z": updatedTodo.done 
//             },
//             ExpressionAttributeNames:{
//               "#n": "name"
//             },
//             ReturnValues: "UPDATED_NEW"
//           }).promise()


// }