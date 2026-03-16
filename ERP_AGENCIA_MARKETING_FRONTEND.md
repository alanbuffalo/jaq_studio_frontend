# ERP de Agencia de Marketing - Direcionamento de Frontend

## Objetivo

Este documento traduz o backlog mestre do backend para uma visao pratica de frontend.

O alvo nao e apenas "fazer telas". O alvo e construir uma interface operacional para uma agencia de marketing que:
- seja rapida para uso diario
- seja clara sob alta carga de informacao
- sirva tanto equipe interna quanto cliente externo
- suporte crescimento modular sem colapsar a experiencia

Este arquivo deve ficar na raiz do projeto e ser usado como referencia principal de frontend para:
- arquitetura de navegacao
- mapa de telas
- padroes de interface
- prioridades de implementacao
- alinhamento com o backend

## Base utilizada

Este documento foi construido a partir de:
- [ERP_AGENCIA_MARKETING_REQUISITOS.md](D:/Dev/JAQ_STUDIO/jaq_studio_backend/ERP_AGENCIA_MARKETING_REQUISITOS.md)
- stack atual do frontend em React + TypeScript + Vite + Tailwind
- referencias visuais e funcionais pesquisadas em produtos de mercado

## O que a pesquisa de mercado indica

Os padroes mais consistentes observados em ferramentas maduras para agencias e operacao criativa foram:

### 1. Um shell principal simples e estavel

Ferramentas como Productive e Workamajig reforcam um principio importante: a estrutura principal nao muda o tempo todo. O usuario precisa reconhecer o produto em segundos.

Consequencia para o JAQ Studio:
- sidebar persistente
- header fixo e enxuto
- breadcrumbs em modulos profundos
- conteudo principal com largura controlada
- filtros e acoes sempre no topo da area de trabalho

### 2. Vista executiva e vista operacional nao podem ser a mesma coisa

Productive enfatiza lucratividade, forecast, utilizacao e saude do negocio em tempo real. Isso pede dashboards de diretoria e operacao separados.

Consequencia para o JAQ Studio:
- home diferente por papel
- dashboard executivo orientado a KPIs, margem, forecast e risco
- dashboard operacional orientado a fila, SLA, jobs, aprovacoes e pendencias

### 3. Tabelas continuam centrais, mas precisam de multiplas visoes

Workamajig e Productive combinam lista, calendario, workload e visoes por projeto. Nao basta um CRUD em tabela.

Consequencia para o JAQ Studio:
- toda entidade relevante precisa nascer com pelo menos uma lista forte
- modulos criticos devem prever visoes alternativas: Kanban, calendario, timeline, workload, Gantt, proofing

### 4. Aprovacao criativa precisa ser tratada como produto, nao detalhe

PageProof e Wrike mostram que feedback contextual, comparacao de versoes, checklist e trilha de aprovacao sao parte central da experiencia para marketing e criacao.

Consequencia para o JAQ Studio:
- modulo proprio de aprovacoes e assets
- comentarios ancorados no ativo
- status claros por etapa
- comparacao de versoes
- aprovacao interna e externa com baixa friccao

### 5. ERP para agencia precisa mostrar dinheiro, capacidade e gargalo o tempo todo

Productive deixa claro o valor de ligar horas, alocacao, budget e margem na mesma experiencia.

Consequencia para o JAQ Studio:
- cards e alertas de budget, horas, SLA e margem nos modulos
- sinais visuais de risco antes do fechamento mensal
- visao por cliente, projeto, campanha, colaborador e squad

## Direcao visual

O frontend deve seguir um visual "resolvido e util", nao decorativo.

### Caracteristicas desejadas

- aparencia premium, mas operacional
- baixa carga cognitiva
- alto contraste entre informacao primaria e secundaria
- hierarquia forte de tipografia
- tabelas e formularios confortaveis para uso prolongado
- densidade controlada: nem apertado demais, nem espacoso demais
- cor usada para semantica operacional, nao para enfeite

### Linguagem visual recomendada

