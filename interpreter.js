function run() {
  const code = document.getElementById("code").value;
  const out = document.getElementById("out");
  const err = document.getElementById("err");

  out.textContent = "";
  err.textContent = "";

  try {
    const result = interpret(code);
    out.textContent = result.stdout;
    err.textContent = result.stderr;
  } catch (e) {
    err.textContent = e.toString();
  }
}

function interpret(code) {
  // 임시: 테스트용
  if (code.includes("혀엉")) {
    return {
      stdout: "Hello, world!",
      stderr: ""
    };
  }

  return {
    stdout: "",
    stderr: "에러: 아직 구현 안 됨"
  };
}
