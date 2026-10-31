import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flower2, Mail, Lock, ArrowRight, KeyRound } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Digite seu e-mail para entrar.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "E-mail inválido.";
    if (!password) next.password = "Digite sua senha.";
    else if (password.length < 6) next.password = "A senha precisa de pelo menos 6 caracteres.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);
    if (error) {
      setFormError(error);
      return;
    }
    navigate("/dashboard");
  }

  async function handleReset() {
    setResetMessage(null);
    const { success } = await authService.resetPassword({ email });
    setResetMessage(success ? "Se este e-mail existir, um link de recuperação será enviado. 🌸" : null);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-rose/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-sage/25 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose to-petal text-white shadow-rose">
            <Flower2 size={30} />
          </span>
          <h1 className="h-study-display text-3xl font-semibold text-ink">Her Study Space</h1>
          <p className="mt-2 text-sm text-muted">Seu jardim particular de estudos 🌸</p>
        </div>

        <div className="h-study-card p-6">
          <h2 className="h-study-display text-xl font-semibold text-ink">Entre no seu espaço</h2>
          <p className="mt-1 text-sm text-muted">Acesse sua conta para continuar seus estudos.</p>

          {formError ? <div className="mt-4 rounded-2xl bg-rose/20 px-4 py-3 text-sm font-medium text-petal">{formError}</div> : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <Input
              label="E-mail"
              type="email"
              placeholder="julia@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
              autoComplete="current-password"
            />
            <div className="flex items-center justify-end">
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-petal transition hover:text-roseDeep">
                <KeyRound size={14} /> Recuperar senha
              </button>
            </div>
            {resetMessage ? <p className="rounded-2xl bg-sage/25 px-4 py-3 text-sm text-[#4C5C40]">{resetMessage}</p> : null}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Entrar <ArrowRight size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-semibold text-petal hover:underline">
              Criar conta
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted">Somente para a Júlia — conta privada.</p>
      </div>
    </div>
  );
}
