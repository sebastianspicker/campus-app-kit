# Ralph Loop 2: Security Review & Hardening

You are performing a security audit of this repository. Work through items ONE AT A TIME.

Before starting, read the project structure and understand what this project does, what inputs it accepts, what external services it talks to, and how it is deployed or run.

## Audit Scope

### 1. Dependency Security
- Run `pip audit`, `npm audit`, or the equivalent for this project's package manager
- Check if dependencies are pinned to specific versions (not just >=)
- Look for unnecessary dependencies that increase attack surface
- Verify no credentials, API keys, tokens, or secrets are committed anywhere (config files, source code, .env files checked in, hardcoded strings)

### 2. Input Validation & Injection
- Identify every entry point where external data enters the system (CLI args, API endpoints, file uploads, user input, config files, environment variables, database queries, message queues)
- For each entry point: verify inputs are validated, sanitized, and bounded
- Check file path handling for path traversal vulnerabilities
- Check for command injection via subprocess calls, shell=True, os.system, eval, exec
- Check for SQL/NoSQL injection in database queries
- If the project parses XML: check for XXE and billion laughs attacks
- If the project handles URLs: check for SSRF

### 3. OWASP Top 10 (adapted to project type)
- A01 Broken Access Control: Can unauthorized users access restricted resources or functions?
- A02 Cryptographic Failures: Are secrets stored in plaintext? Is sensitive data encrypted at rest and in transit?
- A03 Injection: SQL, NoSQL, OS command, LDAP, XSS — check all relevant vectors for this project
- A04 Insecure Design: Are there missing rate limits, missing authentication, or trust boundaries that don't exist?
- A05 Security Misconfiguration: Default credentials, unnecessary features enabled, debug mode in production configs, overly permissive CORS?
- A06 Vulnerable Components: Outdated dependencies with known CVEs?
- A07 Authentication Failures: Weak auth mechanisms, missing MFA considerations, session management issues?
- A08 Data Integrity Failures: Can data be tampered with? Are updates/deployments verified?
- A09 Logging Failures: Are security-relevant events logged? Do logs leak sensitive data (PII, tokens, passwords)?
- A10 SSRF: Does the application make outbound requests based on user-controlled input?

### 4. Project-Specific Attack Vectors
Identify attack vectors specific to this project's domain:
- If it's an MCP server: prompt injection via tool inputs, data exfiltration through responses, resource exhaustion
- If it's a web app: XSS, CSRF, clickjacking, cookie security
- If it processes user-uploaded files: malicious file content, zip bombs, polyglot files
- If it's a CLI tool: argument injection, symlink attacks, race conditions
- If it uses AI/LLM APIs: prompt injection through user-supplied content that gets sent to the model
- If it handles email or messages: content injection, header injection, phishing vector amplification

### 5. Data Privacy & Secrets Management
- Verify .gitignore excludes all sensitive data and local state
- Check that .env.example exists (with dummy values) but .env is never committed
- Verify no PII leaks into log outputs, error messages, or stack traces
- Check if the application sends data to external services unexpectedly
- If the project stores user data: verify it stays where the user expects it

## Rules

- Read actual files and trace actual code paths. Never guess about security.
- For each finding, rate severity: CRITICAL / HIGH / MEDIUM / LOW
- Fix issues directly when the fix is clear, safe, and does not change behavior.
- For complex fixes, document the vulnerability and recommended remediation without changing code.
- Update progress.md after each item.
- Work on ONLY ONE item per invocation.

## Completion

When you have thoroughly reviewed all security aspects and either fixed or documented every finding:

<promise>COMPLETE</promise>
