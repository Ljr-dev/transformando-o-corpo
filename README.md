# Landing Factory

Template para gerar landing pages profissionais com painel visual em `/admin`.

## Tecnologias

- Next.js
- React
- TypeScript
- TailwindCSS
- Framer Motion

## Rodando o projeto

```bash
npm install
npm run dev
```

Acesse:

```bash
http://localhost:3000
```

## Painel admin

O painel fica em:

```bash
http://localhost:3000/admin
```

Ele exige a variavel local:

```bash
ADMIN_PASSWORD=sua-senha
```

Crie um `.env.local` a partir do `.env.example` quando estiver usando o projeto
manualmente. O `.env.local` nao vai para o Git.

No painel, use **Salvar site para publicar** para gravar a configuracao atual
diretamente em:

```bash
config/siteConfig.ts
```

Depois publique:

```bash
git add .
git commit -m "Atualiza site"
git push origin main
```

## Criar novo sistema

Use o arquivo:

```bat
CRIAR-NOVO-SISTEMA.bat
```

Ou rode:

```bash
npm run clone-site
```

O assistente:

- pergunta o nome do novo sistema
- gera uma senha forte para o painel `/admin`
- permite trocar essa senha na hora
- copia o projeto para uma nova pasta
- cria `.env.local` com `ADMIN_PASSWORD`
- instala as dependencias
- inicia o servidor local
- abre o painel automaticamente

Ao final, ele mostra a pasta, o link do painel e a senha gerada.

## Vercel

Para usar o painel protegido na Vercel, cadastre no projeto a mesma variavel:

```bash
ADMIN_PASSWORD=sua-senha
```

Importante: a Vercel nao grava arquivos de volta no GitHub. O fluxo correto para
publicar alteracoes permanentes continua sendo: editar localmente, salvar
`config/siteConfig.ts`, fazer commit e push.
