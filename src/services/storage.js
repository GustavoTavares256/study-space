const PREFIX = "her-study-space";

export const storageKeys = {
  users: `${PREFIX}:users`,
  session: `${PREFIX}:session`,
  subjects: `${PREFIX}:subjects`,
  tasks: `${PREFIX}:tasks`,
  exams: `${PREFIX}:exams`,
  notes: `${PREFIX}:notes`,
  goals: `${PREFIX}:goals`,
  schedule: `${PREFIX}:schedule`,
  achievements: `${PREFIX}:achievements`,
  notificationsRead: `${PREFIX}:notifications-read`,
  notifications: `${PREFIX}:notifications`,
};

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // armazenamento indisponível: mantém estado em memória
  }
  return value;
}

function remove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // noop
  }
}

export const storage = {
  get: read,
  set: write,
  remove,
  keys: storageKeys,
};
