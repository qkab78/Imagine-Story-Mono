# Déploiement avec Dokploy

Ce guide explique comment déployer l'API Imagine Story sur votre serveur local avec Dokploy.

## Prérequis

- Dokploy installé sur votre serveur
- Accès au repository GitHub
- Variables d'environnement configurées

## Configuration Dokploy

### 1. Créer une nouvelle application

Dans Dokploy, créez une nouvelle application avec les paramètres suivants:

- **Type**: Application
- **Source**: GitHub
- **Repository**: `qkab78/Imagine-Story-Mono`
- **Branch**: `main`
- **Build Type**: Dockerfile
- **Dockerfile Path**: `apps/api/Dockerfile`
- **Context Path**: `apps/api`

### 2. Variables d'environnement

Configurez les variables d'environnement suivantes dans Dokploy:

#### Application
```
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
TZ=UTC
LOG_LEVEL=info
APP_KEY=<votre-app-key-generee>
```

#### Base de données (si vous utilisez une base de données externe)
```
DB_HOST=<votre-db-host>
DB_PORT=5432
DB_USER=<votre-db-user>
DB_PASSWORD=<votre-db-password>
DB_DATABASE=imagine_story
```

#### Redis (si vous utilisez Redis externe)
```
QUEUE_REDIS_HOST=<votre-redis-host>
QUEUE_REDIS_PORT=6379
QUEUE_REDIS_PASSWORD=<votre-redis-password>
```

#### API Keys
```
OPENAI_API_KEY=<votre-openai-key>
LEONARDO_AI_API_KEY=<votre-leonardo-key>
STORY_MAX_CHAPTERS=10
```

#### Paiements
```
PAYMENT_API_KEY=<votre-payment-key>
PAYMENT_PREMIUM_ACCOUNT_PRODUCT_ID=<product-id>
PAYMENT_STORE_ID=<store-id>
```

#### Mail (optionnel)
```
SMTP_HOST=<votre-smtp-host>
SMTP_PORT=<votre-smtp-port>
```

### 3. Générer APP_KEY

Pour générer une clé APP_KEY sécurisée, exécutez:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Configuration des services

#### Option A: Utiliser les services Dokploy

Créez les services suivants dans Dokploy:

1. **PostgreSQL 15**
   - Name: `imagine-story-db`
   - Database: `imagine_story`
   - User: `postgres`
   - Password: (générez un mot de passe sécurisé)

2. **Redis**
   - Name: `imagine-story-redis`
   - Port: 6379

#### Option B: Utiliser docker-compose.prod.yaml

Si vous préférez utiliser un fichier docker-compose, vous pouvez utiliser le fichier `docker-compose.prod.yaml` fourni.

### 5. Migrations de base de données

Après le premier déploiement, connectez-vous au conteneur et exécutez les migrations:

```bash
docker exec -it <container-name> node ace kysely:migrate
```

### 6. Worker pour les jobs en arrière-plan

Si vous utilisez le système de queue, vous devez également déployer le worker:

1. Créez une nouvelle application dans Dokploy
2. Utilisez le même Dockerfile
3. Changez la commande de démarrage en: `node ace queue:listen`
4. Utilisez les mêmes variables d'environnement

## Structure du Dockerfile

Le Dockerfile utilise une approche multi-stage:

1. **Stage Builder**: Compile l'application TypeScript
2. **Stage Production**: Image finale légère avec seulement les dépendances de production

## Ports exposés

- Port 3333: API HTTP

## Volumes persistants

- `/app/uploads`: Stockage des images uploadées (covers et chapitres)

## Health Check

Le Dockerfile inclut un health check qui vérifie que l'API répond sur le endpoint `/health`.

## Troubleshooting

### Le build échoue

1. Le Dockerfile utilise `--ignore-ts-errors` pour ignorer les erreurs TypeScript dans les fichiers de test
2. Assurez-vous que le fichier `pnpm-lock.yaml` est à jour
3. Vérifiez que les dépendances de production sont correctement installées

### L'application ne démarre pas

1. **Dans Dokploy**: Allez dans votre application > onglet "Logs" pour voir les logs en temps réel
2. **Via Docker**: `docker logs <container-name>` ou `docker logs -f <container-name>` pour suivre en temps réel
3. **Vérifier si le conteneur tourne**: `docker ps -a` pour voir tous les conteneurs (y compris ceux arrêtés)
4. Assurez-vous que toutes les variables d'environnement sont configurées (surtout `APP_KEY`, `DB_HOST`, etc.)
5. Vérifiez que la base de données est accessible et démarrée avant l'API
6. Vérifiez que Redis est accessible si vous utilisez les queues

### Erreur "Cannot find module '/app/bin/server.js'"

Cette erreur se produit si le CMD du Dockerfile pointe vers le mauvais chemin. AdonisJS compile les fichiers TypeScript dans le répertoire `build/`, donc le chemin correct est `build/bin/server.js` et non `bin/server.js`.

**Solution** : Assurez-vous que le Dockerfile contient :
```dockerfile
CMD ["node", "build/bin/server.js"]
```

Si vous voyez cette erreur, le Dockerfile a probablement l'ancien chemin. Mettez à jour le Dockerfile et redéployez.

### Erreurs de connexion à la base de données

1. Vérifiez que `DB_HOST` pointe vers le bon service
2. Assurez-vous que la base de données est démarrée avant l'API
3. Vérifiez les credentials de connexion

## Mise à jour

Pour mettre à jour l'application:

1. Poussez vos changements sur GitHub
2. Dans Dokploy, cliquez sur "Redeploy"
3. Dokploy va automatiquement récupérer les derniers changements et rebuilder l'image

## Monitoring

- Les logs sont disponibles dans Dokploy (onglet "Logs")
- Le health check s'exécute toutes les 30 secondes
- L'application utilise `pino-pretty` pour des logs formatés en développement

## Commandes utiles pour diagnostiquer

Dans Dokploy, vous pouvez utiliser la console Docker pour exécuter ces commandes:

```bash
# Voir les logs en temps réel
docker logs -f <container-name>

# Voir les 100 dernières lignes de logs
docker logs --tail 100 <container-name>

# Lister tous les conteneurs (y compris arrêtés)
docker ps -a

# Inspecter un conteneur
docker inspect <container-name>

# Exécuter une commande dans le conteneur (si il tourne)
docker exec -it <container-name> sh

# Vérifier les variables d'environnement
docker exec <container-name> env
```

## Variables d'environnement obligatoires

Les variables suivantes **DOIVENT** être configurées pour que l'application démarre:

- `APP_KEY` - Clé de chiffrement de l'application
- `DB_HOST` - Hôte de la base de données
- `DB_USER` - Utilisateur de la base de données
- `DB_PASSWORD` - Mot de passe de la base de données
- `DB_DATABASE` - Nom de la base de données

Sans ces variables, l'application ne pourra pas démarrer.
