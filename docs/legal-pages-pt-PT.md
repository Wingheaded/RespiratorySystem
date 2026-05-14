# Legal Pages — pt-PT (Corpus3D / Respira3D)

**Source of truth** for the three legal pages and the first-launch modal. All copy is in pt-PT. Drop these into the app's routes when implementing FR-attached items in PRD §15 and §8.

Routes:

- `/aviso-legal` → § 2 below
- `/creditos` → § 3 below
- `/privacidade` → § 4 below
- First-launch modal → § 1 below (dismissable, persisted to `localStorage` key `corpus3d.disclaimerAccepted`)

Footer link: `Aviso Legal · Créditos · Privacidade` — visible on every screen.

---

## 1. First-Launch Modal

**Title:** Bem-vindo(a) ao Corpus3D

**Body:**

> Esta aplicação destina-se a alunos do 2.º e 3.º ciclos do ensino básico (11–14 anos) e tem fins exclusivamente educativos.
>
> Vais explorar o sistema respiratório através de modelos 3D interativos e imagens médicas reais (raios-X, microscopia, entre outras). Estas imagens servem para ilustrar a anatomia e fisiologia do corpo humano — **não substituem aconselhamento médico** e não devem ser usadas para diagnóstico.
>
> Algumas imagens mostram efeitos do tabagismo nos pulmões. O objetivo é educativo — sensibilizar para riscos para a saúde.
>
> Todas as imagens utilizadas estão em domínio público ou abrangidas por licenças Creative Commons, com a devida atribuição na secção **Créditos**.

**Buttons:**

- Primary: **Compreendi, vamos começar**
- Secondary: **Ler Aviso Legal completo** → links to `/aviso-legal`

---

## 2. Aviso Legal (`/aviso-legal`)

### Aviso Legal

**Última atualização:** [DATA DE LANÇAMENTO]

#### 1. Finalidade da aplicação

O Corpus3D é uma aplicação educativa destinada a alunos do 2.º e 3.º ciclos do ensino básico (11–14 anos), com foco no ensino da anatomia e fisiologia humanas através de modelos tridimensionais interativos.

#### 2. Sem aconselhamento médico

A informação apresentada nesta aplicação tem natureza estritamente educativa. **Não constitui aconselhamento médico, diagnóstico ou tratamento.** Para questões de saúde, deve sempre consultar um profissional de saúde qualificado.

#### 3. Imagens médicas reais

Esta aplicação utiliza imagens médicas reais (raios-X, ressonância magnética, microscopia eletrónica, fotografias de patologia) com o objetivo de complementar os modelos 3D estilizados. Estas imagens:

- São apresentadas exclusivamente para fins educativos
- Foram obtidas de fontes públicas ou abrangidas por licenças Creative Commons
- São apresentadas com a devida atribuição na secção **Créditos**
- Em nenhum caso identificam pacientes individuais

#### 4. Imagens de patologia

Algumas imagens mostram condições patológicas (por exemplo, pulmões afetados por tabagismo). O objetivo destas imagens é sensibilizar para riscos para a saúde. Sempre que possível, é apresentada primeiro uma representação 3D estilizada, sendo a imagem real visível mediante ação explícita do utilizador.

#### 5. Limitação de responsabilidade

O desenvolvedor desta aplicação não se responsabiliza por:

- Decisões tomadas com base na informação apresentada
- Eventuais imprecisões científicas — embora a aplicação tenha sido revista para alinhamento com o currículo nacional, podem existir erros
- Reações emocionais ao conteúdo educativo (incluindo imagens de patologia)

#### 6. Adequação à idade

A aplicação foi concebida para a faixa etária 11–14 anos. O acompanhamento de um adulto (pai, mãe, encarregado de educação ou professor) é recomendado em primeira utilização.

#### 7. Contacto

Para questões, sugestões ou correções, contactar: **[EMAIL DE CONTACTO]**

#### 8. Lei aplicável

Este aviso legal é regido pela lei portuguesa.

---

## 3. Créditos (`/creditos`)

### Créditos e Atribuições

Esta aplicação só é possível graças ao trabalho de muitas pessoas e instituições que disponibilizam os seus recursos sob licenças abertas.

#### Modelos 3D

| Modelo | Fonte | Licença |
|--------|-------|---------|
| Sistema respiratório (principal) | [FONTE — preencher após download] | [LICENÇA] |
| Pulmão de fumador (variante) | [FONTE — preencher após download] | [LICENÇA] |
| Silhueta torácica (blueprint) | [FONTE — preencher após download] | [LICENÇA] |