- base clara
- superficies brancas ou cinza muito claro
- bordas suaves e bem definidas
- sombras discretas
- cores de status previsiveis
- uso disciplinado de badges, chips, tabs e indicadores

### Inspiracao pratica de UX

- Productive: dashboards de rentabilidade, utilizacao e planejamento
- Workamajig: estrutura de plataforma all-in-one para agencias
- PageProof: prova, comentarios e aprovacoes em ativos
- Wrike: fluxo de proofing e colaboracao contextual

### Paleta e identidade

O projeto ja possui base visual inicial e uma paleta em `docs/CORES.txt`, mas o ERP completo deve consolidar tokens mais amplos:

- `bg-app`
- `bg-surface`
- `bg-muted`
- `border-subtle`
- `text-primary`
- `text-secondary`
- `brand-primary`
- `brand-secondary`
- `success`
- `warning`
- `danger`
- `info`

As cores da agencia configuradas no sistema devem alimentar:
- logo e identidade institucional
- elementos de marca do portal do cliente
- pequenos pontos de destaque

Nao devem dominar:
- estados criticos
- legibilidade de dados
- navegacao principal

## Principios de experiencia

### 1. Menos troca de contexto

O usuario deve conseguir:
- localizar
- filtrar
- editar
- comentar
- aprovar
- registrar atividade

sem navegar por cinco telas para cada acao.

### 2. Contexto sempre visivel

Toda tela operacional profunda deve mostrar:
- cliente
- marca
- projeto/job/campanha
- status
- dono atual
- SLA ou prazo
- valor financeiro ou impacto quando aplicavel

### 3. Primeira acao obvia

Cada modulo precisa deixar claro o que fazer primeiro:
- criar lead
- abrir job
- registrar hora
- aprovar peca
- emitir faturamento

### 4. Escala e bulk action desde cedo

Como o produto e ERP, listas grandes sao inevitaveis. O frontend deve nascer preparado para:
- filtros persistentes
- colunas configuraveis
- ordenacao
- busca
- selecao em massa
- exportacao
- acoes em lote

### 5. Cliente externo com experiencia simplificada

O portal do cliente deve ser uma camada mais limpa e mais guiada do que o backoffice.

## Macroarquitetura de navegacao

## Navegacao principal interna

Sidebar sugerida:

1. Home
2. CRM
3. Clientes
4. Contratos
5. Projetos
6. Jobs e Briefings
7. Criacao e Aprovacoes
8. Midia
9. Financeiro
10. Timesheet e Capacidade
11. Relatorios
12. Fornecedores
13. Base de Conhecimento
14. Configuracoes

### Navegacao secundaria contextual

Cada modulo principal deve abrir subnavegacao propria, por exemplo:

`Clientes`
- lista
- onboarding
- marcas
- contatos
- acessos
- documentos
- SLA

`Projetos`
- portfolio
- calendario
- Kanban
- timeline
- capacidade

`Financeiro`
- faturamento
- receber
- pagar
- despesas
- categorias
- margem
- fluxo de caixa

## Shell da aplicacao

### Sidebar

Deve suportar:
- estado expandido e compacto
- agrupamento por secao
- itens fixos de alta frequencia
- contador de pendencias
- destaque do modulo ativo

### Header

Deve conter:
- busca global
- seletor de contexto quando necessario
- central de notificacoes
- quick actions
- menu do usuario

### Quick actions

Atalhos globais desejados:
- novo lead
- novo cliente
- novo job
- novo projeto
- novo contrato
- registrar hora
- subir arquivo

## Tipos de tela que o frontend precisa suportar

O produto precisa de um conjunto consistente de "moldes" de tela.

### 1. Lista operacional

Para:
- leads
- clientes
- contratos
- jobs
- usuarios
- faturas

Padrao:
- header com titulo, contadores e acoes
- barra de filtros
- tabela com colunas configuraveis
- paginacao
- acoes por linha
- selecao em massa

### 2. Kanban

Para:
- oportunidades
- jobs
- aprovacoes
- pipeline de solicitacoes

Padrao:
- colunas por status
- drag and drop
- badges de prazo, prioridade e responsavel
- filtros no topo

