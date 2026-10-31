import { Component } from "react";
import { Flower2 } from "lucide-react";
import { cx } from "../../lib/utils";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-sakura text-petal">
            <Flower2 size={30} />
          </span>
          <h2 className="h-study-display text-2xl font-semibold text-ink">Algo deslizes no jardim 🌸</h2>
          <p className="mt-2 max-w-md text-sm text-muted">Encontramos uma pequena tempestade. Seu espaço continua lá.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-petal px-5 py-3 font-semibold text-white shadow-rose transition hover:brightness-90"
          >
            Recarregar espaço
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
