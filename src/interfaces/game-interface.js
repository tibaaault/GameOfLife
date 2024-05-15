import Grid from "../components/grid.js";

class GameInterface {
  constructor() {
    // Créer deux instances de la classe Grid avec des grilles de 5 par 5
    this.gridExample = new Grid(5, 5);
    this.gridUser = new Grid(5, 5);
    this.gridSolution = new Grid(5, 5);



    // Sélectionner les éléments canvas
    this.canvas1 = document.getElementById("gameCanvas");
    this.canvas2 = document.getElementById("gameUser");
    this.canvasAfterOneRound = document.getElementById("gameAfterOneRound");
    this.canvasSolution = document.getElementById("gameSolution");

    // Obtenir les contextes de rendu 2D des canvas
    this.ctx1 = this.canvas1.getContext("2d");
    this.ctx2 = this.canvas2.getContext("2d");
    this.ctxAfterOneRound = this.canvasAfterOneRound.getContext("2d");
    this.ctxSolution = this.canvasSolution.getContext("2d");

    // Remplir aléatoirement 15% des cases de gridExample en vert
    this.fillRandomCells(this.gridExample, 0.15);

    this.gridExample = this.applyGameOfLifeRulesOnce(this.gridExample);

    // Dessiner les grilles sur les canvas
    this.drawGrid(this.gridExample, this.ctx1, this.canvas1);
    this.drawGrid(this.gridUser, this.ctx2, this.canvas2);

    // Ajouter un gestionnaire d'événement de clic au canvas gameUser
    this.canvas2.addEventListener("click", this.handleClick.bind(this));

    // Sélectionner le conteneur pour le canvas de la grille après un tour
    this.gameAfterOneRoundContainer = document.getElementById(
      "gameAfterOneRoundContainer"
    );

    // Sélectionner le canvas de la grille après un tour
    this.gameAfterOneRoundCanvas = document.getElementById("gameCanvas");

    // Ajouter un gestionnaire d'événement de clic au bouton reset
    const resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", this.resetGrid.bind(this));

    const solutionBtn = document.getElementById("solutionBtn");
    // Ajouter un gestionnaire d'événement pour le clic sur le bouton
    solutionBtn.addEventListener("click", this.showSolution.bind(this));
  }

