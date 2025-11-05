/**
 * AI ASSISTANT - Assistant IA pour recherche et gestion intelligente
 * CNIM BABCOCK MAROC - Département Méthodes
 * 
 * Fonctionnalités :
 * - Recherche en langage naturel
 * - Suggestions intelligentes
 * - Analyse des données
 * - Réponses contextuelles
 */

class AIAssistant {
    constructor() {
        this.data = null;
        this.conversationHistory = [];
        this.maxHistorySize = 50;
        
        // Mots-clés pour la détection d'intention
        this.keywords = {
            search: ['cherche', 'trouve', 'recherche', 'affiche', 'montre', 'où', 'liste'],
            stats: ['statistiques', 'stats', 'combien', 'total', 'nombre', 'résumé'],
            help: ['aide', 'comment', 'quoi', 'pourquoi', 'help'],
            filter: ['filtre', 'seulement', 'uniquement', 'que'],
            status: ['statut', 'état', 'avancement', 'progression', 'en cours', 'terminé'],
            urgent: ['urgent', 'priorité', 'important', 'critique'],
            budget: ['budget', 'coût', 'prix', 'euros', 'heures'],
            agent: ['agent', 'personne', 'qui', 'employé', 'collaborateur'],
            project: ['projet', 'affaire', 'chantier', 'client'],
            task: ['tâche', 'sous-tâche', 'travail', 'activité'],
            time: ['temps', 'durée', 'pointage', 'heures', 'jours']
        };
    }

    /**
     * Initialiser l'IA avec les données
     */
    initialize(data) {
        this.data = data;
        console.log('🤖 Assistant IA initialisé avec', {
            agents: data.agents?.length || 0,
            sousTaches: data.sousTaches?.length || 0,
            pointages: data.pointages?.length || 0
        });
    }

    /**
     * Mettre à jour les données
     */
    updateData(data) {
        this.data = data;
    }

    /**
     * Traiter une requête en langage naturel
     */
    async processQuery(query) {
        if (!this.data) {
            return {
                type: 'error',
                message: '❌ Les données ne sont pas encore chargées',
                results: []
            };
        }

        // Nettoyer et normaliser la requête
        const normalizedQuery = this.normalizeQuery(query);
        
        // Ajouter à l'historique
        this.addToHistory({
            query: query,
            timestamp: new Date().toISOString()
        });

        // Détecter l'intention
        const intention = this.detectIntention(normalizedQuery);
        
        // Détecter les questions spécifiques
        if (this.isQuestionAboutSpecificTask(normalizedQuery)) {
            return this.handleSpecificTask(normalizedQuery);
        }
        
        if (this.isQuestionAboutAgent(normalizedQuery)) {
            return this.handleAgentQuestion(normalizedQuery);
        }
        
        if (this.isQuestionAboutBudget(normalizedQuery)) {
            return this.handleBudgetQuestion(normalizedQuery);
        }
        
        if (this.isQuestionAboutProgress(normalizedQuery)) {
            return this.handleProgressQuestion(normalizedQuery);
        }
        
        if (this.isQuestionAboutDeadline(normalizedQuery)) {
            return this.handleDeadlineQuestion(normalizedQuery);
        }
        
        // Traiter selon l'intention
        switch (intention.type) {
            case 'search':
                return this.handleSearch(normalizedQuery, intention);
            
            case 'stats':
                return this.handleStats(normalizedQuery, intention);
            
            case 'filter':
                return this.handleFilter(normalizedQuery, intention);
            
            case 'help':
                return this.handleHelp(normalizedQuery);
            
            case 'agent':
                return this.handleAgentInfo(normalizedQuery);
            
            case 'project':
                return this.handleProjectInfo(normalizedQuery);
            
            case 'time':
                return this.handleTimeTracking(normalizedQuery);
            
            default:
                return this.handleGeneral(normalizedQuery);
        }
    }

    /**
     * Normaliser la requête
     */
    normalizeQuery(query) {
        return query
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Enlever les accents
    }

    /**
     * Détecter l'intention de l'utilisateur
     */
    detectIntention(query) {
        const scores = {};
        
        // Calculer les scores pour chaque intention
        for (const [intention, keywords] of Object.entries(this.keywords)) {
            scores[intention] = keywords.reduce((score, keyword) => {
                return score + (query.includes(keyword) ? 1 : 0);
            }, 0);
        }
        
        // Trouver l'intention avec le score le plus élevé
        let maxScore = 0;
        let detectedIntention = 'general';
        
        for (const [intention, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                detectedIntention = intention;
            }
        }
        
        return {
            type: detectedIntention,
            confidence: maxScore,
            allScores: scores
        };
    }

