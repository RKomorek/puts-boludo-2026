# Como contribuir

Obrigado por considerar contribuir com o PutsBoludo! Este projeto é pensado para ser reutilizado por qualquer grupo de amigos.

## Reportar bugs

Abra uma **Issue** com:

- O que você esperava
- O que aconteceu
- Passos para reproduzir
- Screenshots (se aplicável)

## Sugerir melhorias

Issues com label `enhancement` são bem-vindas. Descreva o caso de uso do seu grupo.

## Pull requests

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Commit com mensagens claras em português ou inglês
4. Garanta que passa: `npm run lint` e `npm run build`
5. Abra o PR descrevendo o **porquê** da mudança

## Padrões de código

- TypeScript strict
- App Router do Next.js — preferir Server Components quando possível
- Validação com Zod em Server Actions
- Regras de negócio duplicadas no Postgres (RLS/triggers) quando críticas
- Comentários só para lógica não óbvia
- UI mobile-first

## Estrutura de commits

Prefira mensagens curtas no imperativo:

```
feat: adiciona página de ranking
fix: bloqueia palpite após kickoff
docs: atualiza guia de setup Supabase
```

## Documentação

Se alterar comportamento, atualize:

- `README.md` (se visível ao usuário)
- `docs/ARCHITECTURE.md` (se mudar arquitetura)
- `docs/DECISIONS.md` (se mudar regra de negócio)

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [MIT License](../LICENSE).
