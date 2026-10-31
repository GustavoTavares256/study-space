# Her Study Space 🌸

Aplicação web pessoal de organização e estudos — um jardim digital Sakura para a Júlia.

## Funcionalidades implementadas

### Autenticação
- Telas de Login e Cadastro com validação completa (e-mail, senha, confirmação).
- Recuperação de senha (fluxo simulado).
- Sessão persistida em `localStorage`.
- Rotas protegidas e redirect automático.

### Dashboard
- Saudação personalizada: "Bom dia, Júlia! 🌸" + data + frase motivacional.
- Avatar e botão de notificações (tarefas atrasadas, entregas de hoje, avaliações próximas).
- Cards de resumo: tarefas pendentes, concluídas, próximas provas, horas estudadas na semana.
- Gráfico de produtividade semanal (Recharts).
- Indicador de progresso das metas + % de tarefas concluídas.
- Cronograma do dia.
- Próximas avaliações com contagem regressiva.
- Tarefas recentes com conclusão rápida.
- Card "Um lembrete para você".
- Timer Pomodoro (25/5/15) com anel de progresso.
- Cartão de conquistas.

### Outras páginas
- **Cronograma**: semana Segunda–Domingo, criar/editar/excluir sessões, matéria, horários, descrição, status.
- **Matérias**: cards com cor, ícone, descrição, tarefas e progresso; CRUD + detalhes.
- **Tarefas**: CRUD, filtros por matéria/prioridade/status, indicadores de atraso e prazo próximo.
- **Provas**: painel com contagem regressiva, conteúdo, nível de preparação, CRUD.
- **Anotações**: caderno com busca por título, filtro por matéria, CRUD, data de criação.
- **Metas**: CRUD com progresso e status.
- **Configurações**: perfil, notificações, restaurar dados, sair.

### Especial
- Pomodoro com foco/pausa curta/pausa longa, iniciar/pausar/reiniciar, anel visual.
- Conquistas, frases motivacionais, fundo decorativo Sakura (pétalas animadas).

## Stack

- React 19 + Vite 8
- JavaScript (JSX), sem TypeScript
- Tailwind CSS 3
- React Router DOM 7
- Lucide React
- Recharts
- @supabase/supabase-js 2 (preparado, ainda sem credenciais)

## Estrutura

```
src/
  assets/          # Sakura SVG
  components/
    common/        # Card, Button, Input, Select, Textarea, Modal, Badge, Avatar, StatCard, ProgressBar, ProgressRing, SectionHeader, EmptyState, SubjectIcon
    dashboard/     # Seções do dashboard
    layout/        # Sidebar, MobileNav, TopBar, Layout, SakuraBackground
    pomodoro/      # PomodoroTimer
  context/         # AuthContext
  hooks/           # useLocalStorageState, useNow
  lib/             # utils, supabase
  pages/           # Login, Register, Dashboard, Schedule, Subjects, Tasks, Exams, Notes, Goals, Settings (+index.jsx)
  services/        # storage, auth, data, seed
  App.jsx
  main.jsx
  index.css
```

## Como executar

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # produção em dist/
```

## Próximos passos (Supabase)

1. Configurar projeto no Supabase e criar as tabelas (`users`, `subjects`, `tasks`, `exams`, `notes`, `goals`, `schedule`).
2. Preencher `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local`.
3. Substituir `src/services/auth.js` e a camada de persistência (`useLocalStorageState`) pelos clientes `supabase.auth` e consultas Supabase.
4. Desativar o modo mockado.

> Regras: credenciais nunca são expostas no frontend; a conta é privada da Júlia.
