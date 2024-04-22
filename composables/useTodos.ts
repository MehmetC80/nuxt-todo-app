interface Todo {
  id: string;
  item: string;
  completed?: boolean;
}

export const useTodos = () => {
  const { data: todos, refresh } = useAsyncData<{ data: Todo }>(
    "todo",
    async () => {
      return $fetch("/api/todos");
    }
  );

  const addTodo = async (item: string) => {
    if (!item) return;

    await $fetch("/api/todos", {
      method: "POST",
      body: { item: item },
    });

    refresh();
  };

  const updatedTodo = async (id: string) => {
    await $fetch(`/api/todos/${id}`, {
      method: "PUT",
    });

    refresh();
  };

  const deleteTodo = async (id: string) => {
    await $fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    refresh();
  };

  return { todos, addTodo, updatedTodo, deleteTodo };
};
export default useNuxtDevTools;
