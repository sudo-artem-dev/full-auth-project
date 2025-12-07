# ---- DEV DOCKERFILE ----
    FROM node:22-slim

    WORKDIR /app
    
    # Installer les dépendances
    COPY package*.json ./
    RUN npm install
    
    # Copier le code
    COPY . .
    
    # Exposer Vite (port dev)
    EXPOSE 5173
    
    # Lancer Vite en mode dev accessible depuis l’extérieur
    CMD ["npm", "run", "dev", "--", "--host"]
    