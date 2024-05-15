export default class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createGrid(rows, cols);
  }

  createGrid(rows, cols) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = 0; // Initialiser chaque case de la grille à zéro
      }
    }
    return grid;
  }

  // Méthode pour effacer toutes les cellules de la grille (les mettre à 0)
  clear() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
      }
    }
  }

}
