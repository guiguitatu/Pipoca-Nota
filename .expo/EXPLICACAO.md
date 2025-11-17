## Visão geral do app

O **Pipoca Nota** é um app em React Native (Expo) para:
- **Autenticar usuários localmente** (cadastro, login, logout) usando `AsyncStorage`.
- **Buscar filmes na API do TMDb** (The Movie Database) e exibir detalhes.
- **Permitir que o usuário avalie filmes** e salve uma lista de filmes assistidos.
- **Aplicar tema claro/escuro** em toda a interface, lembrando a preferência do usuário.

A seguir, cada parte importante do app é explicada em detalhes, com foco em:
- **Como o modo escuro é salvo e aplicado**
- **Como a busca de filmes funciona na TMDb**
- **Como usuários e filmes assistidos são salvos localmente**
- **Como funciona a navegação entre telas**

---

## Estrutura principal (`App.tsx`)

O arquivo `App.tsx` é o ponto de entrada do app. Nele são configurados os *providers* de contexto e a navegação:

- **`ThemeProvider`**: controla tema claro/escuro.
- **`AuthProvider`**: controla usuário logado e sessão.
- **`MoviesProvider`**: controla os filmes assistidos e notas.
- **`NavigationContainer` + `RootNavigator`**: definem as telas e a navegação.

Fluxo:
1. `App` renderiza o `ThemeProvider`, depois `AuthProvider`, depois `MoviesProvider` e, por fim, o `AppInner`.
2. `AppInner` chama `useThemePreference()` para obter:
   - `navigationTheme`: tema a ser usado pelo `NavigationContainer`.
   - `statusBarStyle`: estilo da barra de status (clara ou escura).
3. O `NavigationContainer` recebe o `navigationTheme` e renderiza o `RootNavigator`, que cuida de qual tela o usuário verá (login, cadastro, abas principais, detalhes do filme etc.).

---

## Tema claro/escuro e salvamento no dispositivo (`ThemeContext.tsx`)

O tema do app é controlado pelo `ThemeContext`.

### Paleta de cores

O contexto define duas paletas:
- **`lightPalette`**: cores usadas no modo claro (fundo claro, texto escuro, etc.).
- **`darkPalette`**: cores usadas no modo escuro (fundo escuro, texto claro, etc.).

Essas paletas têm chaves como:
- `background`, `surface`, `overlay`
- `text`, `textMuted`
- `border`, `primary`, `danger`
- `inputBackground`, `inputText`, `inputPlaceholder`
- `listItem`, `card`

Essas cores são usadas pelas telas para garantir consistência visual.

### Como o app decide o tema inicial

No `ThemeProvider`:
1. Ele pega o tema do sistema com `Appearance.getColorScheme()`:
   - Se o sistema estiver em **dark**, o estado inicial `mode` é `'dark'`.
   - Caso contrário, começa como `'light'`.
2. Em seguida, um `useEffect` é executado para tentar carregar a preferência salva no dispositivo:
   - Lê de `AsyncStorage` a chave **`pipoca_nota_theme_mode`**.
   - Se o valor salvo for `'light'` ou `'dark'`, esse valor substitui o do sistema.

Resultado: mesmo que o tema do sistema mude, se o usuário tiver escolhido manualmente um tema, **essa escolha é respeitada e restaurada** quando o app é aberto novamente.

### Como o modo escuro é salvo

Ainda em `ThemeProvider`, existe a função:

- **`setDark(enabled: boolean)`**:
  - Se `enabled` for `true`, define `mode = 'dark'`.
  - Se `enabled` for `false`, define `mode = 'light'`.
  - Atualiza o estado `mode` com `setMode(next)`.
  - Salva essa escolha no `AsyncStorage`:
    - Chave: **`pipoca_nota_theme_mode`**
    - Valor: `'dark'` ou `'light'`.

