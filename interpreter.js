function ullalla(code) {
  const lines = tokenize(code);
  const context = { vars: {} };
  executeBlock(lines, context);
}

function tokenize(code) {
  return code
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);
}

function executeBlock(lines, context) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const repeatMatch = line.match(/^(.+)번해\s*\{$/);
    if (repeatMatch) {
      const count = evaluate(repeatMatch[1], context);
      if (!Number.isInteger(count)) {
        throw new Error("반복 횟수는 정수여야 합니다.");
      }

      const block = [];
      i++;
      while (i < lines.length && lines[i] !== "}") {
        block.push(lines[i]);
        i++;
      }

      if (lines[i] !== "}") {
        throw new Error("반복문 블록이 닫히지 않았습니다.");
      }

      for (let j = 0; j < count; j++) {
        executeBlock(block, context);
      }
      continue;
    }

    if (line.startsWith("말해 ")) {
      const value = evaluate(line.slice(3).trim(), context);
      console.log(value);
      continue;
    }

    if (line.startsWith("이건 나야 ")) {
      const assign = line.slice(6).trim();
      const eq = assign.indexOf("=");
      if (eq === -1) {
        throw new Error("변수 선언 문법 오류");
      }
      const name = assign.slice(0, eq).trim();
      const valueExpr = assign.slice(eq + 1).trim();
      context.vars[name] = evaluate(valueExpr, context);
      continue;
    }

    throw new Error("해석 불가능한 구문: " + line);
  }
}

function evaluate(expr, context) {
  expr = expr.trim();

  if (expr.startsWith('"') && expr.endsWith('"')) {
    return expr.slice(1, -1);
  }

  if (!isNaN(expr)) {
    return Number(expr);
  }

  if (expr in context.vars) {
    return context.vars[expr];
  }

  const opMatch = expr.match(/^(.+)\s*([\+\-\*\/])\s*(.+)$/);
  if (opMatch) {
    const left = evaluate(opMatch[1], context);
    const right = evaluate(opMatch[3], context);
    switch (opMatch[2]) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
    }
  }

  throw new Error("식 해석 불가: " + expr);
}

window.ullalla = ullalla;
