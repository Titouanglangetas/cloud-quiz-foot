# ⚽ Cloud Quiz Foot  

Cloud Quiz Foot est une application web cloud-native permettant de jouer à un quiz de football généré dynamiquement.  
Le projet utilise Azure (App Service, Functions, Storage/CosmosDB), de l’Infrastructure as Code et un pipeline CI/CD GitHub Actions pour assurer un déploiement automatisé.

---

## 📌 1. Objectif du projet  
Cloud Quiz Foot a pour objectif de démontrer la mise en place d’une architecture cloud moderne et scalable à travers une application simple et ludique.  
Le projet illustre :

- Le déploiement d’une application web sur Azure  
- La création d’un backend serverless via Azure Functions  
- L’utilisation d’un stockage cloud (Table Storage ou Cosmos DB)  
- Le déploiement automatisé via GitHub Actions  
- La gestion complète de l’infrastructure via IaC (Bicep/Terraform)  
- Une séparation claire frontend / backend / infra

---

## 📂 2. Architecture du projet

### 🧱 Structure générale
cloud-quiz-foot/
│
├── frontend/ → Interface web (HTML/CSS/JS)
├── backend/ → Azure Functions (API serverless)
├── infra/ → Infrastructure as Code (Bicep ou Terraform)
├── data/ → Données statiques (questions de quiz)
└── .github/workflows → Pipelines CI/CD GitHub Actions



### ☁️ Composants Azure utilisés

| Service Azure | Rôle |
|---------------|------|
| **App Service** | Hébergement du frontend |
| **Azure Functions** | Génération du quiz, scoring, leaderboard |
| **Storage / Cosmos DB** | Stockage des questions et scores |
| **App Service Plan** | Plan d’hébergement |
| **GitHub Actions** | Déploiement automatisé |
| **Bicep / Terraform** | Définition de l’infrastructure |

---

## 🧠 3. Fonctionnalités

### ✔ Génération aléatoire d’un quiz  
10 questions tirées depuis un dataset JSON ou une base Azure.

### ✔ Réponse en direct dans l’interface  
Interface web simple et rapide (HTML/CSS/JS).

### ✔ Calcul du score  
Traitement via Azure Function `submitResult`.

### ✔ Classement global  
Stockage des scores → affichage du top 10.

### ✔ Architecture scalable  
Grâce à Azure Functions + App Service.

### ✔ Déploiement entièrement automatisé  
GitHub Actions déploie :
- le frontend  
- le backend  
- l’infrastructure (IaC)

---

## ⚙️ 4. Backend : Azure Functions  

Le backend contient trois fonctions principales :

| Function | Description |
|----------|-------------|
| `generateQuiz` | Renvoie une liste de questions aléatoires |
| `submitResult` | Enregistre un score dans la base |
| `getLeaderboard` | Renvoie le classement des meilleurs joueurs |

Exemple d’endpoint :  
GET /api/generateQuiz
POST /api/submitResult
GET /api/getLeaderboard


---

## 🖥️ 5. Frontend : App Service  
Technologies utilisées :
- HTML  
- CSS  
- JavaScript  

Le frontend communique avec les endpoints Azure Functions via fetch API.

---

## 🧰 6. Infrastructure as Code (IaC)  
L’infrastructure est définie dans le dossier **infra/** via :

- **Bicep** (option recommandée)  
ou  
- **Terraform**

Ressources créées automatiquement :
- Storage Account  
- Function App  
- App Service + App Service Plan  
- Base (Table Storage ou CosmosDB)  
- Identités managées  
- Paramètres d’environnement

---

## 🔄 7. CI/CD – GitHub Actions  

Trois pipelines sont fournis :

| Workflow | Rôle |
|----------|------|
| `deploy-infra.yml` | Déploiement IaC |
| `deploy-backend.yml` | Build & déploiement Azure Functions |
| `deploy-frontend.yml` | Build & déploiement frontend |

Déclencheurs typiques :
- `push` sur `main`  
- `workflow_dispatch` (manuel)

---

## 🗃️ 8. Données  

Les questions sont stockées dans : data/questions.json

Format exemple :
```json
{
  "question": "Qui a gagné la Coupe du Monde 2018 ?",
  "answers": ["France", "Croatie", "Brésil", "Belgique"],
  "correct": "France"
}

## 🚀 9. Installation locale
1) Cloner le repo : git clone https://github.com/username/cloud-quiz-foot.git
2) Installer Azure Functions Tools : npm install -g azure-functions-core-tools@4
3) Lancer le backend localement :cd backend
                                 func start

4) Ouvrir le frontend dans un navigateur: frontend/index.html


## 👥 10. Équipe
Titouan Glangetas
Arthur Fatus
Quentin Petiteville


