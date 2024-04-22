import { db } from "../../db";
import { v4 as uuid } from "uuid";
import { createError, sendError } from "h3";

type Todo = {
  id: string;
  item: string;
  completed?: boolean;
};

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    const todos: Todo[] = db.todos;

    if (method === "GET") {
      return db.todos;
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (method === "POST") {
      const body = await readBody(event);

      if (!body.item) {
        const BadTodoRequest = createError({
          statusCode: 400,
          statusMessage: "No todo provided",
          data: {},
        });
        sendError(event, BadTodoRequest);
        return;
      }

      const newTodo: Todo = {
        id: uuid(),
        item: body.item,
        completed: false,
      };

      db.todos.push(newTodo);

      return newTodo;
    }
  } catch (error) {
    console.log(error);
    const InternalServerError = createError({
      statusCode: 500,
      statusMessage: `Internal Server Error`,
      data: {},
    });
    sendError(event, InternalServerError);
    return;
  }
});
