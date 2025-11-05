# 📋 INSTRUCTIONS DE PORTABILITÉ - CNIM BABCOCK MAROC

## 🎯 Objectif
Ce document explique comment déplacer l'application et ses données vers un autre PC sans perdre aucune information.

---

## 🔐 Stockage des Données

L'application utilise **2 méthodes de stockage** :

### 1. localStorage (Automatique) ⚡
- **Localisation** : Dans votre navigateur (Chrome, Firefox, Edge, etc.)
- **Avantages** : Sauvegarde automatique à chaque modification
- **Inconvénients** : 
  - ❌ NON portable vers un autre PC
  - ❌ NON portable vers un autre navigateur
  - ❌ Peut être effacé si vous nettoyez l'historique du navigateur
- **Données stockées** :
  - Agents, sous-tâches, pointages, dépendances
  - Paramètres de l'application
  - Utilisateurs et mots de passe

### 2. Fichier JSON (Manuel) 💾
- **Localisation** : Fichier téléchargé dans "Téléchargements"
- **Avantages** :
  - ✅ 100% PORTABLE vers n'importe quel PC
  - ✅ Sauvegarde permanente
  - ✅ Peut être archivé, partagé, versionnéé
- **Inconvénients** :
  - Nécessite un export manuel

---

## 📦 Comment Déplacer l'Application vers un Autre PC

### Étape 1 : Exporter les Données (PC Source) 📤

1. Ouvrez l'application `app.html`
2. Connectez-vous avec vos identifiants
3. Allez dans l'onglet **"Paramètres"** ⚙️
4. Dans la section **"Gestion des Données"**, cliquez sur **"📥 Exporter JSON"**
5. Un fichier sera téléchargé dans votre dossier **"Téléchargements"**
   - Nom du fichier : `CNIM_Donnees_YYYY-MM-DD.json`
6. **Important** : Notez bien où se trouve ce fichier !

### Étape 2 : Copier les Fichiers 📁

Copiez **l'ensemble du dossier** "Pointages" vers le nouveau PC :

```
📁 Pointages/
   ├── app.html                          ← Fichier principal
   ├── CNIM_Donnees_2025-01-15.json      ← Votre fichier exporté (à copier ici)
   ├── INSTRUCTIONS_PORTABILITE.md       ← Ce fichier
   ├── README.md
   └── autres fichiers...
```

**Méthodes de copie** :
- Clé USB
- Réseau local (partage de dossier)
- Cloud (OneDrive, Google Drive, etc.)
- Email (si le dossier n'est pas trop volumineux)

### Étape 3 : Importer les Données (PC Destination) 📥

1. Sur le nouveau PC, ouvrez le dossier "Pointages"
2. Double-cliquez sur `app.html` pour ouvrir l'application
3. Connectez-vous (utilisez les mêmes identifiants)
4. Allez dans l'onglet **"Paramètres"** ⚙️
5. Dans la section **"Gestion des Données"**, cliquez sur **"📤 Importer"**
6. Sélectionnez le fichier JSON que vous avez copié
7. Confirmez l'importation
8. ✅ **Toutes vos données sont restaurées !**

---

## 🔄 Sauvegarde Automatique

L'application crée automatiquement des backups dans le localStorage :
- **Fréquence** : Toutes les 5 minutes
- **Nombre de backups** : 10 derniers backups conservés
- **Accès** : Via les outils de développement du navigateur (localStorage)

⚠️ **Attention** : Ces backups sont également stockés dans localStorage et ne sont donc PAS portables.

---

## 📊 Vérification de l'Intégrité des Données

### Après l'importation, vérifiez que tout est présent :

1. **Onglet "Vue d'ensemble"** :
   - Nombre d'affaires/projets
   - Nombre de sous-tâches
   - Nombre de pointages

2. **Onglet "Agents"** :
   - Liste complète des agents
   - Leurs fonctions et emails

3. **Onglet "Pointage"** :
   - Historique des pointages
   - Heures enregistrées

4. **Onglet "Planning"** :
   - Gantt avec toutes les tâches
   - Dates et dépendances

---

## 💡 Bonnes Pratiques

### Exportation Régulière 📅
- **Quotidien** : Si vous modifiez beaucoup de données
- **Hebdomadaire** : Pour une utilisation normale
- **Avant maintenance** : Avant toute manipulation importante

### Nommage des Fichiers 📝
Le fichier exporté inclut automatiquement la date :
```
CNIM_Donnees_2025-01-15.json
CNIM_Donnees_2025-01-22.json
CNIM_Donnees_2025-02-01.json
```

Vous pouvez aussi ajouter des notes :
```
CNIM_Donnees_2025-01-15_avant_migration.json
CNIM_Donnees_2025-01-15_final.json
```

### Archivage 📦
Créez un dossier "Sauvegardes" :
```
📁 Pointages/
   ├── app.html
   └── 📁 Sauvegardes/
       ├── CNIM_Donnees_2025-01-15.json
       ├── CNIM_Donnees_2025-01-22.json
       └── CNIM_Donnees_2025-02-01.json
```

---

## 🆘 Dépannage

### Problème : "Fichier JSON invalide" lors de l'import
**Solutions** :
1. Vérifiez que le fichier n'est pas corrompu
2. Ouvrez le fichier avec Notepad++ ou VS Code
3. Vérifiez qu'il contient du JSON valide (commence par `{` et finit par `}`)

### Problème : "Données manquantes après import"
**Solutions** :
1. Vérifiez que vous avez importé le bon fichier (le plus récent)
2. Essayez un autre fichier de sauvegarde
3. Contactez le support technique

### Problème : "localStorage plein"
**Solutions** :
1. Exportez vos données en JSON
2. Nettoyez le localStorage du navigateur
3. Réimportez vos données

---

## 📞 Support

Pour toute question ou problème :
- **Email** : support.methodes@cnim.ma
- **Documentation** : Consultez README.md

---

## ✅ Checklist de Migration

### Avant de partir (PC Source) :
- [ ] Exporter les données en JSON
- [ ] Vérifier que le fichier JSON a été téléchargé
- [ ] Copier le dossier "Pointages" complet
- [ ] Copier le fichier JSON exporté

### Sur le nouveau PC (PC Destination) :
- [ ] Coller le dossier "Pointages"
- [ ] Ouvrir app.html
- [ ] Se connecter
- [ ] Importer le fichier JSON
- [ ] Vérifier que toutes les données sont présentes
- [ ] Tester l'ajout d'un pointage
- [ ] Exporter à nouveau pour créer une sauvegarde locale

---

## 🎉 Conclusion

Avec cette méthode, vos données CNIM sont **100% portables** et **100% sécurisées** !

**Rappel** : 
- 💾 **localStorage** = Sauvegarde automatique mais NON portable
- 📦 **Fichier JSON** = Sauvegarde manuelle mais 100% portable

**Astuce** : Exportez vos données régulièrement, même si vous ne changez pas de PC. C'est votre **assurance** contre la perte de données !

---

*Document créé le : 2025-01-15*  
*Version : 1.0*  
*CNIM BABCOCK MAROC - Département Méthodes*
