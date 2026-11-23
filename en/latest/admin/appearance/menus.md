# Navigation Menus

Build and manage the menus that allow visitors to navigate your site.

## Creating a Menu

Go to **Appearance → Menus**.
1. **Name**: Give your menu a descriptive name (e.g., "Main Nav", "Footer Links").
2. **Items**: Add links to your menu. You can choose from:
   - **Pages**: Link to any of your hierarchical pages.
   - **Posts**: Link to a specific blog post.
   - **Categories**: Link to a post or product category.
   - **Custom Link**: Enter any URL and a label — or leave the URL empty to use the item as a heading (see [Non-Link Items](#non-link-items-headings)).

## Ordering & Nesting

- **Drag and Drop**: Simply drag items to change their order, or use the arrows.
- **Nesting**: Drag an item to the right next to another item to create a dropdown sub-menu. Vale supports multi-level nesting, which can be rendered by your theme.

## Non-Link Items (Headings)

A menu item does not have to be a link. Leave its **URL** empty and Vale renders the label as plain text instead of a clickable link — a heading that groups the items below it.

### In the header

A heading with sub-items still opens its dropdown on hover; the label itself goes nowhere. A heading without sub-items is simply a text label in the navigation row.

### In the footer

This is where headings are most useful. If a footer menu contains at least one heading, the footer switches to a column layout:

- Every top-level item becomes its own column.
- A heading is the column title; its sub-items are listed underneath, one per line.
- Top-level items that do have a URL stay clickable and keep their own column.
- Deeper nesting (sub-sub-items) is indented under its parent item.

If a footer menu has no headings, the footer keeps its usual single-row list of links.

::: tip EXAMPLE: two footer columns
1. Create a menu and assign it to the **Footer** location.
2. Add an item labeled "Company" and leave its URL empty.
3. Nest "About Us", "Careers", and "Contact" under it.
4. Add a second heading, "Legal", with "Privacy Policy" and "Terms" nested under it.
5. Save. The footer shows two side-by-side columns, each headed by a label that is not a link.
:::

::: info THEMES
The heading and footer-column behavior is built into the bundled themes (Default, Dark, Nova, Vivid). A custom theme renders menus with its own markup, so ask your developer to support items with an empty URL if headings still appear as links there.
:::

## Styling Menu Items with CSS Classes

Each menu item has an optional **CSS** field. You can use it to change the color or emphasis of that item in the navigation, for example to highlight a link in orange.

You don't need to write CSS code. Just type a ready-made class name. Copy one of the values below into the **CSS** field of your menu item and save.

### Text colors

Pick a color and type its class exactly as shown:

| Type this | Result |
|---|---|
| `text-orange-400` | Orange |
| `text-amber-400` | Amber (warm yellow-orange) |
| `text-red-400` | Red |
| `text-blue-400` | Blue |
| `text-green-400` | Green |
| `text-purple-400` | Purple |
| `text-pink-400` | Pink |
| `text-yellow-400` | Yellow |
| `text-cyan-400` | Cyan |

::: tip EXAMPLE: highlight a link in orange
1. In the menu editor, find the item you want to highlight.
2. In its **CSS** field, type: `text-orange-400`
3. Save the menu. The link now appears orange on your site.
:::

### Combining options

You can add more than one class, separated by a space:

| Type this | Result |
|---|---|
| `text-orange-400 font-bold` | Orange and bold |
| `text-orange-400 hover:text-orange-400` | Orange, stays orange on hover |
| `text-orange-400 underline` | Orange and underlined |

For a colored background behind the item, use `bg-` instead of `text-` (add `text-white` so the label stays readable):

| Type this | Result |
|---|---|
| `bg-orange-400 text-white` | Orange background, white label |

### What to know

- **Only the items themselves are affected.** In the bundled themes the class is applied to every item — links, headings, and the top items that open a dropdown. A custom theme may ignore the field.
- **Use exact class names.** Type the values from the tables above (e.g. `text-orange-400`). Random words or color codes like `#ff8c00` won't work.
- If a new class you type doesn't appear on the site, it may need to be rebuilt into the site's stylesheet. Ask your developer to run `npm run build:css`.

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
