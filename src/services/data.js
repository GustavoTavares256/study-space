import { uid } from "../lib/utils";

export function createItem(list, item) {
  return [item, ...list];
}

export function updateItem(list, id, patch) {
  return list.map((item) => (item.id === id ? { ...item, ...patch, id } : item));
}

export function deleteItem(list, id) {
  return list.filter((item) => item.id !== id);
}

export function getItem(list, id) {
  return list.find((item) => item.id === id) || null;
}

export function newId() {
  return uid();
}