#### Imagens Médicas Reais

| Imagem | Fonte | Licença |
|--------|-------|---------|
| Raio-X de tórax (frontal) | NIH ChestX-ray14 Dataset | Domínio Público |
| Broncoscopia | Wikimedia Commons — [autor] | CC-BY-SA |
| Microscopia eletrónica de alvéolos | Wikimedia Commons — [autor] | CC-BY-SA |
| Pulmão de fumador (patologia) | CDC Public Health Image Library | Domínio Público |
| TAC torácica (corte transversal) | Radiopaedia — [caso #] | CC-BY-NC-SA |

#### Sons

| Som | Fonte | Licença |
|-----|-------|---------|
| Chime de sucesso | [FONTE] | CC0 |
| "Boop" de erro | [FONTE] | CC0 |
| Fanfarra de conclusão | [FONTE] | CC0 |

#### Software e Bibliotecas

Esta aplicação foi construída com software de código aberto. As principais bibliotecas e respetivas licenças estão listadas em `LICENSES.md` no repositório do projeto.

#### Tipografia

- **Manrope** — SIL Open Font License 1.1
- **Inter** — SIL Open Font License 1.1

#### Agradecimentos especiais

- Database Center for Life Science (DBCLS) — pelo BodyParts3D (utilizado como referência anatómica)
- NIH 3D Print Exchange — pela biblioteca de modelos anatómicos em domínio público
- Comunidade Three.js / React Three Fiber

---

## 4. Política de Privacidade (`/privacidade`)

### Política de Privacidade

**Última atualização:** [DATA DE LANÇAMENTO]

#### Resumo simples

**Esta aplicação não recolhe, armazena nem transmite quaisquer dados pessoais.** Toda a aprendizagem acontece localmente no teu dispositivo.

#### Detalhe

##### O que NÃO fazemos

- ❌ Não pedimos nome, email ou qualquer informação de identificação
- ❌ Não usamos cookies de rastreamento
- ❌ Não temos contas de utilizador
- ❌ Não recolhemos analítica de utilização
- ❌ Não partilhamos dados com terceiros (porque não temos dados)
- ❌ Não usamos serviços de terceiros que recolham dados (Google Analytics, Facebook Pixel, etc.)

##### O que guardamos localmente no teu dispositivo

A aplicação guarda algumas preferências no armazenamento local do navegador (`localStorage`) para melhorar a tua experiência:

- Aceitação do aviso de primeira utilização
- Estado do som (ligado/desligado)
- Última parte visualizada (para retomar onde paraste)

**Estes dados nunca saem do teu dispositivo.** Podes apagá-los a qualquer momento limpando os dados do navegador.

##### Modo offline

Esta aplicação funciona offline (sem internet). Os modelos 3D, imagens e textos são guardados no teu dispositivo na primeira utilização, num espaço chamado *cache* do navegador. Estes ficheiros não contêm dados pessoais — apenas o conteúdo educativo da aplicação.

##### Crianças e adolescentes

A aplicação foi concebida para utilizadores entre 11 e 14 anos. Por não recolhermos dados, não há tratamento específico ao abrigo do RGPD para menores.

##### Os teus direitos

Como não temos dados teus, não há nada para aceder, retificar ou apagar. Para apagar as preferências locais, basta limpar os dados do navegador para este site.

##### Alterações a esta política

Se esta política mudar (por exemplo, se adicionarmos contas de utilizador no futuro), serás avisado(a) na primeira utilização após a alteração.

##### Contacto

Para qualquer questão sobre privacidade: **[EMAIL DE CONTACTO]**

---

## Implementation Notes (for developer)

- Pages 2/3/4 are static markdown rendered through a single `<LegalPage>` component reading from `src/content/legal/{aviso,creditos,privacidade}.md` via `?raw` import + a markdown renderer (`react-markdown`).
- First-launch modal: `<DisclaimerModal>` mounted in App root; check `localStorage.getItem('corpus3d.disclaimerAccepted')` on mount; setter on dismiss.
- All four entries above must pass the same pt-PT review process as the educational copy (PRD §12).
- Replace `[DATA DE LANÇAMENTO]`, `[EMAIL DE CONTACTO]`, and the placeholder rows in the Créditos table with real values before public launch.
- Add a "Versão da aplicação: x.y.z" footer line on `/aviso-legal` for support traceability.