Assim, **sempre que o usuário altera o switch de modo escuro, o app grava essa preferência no armazenamento local**, e ela será usada nas próximas execuções.

### Uso do tema nas telas

O *hook* **`useThemePreference()`** retorna:
- `isDark`: se o tema atual é escuro.
- `mode`: `'light'` ou `'dark'`.
- `setDark`: função para ativar/desativar o modo escuro.
- `navigationTheme`: tema para o `NavigationContainer`.
- `statusBarStyle`: `'light'` ou `'dark'`.
- `colors`: a paleta de cores (`lightPalette` ou `darkPalette`).

As telas usam `colors` (chamado de `palette` no código) para pintar:
- Fundo das telas (`background`).
- Cartões/listas (`surface`, `listItem`, `card`).
- Textos (`text`, `textMuted`).
- Bordas, botões, campos de texto (`border`, `primary`, etc.).

### Exemplo prático: tela de perfil e o switch de modo escuro

Na `ProfileScreen`:
- O componente obtém `{ colors: palette, isDark, setDark }` do `useThemePreference()`.
- Renderiza um `Switch` de **“Modo escuro”** com:
  - `value={isDark}`: se o tema atual é escuro.
  - `onValueChange={value => { void setDark(value); }}`: quando o usuário alterna o switch, chama `setDark`.

Ao alternar o switch:
1. `setDark(true)` ou `setDark(false)` é chamado.
2. O `ThemeProvider` atualiza o estado interno `mode`.
3. A nova paleta de cores é calculada.
4. O valor `'dark'` ou `'light'` é salvo em `AsyncStorage` (chave `pipoca_nota_theme_mode`).
5. A UI é redesenhada com as novas cores em todas as telas.

---

## Autenticação e armazenamento de usuários (`AuthContext.tsx`)

O `AuthContext` é responsável por:
- **Cadastrar** um novo usuário.
- **Fazer login** de um usuário existente.
- **Manter a sessão ativa** entre aberturas do app.
- **Atualizar a foto de perfil**.
- **Sair da conta**.

### Onde os dados são salvos

São usadas duas chaves no `AsyncStorage`:
- **`pipoca_nota_users`**: lista de todos os usuários cadastrados.
- **`pipoca_nota_session`**: ID do usuário atualmente logado.

### Estrutura de usuário

Cada usuário (`StoredUser`) tem:
- `id`: string única (ex.: `u_1699999999999`).
- `name`: nome do usuário.
- `email`: e-mail.
- `password`: senha (armazenada em texto puro, apenas para fins de estudo/local).
- `profileImageUri`: URI da foto de perfil (opcional).
- `createdAt`: data de criação da conta.

### Carregando a sessão ao abrir o app

Quando o `AuthProvider` monta:
1. Executa `loadSession()` em um `useEffect`.
2. `loadSession()`:
   - Lê `pipoca_nota_session` do `AsyncStorage` (ID do usuário logado).
   - Lê `pipoca_nota_users` (lista de usuários).
   - Procura na lista o usuário com aquele ID.
   - Se encontrar, define `currentUser` com esse usuário.
3. Isso permite que, ao abrir o app, o usuário **permaneça logado** se já havia uma sessão ativa.

### Cadastro (`signUp`)

- Lê a lista de usuários em `pipoca_nota_users`.
- Verifica se já existe usuário com o mesmo e-mail (case-insensitive).
- Se já existir, mostra um `Alert` avisando que o e-mail está em uso.
- Se não existir:
  - Cria um novo objeto `StoredUser` com:
    - ID único.
    - Dados informados (nome, e-mail, senha, foto).
    - `createdAt` com a data atual.
  - Adiciona esse usuário na lista e salva em `pipoca_nota_users`.
  - Salva seu ID em `pipoca_nota_session`.
  - Atualiza `currentUser` para esse novo usuário (login automático após cadastro).

### Login (`signIn`)

