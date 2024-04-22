<script setup lang="ts">
import { useTodos } from "~/composables/useTodos";

const { todos, updatedTodo, deleteTodo, addTodo } = useTodos();
const input = ref("");

const handleClick = () => {
  addTodo(input.value);
  input.value = "";
};
</script>

<template>
  <div class="h-screen w-full">
    <div
      v-if="todos"
      class="mx-auto max-w-xl p-8 border rounded mt-12 flex flex-col gap-6"
    >
      <h1 class="text-2xl">Meine Todos</h1>
      <div class="w-full flex justify-between">
        <input
          @keyup.enter="handleClick"
          v-model="input"
          type="text"
          placeholder="Meine Todo..."
          class="px-4 py-2 border rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 mr-3"
        />
        <button
          @click="handleClick"
          class="rounded-full py-2 px-4 bg-blue-600 text-white text-xl hover:bg-blue-600/80 duration-150 transition"
        >
          +
        </button>
      </div>
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="border border-blue-600 rounded py-2 px-4"
      >
        <div class="p-4 w-full flex justify-between">
          <p
            @click="() => updatedTodo(todo.id)"
            :class="todo.completed ? 'line-through' : ''"
          >
            {{ todo.item }}
          </p>
          <button
            @click="() => deleteTodo(todo.id)"
            class="rounded bg-red-600 py-2 px-4 hover:bg-red-500/70 duration-150 transition"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