### 3. Tela detalhe

Para:
- cliente
- contrato
- projeto
- campanha
- ativo criativo

Padrao:
- cabecalho com titulo, status e acoes
- abas
- coluna principal com conteudo
- coluna lateral com contexto, metadados, atividade e proximos passos

### 4. Formularios longos

Para:
- onboarding
- contrato
- briefing
- cadastro de fornecedor

Padrao:
- secoes agrupadas
- progresso visual
- salvamento parcial
- validacao clara
- resumo fixo lateral em desktop quando necessario

### 5. Painel de prova/aprovacao

Para:
- imagem
- PDF
- video
- web preview

Padrao:
- viewer central
- lista de versoes
- comentarios ancorados
- checklist
- decisao de aprovacao
- historico

### 6. Dashboard

Para:
- diretoria
- atendimento
- midia
- financeiro
- cliente

Padrao:
- filtros globais
- cards KPI
- graficos
- tabelas resumidas
- alertas
- blocos de acao

## Mapa de modulos e telas do frontend

## 1. Home

### Objetivo

Ser ponto de entrada operacional, nao pagina vazia.

### Telas

- dashboard por perfil
- central de pendencias
- agenda do dia
- indicadores principais
- feed de atividade relevante

### Variantes por perfil

`DIRETOR`
- receita
- margem
- forecast
- clientes em risco
- budget estourado
- contratos vencendo

`ATENDIMENTO`
- jobs atrasados
- briefings pendentes
- aprovacoes aguardando cliente
- follow-ups
- SLA em risco

`MIDIA`
- pacing
- campanhas em risco
- budget consumido
- alertas de performance

`FINANCEIRO`
- receber hoje
- receber vencido
- pagar hoje
- repasses pendentes
- previsao de caixa

## 2. CRM e Comercial

### Telas

- lista de leads
- detalhe do lead
- lista de oportunidades
- pipeline Kanban
- agenda de atividades
- proposta
- tela de conversao em cliente/contrato/projeto

### Componentes-chave

- cards de etapa
- timeline de interacoes
- agenda/follow-up
- score visual
- drawer rapido para registrar contato

## 3. Clientes e Onboarding

### Telas

- lista de clientes
- detalhe do cliente
- marcas/unidades
- contatos
- acessos e credenciais operacionais
- onboarding checklist
- documentos
- SLA e politicas

### Componentes-chave

- cabecalho do cliente com saude e status contratual
- abas por dominio
- checklist de onboarding com progresso
- bloco de acessos sensiveis com permissao adequada

## 4. Contratos, Propostas e Escopo

### Telas

- lista de contratos
- detalhe do contrato
- proposta
- itens do contrato
- vigencia e reajuste
- aditivos
- change requests
- alertas contratuais

### Componentes-chave

- resumo financeiro
- linha do tempo contratual
- diff de alteracoes
- status de aprovacao

## 5. Projetos, Jobs e Campanhas

### Telas

- portfolio de projetos
- detalhe do projeto
- detalhe do job
- Kanban de tarefas
- calendario
- timeline/Gantt
- milestones
- riscos e impedimentos

### Componentes-chave

- health badge
- progresso de prazo e horas
- relacao planejado vs realizado
- feed de atividade

## 6. Atendimento, Briefing e Solicitacoes

### Telas

- inbox de solicitacoes
- abertura de job
- builder de briefing por template
- triagem
- aprovacao de briefing

### Componentes-chave

- template selector
- validacoes obrigatorias antes de enviar
- prioridade e SLA destacados
- historico da solicitacao

## 7. Criacao e Aprovacoes

### Telas

- biblioteca de assets
- detalhe do asset
- viewer de prova
- comparacao de versoes
- fila de aprovacoes
- aprovacoes pendentes por usuario

### Componentes-chave

- comentario contextual
- checklist de conformidade
- status por etapa
- decisao aprovar / aprovar com ressalva / rejeitar
- historico com data, usuario e observacao

## 8. Midia e Execucao

### Telas