- Lê a lista de usuários em `pipoca_nota_users`.
- Procura um usuário com:
  - E-mail igual ao digitado (ignora maiúsculas/minúsculas).
  - Senha exatamente igual.
- Se **não encontrar**, mostra `Alert` com erro de login.
- Se encontrar:
  - Salva o `id` desse usuário em `pipoca_nota_session`.
  - Define `currentUser` para este usuário.

### Logout (`signOut`)

- Remove `pipoca_nota_session` do `AsyncStorage`.
- Define `currentUser` como `null`.
- A navegação passa a mostrar novamente a tela de login.

### Atualizar foto de perfil (`updateProfileImage`)

- Verifica se há `currentUser`.
- Lê a lista de usuários de `pipoca_nota_users`.
- Encontra o usuário atual pelo `id`.
- Cria uma cópia do usuário com `profileImageUri` atualizado.
- Substitui na lista, salva a lista em `pipoca_nota_users`.
- Atualiza `currentUser` com os novos dados.

---

## Filmes assistidos e notas (`MoviesContext.tsx` e `WatchedScreen.tsx`)

O `MoviesContext` é usado para:
- Guardar a lista de filmes que o usuário marcou como assistidos.
- Salvar/atualizar a **nota dada** para cada filme.
- Remover filmes da lista.

### Onde os dados são salvos

Os filmes assistidos são salvos em `AsyncStorage` por **usuário**, usando uma chave que depende do ID do usuário:

- Função `watchedKeyForUser(userId)` gera:
  - `pipoca_nota_watched_${userId}`
  - Exemplo: `pipoca_nota_watched_u_1699999999999`

Assim, cada usuário tem sua própria lista de filmes assistidos separada.

### Estrutura de um filme assistido (`WatchedMovie`)

Cada item possui:
- `id`: ID do filme (número, mesmo ID usado pela TMDb).
- `title`: título do filme.
- `posterPath`: caminho da imagem do pôster (opcional).
- `rating`: nota que o usuário deu (0–10).
- `ratedAt`: data/hora em que a nota foi salva (string em ISO).

### Carregando a lista do usuário logado

Ao montar o `MoviesProvider`:
1. Lê `currentUser` do `AuthContext`.
2. Se não houver usuário logado, define `watched = []`.
3. Se houver usuário:
   - Lê do `AsyncStorage` a chave `pipoca_nota_watched_${currentUser.id}`.
   - Se existir, faz `JSON.parse` e coloca no estado `watched`.
   - Se não existir, começa com lista vazia.

### Salvando/atualizando nota de filme (`saveRating`)

Quando o usuário avalia um filme (por exemplo, na tela de detalhes):
1. `saveRating` recebe um objeto com:
   - `id`, `title`, `posterPath`, `rating` (sem `ratedAt`).
2. Verifica se já existe na lista um filme com esse `id`:
   - Se existir:
     - Clona a lista.
     - Atualiza o item existente com:
       - nova `rating`.
       - novo `ratedAt` (data atual).
   - Se não existir:
     - Adiciona um novo item com todos os campos + `ratedAt` atual.
3. Atualiza o estado `watched`.
4. Chama `persist(updated)` para salvar a nova lista em `AsyncStorage` na chave do usuário atual.

Assim, **todas as notas e filmes assistidos ficam guardados de forma persistente por usuário**.

### Removendo um filme da lista (`removeWatched`)

Quando o usuário toca em “Remover” em um filme na `WatchedScreen`:
1. É chamada a função `onRemove`, que chama `removeWatched(id, title)`.
2. `removeWatched`:
   - Filtra a lista `watched` removendo o filme com aquele `id`.
   - Atualiza o estado `watched`.
   - Salva a nova lista em `AsyncStorage`.
3. É exibido um `Alert` avisando que o filme foi removido.

### Exibição na tela `WatchedScreen`

