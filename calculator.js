// Tokenizer function - parses expression into tokens
function tokenize(expr) {
    const exprClean = expr.replace(/\s+/g, "");
    
    if (!exprClean) {
        throw new Error("Malformed expression");
    }
    
    const tokens = [];
    let i = 0;
    
    while (i < exprClean.length) {
        const char = exprClean[i];
        
        // Handle numbers (integers and floats)
        if (/\d/.test(char) || (char === '.' && i + 1 < exprClean.length && /\d/.test(exprClean[i + 1]))) {
            let j = i;
            let hasDot = false;
            
            while (j < exprClean.length && (/\d/.test(exprClean[j]) || (exprClean[j] === '.' && !hasDot))) {
                if (exprClean[j] === '.') {
                    hasDot = true;
                }
                j++;
            }
            
            tokens.push(parseFloat(exprClean.substring(i, j)));
            i = j;
        }
        // Handle operators and parentheses
        else if ("+-*/()".includes(char)) {
            tokens.push(char);
            i++;
        }
        else {
            throw new Error("Invalid character");
        }
    }
    
    return tokens;
}

// Handle unary minus
function handleUnaryMinus(tokens) {
    const result = [];
    
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        if (token === '-') {
            // Check if it's a unary minus
            const prevToken = i > 0 ? tokens[i - 1] : null;
            if (i === 0 || prevToken === '(' || prevToken === '+' || prevToken === '-' || prevToken === '*' || prevToken === '/') {
                result.push('NEG');
            } else {
                result.push(token);
            }
        } else {
            result.push(token);
        }
    }
    
    return result;
}

// Get operator precedence
function precedence(op) {
    if (['+', '-'].includes(op)) return 1;
    if (['*', '/'].includes(op)) return 2;
    if (op === 'NEG') return 3;
    return 0;
}

// Check if token is an operator
function isOperator(token) {
    return ['+', '-', '*', '/', 'NEG'].includes(token);
}

// Shunting-yard algorithm
function shuntingYard(tokens) {
    const outputQueue = [];
    const operatorStack = [];
    
    for (const token of tokens) {
        // Number
        if (typeof token === 'number') {
            outputQueue.push(token);
        }
        // Operator
        else if (isOperator(token)) {
            while (operatorStack.length > 0 &&
                   operatorStack[operatorStack.length - 1] !== '(' &&
                   isOperator(operatorStack[operatorStack.length - 1]) &&
                   precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
        // Left parenthesis
        else if (token === '(') {
            operatorStack.push(token);
        }
        // Right parenthesis
        else if (token === ')') {
            let foundLeft = false;
            
            while (operatorStack.length > 0) {
                const op = operatorStack.pop();
                if (op === '(') {
                    foundLeft = true;
                    break;
                }
                outputQueue.push(op);
            }
            
            if (!foundLeft) {
                throw new Error("Mismatched parentheses");
            }
        }
    }
    
    // Pop remaining operators
    while (operatorStack.length > 0) {
        const op = operatorStack.pop();
        if (['(', ')'].includes(op)) {
            throw new Error("Mismatched parentheses");
        }
        outputQueue.push(op);
    }
    
    return outputQueue;
}

// Convert to RPN
function toRPN(tokens) {
    const processedTokens = handleUnaryMinus(tokens);
    return shuntingYard(processedTokens);
}

// Apply operator
function applyOperator(op, operands) {
    switch (op) {
        case '+':
            return operands[1] + operands[0];
        case '-':
            return operands[1] - operands[0];
        case '*':
            return operands[1] * operands[0];
        case '/':
            if (operands[0] === 0) {
                throw new Error("Division by zero");
            }
            return operands[1] / operands[0];
        case 'NEG':
            return -operands[0];
        default:
            throw new Error("Malformed expression");
    }
}

// Evaluate RPN
function evalRPN(rpn) {
    const stack = [];
    
    for (const token of rpn) {
        if (typeof token === 'number') {
            stack.push(token);
        } else if (isOperator(token)) {
            if (token === 'NEG') {
                if (stack.length < 1) {
                    throw new Error("Malformed expression");
                }
                const operand = stack.pop();
                const result = applyOperator(token, [operand]);
                stack.push(result);
            } else {
                if (stack.length < 2) {
                    throw new Error("Malformed expression");
                }
                const right = stack.pop();
                const left = stack.pop();
                const result = applyOperator(token, [right, left]);
                stack.push(result);
            }
        }
    }
    
    if (stack.length !== 1) {
        throw new Error("Malformed expression");
    }
    
    return stack[0];
}

// Format result
function formatResult(x) {
    // Check if the result is an integer value
    if (x === Math.floor(x)) {
        return String(Math.floor(x));
    } else {
        return String(x);
    }
}

// Main calculation function
function calculate(expr) {
    try {
        const tokens = tokenize(expr);
        const rpn = toRPN(tokens);
        const result = evalRPN(rpn);
        return formatResult(result);
    } catch (e) {
        return `ERROR: ${e.message}`;
    }
}

// DOM manipulation
document.addEventListener('DOMContentLoaded', function() {
    const expressionInput = document.getElementById('expression');
    const calcBtn = document.getElementById('calcBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultDiv = document.getElementById('result');
    
    function performCalculation() {
        const expr = expressionInput.value.trim();
        
        if (!expr) {
            resultDiv.textContent = '';
            resultDiv.classList.remove('success', 'error', 'empty');
            return;
        }
        
        const result = calculate(expr);
        
        if (result.startsWith('ERROR')) {
            resultDiv.textContent = result;
            resultDiv.classList.remove('success', 'empty');
            resultDiv.classList.add('error');
        } else {
            resultDiv.textContent = `Result: ${result}`;
            resultDiv.classList.remove('error', 'empty');
            resultDiv.classList.add('success');
        }
    }
    
    calcBtn.addEventListener('click', performCalculation);
    
    // Allow Enter key to calculate
    expressionInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performCalculation();
        }
    });
    
    clearBtn.addEventListener('click', function() {
        expressionInput.value = '';
        expressionInput.focus();
        resultDiv.textContent = '';
        resultDiv.classList.remove('success', 'error', 'empty');
    });
    
    expressionInput.focus();
});
