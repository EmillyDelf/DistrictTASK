# CONTRATO DE INTEGRAÇÃO — BACKEND E FRONTEND
## Projeto District Task

### 1. Objetivo

Este contrato tem como objetivo estabelecer os requisitos técnicos e as responsabilidades necessárias para a integração entre o backend e o frontend do projeto District Task, garantindo compatibilidade entre as operações, padronização dos dados e comunicação adequada entre as partes.

### 2. Responsabilidades

**Desenvolvedora 1 — Backend**
- Implementar e manter as operações de autenticação e gerenciamento de tarefas.
- Garantir a persistência dos dados no MongoDB Atlas.
- Disponibilizar as Server Actions e seus respectivos tipos.
- Garantir que cada usuário tenha acesso exclusivamente às próprias tarefas.
- Documentar os parâmetros, retornos e regras de utilização das operações.
- Corrigir eventuais problemas identificados durante a integração.

**Desenvolvedora 2 — Frontend**
- Desenvolver a interface utilizando os recursos disponibilizados pelo backend.
- Consumir as Server Actions conforme os contratos documentados.
- Respeitar os tipos de dados e os formatos de retorno estabelecidos.
- Implementar os estados de carregamento, sucesso e erro na interface.
- Comunicar incompatibilidades ou problemas encontrados durante a integração.

### 3. Contrato das operações de tarefas

O backend disponibilizará as seguintes operações:

| Operação | Função | Entrada |
|---|---|---|
| Criar tarefa | `createTask` | `CreateTaskInput` |
| Listar tarefas | `getTasks` | Nenhuma |
| Atualizar tarefa | `updateTask` | `UpdateTaskInput` |
| Excluir tarefa | `deleteTask` | `taskId: string` |

As funções estarão localizadas em:

`src/app/actions/task-actions.ts`

Os tipos compartilhados estarão disponíveis em:

`src/types/task.ts`

### 4. Padronização dos dados

Os valores aceitos para os campos de domínio serão:

**Status:**
- `pendente`
- `completa`

**Prioridade:**
- `baixa`
- `média`
- `alta`

As datas recebidas e retornadas deverão respeitar os formatos definidos nos tipos compartilhados e nas operações do backend.

O objeto de tarefa retornado pelo backend utilizará o formato `SerializedTask`.

### 5. Regras de segurança

- Todas as operações de gerenciamento de tarefas exigem autenticação.
- O identificador do usuário será obtido pelo backend por meio da sessão autenticada.
- O frontend não deverá enviar `userId` para definir o proprietário de uma tarefa.
- A listagem deverá retornar somente as tarefas pertencentes ao usuário autenticado.
- Atualizações e exclusões deverão verificar a propriedade da tarefa antes de executar a operação.
- Informações sensíveis e credenciais não deverão ser expostas no frontend.

### 6. Tratamento dos retornos

As operações utilizarão os formatos de sucesso e erro definidos em `src/types/task.ts`.

O frontend deverá verificar o resultado antes de acessar os dados retornados, distinguindo respostas de sucesso de respostas contendo erro.

As mensagens de erro deverão ser apresentadas de maneira adequada ao usuário, sem expor detalhes internos do servidor ou do banco de dados.

### 7. Comunicação e alterações

Qualquer alteração nas assinaturas das funções, nos tipos compartilhados ou nas regras de negócio deverá ser comunicada antes de ser incorporada à integração.

Alterações que afetem o contrato deverão ser documentadas e disponibilizadas à outra desenvolvedora.

Problemas identificados durante a integração deverão ser comunicados com informações suficientes para reprodução e correção.

### 8. Critérios para conclusão da integração

A integração será considerada concluída quando:

- O frontend conseguir criar tarefas utilizando `createTask`.
- O frontend conseguir listar as tarefas utilizando `getTasks`.
- O frontend conseguir atualizar tarefas utilizando `updateTask`.
- O frontend conseguir excluir tarefas utilizando `deleteTask`.
- Os estados de sucesso, carregamento e erro forem tratados adequadamente.
- Os dados permanecerem associados ao usuário autenticado.
- Não houver incompatibilidades entre os tipos compartilhados e os dados utilizados pelo frontend.
- As operações forem validadas em conjunto pelas duas desenvolvedoras.

### 9. Considerações finais

Este contrato estabelece a referência técnica para a comunicação entre backend e frontend do District Task.

Seu objetivo é evitar divergências de implementação, reduzir retrabalho e assegurar que ambas as partes desenvolvam suas responsabilidades de maneira compatível.