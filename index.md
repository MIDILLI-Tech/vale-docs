---
layout: home

hero:
  name: "Vale"
  text: "Documentation"
  tagline: "Lightweight PHP CMS & E-Commerce Platform"
  image: vale-logo.png
  actions:
    - theme: brand
      text: Get Started
      link: /en/latest/admin/
    - theme: alt
      text: Developer Guide
      link: /en/latest/developer/

features:
  - title: Content Management
    details: Modern WYSIWYG editor, hierarchical pages, and full post management.
  - title: E-Commerce
    details: Simple and variable products, inventory tracking, and multiple payment gateways.
  - title: Newsletter & Marketing
    details: Built-in newsletter campaigns, automations, and subscriber management.

---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'
onMounted(() => {
  const path = window.location.pathname
  const base = withBase('/')
  // Redirect root /docs/ or /docs to /docs/en/latest/
  if (path === base || path === base.replace(/\/$/, '')) {
    window.location.href = withBase('/en/latest/')
  }
})
</script>
