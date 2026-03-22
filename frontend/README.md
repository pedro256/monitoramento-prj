# 📡 Projeto: Sistema de Administração de CLPs (Indústria)

## 🎯 Objetivo do Projeto

Desenvolver um sistema completo para **recebimento, processamento, armazenamento e visualização de dados industriais** provenientes de CLPs (Controladores Lógicos Programáveis).

O sistema deverá ser capaz de lidar com **dados em tempo real**, com foco em:

* escalabilidade
* organização
* performance
* visualização clara

---

# 🧠 Contexto do Problema

Em ambientes industriais, CLPs enviam constantemente informações sobre o estado da operação. Esses dados podem chegar em diferentes frequências e volumes, exigindo uma arquitetura preparada para:

* alto volume de escrita
* processamento eficiente
* visualização quase em tempo real

---

# 📦 Tipos de Dados

Os CLPs podem enviar informações categorizadas como:

## 🔘 Estados

* Representam condições atuais (booleanos ou discretos)
* Exemplo:

```json
{ "motor_ligado": true }
```

---

## 📊 Leituras (Telemetria)

* Valores contínuos e numéricos
* Exemplo:

```json
{ "temperatura": 72.5, "pressao": 1.2 }
```

---

## ⚡ Eventos

* Ações ou ocorrências relevantes
* Exemplo:

```json
{ "evento": "PARTIDA_MOTOR" }
```

---

## 🚨 Alarmes

* Situações críticas ou anormais
* Exemplo:

```json
{ "alarme": "SOBRECARGA", "nivel": "ALTO" }
```

---

# 🧩 Funcionalidades do Sistema

## 📁 Gestão de Estrutura

* [ ] Manter **Organizações**
* [ ] Manter **Dispositivos (CLPs)**
* [ ] Associar dispositivos a organizações

---

## 📥 Ingestão de Dados

* [ ] Endpoint HTTP para recebimento de dados
* [ ] Validação dos dados recebidos
* [ ] Inserção de:

  * estados
  * leituras
  * eventos
  * alarmes

---

## 📊 Visualização

* [ ] Dashboard simples com:

  * últimos valores
  * gráficos de leitura
  * status atual
* [ ] Tela detalhada por CLP
* [ ] Histórico de eventos e alarmes

---

# 🏗️ Arquitetura Proposta

```txt
CLP → API (.NET) → CACHE/FILA → PROCESSADOR → BANCO (Supabase)
                                      ↓
                                  Next.js (Dashboard)
```

---

# ⚙️ Tecnologias Obrigatórias

## 🖥️ Backend

* .NET (API de ingestão)
* Responsável por:

  * receber dados dos CLPs
  * validar payload
  * enviar para fila/cache

---

## 🧠 Banco de Dados

* Supabase (PostgreSQL)
* Armazenamento de:

  * dispositivos
  * telemetria
  * eventos
  * alarmes

---

## 🌐 Frontend

* Next.js
* Responsável por:

  * dashboards
  * visualização em tempo real (ou quase)
  * UX amigável

---

# 🚀 Estratégias Técnicas (IMPORTANTE)

## 🔥 1. Inserção em Lote (Batch Insert)

Evitar:

```txt
1 request → 1 insert
```

Preferir:

```txt
100 registros → 1 insert
```

---

## ⚡ 2. Uso de Cache/Fila

Objetivo:

* reduzir carga no banco
* absorver picos de requisição

Sugestões:

* Redis (lista/queue)
* ou fila simples em memória

---

## 🧊 3. Cache de Último Estado

* Manter estado atual do dispositivo em cache
* Evitar consultas constantes ao banco

---

## 📈 4. Modelagem de Dados

Evitar:

* tabelas com muitas colunas fixas

Preferir:

* modelo flexível (key-value ou JSON)

---

## ⏱️ 5. Indexação

Fundamental:

```sql
(device_id, timestamp)
```

---

# 📡 Exemplo de Payload

```json
{
  "device_id": "CLP-01",
  "timestamp": "2026-03-22T14:00:00Z",
  "states": {
    "motor_ligado": true
  },
  "telemetry": {
    "temperatura": 72.5,
    "pressao": 1.2
  },
  "events": [
    {
      "type": "INFO",
      "description": "Motor iniciado"
    }
  ],
  "alarms": [
    {
      "type": "CRITICO",
      "description": "Sobrecarga"
    }
  ]
}
```

---

# 🧪 Desafios Propostos (Nível Acadêmico)

## 🟢 Nível 1 – Básico

* [ ] CRUD de organizações e dispositivos
* [ ] Endpoint de ingestão funcionando
* [ ] Dashboard simples

---

## 🟡 Nível 2 – Intermediário

* [ ] Implementar cache com Redis
* [ ] Inserção em lote
* [ ] Gráficos de telemetria
* [ ] Filtro por período

---

## 🔴 Nível 3 – Avançado

* [ ] Simulação de múltiplos CLPs (carga)
* [ ] Rate limiting na API
* [ ] Sistema de alertas em tempo real
* [ ] WebSocket ou polling para atualização

---

## 🧠 Nível 4 – Engenharia (Diferencial)

* [ ] Particionamento de tabela por data
* [ ] Sistema de retry (fila)
* [ ] Detecção de anomalias (ex: temperatura alta)
* [ ] Auditoria de dados

---

# ⚠️ Pontos Críticos do Projeto

* Volume de dados cresce MUITO rápido
* Escrita é mais crítica que leitura
* Dados podem vir desorganizados
* CLP pode enviar dados duplicados
* Latência e perda de dados são reais

---

# 🎯 Critérios de Avaliação

* Organização do código
* Clareza da arquitetura
* Performance na ingestão
* Modelagem de banco
* Qualidade da visualização
* Tratamento de erros

---

# 💡 Extras (Para se destacar)

* Implementar autenticação por dispositivo
* Criar documentação da API (Swagger)
* Adicionar logs estruturados
* Criar testes automatizados
* Deploy em ambiente real

---

# 🧾 Conclusão

Este projeto simula um cenário real de sistemas industriais/IoT, exigindo:

* pensamento arquitetural
* preocupação com escala
* boas práticas de backend e frontend

Mais do que “fazer funcionar”, o objetivo é construir algo **robusto e evolutivo**.

---

🚀 *Desafio final: seu sistema aguentaria 100 requisições por segundo?*
