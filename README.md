# Functional Calculator

A pure functional calculator implementation that evaluates arithmetic expressions without classes, global state, or mutations.

## Features

- ✅ Pure functional programming style (no classes, no global state)
- ✅ Supports: `+`, `-`, `*`, `/`, `(`, `)`
- ✅ Unary minus: `-3`, `-(2+5)`, `2*-4`
- ✅ Proper operator precedence and left-associativity
- ✅ Comprehensive error handling
- ✅ Web interface (HTML/CSS/JavaScript)
- ✅ Python backend implementation

## Usage

### Web Version (Recommended)

**Option 1: Direct HTML**
- Simply open `index.html` in your browser

**Option 2: Local Server**

Windows:
```bash
python run.py
```
or double-click `start.bat`

macOS/Linux:
```bash
python3 run.py
```

The calculator will automatically open in your default browser at `http://localhost:8000`

### Python Console Version

```bash
python calculator.py
```

Then enter an expression and press Enter.

## Architecture

### Functions (Pure & Immutable)

1. **tokenize(expr: str) → Tuple**
   - Parses expression string into tokens

2. **process_unary_minus(tokens: Tuple) → Tuple**
   - Converts unary minus to 'NEG' marker

3. **to_rpn(tokens: Tuple) → Tuple**
   - Converts infix to Reverse Polish Notation (RPN)
   - Uses Shunting-yard algorithm

4. **eval_rpn(rpn: Tuple) → float**
   - Evaluates RPN expression

5. **format_result(x: float) → str**
   - Formats output: integers without `.0`, decimals as-is

6. **calculate(expr: str) → str**
   - Main function: orchestrates all operations

## Files

- `index.html` - Web interface
- `style.css` - Styling
- `calc.js` - JavaScript implementation (functional)
- `calculator.py` - Python implementation (functional)
- `run.py` - Web server launcher
- `start.bat` - Windows batch launcher
- `start.ps1` - PowerShell launcher

## Error Handling

Errors are caught and formatted as:
- `ERROR: Invalid character`
- `ERROR: Mismatched parentheses`
- `ERROR: Malformed expression`
- `ERROR: Division by zero`

## Functional Programming Principles

✓ No classes
✓ No global variables
✓ No mutable data structures (tuples instead of lists)
✓ Pure functions with no side effects
✓ Higher-order functions where applicable
✓ Immutable operations throughout