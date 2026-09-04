# Adding a Custom OAuth Provider

Vale supports OAuth 2.0 providers out of the box. Built-in providers are Google, Microsoft, Twitter/X, GitHub, Facebook, and Steam (OpenID). To add a custom provider (e.g., your company's own OAuth 2.0 IdP), you only need to touch two files: `config/reference-data.php` and `app/Controllers/Front/AuthController.php`.

## Prerequisites

Your OAuth 2.0 provider must support the standard **authorization code** flow with these endpoints:

- Authorization URL (`/authorize`)
- Token URL (`/token`)
- User info URL (`/me` or equivalent)

The callback URL Vale will use is:

```
https://yoursite.com/auth/sso/callback/{provider}
```

## Step 1 — Register the provider key

Add your provider to the `sso_providers` array in `config/reference-data.php`:

```php
'sso_providers' => [
    // ... existing providers ...

    'yourcompany' => [
        'label'      => 'Your Company',
        'url'        => 'https://login.yourcompany.com/oauth2/v2/authorize',
        'token_url'  => 'https://login.yourcompany.com/oauth2/v2/token',
        'user_url'   => 'https://login.yourcompany.com/oauth2/v3/userinfo',
        'signup_url' => 'https://admin.yourcompany.com/apps',
    ],
],
```

The key (`yourcompany`) becomes the URL segment: `/auth/sso/yourcompany`.

## Step 2 — Map the user info response

In `AuthController.php`, add a `match` arm in `parseOAuthUserInfo()` for your provider:

```php
private function parseOAuthUserInfo(string $provider, array $userInfo): array
{
    return match ($provider) {
        // ... existing providers ...

        'yourcompany' => [
            (string) ($userInfo['sub'] ?? ''),
            $userInfo['email']  ?? null,
            $userInfo['name']   ?? null,
            $userInfo['picture'] ?? null,
        ],

        default => [(string) ($userInfo['id'] ?? ''), null, null, null],
    };
}
```

The method returns `[providerId, email, name, avatarUrl]`. At minimum, `providerId` (a string that uniquely identifies the account on the provider side) and `email` must be set. If `email` is `null`, the user will be created without an email — see the email-less section below.

## Step 3 — Declare the scopes

Add your provider's required scopes in `getProviderScopes()`:

```php
private function getProviderScopes(string $provider): array
{
    return match ($provider) {
        // ... existing providers ...

        'yourcompany' => ['openid', 'email', 'profile'],

        default => ['email', 'profile'],
    };
}
```

Scopes are joined with spaces and passed as the `scope` parameter in the authorization URL.

## Step 4 — Configure in the admin panel

No code change is needed beyond the two files above. The admin **Registration** settings page reads the `sso_providers` array and automatically renders a configuration panel for each provider:

1. **Enable SSO registration** — toggles SSO sign-up on/off
2. **Toggle your provider** — enable it individually
3. **Enter Client ID and Client Secret** — stored encrypted in the database
4. **Copy the Callback URL** — paste it into your provider's app settings

The `exchangeCodeForToken()` and `fetchOAuthUserInfo()` methods already handle standard OAuth 2.0 responses. If your provider deviates from the norm (e.g., requires JSON body instead of form-encoded for token exchange, or returns user info in a non-standard format), add a provider-specific branch in those methods — see the `github` arms for an example.

## Email-less SSO (e.g., Twitter/X)

Some providers do not return an email address. In that case:

- `email` will be `null` after `parseOAuthUserInfo()`.
- If a user with the same email already exists, Vale cannot auto-link the accounts.
- A new account will be created with the provider's `name` and no email.
- The user can add an email later from their profile.

If your provider can return an email via a secondary endpoint (like GitHub's `/user/emails`), add a follow-up fetch in `ssoCallback()` — see the GitHub branch in that method for the pattern.

## Account linking

When an SSO user already has a Vale account with the same email address, Vale automatically links the SSO provider to the existing account instead of creating a duplicate. This happens in `ssoCallback()` via `findBySsoProvider()` followed by an email-match check.
