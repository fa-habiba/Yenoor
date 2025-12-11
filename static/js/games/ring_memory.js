/**
 * Ring Memory Match Game
 * A modular game that renders inside the provided container.
 */

let state = {
    flippedCards: [],
    matchedPairs: 0,
    isLocked: false,
    score: 0
};

// Jewelry-themed icons
const ICONS = ['💎', '💍', '🔮', '💠', '👑', '⚜️']; 
const CARD_PAIRS = [...ICONS, ...ICONS]; // Duplicate for pairs

export function init(container) {
    // 1. Reset State
    state = { flippedCards: [], matchedPairs: 0, isLocked: false, score: 0 };
    
    // 2. Build UI
    container.innerHTML = `
        <div style="text-align: center; width: 100%; height: 100%; display: flex; flex-direction: column;">
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
                <h3 style="margin: 0;">💎 Gem Match</h3>
                <span style="background: #333; color: #fff; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">Moves: <span id="move-count">0</span></span>
            </div>
            
            <div id="game-grid" style="
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 10px; 
                flex-grow: 1; 
                padding: 10px; 
                max-width: 400px; 
                margin: 0 auto;
            "></div>

            <div id="win-message" style="display: none; margin-top: 10px; color: green; font-weight: bold;">
                🎉 Collection Complete!
            </div>
        </div>
    `;

    // 3. Shuffle and Deal
    const grid = container.querySelector('#game-grid');
    const deck = shuffle(CARD_PAIRS);

    deck.forEach((icon, index) => {
        const card = document.createElement('div');
        card.dataset.icon = icon;
        card.dataset.index = index;
        card.style.cssText = `
            background: #333; 
            border-radius: 8px; 
            cursor: pointer; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            font-size: 2rem; 
            color: transparent; 
            transition: transform 0.3s, background 0.3s;
            user-select: none;
            aspect-ratio: 1;
        `;
        
        card.addEventListener('click', () => flipCard(card, grid));
        grid.appendChild(card);
    });
}

function flipCard(card, grid) {
    if (state.isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Flip animation
    card.classList.add('flipped');
    card.style.background = '#fff';
    card.style.border = '2px solid #333';
    card.style.color = '#333';
    card.style.transform = 'rotateY(180deg)';
    card.innerText = card.dataset.icon;

    state.flippedCards.push(card);

    if (state.flippedCards.length === 2) {
        checkMatch(grid);
    }
}

function checkMatch(grid) {
    state.isLocked = true;
    state.score++;
    document.getElementById('move-count').innerText = state.score;

    const [card1, card2] = state.flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;

    if (isMatch) {
        disableCards(card1, card2);
    } else {
        unflipCards(card1, card2);
    }
}

function disableCards(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    // Visual feedback for match
    card1.style.background = '#d4edda';
    card2.style.background = '#d4edda';
    
    state.flippedCards = [];
    state.matchedPairs++;
    state.isLocked = false;

    if (state.matchedPairs === ICONS.length) {
        document.getElementById('win-message').style.display = 'block';
    }
}

function unflipCards(card1, card2) {
    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        
        // Reset styles
        card1.style.background = '#333';
        card1.style.color = 'transparent';
        card1.style.border = 'none';
        card1.style.transform = 'rotateY(0deg)';
        card1.innerText = '';
        
        card2.style.background = '#333';
        card2.style.color = 'transparent';
        card2.style.border = 'none';
        card2.style.transform = 'rotateY(0deg)';
        card2.innerText = '';

        state.flippedCards = [];
        state.isLocked = false;
    }, 1000);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}