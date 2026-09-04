# Contributing to Vale

First of all, thank you for considering contributing to Vale! Your help is highly appreciated and essential to making Vale a better product for everyone.

We're not lawyers (and honestly, we'd rather be writing code), but open-source projects rely on a few legal formalities to stay healthy. The two rules below — the AGPL-3.0 license and the Developer Certificate of Origin — exist so that everyone can use, share, and build on Vale without worrying about legal trouble down the road. They're quick to satisfy and mostly a matter of good habit.

By contributing to this repository, you agree to license your contribution under the **[GNU Affero General Public License v3.0 (AGPL-3.0)](https://github.com/vale/vale/blob/master/LICENSE)** and agree to the **Developer Certificate of Origin (DCO)**.

::: tip Documentation contributions
Contributions to the [Vale documentation](/vale-docs/LICENSE) are licensed under the **MIT License**, separate from the AGPL-3.0 software license.
:::

---

## Developer Certificate of Origin (DCO)

### Why does Vale require this?

In plain terms: by signing off, you confirm that you wrote the code you're submitting (or that you're allowed to submit it). This protects Vale, you, and everyone downstream — nobody wants a surprise copyright claim later. It's not a bureaucracy exercise; it's just a way to keep things clean and dispute-free as the project grows.

### What does this mean?

By signing off on your commits, you certify that you wrote the code or have the right to submit it under the AGPL-3.0 license.

### How to Sign-Off on Your Commits

Signing off on your commits is easy! You just need to add a `Signed-off-by` line to your commit messages.

#### 1. Command Line Git

When committing your changes from the command line, simply add the `-s` or `--signoff` flag:

```bash
git commit -s -m "Your descriptive commit message"
```

This will automatically append the following line to the end of your commit message:

```text
Signed-off-by: Your Name <your.email@example.com>
```

::: tip
Your Name and email must match your Git configuration: `git config user.name` and `git config user.email`.
:::

#### 2. Amending an Unsigned Commit

If you forgot to sign off on your most recent commit, you can fix it before pushing using:

```bash
git commit --amend --signoff
```

#### 3. Fixing Multiple Unsigned Commits

If you have multiple unsigned commits in your branch, you can perform an interactive rebase to sign them off:

```bash
git rebase --interactive --signoff origin/master
```

---

## Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages:

| Prefix | Use Case | Changelog |
|--------|----------|-----------|
| `fix:` | Bug fixes | Yes — Fixed |
| `feat:` | New features | Yes — Added |
| `add:` | New files, configs, or assets (non-functional additions) | Yes — Added |
| `chore:` | Maintenance, dependencies, tooling, CI | Yes — Changed |
| `refactor:` | Code changes that neither fix bugs nor add features | Yes — Changed |
| `docs:` | Documentation only | Yes — Documentation |
| `test:` | Adding or fixing tests | Yes — Testing |
| `perf:` | Performance improvements | Yes — Performance |
| `security:` | Security fixes or hardening | Yes — Security |
| `deprecate:` | Deprecating APIs or features | Yes — Deprecated |
| `remove:` | Removing code or features | Yes — Removed |
| `style:` | Code formatting, linting (CS-Fixer, PHPCS) | **No** |
| `ci:` | CI/CD pipeline changes | **No** |
| `build:` | Build scripts, asset compilation config | **No** |

Commits with `style:`, `ci:`, or `build:` prefixes are excluded from the changelog by the release orchestrator.

**Format:** `<type>: <short description>`

**Example:**
```bash
git commit -s -m "fix: resolve order total calculation with discounts"
```

### Rules

- **One dominant type:** When a commit spans multiple concerns, use the most dominant type.
- **Merge commits:** Automatically generated merge commits (e.g. `Merge pull request #123`) are exempt from this rule.
- **No revert prefix needed yet:** `revert:` commits will be handled in the future; for now, use `fix:` for reverts.

---

## Code of Conduct & Contribution Flow

1. **Fork the Repository:** Create your own fork and clone it locally.
2. **Create a Branch:** Create a branch for your feature or bug fix (`git checkout -b feature/amazing-feature` or `git checkout -b fix/annoying-bug`).
3. **Write and Test Your Code:** Ensure your code is thoroughly tested and adheres to Vale's coding standards.
4. **Follow Code Quality Standards:**
   - Vale uses `PHP-CS-Fixer` and `PHP CodeSniffer` to maintain style consistency.
   - Run code formatting and style checks before committing:
     ```bash
     composer fix
     composer cs-fix
     composer lint
     composer cs
     ```
5. **Commit Your Changes:** Remember to sign off using `git commit -s`.
6. **Push and Submit a Pull Request:** Push your branch to your fork and submit a PR to the main Vale repository.
   - Fill out the PR template checklist to confirm your agreement to the DCO and license.
