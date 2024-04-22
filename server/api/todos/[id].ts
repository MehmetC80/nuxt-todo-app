import { db } from "../../db";
import { createError, sendError } from "h3";

type Todo = {
  id: string;
  item: string;
  completed?: boolean;
};

export default defineEventHandler(async (event) => {
  const methode = event.node.req.method;

  //1. Find todoId from event.context.params
  const context = event.context;

  //Überprüfe, ob context und context.params existieren und ob id darin vorhanden ist
  if (!context?.params || typeof context.params.id !== "string") {
    throw new Error("ID wurde nicht gefunden oder ist kein String.");
  }

  const { id } = context.params;

  const findTodoById = (todoId: string) => {
    //2.Find todo in todos array in db

    let index: number = -1; // Index mit "-1" initialisieren

    const todo = db.todos.find((t, i) => {
      if (t.id === todoId) {
        index = i;
        return true;
      }
      return false;
    });

    //3. Error if not find todo with id
    if (!todo) {
      const TodoNotFoundError = createError({
        statusCode: 404,
        statusMessage: `Todo with id " + ${todoId} + " not found!"`,
        data: {},
      });
      sendError(event, TodoNotFoundError);
    }

    return { todo, index };
  };

  try {
    if (methode === "PUT") {
      const { todo, index } = findTodoById(id);

      // updated completed status todo
      const updatedTodo: Todo = {
        id: todo?.id || "",
        item: todo?.item || "",
        completed: !todo?.completed,
      };
      db.todos[index] = updatedTodo;

      return updatedTodo;
    }
  } catch (error) {
    console.log("error ", error);
    const InternalServerError = createError({
      statusCode: 500,
      statusMessage: `Internal Server Error`,
      data: {},
    });
    sendError(event, InternalServerError);
  }

  try {
    if (methode === "DELETE") {
      const { todo, index } = findTodoById(id);

      db.todos.splice(index!, 1);
      return {
        message: " item deleted successfully",
      };
    }
  } catch (error) {
    console.log("error ", error);
    const InternalServerError = createError({
      statusCode: 500,
      statusMessage: `Internal Server Error`,
      data: {},
    });
    sendError(event, InternalServerError);
  }
});
