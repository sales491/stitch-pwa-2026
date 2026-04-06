---
description: Rules for running terminal commands in Windows PowerShell
---

## ⚠️ CRITICAL — PowerShell is NOT bash

This project runs on **Windows PowerShell**. The following rules are ABSOLUTE and must never be broken:

### 1. NEVER use `&&` to chain commands
`&&` is a bash operator. It **does not work** in PowerShell and causes a parser error.

**Wrong:**
```
git add -A && git commit -m "msg"
```

**Correct — use `;` to chain, or run separately:**
```
git add -A; git commit -m "msg"
```
Or as two separate `run_command` calls.

### 2. Use `;` for command chaining
Semicolons chain commands sequentially in PowerShell regardless of exit code (similar to `command1; command2` in bash, not `&&`).

### 3. Common patterns

**Stage and commit:**
```powershell
git add -A; git commit -m "your message"
```

**Commit and push:**
```powershell
git commit -m "your message"; git push
```

**Check status:**
```powershell
git status
```

**Install and run:**
```powershell
npm install; npm run dev
```

### 4. No bash-isms
Avoid all bash-specific syntax:
- No `&&` or `||` chaining
- No `$()` subshells (use PowerShell equivalents)
- No `export VAR=value` (use `$env:VAR = "value"`)