    /**
     * Gérer les recherches
     */
    handleSearch(query, intention) {
        const results = {
            agents: [],
            sousTaches: [],
            pointages: [],
            affaires: []
        };

        // Recherche dans les agents
        if (query.match(/agent|personne|qui|employe|collaborateur/)) {
            results.agents = this.data.agents.filter(agent => 
                agent.nom.toLowerCase().includes(query) ||
                agent.fonction.toLowerCase().includes(query) ||
                agent.email.toLowerCase().includes(query)
            );
        }

        // Recherche dans les sous-tâches
        if (query.match(/tache|projet|affaire|travail/)) {
            results.sousTaches = this.data.sousTaches.filter(st =>
                st.nom.toLowerCase().includes(query) ||
                st.numAffaire.toLowerCase().includes(query) ||
                st.client.toLowerCase().includes(query) ||
                st.designation.toLowerCase().includes(query)
            );
        }

        // Recherche par statut
        if (query.match(/en cours|termine|attente|suspendu/)) {
            let statut = '';
            if (query.includes('en cours')) statut = 'en-cours';
            else if (query.includes('termine')) statut = 'termine';
            else if (query.includes('attente')) statut = 'en-attente';
            else if (query.includes('suspendu')) statut = 'suspendu';
            
            if (statut) {
                results.sousTaches = this.data.sousTaches.filter(st => st.statut === statut);
            }
        }

        // Recherche par priorité
        if (query.match(/urgent|priorite|important|critique/)) {
            results.sousTaches = this.data.sousTaches.filter(st => 
                st.priorite === 'urgente' || st.priorite === 'haute'
            );
        }

        // Grouper par affaire
        const affairesMap = new Map();
        results.sousTaches.forEach(st => {
            if (!affairesMap.has(st.numAffaire)) {
                affairesMap.set(st.numAffaire, {
                    numAffaire: st.numAffaire,
                    client: st.client,
                    designation: st.designation,
                    sousTaches: []
                });
            }
            affairesMap.get(st.numAffaire).sousTaches.push(st);
        });
        results.affaires = Array.from(affairesMap.values());

        // Générer le message de réponse
        let message = this.generateSearchMessage(query, results);

        return {
            type: 'search',
            message: message,
            results: results,
            count: {
                agents: results.agents.length,
                sousTaches: results.sousTaches.length,
                affaires: results.affaires.length
            }
        };
    }

    /**
     * Gérer les statistiques
     */
    handleStats(query, intention) {
        const stats = {
            totalAgents: this.data.agents.length,
            totalSousTaches: this.data.sousTaches.length,
            totalPointages: this.data.pointages.length,
            
            // Par statut
            parStatut: {
                'en-cours': this.data.sousTaches.filter(st => st.statut === 'en-cours').length,
                'termine': this.data.sousTaches.filter(st => st.statut === 'termine').length,
                'en-attente': this.data.sousTaches.filter(st => st.statut === 'en-attente').length,
                'suspendu': this.data.sousTaches.filter(st => st.statut === 'suspendu').length
            },
            
            // Par priorité
            parPriorite: {
                'urgente': this.data.sousTaches.filter(st => st.priorite === 'urgente').length,
                'haute': this.data.sousTaches.filter(st => st.priorite === 'haute').length,
                'moyenne': this.data.sousTaches.filter(st => st.priorite === 'moyenne').length,
                'faible': this.data.sousTaches.filter(st => st.priorite === 'faible').length
            },
            
            // Budget total
            budgetTotal: {
                heures: this.data.sousTaches.reduce((sum, st) => sum + (st.budgetHeures || 0), 0),
                euros: this.data.sousTaches.reduce((sum, st) => sum + (st.budgetEuros || 0), 0)
            },
            
            // Temps pointé
            tempsPointe: this.data.pointages.reduce((sum, p) => sum + (p.heures || 0), 0),
            
            // Affaires uniques
            affairesUniques: new Set(this.data.sousTaches.map(st => st.numAffaire)).size
        };

        const message = this.generateStatsMessage(stats);

        return {
            type: 'stats',
            message: message,
            stats: stats
        };
    }

    /**
     * Gérer les filtres
     */
    handleFilter(query, intention) {
        // Similaire à handleSearch mais avec des filtres plus spécifiques
        return this.handleSearch(query, intention);
    }

