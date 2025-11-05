/**
 * AI ASSISTANT EXTENDED - Fonctionnalités avancées
 * Extensions pour l'assistant IA de base
 */

// Étendre la classe AIAssistant avec des méthodes avancées
AIAssistant.prototype.handleAdvancedSearch = function(normalizedQuery, originalQuery, intention) {
    const entities = intention.entities;
    const results = {
        agents: [],
        sousTaches: [],
        pointages: [],
        affaires: [],
        dependances: []
    };

    // Recherche multi-critères avancée
    
    // Si des agents spécifiques sont mentionnés
    if (entities.agents.length > 0) {
        results.agents = entities.agents;
        
        // Trouver les tâches de ces agents
        const agentIds = entities.agents.map(a => a.id);
        results.sousTaches = this.data.sousTaches.filter(st => agentIds.includes(st.agentId));
        
        // Trouver les pointages de ces agents
        results.pointages = this.data.pointages.filter(p => agentIds.includes(p.agentId));
    }
    
    // Si des clients sont mentionnés
    if (entities.clients.length > 0) {
        results.sousTaches = [
            ...results.sousTaches,
            ...this.data.sousTaches.filter(st => entities.clients.includes(st.client))
        ];
        // Dédupliquer
        results.sousTaches = [...new Set(results.sousTaches)];
    }
    
    // Si des affaires sont mentionnées
    if (entities.affaires.length > 0) {
        results.sousTaches = [
            ...results.sousTaches,
            ...this.data.sousTaches.filter(st => entities.affaires.includes(st.numAffaire))
        ];
        results.sousTaches = [...new Set(results.sousTaches)];
    }
    
    // Si des statuts sont mentionnés
    if (entities.statuts.length > 0) {
        const filteredByStatus = this.data.sousTaches.filter(st => 
            entities.statuts.includes(st.statut)
        );
        
        if (results.sousTaches.length === 0) {
            results.sousTaches = filteredByStatus;
        } else {
            results.sousTaches = results.sousTaches.filter(st => 
                entities.statuts.includes(st.statut)
            );
        }
    }
    
    // Si des priorités sont mentionnées
    if (entities.priorites.length > 0) {
        const filteredByPriority = this.data.sousTaches.filter(st => 
            entities.priorites.includes(st.priorite)
        );
        
        if (results.sousTaches.length === 0) {
            results.sousTaches = filteredByPriority;
        } else {
            results.sousTaches = results.sousTaches.filter(st => 
                entities.priorites.includes(st.priorite)
            );
        }
    }
    
    // Recherche textuelle si pas de résultats spécifiques
    if (results.sousTaches.length === 0 && results.agents.length === 0) {
        // Recherche dans tous les champs texte
        results.sousTaches = this.data.sousTaches.filter(st => 
            this.normalizeQuery(st.nom).includes(normalizedQuery) ||
            this.normalizeQuery(st.designation).includes(normalizedQuery) ||
            this.normalizeQuery(st.client).includes(normalizedQuery) ||
            this.normalizeQuery(st.typeDossier).includes(normalizedQuery)
        );
        
        results.agents = this.data.agents.filter(a =>
            this.normalizeQuery(a.nom).includes(normalizedQuery) ||
            this.normalizeQuery(a.fonction).includes(normalizedQuery)
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
                annee: st.annee,
                sousTaches: []
            });
        }
        affairesMap.get(st.numAffaire).sousTaches.push(st);
    });
    results.affaires = Array.from(affairesMap.values());
    
    // Trouver les dépendances liées
    if (results.sousTaches.length > 0) {
        const stIds = results.sousTaches.map(st => st.id);
        results.dependances = this.data.dependances?.filter(dep => 
            stIds.includes(dep.sourceId) || stIds.includes(dep.cibleId)
        ) || [];
    }
    
    let message = this.generateAdvancedSearchMessage(originalQuery, results, entities);
    
    return {
        type: 'search',
        message: message,
        results: results,
        entities: entities,
        count: {
            agents: results.agents.length,
            sousTaches: results.sousTaches.length,
            affaires: results.affaires.length,
            pointages: results.pointages.length,
            dependances: results.dependances.length
        }
    };
};

