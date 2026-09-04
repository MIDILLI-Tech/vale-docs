# Pages

Pages are used for static, hierarchical content such as "About Us", "Contact", or "Services".

## Creating a Page

Go to **Pages → Add New** to create a new page. The interface is similar to the [Post Editor](./posts), but with features specific to hierarchical site structures.

### Main Fields
- **Title**: The name of the page.
- **Slug**: The URL path.
- **Content**: The body of the page, created using the [Editor](./editor).

### Sidebar Configuration

- **Publish Box**:
  - **Status**: *Draft*, *Published*, or *Unlisted*.
  - **Template**: Choose the layout for this page (see [Page Templates](#page-templates) below).
  - **Parent Page**: Select a parent to create a hierarchical URL structure (e.g., `/services/web-design`).
  - **Sort Order**: A numeric value to control the order of pages in listings or menus (lower numbers come first).
  - **Preview** (Ctrl+Shift+P): Open a live preview of your page in a new tab.
  - **Show Active Version** (Ctrl+Shift+S): Open the published version of your page in a new tab (published pages only).
- **SEO Panel**: Per-page meta tags and social sharing settings.

## Page Templates

Vale allows you to change the entire layout of a page using templates. These are defined by your theme and automatically appear in the dropdown menu.

- **Standard**: The default layout including your theme's header, footer, and sidebar.
- **None (Blank Canvas)**: Renders the page body exactly as it is in the editor, without any theme styles, header, or footer. This is perfect for landing pages or custom-coded HTML content.
- **Theme-Specific Templates**: Depending on your active theme, you may see options like "Full Width", "Contact Layout", or "Landing Page".

::: info DEVELOPER NOTE
Developers can add new templates by placing `.twig` files in the `page-templates/` directory of a theme. See the [Theme Development](../../developer/themes#page-templates) guide for more details.
:::

::: tip SEE ALSO
- Organize your pages into [Navigation Menus](../appearance/menus).
- See the [Editor](./editor) for available features.
:::