    /**
     * Gérer l'aide
     */
    handleHelp(query) {
        const helpTopics = [
            {
                title: '🔍 Recherche',
                examples: [
                    '"Cherche les tâches urgentes"',
                    '"Affiche les projets en cours"',
                    '"Trouve les tâches de Ahmed"',
                    '"Montre le projet OCP"'
                ]
            },
            {
                title: '📊 Statistiques',
                examples: [
                    '"Combien de tâches en cours ?"',
                    '"Quel est le budget total ?"',
                    '"Statistiques des projets"',
                    '"Progression globale"'
                ]
            },
            {
                title: '👥 Agents & Équipe',
                examples: [
                    '"Qui travaille sur le projet OCP ?"',
                    '"Info sur Ahmed BENALI"',
                    '"Qui a pointé le plus d\'heures ?"',
                    '"Liste des agents"'
                ]
            },
            {
                title: '💰 Budget & Coûts',
                examples: [
                    '"Budget total"',
                    '"Budget du projet Lafarge"',
                    '"Combien coûte CNIM-2025-001 ?"',
                    '"Consommation budgétaire"'
                ]
            },
            {
                title: '📈 Avancement',
                examples: [
                    '"Avancement de la tâche 1001"',
                    '"Progression du projet"',
                    '"Quelle est la progression ?"',
                    '"Tâches complétées"'
                ]
            },
            {
                title: '⏰ Délais & Échéances',
                examples: [
                    '"Quelles tâches sont en retard ?"',
                    '"Échéances cette semaine"',
                    '"Délais à venir"',
                    '"Projets urgents"'
                ]
            },
            {
                title: '⏱️ Temps & Pointage',
                examples: [
                    '"Combien d\'heures pointées ?"',
                    '"Temps de travail total"',
                    '"Heures par agent"',
                    '"Pointages du mois"'
                ]
            },
            {
                title: '📋 Détails spécifiques',
                examples: [
                    '"Détails de la tâche 1001"',
                    '"Info sur CNIM-2025-001"',
                    '"Tout sur le projet Biomasse"',
                    '"Spécifications de la tâche"'
                ]
            }
        ];

        let message = "💡 **Voici toutes mes capacités :**\n\n";
        message += "Je peux répondre à vos questions sur :\n";
        message += "• 🔍 Recherches et filtres\n";
        message += "• 📊 Statistiques détaillées\n";
        message += "• 👥 Informations agents\n";
        message += "• 💰 Budgets et coûts\n";
        message += "• 📈 Avancement des projets\n";
        message += "• ⏰ Échéances et retards\n";
        message += "• ⏱️ Temps de travail\n";
        message += "• 📋 Détails des tâches\n\n";
        
        message += "**Exemples de questions :**\n\n";
        
        // Afficher 2 exemples de chaque catégorie
        helpTopics.forEach(topic => {
            message += `**${topic.title}**\n`;
            topic.examples.slice(0, 2).forEach(ex => {
                message += `  • ${ex}\n`;
            });
        });

        message += "\n💬 Posez-moi n'importe quelle question sur vos projets !";

        return {
            type: 'help',
            message: message,
            topics: helpTopics
        };
    }

    /**
     * Gérer les requêtes générales
     */
    handleGeneral(query) {
        // Recherche globale dans tout
        const allResults = this.handleSearch(query, { type: 'search' });
        
        if (allResults.count.agents + allResults.count.sousTaches === 0) {
            return {
                type: 'notfound',
                message: `😕 Je n'ai pas trouvé de résultats pour "${query}".\n\n💡 Essayez :\n• "Cherche les tâches urgentes"\n• "Statistiques des projets"\n• "Affiche les agents"`,
                results: []
            };
        }
        
        return allResults;
    }

