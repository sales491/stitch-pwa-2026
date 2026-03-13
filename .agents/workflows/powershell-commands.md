---
description: Rules for running terminal commands in Windows PowerShell
---

# PowerShell Command Rules

When running terminal commands on this project, always follow these rules:

## 1. Never chain commands with `&&`
PowerShell does not support `&&` as a command chaining operator (that's bash/cmd syntax). Instead, run each command as a **separate `run_command` call**, one at a time.

**Wrong:**
```
git add . && git commit -m "message" && git push
```

**Correct:**
- First call: `git add .`
- Second call: `git commit -m "message"`
- Third call: `git push`

## 2. Never use `;` as a command separator for unrelated commands
While `;` works in PowerShell, it obscures errors. Run each command separately so you can check the output after each step.

## 3. Git workflow — always separate steps
For any git commit + push, always use three separate `run_command` calls:
1. `git add <files>`
2. `git commit -m "feat/fix/chore: descriptive message"`
3. `git push`

## 4. Long pipelines are fine in a single call
Piping within a single command is acceptable:
```
npx tsc --noEmit 2>&1 | Select-Object -First 40
```

## 5. Check output before proceeding
After each command, read the output to confirm success before running the next command in a sequence.