  // Méthode pour dessiner une grille sur un canvas
  drawGrid(grid, ctx, canvas) {
    // Calculer la largeur et la hauteur des cellules en fonction de la taille du canvas et de la grille
    const cellWidth = canvas.width / grid.cols;
    const cellHeight = canvas.height / grid.rows;

    // Parcourir toutes les cellules de la grille
    for (let i = 0; i < grid.rows; i++) {
      for (let j = 0; j < grid.cols; j++) {
        // Déterminer la couleur de remplissage en fonction de la valeur de la cellule
        const cellColor = grid.grid[i][j] === 1 ? "#00FF00" : "#ffffff";

        // Dessiner un rectangle pour chaque cellule de la grille
        ctx.beginPath();
        ctx.rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        ctx.fillStyle = cellColor;
        ctx.fill();
        ctx.strokeStyle = "#000000"; // Couleur de bordure noire
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  // Méthode pour gérer les clics sur le canvas gameUser
  handleClick(event) {
    const rect = this.canvas2.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculer l'indice de la cellule correspondant au clic
    const cellWidth = this.canvas2.width / this.gridUser.cols;
    const cellHeight = this.canvas2.height / this.gridUser.rows;
    const row = Math.floor(y / cellHeight);
    const col = Math.floor(x / cellWidth);

    // Changer la couleur de la cellule en vert ou en blanc
    if (this.gridUser.grid[row][col] === 0) {
      this.gridUser.grid[row][col] = 1; // Vert
    } else {
      this.gridUser.grid[row][col] = 0; // Blanc
    }

    // Redessiner la grille mise à jour
    this.drawGrid(this.gridUser, this.ctx2, this.canvas2);
  }

  fillRandomCells(grid, percentage) {
    const totalCells = grid.rows * grid.cols;
    const cellsToFill = Math.round(totalCells * percentage);

    for (let i = 0; i < cellsToFill; i++) {
      const randomRow = Math.floor(Math.random() * grid.rows);
      const randomCol = Math.floor(Math.random() * grid.cols);
      grid.grid[randomRow][randomCol] = 1;
    }
  }

  // Méthode pour appliquer les règles du Game of Life et mettre à jour la grille 2
  applyGameOfLifeRules() {
    const newGrid = new Grid(this.gridUser.rows, this.gridUser.cols);

    for (let i = 0; i < this.gridUser.rows; i++) {
      for (let j = 0; j < this.gridUser.cols; j++) {
        const neighbors = this.countNeighbors(this.gridUser, i, j);
        if (this.gridUser.grid[i][j] === 1) {
          if (neighbors < 2 || neighbors > 3) {
            newGrid.grid[i][j] = 0; // La cellule meurt
          } else {
            newGrid.grid[i][j] = 1; // La cellule survit
          }
        } else {
          if (neighbors === 3) {
            newGrid.grid[i][j] = 1; // La cellule née
          } else {
            newGrid.grid[i][j] = 0; // La cellule reste morte
          }
        }
      }
    }

    // Dessiner la nouvelle grille sur le canvas après un tour
    this.drawGrid(newGrid, this.ctxAfterOneRound, this.canvasAfterOneRound);
  }

  applyGameOfLifeRulesOnce(grid) {
    const newGrid = new Grid(grid.rows, grid.cols);

    for (let i = 0; i < grid.rows; i++) {
      for (let j = 0; j < grid.cols; j++) {
        const neighbors = this.countNeighbors(grid, i, j);
        if (grid.grid[i][j] === 1) {
          if (neighbors < 2 || neighbors > 3) {
            newGrid.grid[i][j] = 0; // La cellule meurt
          } else {
            newGrid.grid[i][j] = 1; // La cellule survit
          }
        } else {
          if (neighbors === 3) {
            newGrid.grid[i][j] = 1; // La cellule née
          } else {
            newGrid.grid[i][j] = 0; // La cellule reste morte
          }
        }
      }
    }

    // Retourner la grille mise à jour
    return newGrid;
  }

  // Méthode pour compter le nombre de voisins vivants d'une cellule
  countNeighbors(grid, x, y) {
    let count = 0;
    const rows = grid.rows;
    const cols = grid.cols;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighborX = x + i;
        const neighborY = y + j;

        // Vérifier si le voisin est à l'intérieur de la grille et s'il est vivant
        if (
          neighborX >= 0 &&
          neighborX < rows &&
          neighborY >= 0 &&
          neighborY < cols &&
          !(i === 0 && j === 0) &&
          grid.grid[neighborX][neighborY] === 1
        ) {
          count++;
        }
      }
    }

    return count;
  }

  resetGrid() {
    // Réinitialiser la grille utilisateur (gridUser)
    this.gridUser.clear(); // Supprimer toutes les cellules vivantes
    this.drawGrid(this.gridUser, this.ctx2, this.canvas2); // Redessiner la grille utilisateur

    // Créer un nouveau gridExample
    this.gridExample = new Grid(5, 5);
    // Remplir aléatoirement 15% des cases de gridExample en vert
    this.fillRandomCells(this.gridExample, 0.15);
    // Redessiner la grille gridExample
    this.drawGrid(this.gridExample, this.ctx1, this.canvas1);

    // Nettoyer le canvas après un tour
    this.ctxAfterOneRound.clearRect(
      0,
      0,
      this.canvasAfterOneRound.width,
      this.canvasAfterOneRound.height
    );
  }

  showSolution() {
    // Dessiner la solution sur le canvas gameSolution
    this.drawGrid(this.gridSolution, this.ctxSolution, this.canvasSolution);
  }

  init() {}
}

export default GameInterface;