- plano de midia
- budgets por canal
- pacing
- placements
- ordens de insercao
- reconciliacao
- biblioteca de UTM

### Componentes-chave

- tabelas densas com agregacao
- visual de budget planejado vs realizado
- alertas de pacing
- timeline de alteracoes de budget

## 9. Performance, BI e Analytics

### Telas

- dashboard executivo
- dashboard por cliente
- dashboard por campanha
- relatorios customizaveis
- widgets configuraveis
- historico de snapshots

### Componentes-chave

- filtros globais persistentes
- comparacao por periodo
- graficos de tendencia
- cards com delta
- exportacao

## 10. Financeiro operacional

### Telas

- faturamento
- contas a receber
- contas a pagar
- despesas
- repasses
- fluxo de caixa
- margem e rentabilidade

### Componentes-chave

- tabela com soma por rodape
- status financeiro forte
- drawer de baixa/confirmacao
- resumo por cliente/projeto/canal

## 11. Fornecedores e Freelas

### Telas

- lista de fornecedores
- detalhe
- solicitacao de cotacao
- comparativo de propostas
- ordem de compra
- invoices
- avaliacao

## 12. Timesheet, Capacidade e Rentabilidade

### Telas

- meu timesheet
- timesheet do time
- workload
- capacidade futura
- alocacao por pessoa
- rentabilidade por cliente/projeto

### Componentes-chave

- timer
- lancamento rapido manual
- heatmap de carga
- comparativo capacidade vs alocacao

## 13. RH operacional

### Telas

- pessoas
- squads
- cargos e senioridades
- ferias e ausencias
- metas

## 14. Portal do cliente

### Objetivo

Ser simples, limpo e seguro. Menos densidade e menos decisoes por tela do que o backoffice.

### Telas

- home do cliente
- abrir solicitacao
- acompanhar jobs
- enviar briefing
- aprovar pecas
- acessar documentos
- consultar calendario
- ver dashboards

### Regras de UX

- linguagem clara
- menos menu
- menos colunas
- destaque para pendencias e aprovacoes
- fluxo mobile-first para aprovacao

## 15. Base de conhecimento

### Telas

- wiki
- playbooks
- templates
- assets reutilizaveis
- brand books

## 16. Configuracoes e administracao

### Telas

- usuarios
- papeis e permissoes
- campos customizados
- status customizados
- templates
- taxonomias
- motivos padrao
- configuracoes de marca
- logs de auditoria

## 17. Compliance e auditoria

### Telas

- trilha de auditoria
- logs de acesso
- consentimentos
- retencao de dados
- exportacao/exclusao quando aplicavel

## Padroes transversais obrigatorios

## Busca global

Deve localizar rapidamente:
- cliente
- lead
- projeto
- job
- contrato
- usuario
- documento

## Filtros persistentes

Filtros devem persistir por rota quando fizer sentido, especialmente em:
- listas
- dashboards
- views de workload
- aprovacoes

## Activity log

Entidades criticas precisam mostrar:
- quem fez
- o que mudou
- quando mudou
- contexto

## Anexos e arquivos

Toda entidade de negocio relevante deve prever:
- upload
- preview quando possivel
- download
- versionamento quando aplicavel

## Comentarios

Comentarios devem existir como padrao em:
- projetos
- jobs
- briefings
- contratos
- assets

## Notificacoes

Tipos principais:
- tarefa atribuida
- SLA em risco
- aprovacao pendente
- comentario mencionado
- budget estourando
- contrato vencendo
- pagamento pendente

## Estados de interface

Toda tela relevante deve prever explicitamente:
- loading inicial
- loading parcial
- vazio
- erro
- sem permissao
- offline ou integracao indisponivel quando aplicavel

## Responsividade

O ERP nao precisa ser "mobile completo" no backoffice, mas precisa ser responsivo de forma pragmatica.

### Desktop

Principal ambiente de uso para:
- listas densas
- financeiro
- contratos
- dashboards analiticos
- planejamento

### Tablet

Bom suporte para:
- acompanhamento
- revisao
- reunioes
- aprovacoes

