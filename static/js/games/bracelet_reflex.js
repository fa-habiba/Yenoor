/**
 * Bracelet Reflex Game
 * Test your speed! Click the gems before they disappear.
 */

let state = {
    score: 0,
    timeLeft: 30,
    timerInterval: null,
    gameInterval: null,
    isPlaying: false
};

export function init(container) {
    // 1. Reset State
    clearInterval(state.timerInterval);
    clearInterval(state.gameInterval);
    state = { score: 0, timeLeft: 30, isPlaying: false };

    // 2. Build UI
    container.innerHTML = `
        <div style="text-align: center; width: 100%; height: 100%; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; padding: 10px 20px; background: #eee; border-radius: 8px;">
                <h3 style="margin: 0;">⚡ Speed Gem</h3>
                <div>
                    <span style="margin-right: 15px;">⏳ <span id="time-left">30</span>s</span>
                    <span>💎 <span id="score-board">0</span></span>
                </div>
            </div>

            <div id="game-area" style="
                flex-grow: 1; 
                position: relative; 
                background: #333; 
                margin-top: 10px; 
                border-radius: 8px; 
                overflow: hidden;
                cursor: crosshair;
            ">
                <div id="start-btn-container" style="
                    position: absolute; top:0; left:0; width:100%; height:100%; 
                    display:flex; justify-content:center; align-items:center; 
                    background:rgba(0,0,0,0.7); z-index:10;
                ">
                    <button id="start-btn" style="
                        padding: 15px 40px; font-size: 1.2rem; background: #00d2ff; 
                        border: none; border-radius: 30px; color: white; cursor: pointer;
                        font-weight: bold; box-shadow: 0 4px 15px rgba(0,210,255,0.4);
                    ">Start Game</button>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#start-btn').addEventListener('click', startGame);
}

function startGame() {
    const area = document.getElementById('game-area');
    const startOverlay = document.getElementById('start-btn-container');
    const timeDisplay = document.getElementById('time-left');
    
    startOverlay.style.display = 'none';
    state.isPlaying = true;

    // Game Timer
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        timeDisplay.innerText = state.timeLeft;
        if (state.timeLeft <= 0) endGame();
    }, 1000);

    // Spawn Gems Loop
    spawnGem(area);
}

function spawnGem(area) {
    if (!state.isPlaying) return;

    // Create Gem
    const gem = document.createElement('div');
    gem.innerText = '💎';
    gem.style.fontSize = '40px';
    gem.style.position = 'absolute';
    gem.style.userSelect = 'none';
    gem.style.cursor = 'pointer';
    gem.style.transition = 'transform 0.1s';
    
    // Random Position
    const x = Math.random() * (area.clientWidth - 50);
    const y = Math.random() * (area.clientHeight - 50);
    gem.style.left = `${x}px`;
    gem.style.top = `${y}px`;

    // Click Event
    gem.onmousedown = () => {
        state.score += 10;
        document.getElementById('score-board').innerText = state.score;
        gem.remove();
        // Spawning next one immediately makes it faster!
        clearTimeout(state.gameInterval);
        spawnGem(area);
    };

    area.appendChild(gem);

    // Gem disappears automatically if not clicked fast enough
    // Speed increases as score goes up
    const speed = Math.max(600, 2000 - (state.score * 5)); 
    
    state.gameInterval = setTimeout(() => {
        if (gem.parentElement) gem.remove();
        spawnGem(area);
    }, speed);
}

function endGame() {
    state.isPlaying = false;
    clearInterval(state.timerInterval);
    clearTimeout(state.gameInterval);

    const area = document.getElementById('game-area');
    area.innerHTML = `
        <div style="
            position: absolute; top:0; left:0; width:100%; height:100%; 
            display:flex; flex-direction:column; justify-content:center; align-items:center; 
            color: white;
        ">
            <h1>Game Over!</h1>
            <h2>Final Score: ${state.score}</h2>
            <button onclick="window.loadGameModule('Bracelet_Of_Speed')" style="
                margin-top:20px; padding: 10px 30px; cursor: pointer;
            ">Play Again</button>
        </div>
    `;
}