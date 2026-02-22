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
  // 임시: 테스트용이고 자시고 이게 뭐야
  if (code.includes("Hello World!")) {
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