    /**
     * Générer un message de réponse pour la recherche
     */
    generateSearchMessage(query, results) {
        let message = '';
        
        if (results.agents.length > 0) {
            message += `👥 **${results.agents.length} agent(s) trouvé(s) :**\n`;
            results.agents.slice(0, 5).forEach(agent => {
                message += `  • ${agent.nom} - ${agent.fonction}\n`;
            });
            if (results.agents.length > 5) {
                message += `  ... et ${results.agents.length - 5} autre(s)\n`;
            }
            message += '\n';
        }
        
        if (results.affaires.length > 0) {
            message += `📁 **${results.affaires.length} affaire(s) trouvée(s) :**\n`;
            results.affaires.slice(0, 3).forEach(affaire => {
                message += `  • ${affaire.numAffaire} - ${affaire.client}\n`;
                message += `    ${affaire.designation}\n`;
                message += `    ${affaire.sousTaches.length} sous-tâche(s)\n`;
            });
            if (results.affaires.length > 3) {
                message += `  ... et ${results.affaires.length - 3} autre(s)\n`;
            }
            message += '\n';
        }
        
        if (results.sousTaches.length > 0 && results.affaires.length === 0) {
            message += `📋 **${results.sousTaches.length} tâche(s) trouvée(s) :**\n`;
            results.sousTaches.slice(0, 5).forEach(st => {
                message += `  • ${st.nom} (${st.statut})\n`;
            });
            if (results.sousTaches.length > 5) {
                message += `  ... et ${results.sousTaches.length - 5} autre(s)\n`;
            }
        }
        
        if (message === '') {
            message = `😕 Aucun résultat trouvé pour "${query}"`;
        }
        
        return message;
    }

    /**
     * Générer un message de statistiques
     */
    generateStatsMessage(stats) {
        let message = '📊 **Statistiques globales :**\n\n';
        
        message += `**Général :**\n`;
        message += `  • ${stats.totalAgents} agents\n`;
        message += `  • ${stats.affairesUniques} affaires\n`;
        message += `  • ${stats.totalSousTaches} sous-tâches\n`;
        message += `  • ${stats.totalPointages} pointages\n\n`;
        
        message += `**Par statut :**\n`;
        message += `  • ✅ Terminé : ${stats.parStatut.termine}\n`;
        message += `  • ⚙️ En cours : ${stats.parStatut['en-cours']}\n`;
        message += `  • ⏳ En attente : ${stats.parStatut['en-attente']}\n`;
        message += `  • ⏸️ Suspendu : ${stats.parStatut.suspendu}\n\n`;
        
        message += `**Par priorité :**\n`;
        message += `  • 🔴 Urgente : ${stats.parPriorite.urgente}\n`;
        message += `  • 🟠 Haute : ${stats.parPriorite.haute}\n`;
        message += `  • 🟡 Moyenne : ${stats.parPriorite.moyenne}\n`;
        message += `  • 🟢 Faible : ${stats.parPriorite.faible}\n\n`;
        
        message += `**Budget :**\n`;
        message += `  • ${stats.budgetTotal.heures.toLocaleString()} heures\n`;
        message += `  • ${stats.budgetTotal.euros.toLocaleString()} €\n\n`;
        
        message += `**Temps pointé : ${stats.tempsPointe.toLocaleString()} heures**`;
        
        return message;
    }

    /**
     * Ajouter à l'historique de conversation
     */
    addToHistory(entry) {
        this.conversationHistory.push(entry);
        
        // Limiter la taille de l'historique
        if (this.conversationHistory.length > this.maxHistorySize) {
            this.conversationHistory.shift();
        }
    }

    /**
     * Obtenir l'historique
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * Effacer l'historique
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Obtenir des suggestions
     */
    getSuggestions() {
        const suggestions = [
            '🔍 Cherche les tâches urgentes',
            '📊 Statistiques des projets',
            '👥 Liste des agents',
            '✅ Affiche les tâches terminées',
            '⏳ Montre les tâches en attente',
            '💰 Quel est le budget total ?',
            '⏱️ Combien d\'heures pointées ?',
            '🏗️ Projets en cours',
            '👤 Qui travaille sur OCP ?',
            '📈 Avancement du projet CNIM-2025-001',
            '⏰ Quelles tâches sont en retard ?',
            '💼 Budget du projet Lafarge',
            '🎯 Progression globale',
            '👥 Qui a pointé le plus d\'heures ?',
            '📋 Détails de la tâche 1001',
            '🔴 Tâches prioritaires cette semaine',
            '💡 Affiche les retards',
            '📅 Échéances à venir'
        ];
        
        // Retourner 4 suggestions aléatoires
        return suggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
    }

    // ============================================
    // NOUVELLES FONCTIONS DE DÉTECTION
    // ============================================

    isQuestionAboutSpecificTask(query) {
        return query.match(/tache|sous-tache|activite/) && 
               (query.match(/quelle|quel|comment|pourquoi|quand|ou/) || 
                query.match(/\d{4}/) || // Numéro de tâche
                query.match(/affaire|cnim-/));
    }

    isQuestionAboutAgent(query) {
        return query.match(/qui|agent|personne|employe|collaborateur|responsable/);
    }