- Usa o `useMovies()` para acessar `watched` e `removeWatched`.
- Usa `useThemePreference()` para aplicar as cores do tema.
- Mostra uma `FlatList` de filmes com:
  - Pôster (`TMDB_IMAGE_BASE + posterPath`).
  - Título.
  - Texto “Sua nota: X”.
  - Data em que foi avaliado, formatada com `toLocaleDateString()`.
  - Botão “Remover”.

---

## Busca de filmes na TMDb (`services/tmdb.ts` e `SearchScreen.tsx`)

O app utiliza a API do **TMDb (The Movie Database)** para buscar filmes e carregar detalhes.

> Obs.: No README do projeto existe instrução para configurar a chave de API em `src/config/tmdb.ts`/`.local.ts`. O código usa `TMDB_API_KEY_SAFE()` para obter essa chave de maneira segura.

### Configuração da API

Em `src/services/tmdb.ts`:
- `API_BASE = 'https://api.themoviedb.org/3'`
- `TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'` (base para imagens de pôster).
- Importa `TMDB_API_KEY_SAFE` de `src/config/tmdb`.

### Função de busca de filmes: `searchMovies(query: string)`

Passos:
1. Obtém a chave da API com `TMDB_API_KEY_SAFE()`.
   - Se não houver chave, retorna `[]`.
2. Monta a URL de busca:
   - Endpoint: `/search/movie`.
   - Parâmetros:
     - `query` com `encodeURIComponent(query)`.
     - `language=pt-BR` (resultados em português).
     - `include_adult=false`.
     - `api_key` com a chave também codificada.
3. Faz o `fetch(url)`.
4. Se a resposta não for `ok`, retorna `[]`.
5. Se for `ok`, faz `res.json()` e retorna `json.results ?? []`.

Ou seja, **a busca retorna diretamente a lista de filmes enviada pela API TMDb**.

### Função de detalhes de filme: `getMovieDetails(id: number)`

Passos:
1. Obtém a chave com `TMDB_API_KEY_SAFE()`.
2. Monta a URL:
   - Endpoint: `/movie/${id}`.
   - Parâmetros: `language=pt-BR`, `api_key=...`.
3. Faz o `fetch(url)`.
4. Se não for `ok`, retorna `null`.
5. Se for `ok`, retorna o `json` completo do filme.

Essa função é usada na tela de detalhes do filme (`MovieDetailsScreen`) para carregar informações mais completas e permitir avaliação.

### Tela de busca (`SearchScreen.tsx`)

- Usa `useState` para:
  - `query`: texto digitado no campo de busca.
  - `results`: array de filmes (resultado da API).
  - `loading`: indica se está carregando.
- Usa `useThemePreference()` para pegar `palette` (cores) e estilizar a tela.
- Usa `useNavigation` para navegar para a tela de detalhes ao tocar em um filme.

Fluxo de busca:
1. Função `onSearch(text: string)` é chamada a cada mudança no `TextInput`.
2. Atualiza `query` com o texto.
3. Se o texto tiver menos de 2 caracteres (após `trim`), limpa `results` e não chama a API.
4. Se tiver 2 ou mais caracteres:
   - Define `loading = true`.
   - Chama `searchMovies(text.trim())`.
   - Coloca o resultado em `results`.
   - Ao final, define `loading = false`.

Renderização:
- Um `TextInput` estilizado com as cores do tema atual.
- Uma `FlatList` que:
  - Usa `results` como dados.
  - Para cada item, mostra:
    - Pôster (usando `TMDB_IMAGE_BASE + item.poster_path`, se houver).
    - Título (`item.title`).
    - Overview (`item.overview`, limitado em linhas).
  - Quando o usuário toca em um item:
    - Navega para `Details` com:
      - `id`, `title`, `posterPath` do filme.
  - Quando não há resultados e não está carregando:
    - Mostra uma mensagem: “Digite para buscar filmes no catálogo TMDb.”

---

## Navegação entre telas (`RootNavigator.tsx`)