AIAssistant.prototype.handleAdvancedStats = function(normalizedQuery, originalQuery, intention) {
    const entities = intention.entities;
    
    // Calculer des statistiques complètes
    const stats = {
        // Général
        general: {
            totalAgents: this.data.agents.length,
            totalSousTaches: this.data.sousTaches.length,
            totalPointages: this.data.pointages.length,
            totalDependances: this.data.dependances?.length || 0,
            affairesUniques: new Set(this.data.sousTaches.map(st => st.numAffaire)).size,
            clientsUniques: new Set(this.data.sousTaches.map(st => st.client)).size
        },
        
        // Par statut
        parStatut: {},
        
        // Par priorité
        parPriorite: {},
        
        // Par agent
        parAgent: [],
        
        // Par client
        parClient: [],
        
        // Budget
        budget: {
            totalHeures: 0,
            totalEuros: 0,
            heuresPointees: 0,
            heuresRestantes: 0,
            tauxRealisation: 0
        },
        
        // Temps
        temps: {
            totalHeuresPointees: 0,
            moyenneParJour: 0,
            moyenneParAgent: 0
        },
        
        // Performance
        performance: {
            tauxAchèvement: 0,
            tachesEnRetard: 0,
            tachesDansLesTemps: 0
        }
    };
    
    // Calcul des statuts
    ['en-cours', 'termine', 'en-attente', 'suspendu'].forEach(statut => {
        stats.parStatut[statut] = this.data.sousTaches.filter(st => st.statut === statut).length;
    });
    
    // Calcul des priorités
    ['urgente', 'haute', 'moyenne', 'faible'].forEach(priorite => {
        stats.parPriorite[priorite] = this.data.sousTaches.filter(st => st.priorite === priorite).length;
    });
    
    // Par agent
    this.data.agents.forEach(agent => {
        const tacheAgent = this.data.sousTaches.filter(st => st.agentId === agent.id);
        const pointagesAgent = this.data.pointages.filter(p => p.agentId === agent.id);
        
        stats.parAgent.push({
            nom: agent.nom,
            totalTaches: tacheAgent.length,
            tachesEnCours: tacheAgent.filter(st => st.statut === 'en-cours').length,
            tachesTerminees: tacheAgent.filter(st => st.statut === 'termine').length,
            heuresPointees: pointagesAgent.reduce((sum, p) => sum + (p.heures || 0), 0),
            budgetHeures: tacheAgent.reduce((sum, st) => sum + (st.budgetHeures || 0), 0)
        });
    });
    
    // Par client
    const clientsMap = new Map();
    this.data.sousTaches.forEach(st => {
        if (!clientsMap.has(st.client)) {
            clientsMap.set(st.client, {
                client: st.client,
                affaires: new Set(),
                taches: 0,
                budgetHeures: 0,
                budgetEuros: 0
            });
        }
        const clientData = clientsMap.get(st.client);
        clientData.affaires.add(st.numAffaire);
        clientData.taches++;
        clientData.budgetHeures += st.budgetHeures || 0;
        clientData.budgetEuros += st.budgetEuros || 0;
    });
    
    clientsMap.forEach((value, key) => {
        stats.parClient.push({
            client: key,
            affaires: value.affaires.size,
            taches: value.taches,
            budgetHeures: value.budgetHeures,
            budgetEuros: value.budgetEuros
        });
    });
    
    // Trier par budget
    stats.parClient.sort((a, b) => b.budgetEuros - a.budgetEuros);
    
    // Budget global
    stats.budget.totalHeures = this.data.sousTaches.reduce((sum, st) => sum + (st.budgetHeures || 0), 0);
    stats.budget.totalEuros = this.data.sousTaches.reduce((sum, st) => sum + (st.budgetEuros || 0), 0);
    stats.budget.heuresPointees = this.data.pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
    stats.budget.heuresRestantes = stats.budget.totalHeures - stats.budget.heuresPointees;
    stats.budget.tauxRealisation = stats.budget.totalHeures > 0 
        ? ((stats.budget.heuresPointees / stats.budget.totalHeures) * 100).toFixed(2)
        : 0;
    
    // Temps
    stats.temps.totalHeuresPointees = stats.budget.heuresPointees;
    const joursUniques = new Set(this.data.pointages.map(p => p.date)).size;
    stats.temps.moyenneParJour = joursUniques > 0 
        ? (stats.budget.heuresPointees / joursUniques).toFixed(2)
        : 0;
    stats.temps.moyenneParAgent = this.data.agents.length > 0
        ? (stats.budget.heuresPointees / this.data.agents.length).toFixed(2)
        : 0;
    
    // Performance
    const aujourd'hui = new Date().toISOString().split('T')[0];
    stats.performance.tachesEnRetard = this.data.sousTaches.filter(st => 
        st.dateFin < aujourd'hui && st.statut !== 'termine'
    ).length;
    stats.performance.tachesDansLesTemps = this.data.sousTaches.filter(st => 
        st.dateFin >= aujourd'hui || st.statut === 'termine'
    ).length;
    stats.performance.tauxAchèvement = (
        (stats.parStatut.termine / this.data.sousTaches.length) * 100
    ).toFixed(2);
    
    const message = this.generateAdvancedStatsMessage(stats, entities);
    
    return {
        type: 'stats',
        message: message,
        stats: stats
    };
};

