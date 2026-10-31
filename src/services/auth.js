import { storage, storageKeys } from "./storage";

export const authService = {
  async getSession() {
    const session = storage.get(storageKeys.session, null);
    if (!session) return { user: null, session: null };
    const users = storage.get(storageKeys.users, []);
    const user = users.find((u) => u.id === session.userId) || null;
    return { user, session };
  },

  async getCurrentUser() {
    const { user } = await authService.getSession();
    return user;
  },

  async signUp({ name, email, password }) {
    const users = storage.get(storageKeys.users, []);
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      return { user: null, error: "E-mail já cadastrado neste espaço." };
    }
    const user = {
      id: `u-${Date.now().toString(36)}`,
      name: name.trim(),
      email: normalized,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    storage.set(storageKeys.users, users);
    storage.set(storageKeys.session, { userId: user.id });
    return { user, error: null };
  },

  async signIn({ email, password }) {
    const users = storage.get(storageKeys.users, []);
    const user = users.find((u) => u.email === email.trim().toLowerCase());
    if (!user) return { user: null, error: "E-mail não encontrado. Que tal se cadastrar? 🌸" };
    if (user.password !== password) return { user: null, error: "Senha incorreta. Tente novamente." };
    storage.set(storageKeys.session, { userId: user.id });
    return { user, error: null };
  },

  async signOut() {
    storage.remove(storageKeys.session);
  },

  async resetPassword() {
    // Fluxo simulado: em produção enviaria um e-mail via Supabase Auth.
    return { success: true };
  },
};
