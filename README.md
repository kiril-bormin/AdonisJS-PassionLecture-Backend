# Passion Lecture

Projet composé d'un backend en AdonisJS et d'un frontend en Vue.js.

## Prérequis

- Node.js(v20 ou supérieur)
- MySQL

## Installation

### Backend (API AdonisJS)

```bash
cd backend
npm install
cp .env.example .env
node ace generate:key
node ace migration:fresh --seed
```

### Frontend (Vue.js)

```bash
cd frontend
npm install
```

## Démarrage

Ouvrez deux terminaux pour lancer les deux parties du projet simultanément.

**1. Lancer le Backend :**

```bash
cd backend
npm run dev
```

**2. Lancer le Frontend :**

```bash
cd frontend
npm run dev
```