AIAssistant.prototype.handleCompare = function(normalizedQuery, originalQuery, intention) {
    let message = '📊 **Comparaison :**\n\n';
    
    // Comparer les agents
    if (intention.entities.agents.length >= 2) {
        const agent1 = intention.entities.agents[0];
        const agent2 = intention.entities.agents[1];
        
        const taches1 = this.data.sousTaches.filter(st => st.agentId === agent1.id);
        const taches2 = this.data.sousTaches.filter(st => st.agentId === agent2.id);
        
        const pointages1 = this.data.pointages.filter(p => p.agentId === agent1.id);
        const pointages2 = this.data.pointages.filter(p => p.agentId === agent2.id);
        
        const heures1 = pointages1.reduce((sum, p) => sum + (p.heures || 0), 0);
        const heures2 = pointages2.reduce((sum, p) => sum + (p.heures || 0), 0);
        
        message += `**${agent1.nom} vs ${agent2.nom}**\n\n`;
        message += `📋 Tâches : ${taches1.length} vs ${taches2.length}\n`;
        message += `⏱️ Heures : ${heures1}h vs ${heures2}h\n`;
        message += `✅ Terminées : ${taches1.filter(t => t.statut === 'termine').length} vs ${taches2.filter(t => t.statut === 'termine').length}\n`;
    }
    // Comparer les clients
    else if (intention.entities.clients.length >= 2) {
        const client1 = intention.entities.clients[0];
        const client2 = intention.entities.clients[1];
        
        const taches1 = this.data.sousTaches.filter(st => st.client === client1);
        const taches2 = this.data.sousTaches.filter(st => st.client === client2);
        
        const budget1 = taches1.reduce((sum, st) => sum + (st.budgetEuros || 0), 0);
        const budget2 = taches2.reduce((sum, st) => sum + (st.budgetEuros || 0), 0);
        
        message += `**${client1} vs ${client2}**\n\n`;
        message += `📋 Tâches : ${taches1.length} vs ${taches2.length}\n`;
        message += `💰 Budget : ${budget1.toLocaleString()}€ vs ${budget2.toLocaleString()}€\n`;
        message += `📁 Affaires : ${new Set(taches1.map(t => t.numAffaire)).size} vs ${new Set(taches2.map(t => t.numAffaire)).size}\n`;
    }
    else {
        message = '😕 Spécifiez deux éléments à comparer (agents, clients, ou affaires).\n';
        message += 'Exemple : "Compare Ahmed et Fatima"';
    }
    
    return {
        type: 'compare',
        message: message
    };
};