O `RootNavigator` usa dois tipos de navegação:
- **Stack Navigator** (fluxo de autenticação, detalhes).
- **Bottom Tab Navigator** (abas principais: Buscar, Assistidos, Perfil).

### Rotas principais do Stack

`RootStackParamList` define:
- `Auth`: tela de login.
- `Main`: abas principais.
- `Details`: detalhes de um filme (recebe `id`, `title`, `posterPath`).
- `Signup`: tela de cadastro.

### Lógica baseada em usuário logado

Dentro do `RootNavigator`:
- Ele lê `currentUser` do `useAuth()`.
- Se **não houver `currentUser`**:
  - Mostra a tela `Auth` (login) como principal.
  - No cabeçalho, coloca um botão “Cadastrar” que navega para `Signup`.
- Se **houver `currentUser`**:
  - Mostra:
    - `Main` (abas principais) sem cabeçalho.
    - `Details` (detalhes do filme).

Além disso, a rota `Signup` está sempre registrada, permitindo navegar para o cadastro.

### Abas principais (`MainTabs`)

As abas são:
- **Buscar** → `SearchScreen`
- **Assistidos** → `WatchedScreen`
- **Perfil** → `ProfileScreen`

Cada aba:
- Usa `headerShown: false` (cada tela controla seu próprio layout).
- Tem rótulos de acessibilidade (`tabBarAccessibilityLabel`) e `tabBarLabel` em português.

---

## Resumo do fluxo completo do usuário

1. **Primeiro acesso / sem sessão:**
   - App carrega.
   - `AuthProvider` não encontra `pipoca_nota_session` → `currentUser = null`.
   - `RootNavigator` mostra tela de login.
2. **Cadastro:**
   - Usuário vai para tela de cadastro (botão “Cadastrar”).
   - Preenche dados e conclui.
   - Novo usuário é salvo em `pipoca_nota_users` e sessão em `pipoca_nota_session`.
   - `currentUser` passa a ser o novo usuário.
   - Navegação muda para `MainTabs` (Buscar, Assistidos, Perfil).
3. **Login (para usuário já existente):**
   - Na tela de login, o usuário informa e-mail e senha.
   - Se válidos, `currentUser` é atualizado, sessão salva, e `MainTabs` é exibida.
4. **Uso do tema:**
   - `ThemeProvider` carrega o tema do sistema e a preferência salva em `pipoca_nota_theme_mode`.
   - Em `Perfil`, o usuário pode ativar/desativar o modo escuro.
   - A escolha é salva e persistida no `AsyncStorage`.
5. **Buscar filmes:**
   - Na aba **Buscar**, o usuário digita pelo menos 2 letras.
   - O app chama `searchMovies` na API TMDb.
   - Exibe os resultados com pôster, título e resumo.
   - Ao tocar em um filme, navega para a tela de detalhes (`Details`), que utiliza `getMovieDetails`.
6. **Avaliar e salvar filmes assistidos:**
   - Na tela de detalhes (não mostrada aqui, mas integrada ao `MoviesContext`), o usuário pode atribuir uma nota.
   - `saveRating` grava/atualiza o filme na lista `watched` do usuário atual e persiste no `AsyncStorage`.
7. **Ver e gerenciar filmes assistidos:**
   - Na aba **Assistidos**, `WatchedScreen` mostra a lista com título, nota e data.
   - O usuário pode remover itens, e a lista é atualizada tanto em memória quanto no `AsyncStorage`.
8. **Sair da conta:**
   - Na aba **Perfil**, o usuário toca em “Sair”.
   - `signOut` apaga `pipoca_nota_session` e define `currentUser = null`.
   - O app volta a mostrar a tela de login.

Com isso, o app oferece **uma experiência completa**: cadastro/login local, tema escuro persistente, busca na TMDb, avaliação de filmes e controle de uma lista pessoal de filmes assistidos, tudo separado por usuário.


