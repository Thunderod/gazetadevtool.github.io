# Deployment and Versioning Rule

Whenever updating the Gazeta Dev Console website:
1. Run `npm run deploy` to push the built production bundle to GitHub Pages.
2. Automatically run a source code commit sequence:
   - Determine the latest version commit number by looking at git history (e.g., `07_push`).
   - Increment the number (e.g., `08_push`).
   - Execute: `git add . ; git commit -m "[VERSION]_push" ; git push`

Always do this automatically without being asked.
