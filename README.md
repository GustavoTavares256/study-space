# Her Study Space 🌸

Aplicação web pessoal de organização e estudos — um jardim digital Sakura para a Júlia.

## Funcionalidades implementadas

### Autenticação
- Telas de Login e Cadastro com validação completa (e-mail, senha, confirmação).
- Recuperação de senha (fluxo simulado).
- Sessão persistida em `localStorage`.
- Rotas protegidas e redirect automático.

### PWA (Progressive Web App)
- Configuração via `vite-plugin-pwa` (Workbox).
- `public/manifest.webmanifest`:
  - Nome: **Her Study Space**
  - Nome curto: **Her Space**
  - `display: standalone`
  - `background_color: #FBF7F2`
  - `theme_color: #C58FA3`
- Ícones: `public/icons/icon-192.png`, `public/icons/icon-512.png`, `apple-touch-icon.png`, SVGs.
- Service Worker com cache de pré-cache + runtime caching (ícones/assets/pages).
- Estratégia de atualização: `autoUpdate`.
- Meta tags: `theme-color`, `mobile-web-app-capable`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`, `apple-touch-icon`.

### Dashboard
- Saudação personalizada: "Bom dia, Júlia! 🌸" + data + frase motivacional.
- Avatar e botão de notificações (tarefas atrasadas, entregas de hoje, avaliações próximas).
- 4 cards de resumo: tarefas pendentes, concluídas, próximas provas, horas estudadas na semana.
- Gráfico de produtividade semanal (Recharts) + progresso de metas + % de conclusão.
- Cronograma do dia, próximas avaliações com contagem regressiva, tarefas recentes com concluir/excluir, card "Um lembrete para você".
- Timer Pomodoro (25/5/15) com anel de progresso, ciclos.
- Cartão de conquistas.

### Outras páginas
- **Cronograma**: semana Segunda–Domingo, criar/editar/excluir sessões, matéria, horários, descrição, status.
- **Matérias**: cards com cor/ícone/descrição/tarefas/progresso, CRUD, detalhes.
- **Tarefas**: CRUD, filtros (matéria/prioridade/status), indicadores de atraso e prazo próximo.
- **Provas**: painel com contagem regressiva, conteúdo, nível de preparação, CRUD.
- **Anotações**: caderno, busca por título, filtro por matéria, CRUD, data de criação.
- **Metas**: progresso, prazo, status, CRUD.
- **Configurações**: perfil, notificações, restaurar dados, sair.

### Especial
- Pomodoro com foco/pausa curta/pausa longa, iniciar/pausar/reiniciar, anel visual.
- Conquistas, frases motivacionais aleatórias, fundo decorativo Sakura (pétalas animadas).

## Stack

- React 19 + Vite 8
- JavaScript (JSX), sem TypeScript
- Tailwind CSS 3
- React Router DOM 7
- Lucide React
- Recharts
- @supabase/supabase-js 2 (preparado, ainda sem credenciais)

## Como executar

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # produção em dist/
```

## PWA

- Instalável via Chrome (Android/desktop) e Safari (iOS/iPadOS).
- `display: standalone`, theme `#C58FA3`, background `#FBF7F2`.
- Service worker com Workbox (precache + runtime caching), estratégia `autoUpdate`.
- Cache: apenas estáticos (`/assets/*`, `/icons/*`) e páginas (NetworkFirst); nunca armazenar auth/Supabase privado.

## Próximos passos (Supabase)

1. Criar projeto no Supabase e tabelas.
2. Preencher `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local`.
3. Substituir `src/services/auth.js` e a camada de persistência pelos clientes `supabase.auth` + consultas.
4. Desativar o modo mockado.