AIAssistant.prototype.handlePredict = function(normalizedQuery, originalQuery, intention) {
    const stats = this.handleAdvancedStats(normalizedQuery, originalQuery, intention).stats;
    
    let message = '🔮 **Prédictions et Estimations :**\n\n';
    
    // Prédiction de fin de projet
    const tachesEnCours = this.data.sousTaches.filter(st => st.statut === 'en-cours');
    const moyenneHeuresParJour = parseFloat(stats.temps.moyenneParJour);
    const heuresRestantes = stats.budget.heuresRestantes;
    
    if (moyenneHeuresParJour > 0) {
        const joursRestants = Math.ceil(heuresRestantes / moyenneHeuresParJour);
        const dateFin = new Date();
        dateFin.setDate(dateFin.getDate() + joursRestants);
        
        message += `📅 **Date de fin estimée :**\n`;
        message += `  • ${joursRestants} jours restants\n`;
        message += `  • Fin prévue : ${dateFin.toLocaleDateString('fr-FR')}\n\n`;
    }
    
    // Prédiction du budget
    const tauxRealisation = parseFloat(stats.budget.tauxRealisation);
    if (tauxRealisation > 0) {
        const budgetFinalEstime = (stats.budget.totalEuros / tauxRealisation) * 100;
        const depassement = budgetFinalEstime - stats.budget.totalEuros;
        
        message += `💰 **Budget estimé :**\n`;
        message += `  • Taux actuel : ${tauxRealisation}%\n`;
        message += `  • Budget final estimé : ${budgetFinalEstime.toLocaleString()}€\n`;
        
        if (depassement > 0) {
            message += `  • ⚠️ Dépassement potentiel : ${depassement.toLocaleString()}€\n`;
        } else {
            message += `  • ✅ Dans les limites du budget\n`;
        }
    }
    
    return {
        type: 'predict',
        message: message,
        predictions: {
            joursRestants: heuresRestantes / moyenneHeuresParJour,
            tauxRealisation: tauxRealisation
        }
    };
};

AIAssistant.prototype.handlePerformance = function(normalizedQuery, originalQuery, intention) {
    let message = '📈 **Analyse de Performance :**\n\n';
    
    // Performance par agent
    const performanceAgents = this.data.agents.map(agent => {
        const taches = this.data.sousTaches.filter(st => st.agentId === agent.id);
        const terminees = taches.filter(st => st.statut === 'termine').length;
        const enRetard = taches.filter(st => {
            const aujourd'hui = new Date().toISOString().split('T')[0];
            return st.dateFin < aujourd'hui && st.statut !== 'termine';
        }).length;
        
        return {
            nom: agent.nom,
            taches: taches.length,
            terminees: terminees,
            enRetard: enRetard,
            tauxReussite: taches.length > 0 ? ((terminees / taches.length) * 100).toFixed(1) : 0
        };
    });
    
    // Trier par taux de réussite
    performanceAgents.sort((a, b) => b.tauxReussite - a.tauxReussite);
    
    message += '**Top 3 des agents :**\n';
    performanceAgents.slice(0, 3).forEach((agent, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        message += `${medal} ${agent.nom} : ${agent.tauxReussite}% (${agent.terminees}/${agent.taches})\n`;
    });
    
    message += '\n**Agents nécessitant du support :**\n';
    const agentsEnDifficulte = performanceAgents.filter(a => a.enRetard > 0);
    if (agentsEnDifficulte.length > 0) {
        agentsEnDifficulte.forEach(agent => {
            message += `⚠️ ${agent.nom} : ${agent.enRetard} tâche(s) en retard\n`;
        });
    } else {
        message += '✅ Aucun agent en difficulté\n';
    }
    
    return {
        type: 'performance',
        message: message,
        performance: performanceAgents
    };
};

