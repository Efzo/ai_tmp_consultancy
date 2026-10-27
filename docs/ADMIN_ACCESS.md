# Admin account setup and password recovery

Production admin accounts live in PostgreSQL. `ADMIN_EMAIL` and `ADMIN_PASSWORD`
are setup credentials; changing those environment variables does not change an
existing account's password. Account setup is invitation-only: the request page
is public, but only approved email addresses can receive setup links.

## Recommended email setup workflow

Configure this in the **production hosting dashboard**, then deploy these changes:

```dotenv
ADMIN_EMAIL="hello@ojomoefosa.com"
ADMIN_EMAILS="another-trusted-admin@example.com,third-trusted-admin@example.com"
NEXTAUTH_URL="https://www.ojomoefosa.com"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="Website Admin <admin@your-verified-domain>"
DEMO_MODE="false"
```

Keep the correct `DATABASE_URL` and a strong, stable `NEXTAUTH_SECRET` configured
as well. Use a Resend-verified sender domain. Never prefix these variables with
`NEXT_PUBLIC_`. Changing local `.env` does not change the deployed environment.

1. Add your approved administrator email (or emails) to the server configuration.
   `ADMIN_EMAIL` and `ADMIN_EMAILS` both contribute to the setup allowlist, which
   accepts comma-separated addresses and ignores capitalization and whitespace.
   The terminal account setup command still requires a single `ADMIN_EMAIL`.
2. Open `/admin/setup`, or choose **First time here? Set up admin access** on login.
3. Enter an approved email. The site creates a pending database account and sends
   a 30-minute, single-use link. It cannot sign in until a password is set.
4. Open the email link and choose a password of at least 8 characters (maximum
   72 UTF-8 bytes). The database stores only its bcrypt hash.
5. Sign in at `/admin/login`. For later password changes, select **Forgot password?**
   or **Change or reset my password** under Security Settings.

No shared `ADMIN_PASSWORD` is needed for this workflow. Each person has their own
password. Unapproved email requests receive the same acknowledgement but create
no account and send no email. Raw setup/reset links are never returned in production.

**Access policy:** every NEW approved account receives `OWNER` (full admin access).
Only list people you trust with full control. Existing accounts retain their role
when requesting a setup link; this cannot upgrade a Viewer or Editor. Use Admin
Users and Roles to assign reduced permissions after onboarding. Pending accounts
show **Pending password setup** there. The setup link also rechecks the allowlist
before setting the password of a pending account.

The environment list controls new enrollment. Removing an email from it blocks
new setup requests but does not disable an existing active database account.
Manage active permissions in Admin Users and Roles; revoking all access requires
removing the database account. Existing accounts can still reset their passwords
through their verified mailbox. Email delivery must be tested after deployment;
the generic acknowledgement alone does not prove delivery.

For daily use, sign in with the password saved in the database. Change it through
Forgot password. Environment credentials are for initial setup and terminal
recovery only. `--check` reports whether the configured setup password matches
the saved password; it never displays either password.

## Create your first administrator

Run these commands from a trusted terminal in the project checkout with the
**intended production environment** available. Do not paste secrets into chat,
commit an environment file, or use browser-exposed `NEXT_PUBLIC_` variables.

Configure these server environment variables:

```dotenv
DATABASE_URL="your-production-postgresql-connection-string"
DEMO_MODE="false"
ADMIN_EMAIL="your-admin-email"
ADMIN_PASSWORD="a-unique-password-of-at-least-8-characters"
NEXTAUTH_URL="https://your-production-domain"
NEXTAUTH_SECRET="a-long-random-secret"
```

