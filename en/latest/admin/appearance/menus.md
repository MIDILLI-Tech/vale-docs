# Navigation Menus

Build and manage the menus that allow visitors to navigate your site.

## Creating a Menu

Go to **Appearance → Menus**.
1. **Name**: Give your menu a descriptive name (e.g., "Main Nav", "Footer Links").
2. **Items**: Add links to your menu. You can choose from:
   - **Pages**: Link to any of your hierarchical pages.
   - **Posts**: Link to a specific blog post.
   - **Categories**: Link to a post or product category.
   - **Custom Link**: Enter any URL and a label.

## Ordering & Nesting

- **Drag and Drop**: Simply drag items to change their order, or use the arrows.
- **Nesting**: Drag an item to the right next to another item to create a dropdown sub-menu. Vale supports multi-level nesting, which can be rendered by your theme.

## Locations

Your theme defines specific locations where menus can be displayed (e.g., "Header", "Footer").

1. **Assigning a Menu**: Once you've built a menu, you can assign it to a location in the **Manage Locations** tab or directly within the menu editor.
2. **Supported Locations**: The available locations are determined by your active theme's `theme.json` file.

::: info MISSING LOCATIONS
If you see a warning **"(missing in current theme)"**, it means that menu location was defined in a previous theme but is not supported by your current active theme. The menu remains saved, but it won't be displayed until assigned to a supported location.
:::

::: tip SEE ALSO
- Learn about [Theme Development](../../developer/themes) and how to define menu locations and render them.
- Create [Hierarchical Pages](../content/pages) to organize your content.
:::