AIAssistant.prototype.handleAlerts = function(normalizedQuery, originalQuery, intention) {
    const alerts = [];
    const aujourd'hui = new Date().toISOString().split('T')[0];
    
    // Tâches en retard
    const tachesEnRetard = this.data.sousTaches.filter(st => 
        st.dateFin < aujourd'hui && st.statut !== 'termine'
    );
    
    if (tachesEnRetard.length > 0) {
        alerts.push({
            type: 'urgent',
            icon: '🚨',
            titre: 'Tâches en retard',
            count: tachesEnRetard.length,
            details: tachesEnRetard.slice(0, 3).map(st => st.nom)
        });
    }
    
    // Budget dépassé
    const budgetTotal = this.data.sousTaches.reduce((sum, st) => sum + (st.budgetHeures || 0), 0);
    const heuresPointees = this.data.pointages.reduce((sum, p) => sum + (p.heures || 0), 0);
    
    if (heuresPointees > budgetTotal * 0.9) {
        alerts.push({
            type: 'warning',
            icon: '⚠️',
            titre: 'Budget proche de la limite',
            count: 1,
            details: [`${((heuresPointees / budgetTotal) * 100).toFixed(1)}% utilisé`]
        });
    }
    
    // Tâches urgentes non commencées
    const tachesUrgentesEnAttente = this.data.sousTaches.filter(st => 
        st.priorite === 'urgente' && st.statut === 'en-attente'
    );
    
    if (tachesUrgentesEnAttente.length > 0) {
        alerts.push({
            type: 'info',
            icon: '💡',
            titre: 'Tâches urgentes en attente',
            count: tachesUrgentesEnAttente.length,
            details: tachesUrgentesEnAttente.slice(0, 3).map(st => st.nom)
        });
    }
    
    let message = '🔔 **Alertes et Notifications :**\n\n';
    
    if (alerts.length === 0) {
        message += '✅ Aucune alerte. Tout va bien !\n';
    } else {
        alerts.forEach(alert => {
            message += `${alert.icon} **${alert.titre}** (${alert.count})\n`;
            alert.details.forEach(detail => {
                message += `  • ${detail}\n`;
            });
            message += '\n';
        });
    }
    
    return {
        type: 'alert',
        message: message,
        alerts: alerts
    };
};