    isQuestionAboutBudget(query) {
        return query.match(/budget|cout|prix|euros|argent|depense|combien.*euro/);
    }

    isQuestionAboutProgress(query) {
        return query.match(/avancement|progression|pourcentage|%|complete|fini|reste/);
    }

    isQuestionAboutDeadline(query) {
        return query.match(/deadline|echeance|date.*fin|quand.*termine|retard|delai/);
    }

    // ============================================
    // GESTIONNAIRES AVANCÉS
    // ============================================

    handleSpecificTask(query) {
        let results = [];
        
        // Chercher par numéro de tâche
        const taskIdMatch = query.match(/\d{4}/);
        if (taskIdMatch) {
            const taskId = parseInt(taskIdMatch[0]);
            results = this.data.sousTaches.filter(st => st.id === taskId);
        }
        
        // Chercher par nom de tâche
        if (results.length === 0) {
            results = this.data.sousTaches.filter(st =>
                st.nom.toLowerCase().includes(query) ||
                st.designation.toLowerCase().includes(query)
            );
        }

        if (results.length === 0) {
            return {
                type: 'notfound',
                message: '😕 Je n\'ai pas trouvé cette tâche spécifique.',
                results: []
            };
        }

        // Générer une réponse détaillée pour chaque tâche
        let message = `📋 **Informations sur ${results.length} tâche(s) :**\n\n`;
        
        results.slice(0, 3).forEach(st => {
            const agent = this.data.agents.find(a => a.id === st.agentId);
            const pointages = this.data.pointages.filter(p => p.sousTacheId === st.id);
            const heuresPointees = pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
            const progression = st.budgetHeures > 0 ? 
                ((heuresPointees / st.budgetHeures) * 100).toFixed(1) : 0;

            message += `**${st.numAffaire} - ${st.nom}**\n`;
            message += `  • Client: ${st.client}\n`;
            message += `  • Projet: ${st.designation}\n`;
            message += `  • Statut: ${this.getStatusEmoji(st.statut)} ${st.statut}\n`;
            message += `  • Priorité: ${this.getPriorityEmoji(st.priorite)} ${st.priorite}\n`;
            message += `  • Responsable: ${agent ? agent.nom : 'Non assigné'}\n`;
            message += `  • Budget: ${st.budgetHeures}h / ${st.budgetEuros.toLocaleString()}€\n`;
            message += `  • Heures pointées: ${heuresPointees}h (${progression}%)\n`;
            message += `  • Période: ${this.formatDate(st.dateDebut)} → ${this.formatDate(st.dateFin)}\n`;
            message += `  • Type: ${st.typeDossier}\n\n`;
        });

        if (results.length > 3) {
            message += `... et ${results.length - 3} autre(s) tâche(s)\n`;
        }

        return {
            type: 'task_detail',
            message: message,
            results: results
        };
    }

    handleAgentQuestion(query) {
        // Qui travaille sur quoi ?
        if (query.match(/qui.*sur|qui.*fait|qui.*travaille/)) {
            const results = this.data.sousTaches.filter(st =>
                st.nom.toLowerCase().includes(query) ||
                st.client.toLowerCase().includes(query)
            );

            if (results.length > 0) {
                const agents = results.map(st => {
                    const agent = this.data.agents.find(a => a.id === st.agentId);
                    return agent;
                }).filter(a => a);

                const uniqueAgents = [...new Map(agents.map(a => [a.id, a])).values()];

                let message = `👥 **${uniqueAgents.length} agent(s) travaille(nt) sur cela :**\n\n`;
                uniqueAgents.forEach(agent => {
                    const taches = results.filter(st => st.agentId === agent.id);
                    message += `**${agent.nom}** - ${agent.fonction}\n`;
                    message += `  📧 ${agent.email}\n`;
                    message += `  📋 ${taches.length} tâche(s)\n\n`;
                });

                return {
                    type: 'agent_info',
                    message: message,
                    results: uniqueAgents
                };
            }
        }

        // Information sur un agent spécifique
        const agents = this.data.agents.filter(a =>
            a.nom.toLowerCase().includes(query) ||
            a.fonction.toLowerCase().includes(query)
        );

        if (agents.length > 0) {
            let message = `👥 **Information sur ${agents.length} agent(s) :**\n\n`;
            
            agents.forEach(agent => {
                const taches = this.data.sousTaches.filter(st => st.agentId === agent.id);
                const pointages = this.data.pointages.filter(p => {
                    const sousTache = this.data.sousTaches.find(st => st.id === p.sousTacheId);
                    return sousTache && sousTache.agentId === agent.id;
                });
                
                const heuresTotal = pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
                const tachesEnCours = taches.filter(t => t.statut === 'en-cours').length;
                const tachesTerminees = taches.filter(t => t.statut === 'termine').length;

                message += `**${agent.nom}**\n`;
                message += `  • Fonction: ${agent.fonction}\n`;
                message += `  • Email: ${agent.email}\n`;
                message += `  • Tâches totales: ${taches.length}\n`;
                message += `  • En cours: ${tachesEnCours} | Terminées: ${tachesTerminees}\n`;
                message += `  • Heures pointées: ${heuresTotal}h\n\n`;
            });

            return {
                type: 'agent_info',
                message: message,
                results: agents
            };
        }

        return this.handleGeneral(query);
    }

