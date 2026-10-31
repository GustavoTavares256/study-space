import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flower2, User, Mail, Lock, ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (name.trim().length < 2) next.name = "Digite seu nome completo.";
    if (!email.trim()) next.email = "Digite seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "E-mail inválido.";
    if (!password) next.password = "Crie uma senha.";
    else if (password.length < 6) next.password = "A senha precisa de pelo menos 6 caracteres.";
    if (confirmPassword !== password) next.confirmPassword = "As senhas não coincidem.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    const { user, error } = await signUp({ name, email, password });
    setLoading(false);
    if (error) {
      setFormError(error);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-rose/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-sage/25 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose to-petal text-white shadow-rose">
            <Flower2 size={30} />
          </span>
          <h1 className="h-study-display text-3xl font-semibold text-ink">Criar seu jardim</h1>
          <p className="mt-2 text-sm text-muted">Sua conta será exclusiva da Júlia.</p>
        </div>

        <div className="h-study-card p-6">
          <h2 className="h-study-display text-xl font-semibold text-ink">Cadastre-se</h2>

          {formError ? <div className="mt-4 rounded-2xl bg-rose/20 px-4 py-3 text-sm font-medium text-petal">{formError}</div> : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <Input label="Nome" type="text" placeholder="Júlia" icon={User} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} autoComplete="name" />
            <Input label="E-mail" type="email" placeholder="julia@email.com" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
            <Input label="Senha" type="password" placeholder="Mínimo 6 caracteres" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="new-password" />
            <Input label="Confirmar senha" type="password" placeholder="Repita a senha" icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} autoComplete="new-password" />

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Criar conta <ArrowRight size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Já tem conta?{" "}
            <Link to="/login" className="font-semibold text-petal hover:underline">
              Entrar
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted">Somente para a Júlia — conta privada.</p>
      </div>
    </div>
  );
}
