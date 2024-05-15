import GameInterface from './interfaces/game-interface.js';

// Initialisation de l'interface du jeu
const gameInterface = new GameInterface();


// Sélectionner le bouton "Execute"
const executeBtn = document.getElementById('executeBtn');


executeBtn.addEventListener('click', function() {
    // Appliquer les règles du Game of Life et mettre à jour la grille 2
    gameInterface.applyGameOfLifeRules(gameInterface.gridUser);
    // Comparer les deux grilles
    const gridsMatch = compareGrids(gameInterface.gridExample, gameInterface.gridAfterOneRound);
    // Si les deux grilles sont identiques
    if (gridsMatch) {
        alert("Réussi !");
    } 

});

// Fonction pour comparer deux grilles
function compareGrids(grid1, grid2) {
    // Parcourir toutes les cellules des deux grilles
    for (let i = 0; i < grid1.rows; i++) {
        for (let j = 0; j < grid1.cols; j++) {
            // Si les valeurs des cellules ne correspondent pas
            if (grid1.grid[i][j] !== grid2.grid[i][j]) {
                return false; // Les grilles sont différentes
            }
        }
    }
    return true; // Les grilles sont identiques
}