AIAssistant.prototype.handleReport = function(normalizedQuery, originalQuery, intention) {
    const stats = this.handleAdvancedStats(normalizedQuery, originalQuery, intention).stats;
    const performance = this.handlePerformance(normalizedQuery, originalQuery, intention).performance;
    const alerts = this.handleAlerts(normalizedQuery, originalQuery, intention).alerts;
    
    let message = '📋 **RAPPORT COMPLET - Département Méthodes**\n';
    message += `📅 Date : ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    message += '**📊 Vue d\'ensemble :**\n';
    message += `• ${stats.general.totalSousTaches} tâches sur ${stats.general.affairesUniques} affaires\n`;
    message += `• ${stats.general.totalAgents} agents actifs\n`;
    message += `• ${stats.general.clientsUniques} clients\n\n`;
    
    message += '**✅ État d\'avancement :**\n';
    message += `• Terminé : ${stats.parStatut.termine} (${((stats.parStatut.termine/stats.general.totalSousTaches)*100).toFixed(1)}%)\n`;
    message += `• En cours : ${stats.parStatut['en-cours']}\n`;
    message += `• En attente : ${stats.parStatut['en-attente']}\n\n`;
    
    message += '**💰 Budget :**\n';
    message += `• Budget total : ${stats.budget.totalEuros.toLocaleString()}€\n`;
    message += `• Heures pointées : ${stats.budget.heuresPointees}h / ${stats.budget.totalHeures}h\n`;
    message += `• Taux de réalisation : ${stats.budget.tauxRealisation}%\n\n`;
    
    message += '**🏆 Top Performers :**\n';
    performance.slice(0, 3).forEach((agent, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        message += `${medal} ${agent.nom} : ${agent.tauxReussite}%\n`;
    });
    
    if (alerts.length > 0) {
        message += '\n**⚠️ Points d\'attention :**\n';
        alerts.forEach(alert => {
            message += `${alert.icon} ${alert.titre} (${alert.count})\n`;
        });
    }
    
    return {
        type: 'report',
        message: message,
        report: {
            stats,
            performance,
            alerts
        }
    };
};

AIAssistant.prototype.handleCreate = function(normalizedQuery, originalQuery, intention) {
    let message = '✏️ **Création :**\n\n';
    message += 'Pour créer un élément, utilisez les formulaires de l\'application :\n\n';
    message += '• **Nouvelle tâche** : Onglet "Affaires" → Bouton "Nouvelle Sous-Tâche"\n';
    message += '• **Nouveau pointage** : Onglet "Pointage Journalier" → Formulaire de saisie\n';
    message += '• **Nouvel agent** : Onglet "Paramètres" → Section Agents\n\n';
    message += '💡 Astuce : L\'IA peut vous aider à trouver où créer ce que vous cherchez !';
    
    return {
        type: 'create',
        message: message
    };
};

AIAssistant.prototype.handleModify = function(normalizedQuery, originalQuery, intention) {
    let message = '✏️ **Modification :**\n\n';
    message += 'Pour modifier un élément :\n\n';
    message += '1. Recherchez l\'élément que vous souhaitez modifier\n';
    message += '2. Cliquez sur le bouton d\'édition (✏️)\n';
    message += '3. Modifiez les informations\n';
    message += '4. Enregistrez les changements\n\n';
    message += '💡 Demandez-moi de trouver l\'élément à modifier !';
    
    return {
        type: 'modify',
        message: message
    };
};

AIAssistant.prototype.handleDelete = function(normalizedQuery, originalQuery, intention) {
    let message = '🗑️ **Suppression :**\n\n';
    message += 'Pour supprimer un élément :\n\n';
    message += '1. Localisez l\'élément dans l\'application\n';
    message += '2. Cliquez sur le bouton de suppression (🗑️)\n';
    message += '3. Confirmez la suppression\n\n';
    message += '⚠️ Attention : Cette action est irréversible !';
    
    return {
        type: 'delete',
        message: message
    };
};

AIAssistant.prototype.handleExport = function(normalizedQuery, originalQuery, intention) {
    let message = '📤 **Export de données :**\n\n';
    message += 'Options d\'export disponibles :\n\n';
    message += '• **Excel** : Onglet "Affaires" → Bouton "Export Excel"\n';
    message += '• **JSON** : Utilisez le gestionnaire de données\n';
    message += '• **Rapports** : Générez un rapport complet avec "rapport complet"\n\n';
    message += '💡 Les exports incluent toutes les données filtrées actuellement affichées.';
    
    return {
        type: 'export',
        message: message
    };
};

AIAssistant.prototype.handleConfig = function(normalizedQuery, originalQuery, intention) {
    let message = '⚙️ **Configuration :**\n\n';
    
    if (this.platformData.config) {
        message += `**Configuration actuelle :**\n`;
        message += `• Heures/jour : ${this.platformData.config.HEURES_JOUR || 8}h\n`;
        message += `• Thème : ${this.platformData.theme || 'light'}\n`;
        message += `• Vues sauvegardées : ${this.platformData.savedViews?.length || 0}\n\n`;
    }
    
    message += 'Pour modifier la configuration :\n';
    message += '1. Allez dans l\'onglet "Paramètres"\n';
    message += '2. Section "Configuration Métier"\n';
    message += '3. Ajustez les paramètres souhaités\n';
    
    return {
        type: 'config',
        message: message,
        config: this.platformData.config
    };
};

AIAssistant.prototype.handleDateQuery = function(normalizedQuery, originalQuery, intention) {
    const aujourd'hui = new Date();
    let message = '📅 **Informations de date :**\n\n';
    
    // Trouver les tâches pour aujourd'hui
    const aujourdHuiStr = aujourd'hui.toISOString().split('T')[0];
    
    if (normalizedQuery.includes('aujourd\'hui') || normalizedQuery.includes('aujourdhui')) {
        const pointagesAujourdHui = this.data.pointages.filter(p => p.date === aujourdHuiStr);
        const heuresAujourdHui = pointagesAujourdHui.reduce((sum, p) => sum + (p.heures || 0), 0);
        
        message += `**Aujourd'hui (${aujourd'hui.toLocaleDateString('fr-FR')}) :**\n`;
        message += `• ${pointagesAujourdHui.length} pointages\n`;
        message += `• ${heuresAujourdHui}h travaillées\n\n`;
    }
    
    // Tâches qui finissent cette semaine
    const finSemaine = new Date(aujourd'hui);
    finSemaine.setDate(aujourd'hui.getDate() + 7);
    const finSemaineStr = finSemaine.toISOString().split('T')[0];
    
    const tachesCetteSemaine = this.data.sousTaches.filter(st => 
        st.dateFin >= aujourdHuiStr && st.dateFin <= finSemaineStr && st.statut !== 'termine'
    );
    
    if (tachesCetteSemaine.length > 0) {
        message += `**Cette semaine (échéance) :**\n`;
        tachesCetteSemaine.forEach(st => {
            message += `• ${st.nom} - ${new Date(st.dateFin).toLocaleDateString('fr-FR')}\n`;
        });
    }
    
    return {
        type: 'date',
        message: message
    };
};

AIAssistant.prototype.handleAdvancedHelp = function(normalizedQuery, originalQuery) {
    let message = '💡 **Guide d\'utilisation de l\'Assistant IA :**\n\n';
    
    message += '**🔍 Recherches :**\n';
    message += '• "Trouve les tâches de Ahmed"\n';
    message += '• "Affiche les projets urgents"\n';
    message += '• "Montre les tâches OCP en cours"\n';
    message += '• "Cherche les tâches en retard"\n\n';
    
    message += '**📊 Statistiques :**\n';
    message += '• "Statistiques générales"\n';
    message += '• "Combien de tâches par agent ?"\n';
    message += '• "Budget total des projets"\n';
    message += '• "Heures pointées ce mois"\n\n';
    
    message += '**📈 Analyses :**\n';
    message += '• "Analyse de performance"\n';
    message += '• "Compare Ahmed et Fatima"\n';
    message += '• "Prédis la fin du projet"\n';
    message += '• "Rapport complet"\n\n';
    
    message += '**🔔 Alertes :**\n';
    message += '• "Quelles sont les alertes ?"\n';
    message += '• "Tâches en retard"\n';
    message += '• "Problèmes de budget"\n\n';
    
    message += '**📅 Dates :**\n';
    message += '• "Tâches d\'aujourd\'hui"\n';
    message += '• "Échéances cette semaine"\n';
    message += '• "Pointages du mois"\n\n';
    
    message += '💬 Posez vos questions en langage naturel !';
    
    return {
        type: 'help',
        message: message
    };
};

AIAssistant.prototype.handleGeneralAdvanced = function(normalizedQuery, originalQuery) {
    // Recherche globale intelligente
    const searchResults = this.handleAdvancedSearch(normalizedQuery, originalQuery, {
        entities: this.analyzeEntities(normalizedQuery, originalQuery)
    });
    
    if (searchResults.count.agents + searchResults.count.sousTaches > 0) {
        return searchResults;
    }
    
    // Si aucun résultat, proposer de l'aide
    let message = `😕 Je n'ai pas bien compris "${originalQuery}".\n\n`;
    message += '💡 Essayez :\n';
    message += '• "Statistiques"\n';
    message += '• "Tâches urgentes"\n';
    message += '• "Rapport complet"\n';
    message += '• "Aide"\n\n';
    message += 'Ou tapez "aide" pour voir toutes les possibilités !';
    
    return {
        type: 'notfound',
        message: message
    };
};

