/**
 * 2048游戏核心逻辑
 */
document.addEventListener('DOMContentLoaded', function() {
    // 游戏主类
    class Game2048 {
        constructor() {
            this.size = 4; // 4x4网格
            this.tileContainer = document.getElementById('tile-container');
            this.scoreContainer = document.getElementById('score');
            this.bestScoreContainer = document.getElementById('best-score');
            this.messageContainer = document.querySelector('.game-message');
            this.score = 0;
            
            // 从本地存储加载最高分
            this.bestScore = localStorage.getItem('bestScore') || 0;
            this.bestScoreContainer.textContent = this.bestScore;
            
            // 初始化游戏
            this.grid = this.createGrid();
            this.setup();
            
            // 绑定按钮事件
            document.getElementById('new-game-button').addEventListener('click', () => this.restart());
            document.getElementById('retry-button').addEventListener('click', () => this.restart());
            
            // 绑定键盘事件
            this.bindKeyboardEvents();
        }
        
        // 创建空网格
        createGrid() {
            let grid = [];
            for (let i = 0; i < this.size; i++) {
                grid[i] = [];
                for (let j = 0; j < this.size; j++) {
                    grid[i][j] = null;
                }
            }
            return grid;
        }
        
        // 设置游戏初始状态
        setup() {
            this.clearGrid();
            this.addStartTiles();
            this.updateUI();
        }
        
        // 清空网格
        clearGrid() {
            this.grid = this.createGrid();
            this.score = 0;
            this.updateScore();
            this.tileContainer.innerHTML = '';
        }
        
        // 添加初始方块
        addStartTiles() {
            for (let i = 0; i < 2; i++) {
                this.addRandomTile();
            }
        }
        
        // 添加随机方块
        addRandomTile() {
            if (this.hasEmptyCell()) {
                let value = Math.random() < 0.9 ? 2 : 4;
                let cell = this.randomEmptyCell();
                this.grid[cell.x][cell.y] = value;
                this.addTile(value, cell.x, cell.y);
            }
        }
        
        // 检查是否有空单元格
        hasEmptyCell() {
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    if (!this.grid[x][y]) {
                        return true;
                    }
                }
            }
            return false;
        }
        
        // 随机选择一个空单元格
        randomEmptyCell() {
            let emptyCells = [];
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    if (!this.grid[x][y]) {
                        emptyCells.push({ x: x, y: y });
                    }
                }
            }
            
            if (emptyCells.length) {
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
            return null;
        }
        
        // 添加方块到UI
        addTile(value, x, y) {
            const tile = document.createElement('div');
            tile.classList.add('tile', `tile-${value}`);
            tile.textContent = value;
            
            // 设置方块位置
            tile.style.left = (y * 106.25 + y * 15) + 'px';
            tile.style.top = (x * 106.25 + x * 15) + 'px';
            
            // 添加到容器
            this.tileContainer.appendChild(tile);
            
            // 添加出现动画
            setTimeout(() => {
                tile.style.transform = 'scale(1)';
            }, 100);
        }
        
        // 更新UI
        updateUI() {
            // 清空容器
            this.tileContainer.innerHTML = '';
            
            // 重新添加所有方块
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    if (this.grid[x][y]) {
                        this.addTile(this.grid[x][y], x, y);
                    }
                }
            }
        }
        
        // 更新分数
        updateScore() {
            this.scoreContainer.textContent = this.score;
            
            // 更新最高分
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                this.bestScoreContainer.textContent = this.bestScore;
                localStorage.setItem('bestScore', this.bestScore);
            }
        }
        
        // 绑定键盘事件
        bindKeyboardEvents() {
            document.addEventListener('keydown', (event) => {
                switch(event.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        event.preventDefault();
                        this.move('up');
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        event.preventDefault();
                        this.move('right');
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        event.preventDefault();
                        this.move('down');
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        event.preventDefault();
                        this.move('left');
                        break;
                }
            });
            
            // 添加触摸滑动支持
            let touchStartX, touchStartY;
            let touchEndX, touchEndY;
            
            const gameContainer = document.querySelector('.game-container');
            
            gameContainer.addEventListener('touchstart', (event) => {
                if (event.touches.length > 0) {
                    touchStartX = event.touches[0].clientX;
                    touchStartY = event.touches[0].clientY;
                }
            });
            
            gameContainer.addEventListener('touchend', (event) => {
                if (event.changedTouches.length > 0) {
                    touchEndX = event.changedTouches[0].clientX;
                    touchEndY = event.changedTouches[0].clientY;
                    
                    const dx = touchEndX - touchStartX;
                    const dy = touchEndY - touchStartY;
                    
                    // 确定滑动方向
                    if (Math.abs(dx) > Math.abs(dy)) {
                        // 水平滑动
                        if (dx > 0) {
                            this.move('right');
                        } else {
                            this.move('left');
                        }
                    } else {
                        // 垂直滑动
                        if (dy > 0) {
                            this.move('down');
                        } else {
                            this.move('up');
                        }
                    }
                }
            });
        }
        
        // 移动方块
        move(direction) {
            // 保存当前网格状态，用于检查是否有变化
            const previousGrid = JSON.stringify(this.grid);
            
            // 根据方向处理移动
            switch(direction) {
                case 'up':
                    this.moveUp();
                    break;
                case 'right':
                    this.moveRight();
                    break;
                case 'down':
                    this.moveDown();
                    break;
                case 'left':
                    this.moveLeft();
                    break;
            }
            
            // 检查网格是否有变化
            const currentGrid = JSON.stringify(this.grid);
            if (previousGrid !== currentGrid) {
                // 添加新方块
                this.addRandomTile();
                
                // 更新UI
                this.updateUI();
                
                // 检查游戏状态
                this.checkGameState();
            }
        }
        
        // 向上移动
        moveUp() {
            for (let y = 0; y < this.size; y++) {
                let column = [];
                
                // 获取当前列
                for (let x = 0; x < this.size; x++) {
                    if (this.grid[x][y]) {
                        column.push(this.grid[x][y]);
                    }
                }
                
                // 合并相同的方块
                column = this.mergeTiles(column);
                
                // 清空当前列
                for (let x = 0; x < this.size; x++) {
                    this.grid[x][y] = null;
                }
                
                // 更新网格
                for (let x = 0; x < column.length; x++) {
                    this.grid[x][y] = column[x];
                }
            }
        }
        
        // 向右移动
        moveRight() {
            for (let x = 0; x < this.size; x++) {
                let row = [];
                
                // 获取当前行
                for (let y = 0; y < this.size; y++) {
                    if (this.grid[x][y]) {
                        row.push(this.grid[x][y]);
                    }
                }
                
                // 合并相同的方块
                row = this.mergeTiles(row.reverse());
                row.reverse();
                
                // 清空当前行
                for (let y = 0; y < this.size; y++) {
                    this.grid[x][y] = null;
                }
                
                // 更新网格
                for (let y = 0; y < row.length; y++) {
                    this.grid[x][this.size - 1 - y] = row[y];
                }
            }
        }
        
        // 向下移动
        moveDown() {
            for (let y = 0; y < this.size; y++) {
                let column = [];
                
                // 获取当前列
                for (let x = 0; x < this.size; x++) {
                    if (this.grid[x][y]) {
                        column.push(this.grid[x][y]);
                    }
                }
                
                // 合并相同的方块
                column = this.mergeTiles(column.reverse());
                column.reverse();
                
                // 清空当前列
                for (let x = 0; x < this.size; x++) {
                    this.grid[x][y] = null;
                }
                
                // 更新网格
                for (let x = 0; x < column.length; x++) {
                    this.grid[this.size - 1 - x][y] = column[x];
                }
            }
        }
        
        // 向左移动
        moveLeft() {
            for (let x = 0; x < this.size; x++) {
                let row = [];
                
                // 获取当前行
                for (let y = 0; y < this.size; y++) {
                    if (this.grid[x][y]) {
                        row.push(this.grid[x][y]);
                    }
                }
                
                // 合并相同的方块
                row = this.mergeTiles(row);
                
                // 清空当前行
                for (let y = 0; y < this.size; y++) {
                    this.grid[x][y] = null;
                }
                
                // 更新网格
                for (let y = 0; y < row.length; y++) {
                    this.grid[x][y] = row[y];
                }
            }
        }
        
        // 合并相同的方块
        mergeTiles(tiles) {
            let result = [];
            
            for (let i = 0; i < tiles.length; i++) {
                if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
                    // 合并相同的方块
                    const mergedValue = tiles[i] * 2;
                    result.push(mergedValue);
                    
                    // 更新分数
                    this.score += mergedValue;
                    this.updateScore();
                    
                    // 跳过下一个方块
                    i++;
                } else {
                    result.push(tiles[i]);
                }
            }
            
            return result;
        }
        
        // 检查游戏状态
        checkGameState() {
            // 检查是否达到2048
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    if (this.grid[x][y] === 2048) {
                        this.win();
                        return;
                    }
                }
            }
            
            // 检查是否还有空单元格
            if (this.hasEmptyCell()) {
                return;
            }
            
            // 检查是否还有可以合并的方块
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    const value = this.grid[x][y];
                    
                    // 检查右侧
                    if (y < this.size - 1 && value === this.grid[x][y + 1]) {
                        return;
                    }
                    
                    // 检查下方
                    if (x < this.size - 1 && value === this.grid[x + 1][y]) {
                        return;
                    }
                }
            }
            
            // 游戏结束
            this.gameOver();
        }
        
        // 游戏胜利
        win() {
            this.messageContainer.classList.add('game-won');
            this.messageContainer.querySelector('p').textContent = '你赢了!';
        }
        
        // 游戏结束
        gameOver() {
            this.messageContainer.classList.add('game-over');
            this.messageContainer.querySelector('p').textContent = '游戏结束!';
        }
        
        // 重新开始游戏
        restart() {
            this.messageContainer.classList.remove('game-won');
            this.messageContainer.classList.remove('game-over');
            this.setup();
        }
    }
    
    // 初始化游戏
    const game = new Game2048();
});