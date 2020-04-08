import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// const XAWS = AWSXRay.captureAWS(AWS)
// import * as AWSXRay from 'aws-xray-sdk'


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
    ) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
        TableName : this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        ScanIndexForward: false
       }).promise()

    const items = result.Items
    return items as TodoItem[]
 }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    console.log(`Creating a todo with todo id ${todo.todoId}`)

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }


  async updateTodo(todo: TodoUpdate, id: string){
    return await this.docClient
    .update({
            TableName: this.todosTable,
            Key: {  "todoId": id },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set #n = :x, dueDate = :y, done = :z',
            ExpressionAttributeValues:{
              ":x": todo['name'],
              ":y": todo.dueDate,
              ":z": todo.done 
            },
            ExpressionAttributeNames:{
              "#n": "name"
            },
            ReturnValues: "UPDATED_NEW"
          }).promise()

  }
}

// function createDynamoDBClient() {
//   if (process.env.IS_OFFLINE) {
//     console.log('Creating a local DynamoDB instance')
//     return new XAWS.DynamoDB.DocumentClient({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }

//   return new XAWS.DynamoDB.DocumentClient()
// }