AIAssistant.prototype.generateAdvancedSearchMessage = function(originalQuery, results, entities) {
    let message = `🔍 **Résultats pour "${originalQuery}" :**\n\n`;
    
    if (entities.agents.length > 0) {
        message += `👤 **Agents mentionnés :** ${entities.agents.map(a => a.nom).join(', ')}\n\n`;
    }
    
    if (results.affaires.length > 0) {
        message += `📁 **${results.affaires.length} affaire(s) :**\n`;
        results.affaires.slice(0, 3).forEach(affaire => {
            message += `• **${affaire.numAffaire}** - ${affaire.client}\n`;
            message += `  ${affaire.designation}\n`;
            message += `  ${affaire.sousTaches.length} sous-tâche(s)\n`;
        });
        if (results.affaires.length > 3) {
            message += `  ... et ${results.affaires.length - 3} autre(s)\n`;
        }
        message += '\n';
    }
    
    if (results.agents.length > 0) {
        message += `👥 **${results.agents.length} agent(s) :**\n`;
        results.agents.slice(0, 5).forEach(agent => {
            message += `• ${agent.nom} - ${agent.fonction}\n`;
        });
        if (results.agents.length > 5) {
            message += `  ... et ${results.agents.length - 5} autre(s)\n`;
        }
        message += '\n';
    }
    
    if (results.dependances.length > 0) {
        message += `🔗 **${results.dependances.length} dépendance(s) trouvée(s)**\n\n`;
    }
    
    if (message === `🔍 **Résultats pour "${originalQuery}" :**\n\n`) {
        message = `😕 Aucun résultat pour "${originalQuery}".\n`;
        message += 'Essayez d\'autres termes de recherche.';
    }
    
    return message;
};