### Mobile

Prioridade real para:
- aprovacoes
- notificacoes
- agenda
- consultas rapidas
- registrar hora
- acompanhar jobs

## Arquitetura recomendada do frontend

## Estrutura funcional sugerida

O frontend deve evoluir para uma estrutura por dominio:

- `src/app`
- `src/modules/auth`
- `src/modules/home`
- `src/modules/crm`
- `src/modules/clients`
- `src/modules/contracts`
- `src/modules/projects`
- `src/modules/jobs`
- `src/modules/creative`
- `src/modules/media`
- `src/modules/finance`
- `src/modules/timesheet`
- `src/modules/reports`
- `src/modules/vendors`
- `src/modules/settings`
- `src/modules/portal`
- `src/shared`

## Camadas

- `api`: clientes HTTP e contratos
- `models`: tipos de dominio
- `pages`: entradas de rota
- `components`: blocos reutilizaveis
- `features`: fluxos compostos por modulo
- `hooks`: comportamento reutilizavel
- `state`: estado local/global por dominio

## Design system minimo

Componentes que precisam existir de forma padronizada:

- button
- input
- textarea
- select
- checkbox
- radio
- switch
- date picker
- money input
- phone input
- cpf/cnpj input
- file uploader
- avatar
- badge
- tabs
- breadcrumb
- table
- data grid toolbar
- pagination
- drawer
- modal
- confirm dialog
- toast
- empty state
- skeleton
- metric card
- chart wrapper
- activity timeline
- comment thread
- approval action bar

## Roadmap recomendado para frontend

## Fase 1. Base e consistencia

- corrigir encoding e textos quebrados
- consolidar layout base
- criar design tokens
- padronizar componentes de formulario e tabela
- criar shell com navegacao escalavel
- estruturar modulos por dominio

## Fase 2. MVP operacional alinhado ao backend

- auth
- home por perfil
- CRM
- clientes
- contratos
- projetos/jobs
- usuarios
- portal basico

## Fase 3. Operacao com controle

- timesheet
- capacidade
- financeiro basico
- dashboards executivos
- logs e auditoria visual

## Fase 4. Diferencial de agencia

- aprovacao criativa
- proofing
- portal do cliente mais maduro
- comparacao de versoes
- workflows de aprovacao

## Fase 5. Midia e performance

- plano de midia
- pacing
- reconciliacao
- analytics e dashboards avancados

## Criterios de aceite para cada novo modulo de frontend

Todo modulo novo deve nascer com:
- lista funcional
- detalhe funcional
- formulario funcional
- loading, empty e erro
- filtro e busca
- permissao por perfil
- feedback visual de sucesso/erro
- links entre entidades relacionadas

Se a entidade for critica para operacao, deve incluir tambem:
- atividade/historico
- anexos
- comentarios
- exportacao

## Fontes pesquisadas para direcionamento visual e funcional

- Productive home e plataforma:
  - https://productive.io/
- Productive profitability:
  - https://productive.io/profitability/
- Productive resource planning:
  - https://productive.io/resource-planning/
- Productive agency management:
  - https://productive.io/industries/agency-management-software/
- Workamajig plataforma:
  - https://www.workamajig.com/
- Workamajig project management:
  - https://www.workamajig.com/project-management-software
- Workamajig resourcing and scheduling:
  - https://www.workamajig.com/project-management-software/resource-management
- PageProof online proofing:
  - https://pageproof.com/
- PageProof client collaboration:
  - https://pageproof.com/client-collaboration-software
- Wrike online proofing:
  - https://www.wrike.com/features/online-proofing

## Sintese final

O frontend do JAQ Studio nao deve ser desenhado como um painel administrativo generico.

Ele deve ser construido como:
- sistema operacional de agencia
- cockpit de operacao
- area de colaboracao criativa
- camada executiva de margem, capacidade e performance
- portal simplificado para cliente externo

Se backend e frontend seguirem este documento em paralelo, o produto tende a crescer com coerencia estrutural e sem virar uma colecao de CRUDs desconexos.
