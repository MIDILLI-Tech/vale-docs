import { defineConfig } from 'vitepress';

const CURRENT_VERSION = 'v0.60';

// Single source of truth for environment versions referenced across the docs.
// Update these values and rebuild — every @key@ placeholder matching a
// VARIANTS key is replaced automatically in prose and code blocks.
const VARIANTS = {
  phpVersion: '8.3',
  nodeVersion: '24',
  composerVersion: '2.x',
  mysqlVersion: '8.4',
  mariadbVersion: '11.8',
  pgsqlVersion: '14.0'
};

function versionVarsPlugin(md) {
  // \@key@ renders the literal token, @key@ is replaced with the VARIANTS value.
  const replace = (text) =>
    text.replace(/\\(@\w+@)|@(\w+)@/g, (match, escaped, key) =>
      escaped || (Object.prototype.hasOwnProperty.call(VARIANTS, key) ? VARIANTS[key] : match)
    );
  return (state) => {
    for (const token of state.tokens) {
      if (token.type === 'fence') {
        token.content = replace(token.content);
      } else if (token.type === 'inline' && token.children) {
        for (const child of token.children) {
          if (child.type === 'text' || child.type === 'code_inline') {
            child.content = replace(child.content);
          }
        }
      }
    }
  };
}

const searchHeadingRegex = /<h(\d*).*?>(.*?<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi;
const searchHeadingContentRegex = /(.*?)<a.*? href="#(.*?)".*?>.*?<\/a>/i;

function guideForPath(file) {
  const p = file.replace(/\\/g, '/');
  if (/\/admin\//.test(p)) return 'Admin Guide';
  if (/\/developer\//.test(p)) return 'Developer Guide';
  return null;
}

function* splitSectionsWithGuide(file, html) {
  const guide = guideForPath(file);
  const result = html.split(searchHeadingRegex);
  result.shift();
  let parentTitles = [];
  for (let i = 0; i < result.length; i += 3) {
    const level = parseInt(result[i]) - 1;
    const heading = result[i + 1];
    const headingResult = searchHeadingContentRegex.exec(heading);
    const title = (headingResult?.[1] ?? '').replace(/<[^>]*>/g, '').trim();
    const anchor = headingResult?.[2] ?? '';
    const content = result[i + 2];
    if (!title || !content) continue;
    const displayTitle =
      level === 0 && guide && !title.startsWith(guide) ? `${guide}: ${title}` : title;
    let titles = parentTitles.slice(0, level);
    titles[level] = displayTitle;
    titles = titles.filter(Boolean);
    yield { anchor, titles, text: content.replace(/<[^>]*>/g, '') };
    if (level === 0) {
      parentTitles = [displayTitle];
    } else {
      parentTitles[level] = displayTitle;
    }
  }
}

export default defineConfig({
  title: "Vale Documentation",
  description: "Lightweight PHP CMS & E-Commerce Platform",
  head: [],
  vite: {
    build: {
      chunkSizeWarningLimit: 1000
    }
  },
  markdown: {
    config(md) {
      md.core.ruler.push('version-vars', versionVarsPlugin(md));
    }
  },
  router: {
    prefetchLinks: true
  },
  appearance: true,
  themeConfig: {
    logo: {
      src: "/vale-logo.png",
      alt: "Vale Logo",
      link: "/en/latest/"
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/MIDILLI-Tech/vale-docs"
      }
    ],
    search: {
      provider: "local",
      options: {
        detailedView: true,
        miniSearch: {
          _splitIntoSections: splitSectionsWithGuide,
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: {
              title: 4,
              text: 1
            },
            filter(result) {
              const path = window.location.pathname;
              const id = String(result.id);
              // Only search within the active (latest) version snapshot.
              if (!id.includes('/en/latest/')) return false;
              const inAdmin = path.includes('/admin/');
              const inDeveloper = path.includes('/developer/');
              if (inAdmin) return id.includes('/admin/');
              if (inDeveloper) return id.includes('/developer/');
              return true;
            }
          }
        }
      }
    },
    footer: {
      message: 'Documentation released under the <a href="/vale-docs/LICENSE.">MIT License</a>.',
      copyright: "Copyright © 2024-present Vale"
    }
  },
  locales: {
    en: {
      label: "English",
      lang: "en",
      link: "/en/latest/",
      themeConfig: {
        nav: [
          {
            text: "Versions",
            items: [
              {
                text: CURRENT_VERSION,
                link: `/en/${CURRENT_VERSION}/admin/`
              },
              {
                text: "Latest",
                link: "/en/latest/"
              }
            ]
          },
          {
            text: "Admin Guide",
            link: "/en/latest/admin/"
          },
          {
            text: "Developer Guide",
            link: "/en/latest/developer/"
          }
        ],
        sidebar: {
          "/en/latest/admin/": [
            {
              text: "Admin Guide",
              items: [
                {
                  text: "Installation",
                  link: "/en/latest/admin/installation"
                },
                {
                  text: "Settings",
                  link: "/en/latest/admin/settings/",
                  items: [
                    {
                      text: "General",
                      link: "/en/latest/admin/settings/general"
                    },
                    {
                      text: "Content",
                      link: "/en/latest/admin/settings/content"
                    },
                    {
                      text: "Discussion",
                      link: "/en/latest/admin/settings/discussion"
                    },
                    {
                      text: "E-Commerce",
                      link: "/en/latest/admin/settings/ecommerce"
                    },
                    {
                      text: "Registration",
                      link: "/en/latest/admin/settings/registration"
                    },
                    {
                      text: "SEO",
                      link: "/en/latest/admin/settings/seo"
                    },
                    {
                      text: "Mail",
                      link: "/en/latest/admin/settings/mail"
                    },
                    {
                      text: "Privacy & Security",
                      link: "/en/latest/admin/settings/privacy"
                    },
                    {
                      text: "Analytics",
                      link: "/en/latest/admin/settings/analytics"
                    },
                    {
                      text: "Maintenance",
                      link: "/en/latest/admin/settings/maintenance"
                    },
                    {
                      text: "Advanced",
                      link: "/en/latest/admin/settings/advanced"
                    }
                  ]
                },
                {
                  text: "Content Management",
                  link: "/en/latest/admin/content/",
                  items: [
                    {
                      text: "Editor",
                      link: "/en/latest/admin/content/editor"
                    },
                    {
                      text: "Multi-Language",
                      link: "/en/latest/admin/content/translations"
                    },
                    {
                      text: "Posts",
                      link: "/en/latest/admin/content/posts"
                    },
                    {
                      text: "Pages",
                      link: "/en/latest/admin/content/pages"
                    },
                    {
                      text: "Custom Content Types",
                      link: "/en/latest/admin/content/content-types"
                    },
                    {
                      text: "Revisions",
                      link: "/en/latest/admin/content/revisions"
                    },
                    {
                      text: "Media",
                      link: "/en/latest/admin/content/media"
                    },
                    {
                      text: "Comments",
                      link: "/en/latest/admin/content/comments"
                    }
                  ]
                },
                {
                  text: "E-Commerce",
                  link: "/en/latest/admin/ecommerce/",
                  items: [
                    {
                      text: "Products",
                      link: "/en/latest/admin/ecommerce/products"
                    },
                    {
                      text: "Orders",
                      link: "/en/latest/admin/ecommerce/orders"
                    },
                    {
                      text: "Coupons",
                      link: "/en/latest/admin/ecommerce/coupons"
                    },
                    {
                      text: "Product Feeds",
                      link: "/en/latest/admin/ecommerce/product-feeds"
                    },
                    {
                      text: "Checkout",
                      link: "/en/latest/admin/ecommerce/checkout"
                    },
                    {
                      text: "Exchange Rates",
                      link: "/en/latest/admin/settings/exchange-rates"
                    },
                    {
                      text: "Customer Account",
                      link: "/en/latest/admin/ecommerce/account"
                    },
                    {
                      text: "Memberships",
                      link: "/en/latest/admin/ecommerce/memberships"
                    },
                    {
                      text: "Abandoned Cart",
                      link: "/en/latest/admin/ecommerce/abandoned-cart"
                    }
                  ]
                },
                {
                  text: "Marketing",
                  link: "/en/latest/admin/marketing/",
                  items: [
                    {
                      text: "Newsletter",
                      link: "/en/latest/admin/marketing/newsletter"
                    },
                    {
                      text: "Automations",
                      link: "/en/latest/admin/marketing/automations"
                    },
                    {
                      text: "Analytics",
                      link: "/en/latest/admin/marketing/analytics"
                    },
                    {
                      text: "Advertising",
                      link: "/en/latest/admin/marketing/advertising"
                    }
                  ]
                },
                {
                  text: "Forms",
                  link: "/en/latest/admin/forms"
                },
                {
                  text: "Users & Roles",
                  link: "/en/latest/admin/users"
                },
                {
                  text: "Appearance",
                  link: "/en/latest/admin/appearance/",
                  items: [
                    {
                      text: "Themes",
                      link: "/en/latest/admin/appearance/themes"
                    },
                    {
                      text: "Menus",
                      link: "/en/latest/admin/appearance/menus"
                    },
                    {
                      text: "Fonts",
                      link: "/en/latest/admin/appearance/fonts"
                    }
                  ]
                },
                {
                  text: "System",
                  link: "/en/latest/admin/system/",
                  items: [
                    {
                      text: "Updates & Backups",
                      link: "/en/latest/admin/system/updates"
                    },
                    {
                      text: "GDPR & Privacy",
                      link: "/en/latest/admin/system/gdpr"
                    },
                    {
                      text: "CLI Commands",
                      link: "/en/latest/admin/system/cli"
                    },
                    {
                      text: "Troubleshooting",
                      link: "/en/latest/admin/system/troubleshooting"
                    },
                    {
                      text: "Spam Prevention",
                      link: "/en/latest/admin/system/spam"
                    }
                  ]
                },
                {
                  text: "Migration",
                  link: "/en/latest/admin/migration/",
                  items: [
                    {
                      text: "From WordPress",
                      link: "/en/latest/admin/migration/migrate-from-wordpress"
                    },
                    {
                      text: "From Ghost",
                      link: "/en/latest/admin/migration/migrate-from-ghost"
                    },
                    {
                      text: "From / To Vale",
                      link: "/en/latest/admin/migration/migrate-from-vale"
                    }
                  ]
                }
              ]
            }
          ],
          "/en/latest/developer/": [
            {
              text: "Getting Started",
              items: [
                {
                  text: "Introduction",
                  link: "/en/latest/developer/introduction"
                },
                {
                  text: "Prerequisites",
                  link: "/en/latest/developer/prerequisites"
                },
                {
                  text: "Getting Started",
                  link: "/en/latest/developer/getting-started"
                },
                {
                  text: "Agent Skills",
                  link: "/en/latest/developer/agent-skills"
                }
              ]
            },
            {
              text: "Architecture",
              link: "/en/latest/developer/architecture/",
              items: [
                {
                  text: "Domain Model",
                  link: "/en/latest/developer/architecture/domain"
                },
                {
                  text: "Use Cases",
                  link: "/en/latest/developer/architecture/use-cases"
                },
                {
                  text: "Repository Pattern",
                  link: "/en/latest/developer/architecture/repository"
                }
              ]
            },
            {
              text: "Extending Vale",
              items: [
                {
                  text: "Theme Development",
                  link: "/en/latest/developer/themes",
                  items: [
                    {
                      text: "Twig Globals",
                      link: "/en/latest/developer/themes/twig-globals"
                    },
                    {
                      text: "Twig Functions",
                      link: "/en/latest/developer/twig/functions"
                    },
                    {
                      text: "Twig Filters",
                      link: "/en/latest/developer/twig/filters"
                    }
                  ]
                },
                {
                  text: "REST API",
                  link: "/en/latest/developer/api"
                },
                {
                  text: "Shortcodes",
                  link: "/en/latest/developer/shortcodes"
                },
                {
                  text: "Webhooks",
                  link: "/en/latest/developer/webhooks"
                },
                {
                  text: "Payment Gateways",
                  link: "/en/latest/developer/payment-gateways"
                },
                {
                  text: "SSO Integration",
                  link: "/en/latest/developer/sso"
                },
                {
                  text: "Hooks & Events",
                  link: "/en/latest/developer/hooks"
                }
              ]
            },
            {
              text: "Tooling & Workflow",
              items: [
                {
                  text: "Security",
                  link: "/en/latest/developer/security/"
                },
                {
                  text: "Migrations",
                  link: "/en/latest/developer/migrations"
                },
                {
                  text: "Translations Tooling",
                  link: "/en/latest/developer/translations-tooling"
                },
                {
                  text: "CLI Reference",
                  link: "/en/latest/admin/system/cli"
                },
                {
                  text: "Testing",
                  link: "/en/latest/developer/testing/"
                },
                {
                  text: "Dependency Scan",
                  link: "/en/latest/developer/dependency-scan"
                },
                {
                  text: "Environment Variables",
                  link: "/en/latest/developer/env"
                }
              ]
            },
            {
              text: "Ship",
              items: [
                {
                  text: "Deployment",
                  link: "/en/latest/developer/deployment/",
                  items: [
                    {
                      text: "Docker",
                      link: "/en/latest/developer/deployment/docker"
                    },
                    {
                      text: "CapRover",
                      link: "/en/latest/developer/deployment/caprover"
                    }
                  ]
                },
                {
                  text: "Release Process",
                  link: "/en/latest/developer/releases"
                }
              ]
            },
            {
              text: "Meta",
              items: [
                {
                  text: "Documentation Guide",
                  link: "/en/latest/developer/documentation"
                },
                {
                  text: "Contributing",
                  link: "/en/latest/developer/contributing"
                }
              ]
            }
          ],
          [`/en/${CURRENT_VERSION}/admin/`]: [
            {
              text: "Admin Guide",
              items: [
                {
                  text: "Introduction",
                  link: `/en/${CURRENT_VERSION}/admin/introduction`
                },
                {
                  text: "Installation",
                  link: `/en/${CURRENT_VERSION}/admin/installation`
                },
                {
                  text: "Settings",
                  link: `/en/${CURRENT_VERSION}/admin/settings/`,
                  items: [
                    {
                      text: "General",
                      link: `/en/${CURRENT_VERSION}/admin/settings/general`
                    },
                    {
                      text: "E-Commerce",
                      link: `/en/${CURRENT_VERSION}/admin/settings/ecommerce`
                    },
                    {
                      text: "Mail",
                      link: `/en/${CURRENT_VERSION}/admin/settings/mail`
                    },
                    {
                      text: "SEO",
                      link: `/en/${CURRENT_VERSION}/admin/settings/seo`
                    },
                    {
                      text: "Content",
                      link: `/en/${CURRENT_VERSION}/admin/settings/content`
                    },
                    {
                      text: "Discussion",
                      link: `/en/${CURRENT_VERSION}/admin/settings/discussion`
                    },
                    {
                      text: "Membership",
                      link: `/en/${CURRENT_VERSION}/admin/settings/membership`
                    },
                    {
                      text: "Exchange Rates",
                      link: `/en/${CURRENT_VERSION}/admin/settings/exchange-rates`
                    },
                    {
                      text: "Advanced",
                      link: `/en/${CURRENT_VERSION}/admin/settings/advanced`
                    }
                  ]
                },
                {
                  text: "Content Management",
                  items: [
                    {
                      text: "Editor",
                      link: `/en/${CURRENT_VERSION}/admin/editor`
                    },
                    {
                      text: "Multi-Language",
                      link: `/en/${CURRENT_VERSION}/admin/translations`
                    },
                    {
                      text: "Posts",
                      link: `/en/${CURRENT_VERSION}/admin/posts`
                    },
                    {
                      text: "Pages",
                      link: `/en/${CURRENT_VERSION}/admin/pages`
                    },
                    {
                      text: "Custom Content Types",
                      link: `/en/${CURRENT_VERSION}/admin/content-types`
                    },
                    {
                      text: "Revisions",
                      link: `/en/${CURRENT_VERSION}/admin/revisions`
                    },
                    {
                      text: "Media",
                      link: `/en/${CURRENT_VERSION}/admin/media`
                    },
                    {
                      text: "Comments",
                      link: `/en/${CURRENT_VERSION}/admin/comments`
                    }
                  ]
                },
                {
                  text: "E-Commerce",
                  items: [
                    {
                      text: "Products",
                      link: `/en/${CURRENT_VERSION}/admin/products`
                    },
                    {
                      text: "Orders",
                      link: `/en/${CURRENT_VERSION}/admin/orders`
                    },
                    {
                      text: "Coupons",
                      link: `/en/${CURRENT_VERSION}/admin/coupons`
                    },
                    {
                      text: "Product Feeds",
                      link: `/en/${CURRENT_VERSION}/admin/product-feeds`
                    },
                    {
                      text: "Checkout",
                      link: `/en/${CURRENT_VERSION}/admin/checkout`
                    },
                    {
                      text: "Customer Account",
                      link: `/en/${CURRENT_VERSION}/admin/account`
                    },
                    {
                      text: "Abandoned Cart",
                      link: `/en/${CURRENT_VERSION}/admin/abandoned-cart`
                    }
                  ]
                },
                {
                  text: "Marketing",
                  items: [
                    {
                      text: "Newsletter",
                      link: `/en/${CURRENT_VERSION}/admin/newsletter`
                    },
                    {
                      text: "Automations",
                      link: `/en/${CURRENT_VERSION}/admin/automations`
                    },
                    {
                      text: "Analytics",
                      link: `/en/${CURRENT_VERSION}/admin/analytics`
                    },
                    {
                      text: "Advertising",
                      link: `/en/${CURRENT_VERSION}/admin/advertising`
                    }
                  ]
                },
                {
                  text: "Forms",
                  link: `/en/${CURRENT_VERSION}/admin/forms`
                },
                {
                  text: "Users & Roles",
                  link: `/en/${CURRENT_VERSION}/admin/users`
                },
                {
                  text: "API Tokens",
                  link: `/en/${CURRENT_VERSION}/admin/api-tokens`
                },
                {
                  text: "Appearance",
                  items: [
                    {
                      text: "Themes",
                      link: `/en/${CURRENT_VERSION}/admin/themes`
                    },
                    {
                      text: "Menus",
                      link: `/en/${CURRENT_VERSION}/admin/menus`
                    },
                    {
                      text: "Fonts",
                      link: `/en/${CURRENT_VERSION}/admin/fonts`
                    }
                  ]
                },
                {
                  text: "System",
                  items: [
                    {
                      text: "Updates & Backups",
                      link: `/en/${CURRENT_VERSION}/admin/updates`
                    },
                    {
                      text: "GDPR & Privacy",
                      link: `/en/${CURRENT_VERSION}/admin/gdpr`
                    },
                    {
                      text: "CLI Commands",
                      link: `/en/${CURRENT_VERSION}/admin/cli`
                    },
                    {
                      text: "Troubleshooting",
                      link: `/en/${CURRENT_VERSION}/admin/troubleshooting`
                    },
                    {
                      text: "Spam Prevention",
                      link: `/en/${CURRENT_VERSION}/admin/spam`
                    }
                  ]
                },
                {
                  text: "Migration",
                  items: [
                    {
                      text: "From WordPress",
                      link: `/en/${CURRENT_VERSION}/admin/migrate-from-wordpress`
                    },
                    {
                      text: "From Ghost",
                      link: `/en/${CURRENT_VERSION}/admin/migrate-from-ghost`
                    },
                    {
                      text: "From / To Vale",
                      link: `/en/${CURRENT_VERSION}/admin/migrate-from-vale`
                    }
                  ]
                }
              ]
            }
          ],
          [`/en/${CURRENT_VERSION}/developer/`]: [
            {
              text: "Developer Guide",
              items: [
                {
                  text: "Introduction",
                  link: `/en/${CURRENT_VERSION}/developer/introduction`
                },
                {
                  text: "Prerequisites",
                  link: `/en/${CURRENT_VERSION}/developer/prerequisites`
                },
                {
                  text: "Architecture",
                  items: [
                    {
                      text: "Domain Model",
                      link: `/en/${CURRENT_VERSION}/developer/architecture/domain`
                    },
                    {
                      text: "Use Cases",
                      link: `/en/${CURRENT_VERSION}/developer/architecture/use-cases`
                    },
                    {
                      text: "Repository Pattern",
                      link: `/en/${CURRENT_VERSION}/developer/architecture/repository`
                    }
                  ]
                },
                {
                  text: "Theme Development",
                  items: [
                    {
                      text: "Getting Started",
                      link: `/en/${CURRENT_VERSION}/developer/themes`
                    },
                    {
                      text: "Twig Globals",
                      link: `/en/${CURRENT_VERSION}/developer/themes/twig-globals`
                    },
                    {
                      text: "Twig Functions",
                      link: `/en/${CURRENT_VERSION}/developer/twig/functions`
                    },
                    {
                      text: "Twig Filters",
                      link: `/en/${CURRENT_VERSION}/developer/twig/filters`
                    }
                  ]
                },
                {
                  text: "REST API",
                  link: `/en/${CURRENT_VERSION}/developer/api`
                },
                {
                  text: "Shortcodes",
                  link: `/en/${CURRENT_VERSION}/developer/shortcodes`
                },
                {
                  text: "Webhooks",
                  link: `/en/${CURRENT_VERSION}/developer/webhooks`
                },
                {
                  text: "Payment Gateways",
                  link: `/en/${CURRENT_VERSION}/developer/payment-gateways`
                },
                {
                  text: "Hooks & Events",
                  link: `/en/${CURRENT_VERSION}/developer/hooks`
                },
                {
                  text: "Security",
                  link: `/en/${CURRENT_VERSION}/developer/security/`
                },
                {
                  text: "LLMO & Structured Data",
                  link: `/en/${CURRENT_VERSION}/developer/llmo`
                },
                {
                  text: "Migrations",
                  link: `/en/${CURRENT_VERSION}/developer/migrations`
                },
                {
                  text: "Translations Tooling",
                  link: `/en/${CURRENT_VERSION}/developer/translations-tooling`
                },
                {
                  text: "CLI Reference",
                  link: `/en/${CURRENT_VERSION}/admin/cli`
                },
                {
                  text: "Testing",
                  link: `/en/${CURRENT_VERSION}/developer/testing/`
                },
                {
                  text: "Dependency Scan",
                  link: `/en/${CURRENT_VERSION}/developer/dependency-scan`
                },
                {
                  text: "Deployment",
                  items: [
                    {
                      text: "Overview",
                      link: `/en/${CURRENT_VERSION}/developer/deployment/`
                    },
                    {
                      text: "Docker",
                      link: `/en/${CURRENT_VERSION}/developer/deployment/docker`
                    }
                  ]
                },
                {
                  text: "Environment Variables",
                  link: `/en/${CURRENT_VERSION}/developer/env`
                },
                {
                  text: "Release Process",
                  link: `/en/${CURRENT_VERSION}/developer/releases`
                },
                {
                  text: "Documentation Guide",
                  link: `/en/${CURRENT_VERSION}/developer/documentation`
                }
              ]
            }
          ]
        }
      }
    },
    tr: {
      label: "Türkçe",
      lang: "tr",
      link: "/tr/latest/",
      themeConfig: {
        nav: [
          {
            text: "Sürümler",
            items: [
              {
                text: CURRENT_VERSION,
                link: `/tr/${CURRENT_VERSION}/admin/`
              },
              {
                text: "En Yeni",
                link: "/tr/latest/"
              }
            ]
          }
        ],
        sidebar: {
          "/tr/latest/admin/": [
            {
              text: "Admin Guide",
              items: [
                {
                  text: "Introduction",
                  link: "/tr/latest/admin/introduction"
                },
                {
                  text: "Installation",
                  link: "/tr/latest/admin/installation"
                },
                {
                  text: "Settings",
                  link: "/tr/latest/admin/settings/",
                  items: [
                    {
                      text: "General",
                      link: "/tr/latest/admin/settings/general"
                    },
                    {
                      text: "E-Commerce",
                      link: "/tr/latest/admin/settings/ecommerce"
                    },
                    {
                      text: "Mail",
                      link: "/tr/latest/admin/settings/mail"
                    },
                    {
                      text: "SEO",
                      link: "/tr/latest/admin/settings/seo"
                    },
                    {
                      text: "Content",
                      link: "/tr/latest/admin/settings/content"
                    },
                    {
                      text: "Discussion",
                      link: "/tr/latest/admin/settings/discussion"
                    },
                    {
                      text: "Membership",
                      link: "/tr/latest/admin/settings/membership"
                    },
                    {
                      text: "Exchange Rates",
                      link: "/tr/latest/admin/settings/exchange-rates"
                    },
                    {
                      text: "Advanced",
                      link: "/tr/latest/admin/settings/advanced"
                    }
                  ]
                },
                {
                  text: "Content Management",
                  items: [
                    {
                      text: "Editor",
                      link: "/tr/latest/admin/editor"
                    },
                    {
                      text: "Multi-Language",
                      link: "/tr/latest/admin/translations"
                    },
                    {
                      text: "Posts",
                      link: "/tr/latest/admin/posts"
                    },
                    {
                      text: "Pages",
                      link: "/tr/latest/admin/pages"
                    },
                    {
                      text: "Custom Content Types",
                      link: "/tr/latest/admin/content-types"
                    },
                    {
                      text: "Revisions",
                      link: "/tr/latest/admin/revisions"
                    },
                    {
                      text: "Media",
                      link: "/tr/latest/admin/media"
                    },
                    {
                      text: "Comments",
                      link: "/tr/latest/admin/comments"
                    }
                  ]
                },
                {
                  text: "E-Commerce",
                  items: [
                    {
                      text: "Products",
                      link: "/tr/latest/admin/products"
                    },
                    {
                      text: "Orders",
                      link: "/tr/latest/admin/orders"
                    },
                    {
                      text: "Coupons",
                      link: "/tr/latest/admin/coupons"
                    },
                    {
                      text: "Product Feeds",
                      link: "/tr/latest/admin/product-feeds"
                    },
                    {
                      text: "Checkout",
                      link: "/tr/latest/admin/checkout"
                    },
                    {
                      text: "Customer Account",
                      link: "/tr/latest/admin/account"
                    },
                    {
                      text: "Abandoned Cart",
                      link: "/tr/latest/admin/abandoned-cart"
                    }
                  ]
                },
                {
                  text: "Marketing",
                  items: [
                    {
                      text: "Newsletter",
                      link: "/tr/latest/admin/newsletter"
                    },
                    {
                      text: "Automations",
                      link: "/tr/latest/admin/automations"
                    },
                    {
                      text: "Analytics",
                      link: "/tr/latest/admin/analytics"
                    },
                    {
                      text: "Advertising",
                      link: "/tr/latest/admin/advertising"
                    }
                  ]
                },
                {
                  text: "Forms",
                  link: "/tr/latest/admin/forms"
                },
                {
                  text: "Users & Roles",
                  link: "/tr/latest/admin/users"
                },
                {
                  text: "API Tokens",
                  link: "/tr/latest/admin/api-tokens"
                },
                {
                  text: "Appearance",
                  items: [
                    {
                      text: "Themes",
                      link: "/tr/latest/admin/themes"
                    },
                    {
                      text: "Menus",
                      link: "/tr/latest/admin/menus"
                    },
                    {
                      text: "Fonts",
                      link: "/tr/latest/admin/fonts"
                    }
                  ]
                },
                {
                  text: "System",
                  items: [
                    {
                      text: "Updates & Backups",
                      link: "/tr/latest/admin/updates"
                    },
                    {
                      text: "GDPR & Privacy",
                      link: "/tr/latest/admin/gdpr"
                    },
                    {
                      text: "CLI Commands",
                      link: "/tr/latest/admin/cli"
                    },
                    {
                      text: "Troubleshooting",
                      link: "/tr/latest/admin/troubleshooting"
                    },
                    {
                      text: "Spam Prevention",
                      link: "/tr/latest/admin/spam"
                    }
                  ]
                }
              ]
            }
          ],
          "/tr/latest/developer/": [
            {
              text: "Developer Guide",
              items: [
                {
                  text: "Introduction",
                  link: "/tr/latest/developer/introduction"
                },
                {
                  text: "Architecture",
                  items: [
                    {
                      text: "Domain Model",
                      link: "/tr/latest/developer/architecture/domain"
                    },
                    {
                      text: "Use Cases",
                      link: "/tr/latest/developer/architecture/use-cases"
                    },
                    {
                      text: "Repository Pattern",
                      link: "/tr/latest/developer/architecture/repository"
                    }
                  ]
                },
                {
                  text: "Theme Development",
                  items: [
                    {
                      text: "Getting Started",
                      link: "/tr/latest/developer/themes"
                    },
                    {
                      text: "Twig Globals",
                      link: "/tr/latest/developer/themes/twig-globals"
                    },
                    {
                      text: "Twig Functions",
                      link: "/tr/latest/developer/twig/functions"
                    },
                    {
                      text: "Twig Filters",
                      link: "/tr/latest/developer/twig/filters"
                    }
                  ]
                },
                {
                  text: "REST API",
                  link: "/tr/latest/developer/api"
                },
                {
                  text: "Shortcodes",
                  link: "/tr/latest/developer/shortcodes"
                },
                {
                  text: "Webhooks",
                  link: "/tr/latest/developer/webhooks"
                },
                {
                  text: "Payment Gateways",
                  link: "/tr/latest/developer/payment-gateways"
                },
                {
                  text: "Hooks & Events",
                  link: "/tr/latest/developer/hooks"
                },
                {
                  text: "Security",
                  link: "/tr/latest/developer/security/"
                },
                {
                  text: "LLMO & Structured Data",
                  link: "/tr/latest/developer/llmo"
                },
                {
                  text: "Migrations",
                  link: "/tr/latest/developer/migrations"
                },
                {
                  text: "Translations Tooling",
                  link: "/tr/latest/developer/translations-tooling"
                },
                {
                  text: "CLI Reference",
                  link: "/tr/latest/admin/cli"
                },
                {
                  text: "Testing",
                  link: "/tr/latest/developer/testing/"
                },
                {
                  text: "Deployment",
                  items: [
                    {
                      text: "Overview",
                      link: "/tr/latest/developer/deployment/"
                    },
                    {
                      text: "Docker",
                      link: "/tr/latest/developer/deployment/docker"
                    }
                  ]
                },
                {
                  text: "Environment Variables",
                  link: "/tr/latest/developer/env"
                },
                {
                  text: "Release Process",
                  link: "/tr/latest/developer/releases"
                },
                {
                  text: "Documentation Guide",
                  link: "/tr/latest/developer/documentation"
                }
              ]
            }
          ],
          [`/tr/${CURRENT_VERSION}/admin/`]: [
            {
              text: "Admin Guide",
              items: [
                {
                  text: "Introduction",
                  link: `/tr/${CURRENT_VERSION}/admin/introduction`
                },
                {
                  text: "Installation",
                  link: `/tr/${CURRENT_VERSION}/admin/installation`
                },
                {
                  text: "Settings",
                  link: `/tr/${CURRENT_VERSION}/admin/settings/`,
                  items: [
                    {
                      text: "General",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/general`
                    },
                    {
                      text: "E-Commerce",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/ecommerce`
                    },
                    {
                      text: "Mail",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/mail`
                    },
                    {
                      text: "SEO",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/seo`
                    },
                    {
                      text: "Content",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/content`
                    },
                    {
                      text: "Discussion",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/discussion`
                    },
                    {
                      text: "Membership",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/membership`
                    },
                    {
                      text: "Exchange Rates",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/exchange-rates`
                    },
                    {
                      text: "Advanced",
                      link: `/tr/${CURRENT_VERSION}/admin/settings/advanced`
                    }
                  ]
                },
                {
                  text: "Content Management",
                  items: [
                    {
                      text: "Editor",
                      link: `/tr/${CURRENT_VERSION}/admin/editor`
                    },
                    {
                      text: "Multi-Language",
                      link: `/tr/${CURRENT_VERSION}/admin/translations`
                    },
                    {
                      text: "Posts",
                      link: `/tr/${CURRENT_VERSION}/admin/posts`
                    },
                    {
                      text: "Pages",
                      link: `/tr/${CURRENT_VERSION}/admin/pages`
                    },
                    {
                      text: "Custom Content Types",
                      link: `/tr/${CURRENT_VERSION}/admin/content-types`
                    },
                    {
                      text: "Revisions",
                      link: `/tr/${CURRENT_VERSION}/admin/revisions`
                    },
                    {
                      text: "Media",
                      link: `/tr/${CURRENT_VERSION}/admin/media`
                    },
                    {
                      text: "Comments",
                      link: `/tr/${CURRENT_VERSION}/admin/comments`
                    }
                  ]
                },
                {
                  text: "E-Commerce",
                  items: [
                    {
                      text: "Products",
                      link: `/tr/${CURRENT_VERSION}/admin/products`
                    },
                    {
                      text: "Orders",
                      link: `/tr/${CURRENT_VERSION}/admin/orders`
                    },
                    {
                      text: "Coupons",
                      link: `/tr/${CURRENT_VERSION}/admin/coupons`
                    },
                    {
                      text: "Product Feeds",
                      link: `/tr/${CURRENT_VERSION}/admin/product-feeds`
                    },
                    {
                      text: "Checkout",
                      link: `/tr/${CURRENT_VERSION}/admin/checkout`
                    },
                    {
                      text: "Customer Account",
                      link: `/tr/${CURRENT_VERSION}/admin/account`
                    },
                    {
                      text: "Abandoned Cart",
                      link: `/tr/${CURRENT_VERSION}/admin/abandoned-cart`
                    }
                  ]
                },
                {
                  text: "Marketing",
                  items: [
                    {
                      text: "Newsletter",
                      link: `/tr/${CURRENT_VERSION}/admin/newsletter`
                    },
                    {
                      text: "Automations",
                      link: `/tr/${CURRENT_VERSION}/admin/automations`
                    },
                    {
                      text: "Analytics",
                      link: `/tr/${CURRENT_VERSION}/admin/analytics`
                    },
                    {
                      text: "Advertising",
                      link: `/tr/${CURRENT_VERSION}/admin/advertising`
                    }
                  ]
                },
                {
                  text: "Forms",
                  link: `/tr/${CURRENT_VERSION}/admin/forms`
                },
                {
                  text: "Users & Roles",
                  link: `/tr/${CURRENT_VERSION}/admin/users`
                },
                {
                  text: "API Tokens",
                  link: `/tr/${CURRENT_VERSION}/admin/api-tokens`
                },
                {
                  text: "Appearance",
                  items: [
                    {
                      text: "Themes",
                      link: `/tr/${CURRENT_VERSION}/admin/themes`
                    },
                    {
                      text: "Menus",
                      link: `/tr/${CURRENT_VERSION}/admin/menus`
                    },
                    {
                      text: "Fonts",
                      link: `/tr/${CURRENT_VERSION}/admin/fonts`
                    }
                  ]
                },
                {
                  text: "System",
                  items: [
                    {
                      text: "Updates & Backups",
                      link: `/tr/${CURRENT_VERSION}/admin/updates`
                    },
                    {
                      text: "GDPR & Privacy",
                      link: `/tr/${CURRENT_VERSION}/admin/gdpr`
                    },
                    {
                      text: "CLI Commands",
                      link: `/tr/${CURRENT_VERSION}/admin/cli`
                    },
                    {
                      text: "Troubleshooting",
                      link: `/tr/${CURRENT_VERSION}/admin/troubleshooting`
                    },
                    {
                      text: "Spam Prevention",
                      link: `/tr/${CURRENT_VERSION}/admin/spam`
                    }
                  ]
                }
              ]
            }
          ],
          [`/tr/${CURRENT_VERSION}/developer/`]: [
            {
              text: "Developer Guide",
              items: [
                {
                  text: "Introduction",
                  link: `/tr/${CURRENT_VERSION}/developer/introduction`
                },
                {
                  text: "Architecture",
                  items: [
                    {
                      text: "Domain Model",
                      link: `/tr/${CURRENT_VERSION}/developer/architecture/domain`
                    },
                    {
                      text: "Use Cases",
                      link: `/tr/${CURRENT_VERSION}/developer/architecture/use-cases`
                    },
                    {
                      text: "Repository Pattern",
                      link: `/tr/${CURRENT_VERSION}/developer/architecture/repository`
                    }
                  ]
                },
                {
                  text: "Theme Development",
                  items: [
                    {
                      text: "Getting Started",
                      link: `/tr/${CURRENT_VERSION}/themes`
                    },
                    {
                      text: "Twig Globals",
                      link: `/tr/${CURRENT_VERSION}/themes/twig-globals`
                    },
                    {
                      text: "Twig Functions",
                      link: `/tr/${CURRENT_VERSION}/twig/functions`
                    },
                    {
                      text: "Twig Filters",
                      link: `/tr/${CURRENT_VERSION}/twig/filters`
                    }
                  ]
                },
                {
                  text: "REST API",
                  link: `/tr/${CURRENT_VERSION}/developer/api`
                },
                {
                  text: "Shortcodes",
                  link: `/tr/${CURRENT_VERSION}/developer/shortcodes`
                },
                {
                  text: "Webhooks",
                  link: `/tr/${CURRENT_VERSION}/developer/webhooks`
                },
                {
                  text: "Payment Gateways",
                  link: `/tr/${CURRENT_VERSION}/developer/payment-gateways`
                },
                {
                  text: "Hooks & Events",
                  link: `/tr/${CURRENT_VERSION}/developer/hooks`
                },
                {
                  text: "Security",
                  link: `/tr/${CURRENT_VERSION}/developer/security/`
                },
                {
                  text: "LLMO & Structured Data",
                  link: `/tr/${CURRENT_VERSION}/developer/llmo`
                },
                {
                  text: "Migrations",
                  link: `/tr/${CURRENT_VERSION}/developer/migrations`
                },
                {
                  text: "Translations Tooling",
                  link: `/tr/${CURRENT_VERSION}/developer/translations-tooling`
                },
                {
                  text: "CLI Reference",
                  link: `/tr/${CURRENT_VERSION}/admin/cli`
                },
                {
                  text: "Testing",
                  link: `/tr/${CURRENT_VERSION}/developer/testing/`
                },
                {
                  text: "Deployment",
                  items: [
                    {
                      text: "Overview",
                      link: `/tr/${CURRENT_VERSION}/developer/deployment/`
                    },
                    {
                      text: "Docker",
                      link: `/tr/${CURRENT_VERSION}/developer/deployment/docker`
                    }
                  ]
                },
                {
                  text: "Environment Variables",
                  link: `/tr/${CURRENT_VERSION}/developer/env`
                },
                {
                  text: "Release Process",
                  link: `/tr/${CURRENT_VERSION}/developer/releases`
                },
                {
                  text: "Documentation Guide",
                  link: `/tr/${CURRENT_VERSION}/developer/documentation`
                }
              ]
            }
          ]
        }
      }
    }
  },
  ignoreDeadLinks: [
    /^\/tr\//,
    /^\/en\/v\d+\.\d+\.\d+\//,
    /^\/tr\/v\d+\.\d+\.\d+\//,
    /LICENSE/
  ]
});
