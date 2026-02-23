function ullalla(code) {
  const lines = code.split("\n");
  const context = { vars: {} };
  executeBlock(lines, context, 0);
}

function executeBlock(lines, context, offset) {
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    const lineNo = offset + i + 1;

    if (line === "") continue;

    const repeatMatch = line.match(/^(.+)번해\s*\{$/);
    if (repeatMatch) {
      const count = evaluate(repeatMatch[1], context, lineNo);
      if (!Number.isInteger(count)) {
        throw new Error(`[줄 ${lineNo}] 반복 횟수는 정수여야 합니다`);
      }

      const block = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "}") {
        block.push(lines[i]);
        i++;
      }

      if (i >= lines.length) {
        throw new Error(`[줄 ${lineNo}] 반복문 블록이 닫히지 않았습니다`);
      }

      for (let j = 0; j < count; j++) {
        executeBlock(block, context, lineNo);
      }
      continue;
    }

    if (line.startsWith("말해 ")) {
      const value = evaluate(line.slice(3).trim(), context, lineNo);
      console.log(value);
      continue;
    }

    if (line.startsWith("이건 나야 ")) {
      const rest = line.slice(6).trim();
      const eq = rest.indexOf("=");
      if (eq === -1) {
        throw new Error(`[줄 ${lineNo}] 변수 선언 문법 오류`);
      }
      const name = rest.slice(0, eq).trim();
      const expr = rest.slice(eq + 1).trim();
      context.vars[name] = evaluate(expr, context, lineNo);
      continue;
    }

    throw new Error(`[줄 ${lineNo}] 해석 불가능한 구문: ${line}`);
  }
}

function evaluate(expr, context, lineNo) {
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

  const op = expr.match(/^(.+)\s*([\+\-\*\/])\s*(.+)$/);
  if (op) {
    const left = evaluate(op[1], context, lineNo);
    const right = evaluate(op[3], context, lineNo);
    switch (op[2]) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
    }
  }

  throw new Error(`[줄 ${lineNo}] 식 해석 불가: ${expr}`);
}

window.ullalla = ullalla;
