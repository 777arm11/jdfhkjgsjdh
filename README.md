
# Taparoo - Telegram Mini App Game

## Project info

**URL**: https://lovable.dev/projects/598ff028-9e07-4d49-b11d-51fa89f6d295

## Deploying to Telegram

To deploy this game on Telegram, follow these steps:

1. **Create a Telegram Bot**:
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use the `/newbot` command to create a new bot
   - Save the API token you receive

2. **Set up required environment variables**:
   - In the Supabase dashboard for this project, go to the Edge Functions settings
   - Add the following secrets:
     - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather
     - `GAME_URL`: The URL where your game is hosted (use the Lovable published URL)

3. **Configure Webhook URL for Telegram**:
   - After the edge function is deployed, register it with Telegram using this command:
   ```
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_WEBHOOK_URL>"
   ```
   - Replace `<YOUR_BOT_TOKEN>` with your actual bot token
   - Replace `<YOUR_WEBHOOK_URL>` with your Supabase edge function URL for the webhook handler

4. **Enable Games for Your Bot**:
   - Send `/mybots` to @BotFather
   - Select your bot
   - Choose "Games" from the menu
   - Use `/newgame` to create a new game
   - Set the game title and description
   - Provide the URL where your game is hosted (from your GAME_URL environment variable)

5. **Publish Your Game**:
   - Click on Share -> Publish in [Lovable](https://lovable.dev/projects/598ff028-9e07-4d49-b11d-51fa89f6d295)
   - Copy the published URL
   - Update the GAME_URL environment variable if needed

6. **Test Your Bot**:
   - Start a chat with your bot
   - Try the following commands:
     - `/start` - Should show a button to launch the game
     - `/balance` - Should show your coin balance
     - `/referral` - Should provide your referral link
     - `/help` - Should list available commands

## Available commands in your bot

The bot supports the following commands:

- `/start` - Starts the bot and shows the game launch button
- `/balance` - Shows the user's current coin balance
- `/referral` - Generates and shows the user's referral link
- `/help` - Displays a list of available commands

When a user joins through a referral link (format: `/start ref_XXXXXX`), both the referrer and the new user receive bonus coins.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/598ff028-9e07-4d49-b11d-51fa89f6d295) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Telegram Bot API integration
- Supabase for the backend

## Database Schema

The game uses the following tables:

- **players** - Stores player information and coin balances
- **daily_login_rewards** - Tracks daily login rewards
- **referrals** - Tracks referral relationships
- **creator_codes** - Stores creator codes for bonus coins

## Project Features

- **Tapping Game**: A simple but addictive tapping game
- **Coin System**: Earn coins by playing the game
- **Leaderboard**: Compete with other players
- **Referral System**: Invite friends and earn rewards
- **Daily Rewards**: Get rewards for daily logins
