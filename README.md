# telegram-chat-verification-bot
Telegram Bot with Human Verification for Cloudflare Pages
# Telegram Chat Verification Bot

This project provides a Telegram bot with human verification using Cloudflare Turnstile. Strangers must complete verification before they can chat with you.

## Features

- Cloudflare Turnstile human verification
- Verification status stored in Cloudflare KV
- Modern responsive UI
- Deployable to Cloudflare Pages

## Setup Instructions

1. **Create a Telegram Bot**
   - Start a chat with [@BotFather](https://t.me/BotFather)
   - Use `/newbot` to create a new bot
   - Note down the bot token (`YOUR_BOT_TOKEN`)

2. **Set up Cloudflare Turnstile**
   - Go to [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
   - Add a new site and note down Site Key and Secret Key

3. **Set up Cloudflare KV**
   - In Cloudflare Dashboard, go to Workers > KV
   - Create a new KV namespace and note down its ID

4. **Update Configuration**
   - In `public/script.js`, replace `'YOUR_TURNSTILE_SITEKEY'` with your Turnstile Site Key
   - In `wrangler.toml`, replace `VERIFIED_USERS_ID` with your KV namespace ID

5. **Set Environment Variables** (in Cloudflare Pages)
   - `TURNSTILE_SECRET_KEY`: Your Turnstile Secret Key
   - `BOT_TOKEN`: Your Telegram Bot token
   - `OWNER_CHAT_ID`: Your Telegram Chat ID (can be found with @userinfobot)

6. **Deploy to Cloudflare Pages**
   - Connect your GitHub repository to Cloudflare Pages
   - Set build command: `npm run build` (or leave blank as we have static files)
   - Set output directory: `public`
   - Add environment variables from step 5

## Local Development

```bash
npm install
npm run dev