AIAssistant.prototype.generateAdvancedStatsMessage = function(stats, entities) {
    let message = '📊 **Statistiques Complètes :**\n\n';
    
    message += '**Vue d\'ensemble :**\n';
    message += `• ${stats.general.totalSousTaches} tâches\n`;
    message += `• ${stats.general.totalAgents} agents\n`;
    message += `• ${stats.general.affairesUniques} affaires\n`;
    message += `• ${stats.general.clientsUniques} clients\n\n`;
    
    message += '**Par statut :**\n';
    message += `• ✅ Terminé : ${stats.parStatut.termine}\n`;
    message += `• ⚙️ En cours : ${stats.parStatut['en-cours']}\n`;
    message += `• ⏳ En attente : ${stats.parStatut['en-attente']}\n`;
    message += `• ⏸️ Suspendu : ${stats.parStatut.suspendu}\n\n`;
    
    message += '**Par priorité :**\n';
    message += `• 🔴 Urgente : ${stats.parPriorite.urgente}\n`;
    message += `• 🟠 Haute : ${stats.parPriorite.haute}\n`;
    message += `• 🟡 Moyenne : ${stats.parPriorite.moyenne}\n`;
    message += `• 🟢 Faible : ${stats.parPriorite.faible}\n\n`;
    
    message += '**Budget :**\n';
    message += `• Total : ${stats.budget.totalEuros.toLocaleString()}€\n`;
    message += `• Heures : ${stats.budget.heuresPointees}h / ${stats.budget.totalHeures}h\n`;
    message += `• Réalisation : ${stats.budget.tauxRealisation}%\n\n`;
    
    message += '**Top 3 clients :**\n';
    stats.parClient.slice(0, 3).forEach((client, index) => {
        message += `${index + 1}. ${client.client} : ${client.budgetEuros.toLocaleString()}€ (${client.affaires} affaires)\n`;
    });
    
    return message;
};

// Export
console.log('🚀 Extensions IA avancées chargées');