    handleBudgetQuestion(query) {
        // Budget global
        if (query.match(/total|global|tous|ensemble/)) {
            const budgetTotal = {
                heures: this.data.sousTaches.reduce((sum, st) => sum + (st.budgetHeures || 0), 0),
                euros: this.data.sousTaches.reduce((sum, st) => sum + (st.budgetEuros || 0), 0)
            };

            const heuresPointees = this.data.pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
            const pourcentageUtilise = ((heuresPointees / budgetTotal.heures) * 100).toFixed(1);

            let message = `💰 **Budget Total :**\n\n`;
            message += `**Budget alloué :**\n`;
            message += `  • ${budgetTotal.heures.toLocaleString()} heures\n`;
            message += `  • ${budgetTotal.euros.toLocaleString()} €\n\n`;
            message += `**Consommé :**\n`;
            message += `  • ${heuresPointees.toLocaleString()} heures (${pourcentageUtilise}%)\n`;
            message += `  • Reste: ${(budgetTotal.heures - heuresPointees).toLocaleString()} heures\n\n`;

            // Budget par affaire
            const affairesMap = new Map();
            this.data.sousTaches.forEach(st => {
                if (!affairesMap.has(st.numAffaire)) {
                    affairesMap.set(st.numAffaire, {
                        numAffaire: st.numAffaire,
                        client: st.client,
                        budgetHeures: 0,
                        budgetEuros: 0
                    });
                }
                const affaire = affairesMap.get(st.numAffaire);
                affaire.budgetHeures += st.budgetHeures || 0;
                affaire.budgetEuros += st.budgetEuros || 0;
            });

            message += `**Top 5 projets par budget :**\n`;
            const topAffaires = Array.from(affairesMap.values())
                .sort((a, b) => b.budgetEuros - a.budgetEuros)
                .slice(0, 5);

            topAffaires.forEach((affaire, index) => {
                message += `  ${index + 1}. ${affaire.numAffaire} - ${affaire.client}\n`;
                message += `     ${affaire.budgetHeures}h / ${affaire.budgetEuros.toLocaleString()}€\n`;
            });

            return {
                type: 'budget_info',
                message: message,
                stats: { budgetTotal, heuresPointees, pourcentageUtilise }
            };
        }

        // Budget d'un projet spécifique
        const projets = this.data.sousTaches.filter(st =>
            st.numAffaire.toLowerCase().includes(query) ||
            st.client.toLowerCase().includes(query) ||
            st.designation.toLowerCase().includes(query)
        );

        if (projets.length > 0) {
            const budgetProjet = projets.reduce((sum, st) => ({
                heures: sum.heures + (st.budgetHeures || 0),
                euros: sum.euros + (st.budgetEuros || 0)
            }), { heures: 0, euros: 0 });

            const pointagesProjet = this.data.pointages.filter(p =>
                projets.some(st => st.id === p.sousTacheId)
            );
            const heuresPointees = pointagesProjet.reduce((sum, p) => sum + (p.heures || 0), 0);

            let message = `💰 **Budget du projet :**\n\n`;
            message += `**${projets[0].numAffaire} - ${projets[0].client}**\n`;
            message += `${projets[0].designation}\n\n`;
            message += `  • Budget: ${budgetProjet.heures}h / ${budgetProjet.euros.toLocaleString()}€\n`;
            message += `  • Consommé: ${heuresPointees}h (${((heuresPointees / budgetProjet.heures) * 100).toFixed(1)}%)\n`;
            message += `  • ${projets.length} sous-tâche(s)\n`;

            return {
                type: 'budget_info',
                message: message,
                results: projets
            };
        }

        return this.handleGeneral(query);
    }

