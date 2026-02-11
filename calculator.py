"""
Functional Calculator - Pure functional implementation in Python
No classes, no global state, no mutations
"""

from functools import reduce
from typing import Union, List, Tuple


def tokenize(expr: str) -> Tuple:
    """
    Parse an arithmetic expression string into tokens.
    
    Args:
        expr: String expression
        
    Returns:
        Tuple of tokens (numbers, operators, parentheses)
        
    Raises:
        ValueError: If expression is invalid
    """
    expr_clean = expr.replace(" ", "")
    
    if not expr_clean:
        raise ValueError("Malformed expression")
    
    tokens = []
    i = 0
    
    while i < len(expr_clean):
        char = expr_clean[i]
        
        # Handle numbers (integers and floats)
        if char.isdigit() or (char == '.' and i + 1 < len(expr_clean) and expr_clean[i + 1].isdigit()):
            j = i
            has_dot = False
            
            while j < len(expr_clean) and (expr_clean[j].isdigit() or (expr_clean[j] == '.' and not has_dot)):
                if expr_clean[j] == '.':
                    has_dot = True
                j += 1
            
            tokens.append(float(expr_clean[i:j]))
            i = j
        
        # Handle operators and parentheses
        elif char in "+-*/()":
            tokens.append(char)
            i += 1
        
        else:
            raise ValueError("Invalid character")
    
    return tuple(tokens)


def process_unary_minus(tokens: Tuple) -> Tuple:
    """
    Convert minus operators to unary minus where appropriate.
    
    Args:
        tokens: Tuple of tokens
        
    Returns:
        Tuple with unary minus marked as 'NEG'
    """
    result = []
    
    for i, token in enumerate(tokens):
        if token == '-':
            # Check if it's a unary minus
            prev_token = tokens[i - 1] if i > 0 else None
            is_unary = i == 0 or prev_token in ('(', '+', '-', '*', '/')
            
            result.append('NEG' if is_unary else token)
        else:
            result.append(token)
    
    return tuple(result)


def get_precedence(op: str) -> int:
    """Get operator precedence."""
    if op == 'NEG':
        return 3
    elif op in ('+', '-'):
        return 1
    elif op in ('*', '/'):
        return 2
    return 0


def is_operator(token) -> bool:
    """Check if token is an operator."""
    return token in ('+', '-', '*', '/', 'NEG')


def shunting_yard(tokens: Tuple) -> Tuple:
    """
    Convert infix notation to postfix (RPN) using Shunting-yard algorithm.
    
    Args:
        tokens: Tuple of tokens in infix notation
        
    Returns:
        Tuple of tokens in RPN
        
    Raises:
        ValueError: If parentheses are mismatched
    """
    output_queue = []
    operator_stack = []
    
    for token in tokens:
        # Number
        if isinstance(token, float):
            output_queue.append(token)
        
        # Operator
        elif is_operator(token):
            while (operator_stack and 
                   operator_stack[-1] != '(' and 
                   is_operator(operator_stack[-1]) and
                   get_precedence(operator_stack[-1]) >= get_precedence(token)):
                output_queue.append(operator_stack.pop())
            operator_stack.append(token)
        
        # Left parenthesis
        elif token == '(':
            operator_stack.append(token)
        
        # Right parenthesis
        elif token == ')':
            found_left = False
            while operator_stack:
                op = operator_stack.pop()
                if op == '(':
                    found_left = True
                    break
                output_queue.append(op)
            
            if not found_left:
                raise ValueError("Mismatched parentheses")
    
    # Pop remaining operators
    while operator_stack:
        op = operator_stack.pop()
        if op in ('(', ')'):
            raise ValueError("Mismatched parentheses")
        output_queue.append(op)
    
    return tuple(output_queue)


def to_rpn(tokens: Tuple) -> Tuple:
    """
    Convert tokens to Reverse Polish Notation.
    
    Args:
        tokens: Tuple of tokens
        
    Returns:
        Tuple of tokens in RPN
    """
    processed_tokens = process_unary_minus(tokens)
    return shunting_yard(processed_tokens)


def apply_operator(op: str, left: float, right: float = None) -> float:
    """
    Apply an operator to operand(s).
    
    Args:
        op: Operator string
        left: Left operand (or only operand for unary operators)
        right: Right operand (optional for unary operators)
        
    Returns:
        Result of the operation
        
    Raises:
        ValueError: For division by zero or invalid operators
    """
    if op == '+':
        return left + right
    elif op == '-':
        return left - right
    elif op == '*':
        return left * right
    elif op == '/':
        if right == 0:
            raise ValueError("Division by zero")
        return left / right
    elif op == 'NEG':
        return -left
    else:
        raise ValueError("Malformed expression")


def eval_rpn(rpn: Tuple) -> float:
    """
    Evaluate an RPN expression.
    
    Args:
        rpn: Tuple of tokens in RPN
        
    Returns:
        Result of the evaluation
        
    Raises:
        ValueError: If RPN is malformed
    """
    stack = []
    
    for token in rpn:
        if isinstance(token, float):
            stack.append(token)
        elif is_operator(token):
            if token == 'NEG':
                if len(stack) < 1:
                    raise ValueError("Malformed expression")
                operand = stack.pop()
                result = apply_operator(token, operand)
                stack.append(result)
            else:
                if len(stack) < 2:
                    raise ValueError("Malformed expression")
                right = stack.pop()
                left = stack.pop()
                result = apply_operator(token, left, right)
                stack.append(result)
    
    if len(stack) != 1:
        raise ValueError("Malformed expression")
    
    return stack[0]


def format_result(x: float) -> str:
    """
    Format the result according to rules:
    - If integer: print without decimal point (e.g., 7)
    - If fractional: print as decimal (e.g., 2.5)
    
    Args:
        x: Floating point number
        
    Returns:
        Formatted string
    """
    if x == int(x):
        return str(int(x))
    else:
        return str(x)


def calculate(expr: str) -> str:
    """
    Main calculation function.
    Takes an expression string and returns the formatted result or error message.
    
    Args:
        expr: String expression
        
    Returns:
        Result string or ERROR message
    """
    try:
        tokens = tokenize(expr)
        rpn = to_rpn(tokens)
        result = eval_rpn(rpn)
        return format_result(result)
    except ValueError as e:
        return f"ERROR: {str(e)}"


def main():
    """
    Main entry point - reads from console and prints result.
    """
    expr = input()
    print(calculate(expr))


if __name__ == "__main__":
    main()


if __name__ == "__main__":
    main()