Passwords must contain at least 8 non-padding characters and no more than 72
UTF-8 bytes (bcrypt's limit). A password manager can generate a suitable password.

The command uses Next.js environment loading. Set `NODE_ENV=production` to load
`.env.production.local`, `.env.local`, `.env.production`, and `.env`, in that
precedence order; exported environment variables take precedence over files.
Hosting-dashboard variables are not automatically available in your local shell.
Use your host's secure environment tooling or a protected, gitignored local file.
Verify that `DATABASE_URL` points at the intended database before writing to it.

First inspect the account without changing it:

```sh
NODE_ENV=production npm run admin:create -- --check
```

If the schema has not been deployed, review the existing migrations and back up
the database before applying them with `npm run db:migrate` in the same environment.
Do not apply migrations blindly. No new migration is required for this change.

Create the missing account:

```sh
NODE_ENV=production npm run admin:create
```

This creates only the admin user with role `OWNER`; it does not seed website
content. If the account exists, it leaves its password and role unchanged.
Open `/admin/login` and sign in using the configured credentials. Deploy/restart
the app after changing its runtime environment configuration.

## Recover an existing account from the terminal

If you cannot receive a reset email, set `ADMIN_EMAIL` to the existing account and
`ADMIN_PASSWORD` to your new password in the trusted environment, then run:

```sh
NODE_ENV=production npm run admin:create -- --reset-password
```

This replaces that account's password, sets its role to `OWNER`, and revokes
outstanding password reset links. It does not change website content. Changing
`ADMIN_EMAIL` to a different address creates a separate owner; it does not rename
the old account. This command requires privileged database access; do not expose
it as a public endpoint or execute it on every build/deployment.

After provisioning, remove `ADMIN_PASSWORD` from the production app's runtime
environment if it is no longer needed for setup. `ADMIN_EMAIL` is also only needed
for setup and demo mode; production login uses database accounts. Keep database and
authentication settings. The old create-only seed also accepts these credentials,
but it seeds content too and never resets an existing password.

## Enable Forgot password

Set these variables in the deployed app's server environment and redeploy:

```dotenv
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="Website Admin <admin@your-verified-domain>"
NEXTAUTH_URL="https://your-production-domain"
DEMO_MODE="false"
```

Verify the sending domain with Resend and use an API key permitted to send from
it. `BUSINESS_EMAIL` is used for other site notifications; it is not required for
admin password recovery. The reset email goes to the account email in PostgreSQL.

1. Open `/admin/login` and select **Forgot password?**
2. Enter the existing admin account's email.
3. Check the inbox and spam folder. The link expires after 30 minutes.
4. Open the link, enter and confirm your new password, then return to login.

Production never displays a reset link on the page. All valid email requests get
the same response to avoid exposing registered accounts. Requests for the same
account have a persisted 60-second cooldown (not a complete abuse rate limiter).
Successful password changes invalidate the account's outstanding reset links;
each token can only be used once. Only a hash of the reset token is stored.

## Troubleshooting

- **Account missing:** run the create command in the correct database environment.
- **Old environment password fails:** reset the existing database password with
  the command above or use email recovery.
- **Reset email missing:** check Resend's delivery activity, sender verification,
  spam folder, and server logs for `[password-reset]` messages. Missing settings,
  database failures and provider failures use safe server-side messages.
- **Login keeps redirecting:** confirm the runtime `DATABASE_URL`, HTTPS
  `NEXTAUTH_URL`, stable `NEXTAUTH_SECRET`, and that `DEMO_MODE=false`. Clear old
  site cookies after correcting the configuration.
- **Production domain:** for the current website's canonical hostname, set
  `NEXTAUTH_URL=https://www.ojomoefosa.com` in the production hosting environment
  and redeploy. A change to local `.env` does not update hosting settings.
- **Credentials rejected:** check deployed server logs for `[admin-auth]`.
  `password_mismatch` means the submitted password differs from that deployment's
  saved password. `account_missing_or_password_not_set` means that deployment's
  database has no usable account for the submitted email.
  `database_not_configured` and `database_or_password_verification_failed` identify
  server configuration or verification failures. These messages do not include
  submitted credentials, account identifiers, or database URLs.
- **Email capitalization:** login and recovery match emails case-insensitively.
  Avoid creating multiple accounts that differ only by case.

Password changes currently do not revoke previously issued JWT sessions. If you
suspect account compromise, rotate `NEXTAUTH_SECRET` across all app instances to
invalidate existing sessions as well. Add host-level rate limiting for login and
recovery endpoints before exposing them to high traffic.

## Validation scope

Automated checks use isolated database/email mocks and do not write production
accounts or send real email. Complete a real recovery test after configuring and
deploying the app; local validation cannot confirm your production credentials or
Resend delivery.