    handleProgressQuestion(query) {
        // Chercher les tâches concernées
        const taches = this.data.sousTaches.filter(st =>
            st.nom.toLowerCase().includes(query) ||
            st.client.toLowerCase().includes(query) ||
            st.designation.toLowerCase().includes(query) ||
            st.numAffaire.toLowerCase().includes(query)
        );

        if (taches.length > 0) {
            let message = `📈 **Avancement :**\n\n`;

            taches.slice(0, 5).forEach(st => {
                const pointages = this.data.pointages.filter(p => p.sousTacheId === st.id);
                const heuresPointees = pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
                const progression = st.budgetHeures > 0 ? 
                    ((heuresPointees / st.budgetHeures) * 100).toFixed(1) : 0;

                const barLength = 20;
                const filledLength = Math.round((progression / 100) * barLength);
                const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

                message += `**${st.nom}**\n`;
                message += `  [${bar}] ${progression}%\n`;
                message += `  ${heuresPointees}h / ${st.budgetHeures}h\n`;
                message += `  Statut: ${this.getStatusEmoji(st.statut)} ${st.statut}\n\n`;
            });

            if (taches.length > 5) {
                message += `... et ${taches.length - 5} autre(s) tâche(s)\n`;
            }

            return {
                type: 'progress_info',
                message: message,
                results: taches
            };
        }

        // Progression globale
        const totalBudget = this.data.sousTaches.reduce((sum, st) => sum + (st.budgetHeures || 0), 0);
        const totalPointe = this.data.pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
        const progressionGlobale = ((totalPointe / totalBudget) * 100).toFixed(1);

        let message = `📈 **Progression globale de tous les projets :**\n\n`;
        message += `  • Total pointé: ${totalPointe.toLocaleString()}h\n`;
        message += `  • Budget total: ${totalBudget.toLocaleString()}h\n`;
        message += `  • Progression: ${progressionGlobale}%\n\n`;

        const parStatut = {
            'termine': this.data.sousTaches.filter(st => st.statut === 'termine').length,
            'en-cours': this.data.sousTaches.filter(st => st.statut === 'en-cours').length,
            'en-attente': this.data.sousTaches.filter(st => st.statut === 'en-attente').length
        };

        message += `**Par statut :**\n`;
        message += `  • ✅ Terminé: ${parStatut.termine}\n`;
        message += `  • ⚙️ En cours: ${parStatut['en-cours']}\n`;
        message += `  • ⏳ En attente: ${parStatut['en-attente']}\n`;

        return {
            type: 'progress_info',
            message: message,
            stats: { totalBudget, totalPointe, progressionGlobale, parStatut }
        };
    }

    handleDeadlineQuestion(query) {
        const now = new Date();
        
        // Tâches en retard
        const enRetard = this.data.sousTaches.filter(st => {
            if (st.statut === 'termine') return false;
            const dateFin = new Date(st.dateFin);
            return dateFin < now;
        });

        // Tâches qui se terminent bientôt (7 jours)
        const bientot = this.data.sousTaches.filter(st => {
            if (st.statut === 'termine') return false;
            const dateFin = new Date(st.dateFin);
            const diff = (dateFin - now) / (1000 * 60 * 60 * 24);
            return diff > 0 && diff <= 7;
        });

        let message = `⏰ **Échéances et délais :**\n\n`;

        if (enRetard.length > 0) {
            message += `🔴 **${enRetard.length} tâche(s) en retard :**\n`;
            enRetard.slice(0, 5).forEach(st => {
                const dateFin = new Date(st.dateFin);
                const joursRetard = Math.floor((now - dateFin) / (1000 * 60 * 60 * 24));
                message += `  • ${st.nom}\n`;
                message += `    Échéance dépassée de ${joursRetard} jour(s)\n`;
                message += `    Client: ${st.client}\n`;
            });
            message += '\n';
        }

        if (bientot.length > 0) {
            message += `🟡 **${bientot.length} tâche(s) à terminer cette semaine :**\n`;
            bientot.slice(0, 5).forEach(st => {
                const dateFin = new Date(st.dateFin);
                const joursRestants = Math.ceil((dateFin - now) / (1000 * 60 * 60 * 24));
                message += `  • ${st.nom}\n`;
                message += `    Dans ${joursRestants} jour(s) - ${this.formatDate(st.dateFin)}\n`;
                message += `    Client: ${st.client}\n`;
            });
        }

        if (enRetard.length === 0 && bientot.length === 0) {
            message += `✅ Aucune tâche en retard ou urgente cette semaine !\n`;
        }

        return {
            type: 'deadline_info',
            message: message,
            stats: {
                enRetard: enRetard.length,
                bientot: bientot.length
            }
        };
    }

