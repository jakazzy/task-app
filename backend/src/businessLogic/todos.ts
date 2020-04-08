import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()


export async function getAllTodos(userId: string): Promise<TodoItem[]>{
    return await todoAccess.getAllTodos(userId)
}

export async function createTodo( createTodoRequest: CreateTodoRequest, userId: string ): Promise<TodoItem>{
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
  
    return await todoAccess.createTodo({
        todoId,
        userId,
        createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    })
}

export async function updateTodo( todo: UpdateTodoRequest, id: string){
    return await todoAccess.updateTodo(todo, id)
}

export async function generateUploadUrl( imageUrl: string, todoId: string){
    return todoAccess.generateUploadUrl(imageUrl, todoId)
}

export function getUploadUrl(imageId: string){ 
    return todoAccess.getUploadUrl(imageId)
}

export function deleteTodo(todoId: string){
    return todoAccess.deleteTodo(todoId)
}