# Pokédex Admin - Sistema de Controle de Pokémons

Sistema Fullstack desenvolvido para gerenciamento administrativo de espécimes, com foco em segurança, escalabilidade e experiência do usuário premium.

## 👨‍💻 Autor
**Hilton Medeiros Amorim** Bacharel em Ciência da Computação pelo **Centro Universitário de João Pessoa (UNIPÊ)** - Dezembro 2025.
[LinkedIn](https://linkedin.com/in/seu-perfil) | [GitHub](https://github.com/seu-usuario)

---

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS**: Framework Node.js progressivo para aplicações eficientes.
- **Prisma ORM**: Modelagem de dados e Type-safe queries.
- **PostgreSQL**: Banco de dados relacional (via Docker).
- **JWT & Bcrypt**: Autenticação segura e criptografia de senhas.
- **Jest & Supertest**: Testes de integração E2E.

### Frontend
- **Next.js 14**: Framework React com App Router.
- **Tailwind CSS**: Estilização moderna com Glassmorphism.
- **Lucide React**: Biblioteca de ícones vetoriais.

---

## 🛠️ Como Executar o Projeto

### 1. Suba o Banco de Dados (Docker):
```bash
cd backend
docker-compose up -d
```
### 2. Configure o Backend:
```bash
npm install
npx prisma migrate dev
npm run start:dev
```
### 3. Inicie o Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
## 🛡️ Diferenciais do Projeto

* **Segurança por Proprietário**: O sistema foi projetado para que cada treinador gerencie exclusivamente seus próprios registros de Pokémon, garantindo a integridade e privacidade dos dados de cada usuário.
* **Interface Premium**: Experiência de usuário (UX) refinada com feedback visual constante, incluindo modais de confirmação customizadas, loaders de carregamento (spinners) e um sistema de busca/filtro em tempo real.
* **Documentação Técnica**: Código desenvolvido seguindo rigorosamente os princípios **SOLID** e **Clean Code**, demonstrando a maturidade técnica compatível com as exigências de um Bacharel em Ciência da Computação.

---
© 2026 Pokédex Administrativa · **Hilton Medeiros Amorim**



