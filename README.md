## Pipoca & Nota

Aplicativo móvel (React Native) para catálogo pessoal de filmes, com:
- Autenticação local (cadastro, login, foto de perfil via câmera/galeria)
- Busca de filmes pela API do TMDb
- Detalhes do filme com avaliação (0–10) e salvamento em “Assistidos”
- Lista “Meus Filmes Assistidos” por usuário, com persistência local
- Acessibilidade (a11y): rótulos, foco lógico, imagens com descrição e alvos de toque ≥ 44x44

### Tecnologias
- React Native (Android e iOS)
- TypeScript
- React Navigation
- AsyncStorage (persistência local)
- react-native-image-picker (câmera/galeria)

### Requisitos funcionais atendidos
- RF01: Fluxo de autenticação local (login/cadastro com imagem)
- RF02: Tela de perfil do usuário (nome + foto)
- RF03: Tela de busca de filmes (TMDb)
- RF04: Navegação e tela de detalhes (avaliar e salvar)
- RF05: Tela “Meus Filmes Assistidos” (estado global por usuário)
- RF06: Persistência local por usuário (troca de usuário altera lista)
- RF07: Acessibilidade (labels, alt text, foco e alvos mínimos)

### Pré-requisitos
- Node.js LTS e npm
- Ambiente React Native configurado (Android SDK/Xcode)
- Chave de API do TMDb (`https://www.themoviedb.org/`)

### Instalação de dependências

```bash
npm install
```

No iOS, após instalar pacotes, rode:

```bash
cd ios && pod install && cd ..
```

### Configurar chave do TMDb
Crie o arquivo `src/config/tmdb.local.ts` com o conteúdo:

```ts
export const TMDB_API_KEY = 'SUA_CHAVE_TMDB_AQUI';
```

Observação: não comitar chaves reais em repositórios públicos.

### Executar o app
Você pode usar os scripts do npm. Em dois terminais:

1) Metro (bundler):
```bash
npm run metro
```

2) Plataforma:
```bash
# Android
npm run android

# iOS (em macOS com Xcode)
npm run ios
```

Se estiver no PowerShell e enfrentar erro de rede do npm (ECONNRESET), tente trocar o registry temporariamente e repetir o comando:

```bash
npm config set registry https://registry.npmmirror.com
```

### Instalar/atualizar o Metro (se necessário)
O Metro já vem incluso via Expo, mas o pacote aparece em `devDependencies` para assegurar compatibilidade.
Caso precise reinstalar/atualizar manualmente:

```bash
npm install -D metro
```

### Permissões
- Android: a lib de imagens solicitará permissões de câmera/armazenamento em tempo de execução.
- iOS: adicione chaves no Info.plist conforme a necessidade da câmera/fototeca (Camera/Photo Library Usage Description).

### Estrutura (principal)
- `src/App.tsx`: providers e `NavigationContainer`
- `src/navigation/`: pilha de autenticação, tabs e detalhes
- `src/context/AuthContext.tsx`: usuários (cadastro/login), sessão, foto
- `src/context/MoviesContext.tsx`: busca TMDb e “assistidos” por usuário
- `src/screens/`: telas de Login, Register, Profile, Search, MovieDetails, MyMovies
- `src/components/AccessibleImage.tsx`: imagem com suporte a a11y
- `src/config/tmdb.ts`: leitura segura da chave local do TMDb

### Acessibilidade (a11y)
- `accessibilityLabel`/`accessibilityRole` em botões e inputs
- Imagens com textos descritivos (alt)
- Foco lógico entre campos e telas
- Alvos de toque com altura mínima (≥ 44)

### Scripts úteis (se definidos em package.json)
```bash
# Lint/Typecheck (exemplo)
npm run lint
npm run typecheck
```

### Licença
Projeto acadêmico para fins educacionais.


