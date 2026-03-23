---
trigger: manual
---

updates package.json version +1
ng build
cd dist/{name}
npm login
npm publish --access public