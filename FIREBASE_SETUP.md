# 🔥 Configuração do Firebase

Este documento explica como configurar o Firebase para o App Gerador de Currículo.

## 📋 Pré-requisitos

1. Conta no Google (para acessar o Firebase Console)
2. Projeto Firebase criado

## ⚙️ Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar projeto"
3. Digite um nome para o projeto (ex: "app-gerador-curriculo")
4. Siga os passos de configuração

### 2. Configurar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Get started"
3. Vá para a aba "Sign-in method"
4. Clique em "Google" e habilite
5. Configure o nome do projeto e email de suporte
6. Salve as configurações

### 3. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima
5. Clique em "Done"

### 4. Obter Configurações do Projeto

1. No menu lateral, clique na engrenagem (⚙️) ao lado de "Project Overview"
2. Clique em "Project settings"
3. Role para baixo até "Your apps"
4. Clique no ícone da web (</>) para adicionar um app web
5. Digite um nome para o app (ex: "curriculo-app")
6. Clique em "Register app"
7. Copie as configurações que aparecem

### 5. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**Substitua os valores pelos que você copiou do Firebase Console.**

### 6. Configurar Regras de Segurança

#### Regras do Firestore

1. No Firestore Database, clique na aba "Rules"
2. Substitua as regras existentes por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /curriculos/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Clique em "Publish"

## 🔒 Explicação das Regras de Segurança

### Firestore
- Usuários só podem ler/escrever documentos onde `userId` corresponde ao seu ID
- Usuários só podem criar documentos com seu próprio `userId`
- Autenticação é obrigatória
- **Não precisamos do Storage** - todos os dados são salvos no Firestore

## 🚨 Importante

- **Nunca** commite o arquivo `.env` no repositório
- As regras de "test mode" são apenas para desenvolvimento
- Para produção, configure regras mais restritivas
- Mantenha suas chaves de API seguras
- **Não é necessário configurar Storage** - usamos apenas Firestore

## 🧪 Testando a Configuração

1. Execute `npm run dev`
2. Acesse o aplicativo
3. Tente fazer login com Google
4. Crie um currículo e salve na nuvem
5. Verifique se aparece na página "Meus Currículos"
6. Teste o download do PDF

## 🔧 Solução de Problemas

### Erro de Autenticação
- Verifique se o Google Auth está habilitado
- Confirme se as variáveis de ambiente estão corretas

### Erro de Firestore
- Verifique se o Firestore está habilitado
- Confirme se as regras de segurança estão corretas

### Erro ao salvar currículo
- Verifique se o usuário está logado
- Confirme se as regras do Firestore permitem escrita

## 💰 Custos

- **Firestore:** Primeiros 50.000 leituras/escritas por dia são gratuitas
- **Authentication:** Totalmente gratuito
- **Storage:** Não utilizado (economia de custos)

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador para erros
2. Firebase Console para logs
3. Regras de segurança
4. Configurações do projeto 