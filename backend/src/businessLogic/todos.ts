import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import {  CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]>{
    return todoAccess.getAllTodos(userId)
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