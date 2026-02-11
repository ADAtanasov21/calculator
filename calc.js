/**
 * Functional Calculator with Extended Functions
 * All operations implemented functionally
 */

// State helper - immutable state management
const createState = () => ({
    display: '0',
    accumulator: 0,
    operator: null,
    shouldResetDisplay: true,
    lastInput: null,
    memory: 0,
});

let state = createState();
let displayEl = null;

// Helper functions
const isNumber = (str) => !isNaN(parseFloat(str));

const updateDisplay = (value) => {
    state = { ...state, display: String(value) };
    if (displayEl) displayEl.textContent = state.display;
};

const getDisplayValue = () => parseFloat(state.display) || 0;

// Number input
const handleNumber = (num) => {
    if (state.shouldResetDisplay) {
        updateDisplay(num);
        state = { ...state, shouldResetDisplay: false };
    } else {
        const current = state.display;
        if (num === '.' && current.includes('.')) return;
        if (num === '.' && current === '0') {
            updateDisplay('0.');
        } else if (current === '0' && num !== '.') {
            updateDisplay(num);
        } else {
            updateDisplay(current + num);
        }
    }
};

// Operator handling
const handleOperator = (op) => {
    const current = getDisplayValue();
    
    if (state.operator && !state.shouldResetDisplay) {
        // Calculate previous operation
        const result = calculate(state.accumulator, current, state.operator);
        updateDisplay(result);
        state = { ...state, accumulator: result, operator: op, shouldResetDisplay: true };
    } else {
        state = { ...state, accumulator: current, operator: op, shouldResetDisplay: true };
    }
};

// Calculate operation
const calculate = (a, b, op) => {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? 0 : a / b;
        default: return b;
    }
};

// Equals
const handleEquals = () => {
    if (state.operator) {
        const current = getDisplayValue();
        const result = calculate(state.accumulator, current, state.operator);
        updateDisplay(formatNumber(result));
        state = { ...state, accumulator: result, operator: null, shouldResetDisplay: true };
    }
};

// Scientific functions
const handleSquare = () => {
    const val = getDisplayValue();
    const result = val * val;
    updateDisplay(formatNumber(result));
    state = { ...state, shouldResetDisplay: true };
};

const handleSqrt = () => {
    const val = getDisplayValue();
    if (val < 0) {
        updateDisplay('Error');
        return;
    }
    const result = Math.sqrt(val);
    updateDisplay(formatNumber(result));
    state = { ...state, shouldResetDisplay: true };
};

const handleReciprocal = () => {
    const val = getDisplayValue();
    if (val === 0) {
        updateDisplay('Error');
        return;
    }
    const result = 1 / val;
    updateDisplay(formatNumber(result));
    state = { ...state, shouldResetDisplay: true };
};

const handlePercent = () => {
    const val = getDisplayValue();
    if (state.operator && state.accumulator !== 0) {
        const result = (state.accumulator * val) / 100;
        updateDisplay(formatNumber(result));
        state = { ...state, shouldResetDisplay: true };
    } else {
        updateDisplay(formatNumber(val / 100));
        state = { ...state, shouldResetDisplay: true };
    }
};

const handleToggleSign = () => {
    const val = getDisplayValue();
    updateDisplay(formatNumber(-val));
    state = { ...state, shouldResetDisplay: true };
};

const handleBackspace = () => {
    if (state.shouldResetDisplay) return;
    const current = state.display;
    if (current.length === 1 || (current.length === 2 && current.includes('-'))) {
        updateDisplay('0');
        state = { ...state, shouldResetDisplay: true };
    } else {
        updateDisplay(current.slice(0, -1));
    }
};

const handleCE = () => {
    updateDisplay('0');
    state = { ...state, shouldResetDisplay: true };
};

const handleClear = () => {
    state = createState();
    updateDisplay('0');
};

// Format number - remove unnecessary decimals
const formatNumber = (num) => {
    if (num === Math.floor(num)) {
        return String(Math.floor(num));
    }
    return parseFloat(num.toFixed(10)).toString();
};

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    displayEl = document.querySelector('.display .current');
    
    // Number buttons
    document.querySelectorAll('.btn.num').forEach(btn => {
        btn.addEventListener('click', () => handleNumber(btn.dataset.num));
    });
    
    // Operator buttons
    document.querySelectorAll('.btn.op').forEach(btn => {
        btn.addEventListener('click', () => handleOperator(btn.dataset.op));
    });
    
    // Function buttons
    const functionHandlers = {
        'square': handleSquare,
        'sqrt': handleSqrt,
        'reciprocal': handleReciprocal,
        'percent': handlePercent,
        'toggle-sign': handleToggleSign,
        'backspace': handleBackspace,
        'ce': handleCE,
        'clear': handleClear,
        'equal': handleEquals,
    };
    
    document.querySelectorAll('.btn.fn, .btn.equal').forEach(btn => {
        const fn = btn.dataset.fn;
        if (functionHandlers[fn]) {
            btn.addEventListener('click', functionHandlers[fn]);
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
        if (e.key === '.') handleNumber('.');
        if (e.key === '+') handleOperator('+');
        if (e.key === '-') handleOperator('-');
        if (e.key === '*') handleOperator('*');
        if (e.key === '/') { e.preventDefault(); handleOperator('/'); }
        if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleEquals(); }
        if (e.key === 'Escape') handleClear();
        if (e.key === 'Backspace') { e.preventDefault(); handleBackspace(); }
    });
});