    handleAgentInfo(query) {
        return this.handleAgentQuestion(query);
    }

    handleProjectInfo(query) {
        const projets = this.data.sousTaches.filter(st =>
            st.numAffaire.toLowerCase().includes(query) ||
            st.client.toLowerCase().includes(query) ||
            st.designation.toLowerCase().includes(query)
        );

        if (projets.length > 0) {
            // Grouper par affaire
            const affairesMap = new Map();
            projets.forEach(st => {
                if (!affairesMap.has(st.numAffaire)) {
                    affairesMap.set(st.numAffaire, {
                        numAffaire: st.numAffaire,
                        client: st.client,
                        designation: st.designation,
                        sousTaches: []
                    });
                }
                affairesMap.get(st.numAffaire).sousTaches.push(st);
            });

            let message = `🏗️ **${affairesMap.size} projet(s) trouvé(s) :**\n\n`;

            affairesMap.forEach(affaire => {
                const budgetTotal = affaire.sousTaches.reduce((sum, st) => ({
                    heures: sum.heures + (st.budgetHeures || 0),
                    euros: sum.euros + (st.budgetEuros || 0)
                }), { heures: 0, euros: 0 });

                const termine = affaire.sousTaches.filter(st => st.statut === 'termine').length;
                const enCours = affaire.sousTaches.filter(st => st.statut === 'en-cours').length;

                message += `**${affaire.numAffaire} - ${affaire.client}**\n`;
                message += `${affaire.designation}\n`;
                message += `  • ${affaire.sousTaches.length} sous-tâches\n`;
                message += `  • Budget: ${budgetTotal.heures}h / ${budgetTotal.euros.toLocaleString()}€\n`;
                message += `  • Terminé: ${termine} | En cours: ${enCours}\n\n`;
            });

            return {
                type: 'project_info',
                message: message,
                results: Array.from(affairesMap.values())
            };
        }

        return this.handleGeneral(query);
    }

    handleTimeTracking(query) {
        // Heures pointées par agent
        if (query.match(/qui.*plus.*heures|plus.*travaille|plus.*pointe/)) {
            const agentHeures = new Map();

            this.data.pointages.forEach(p => {
                const st = this.data.sousTaches.find(st => st.id === p.sousTacheId);
                if (st) {
                    const agent = this.data.agents.find(a => a.id === st.agentId);
                    if (agent) {
                        if (!agentHeures.has(agent.id)) {
                            agentHeures.set(agent.id, {
                                agent: agent,
                                heures: 0
                            });
                        }
                        agentHeures.get(agent.id).heures += p.heures || 0;
                    }
                }
            });

            const top = Array.from(agentHeures.values())
                .sort((a, b) => b.heures - a.heures)
                .slice(0, 5);

            let message = `⏱️ **Top agents par heures pointées :**\n\n`;
            top.forEach((item, index) => {
                message += `${index + 1}. **${item.agent.nom}**\n`;
                message += `   ${item.heures.toLocaleString()} heures\n`;
                message += `   ${item.agent.fonction}\n\n`;
            });

            return {
                type: 'time_tracking',
                message: message,
                results: top
            };
        }

        // Total des heures
        const totalHeures = this.data.pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
        const totalJours = Math.floor(totalHeures / 8);

        let message = `⏱️ **Temps de travail total :**\n\n`;
        message += `  • ${totalHeures.toLocaleString()} heures pointées\n`;
        message += `  • ${totalJours} jours de travail\n`;
        message += `  • ${this.data.pointages.length} pointages enregistrés\n`;

        return {
            type: 'time_tracking',
            message: message,
            stats: { totalHeures, totalJours }
        };
    }

    // ============================================
    // FONCTIONS UTILITAIRES
    // ============================================

    getStatusEmoji(statut) {
        const emojis = {
            'termine': '✅',
            'en-cours': '⚙️',
            'en-attente': '⏳',
            'suspendu': '⏸️'
        };
        return emojis[statut] || '❓';
    }

    getPriorityEmoji(priorite) {
        const emojis = {
            'urgente': '🔴',
            'haute': '🟠',
            'moyenne': '🟡',
            'faible': '🟢'
        };
        return emojis[priorite] || '⚪';
    }

    formatDate(dateString) {
        if (!dateString) return 'Non défini';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Créer une instance globale
const aiAssistant = new AIAssistant();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}
