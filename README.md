# Estoque Blito

**Site:** [Acessar o Estoque Blito](https://estoque-react-firebase.vercel.app)

Sistema web para controlar produtos, impressoras e movimentações de estoque. Desenvolvido em React com Supabase para autenticação, banco PostgreSQL e armazenamento de imagens.

## Funcionalidades

- Login por email e senha, encerramento de sessão e recuperação de senha.
- Cadastro, edição, exclusão e pesquisa de produtos por nome, código e tipo.
- Controle de impressoras com modelo, número de série, contador e observações.
- Entradas e saídas com validação de saldo e registro de histórico.
- Relatórios com gráficos, filtros e exportação para PDF e Excel.
- Imagens em bucket privado, acessíveis por URLs temporárias.
- Estoque compartilhado somente entre membros autorizados no banco.

## Interface

A interface usa navegação recolhível no celular, listas com fotos e saldos alinhados, busca por produto e formulários com validação. Os relatórios mostram barras proporcionais ao saldo real, totais de entradas e saídas e histórico filtrável. PDF e Excel são carregados sob demanda.

A direção visual usa o estilo Framed sheet, a tipografia IBM Plex Sans e o logotipo original da Blito.

## Tecnologias

React 19, Vite, React Router, Supabase JS, jsPDF e SheetJS.

## Executar localmente

Requisitos: Node.js 22 ou superior e npm.

```sh
git clone https://github.com/Borsato21/estoque-react-firebase.git
cd estoque-react-firebase
npm ci
```

Copie `.env.example` para `.env.local` e preencha:

```dotenv
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_sua_chave
```

A URL e a chave publicável estão em **Supabase → Project Settings → API**. A variável antiga `VITE_SUPABASE_ANON_KEY` continua aceita para compatibilidade. Use apenas chave publicável ou `anon` no navegador; nunca uma chave secreta ou `service_role`.

```sh
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

## Configurar o Supabase

1. Crie ou reative um projeto Supabase.
2. Revise e aplique o SQL em `supabase/migrations/` pelo SQL Editor ou com a CLI autenticada (`supabase link` e `supabase db push`). Faça backup antes de aplicar em outro banco existente.
3. Em **Authentication → URL Configuration**, configure a Site URL e autorize os redirecionamentos `http://localhost:5173/redefinir-senha` e `https://SEU-DOMINIO/redefinir-senha`.
4. Crie os usuários em **Authentication → Users**. O aplicativo não oferece cadastro público. Para um estoque interno, desative novos cadastros públicos nas configurações de Auth.
5. Autorize cada usuário na tabela `estoque_membros` pelo SQL Editor, usando o UUID de Authentication → Users:

```sql
insert into public.estoque_membros (user_id)
values ('UUID-DO-USUARIO')
on conflict (user_id) do nothing;
```

O acesso de membro permite operar o estoque compartilhado. Somente o administrador do projeto pode conceder ou revogar essa participação. Autenticar uma conta não concede acesso aos registros automaticamente.

Para revogar acesso:

```sql
delete from public.estoque_membros where user_id = 'UUID-DO-USUARIO';
```

Configure SMTP próprio para envio confiável dos emails de recuperação em produção. No aplicativo, clique em **Esqueceu a senha?**, abra o link recebido e informe a nova senha.

## Banco e arquivos

- `produtos`: identificação, tipo, quantidade, imagem e observação.
- `impressoras`: modelo, série, contador e observação.
- `movimentacoes`: produto, entrada/saída, quantidade, data e observação.
- `estoque_membros`: usuários autorizados a acessar o estoque.
- `product-images`: bucket privado de imagens JPEG, PNG e WebP, com limite de 5 MB por arquivo.

A função `registrar_movimentacao` registra a operação no PostgreSQL. O banco atualiza o saldo na mesma transação, com bloqueio da linha do produto para evitar perda de atualizações concorrentes. Saídas acima do saldo são rejeitadas. Edições manuais de quantidade no cadastro são ajustes diretos e não geram histórico de movimentação.

As imagens do bucket antigo `produtos` conservam suas URLs públicas para compatibilidade; novos uploads anônimos nesse bucket foram bloqueados.

Imagens novas são armazenadas como arquivos; o banco guarda o caminho. URLs temporárias duram uma hora; recarregue a listagem para renová-las. URLs antigas e imagens em base64 permanecem legíveis durante a transição. Arquivos substituídos ou de produtos excluídos não são removidos automaticamente do bucket.

## Migração do Firebase

O aplicativo não depende mais do SDK Firebase. Login, recuperação de senha e novos uploads usam Supabase. Contas Firebase não são migradas: crie novas contas e autorize-as conforme a seção anterior.

Os registros que já estão no Supabase devem ser preservados. Dados que existam apenas no Firebase exigem uma exportação administrativa antes da transferência. Remover o SDK não transfere dados ou arquivos antigos automaticamente. Até que arquivos externos sejam copiados para o bucket, suas URLs antigas continuam dependendo do provedor de origem. Não apague o projeto Firebase antes de confirmar a cópia de todos os registros e arquivos necessários.

## Comandos

| Comando | Objetivo |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Conferir o build localmente |
| `npm run lint` | Verificação estática do código |

## Publicação

Em uma hospedagem para Vite, configure build `npm run build`, diretório de saída `dist` e as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. As variáveis são incorporadas durante o build: publique novamente após alterá-las. O arquivo `vercel.json` já configura o redirecionamento das rotas da SPA.

Após publicar, confira login, logout, recuperação de senha, upload, cadastros, movimentações e exportações. Confirme também que uma conta fora de `estoque_membros` e visitantes sem login não conseguem acessar os dados.

## Estrutura

```text
src/
  components/    Modais, navegação e cartões
  pages/         Login, recuperação, estoque, impressoras e relatórios
  repositories/  Acesso adicional aos dados
  services/      Cliente Supabase, Auth, Storage e operações do estoque
  styles/        Estilos das telas
supabase/
  migrations/    Alterações versionadas do banco
```

## Documentação oficial

- [Supabase Auth](https://supabase.com/docs/guides/auth/passwords)
- [Permissões com RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Segurança do Storage](https://supabase.com/docs/guides/storage/security/access-control)
- [Vite](https://vite.dev/guide/)
