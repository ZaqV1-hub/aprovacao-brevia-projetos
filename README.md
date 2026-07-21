# aprovacao-brevia-projetos

Projeto estatico da Brevia para consulta e aprovacao de entregas.

## Estrutura

- `index.html`: lista de entregas.
- `delivery.html`: pagina de aprovacao por entrega.
- `assets/`: imagens usadas na interface.
- `uploads/`: arquivos entregues ao cliente.

## Deploy

O projeto nao exige build. Basta publicar a raiz do repositorio em um host estatico como Netlify.

## Observacao importante

No estado atual, a aprovacao eh registrada apenas em memoria no navegador. Isso deixa a demonstracao funcional, mas nao grava aprovacoes de forma permanente em um banco de dados.
