# 🚀 Render Deployment - Quick Start Guide

This guide will help you deploy your backend on Render in 5 minutes.

## 📋 Prerequisites (Complete These First!)

1. **MongoDB Atlas Setup** - Get your `MONGO_URI`
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

2. **Gmail App Password** - For email notifications
   - Enable 2-Factor Authentication on Gmail
   - Go to https://myaccount.google.com/apppasswords
   - Create app password for your email client
   - Copy the generated 16-character password

3. **GitHub Account** - Required by Render
   - Create if you don't have one at https://github.com

---

## 🔄 Step 1: Push Code to GitHub (5 minutes)

**Open Terminal in your project root directory:**

```bash
# Initialize git (skip if already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Ridhi Chat App"

# Go to https://github.com/new and create repository "ridhi-chat"
# Copy the HTTPS URL from GitHub

# Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/ridhi-chat.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🎯 Step 2: Deploy to Render (5 minutes)

### 2.1: Create Render Service
1. Go to https://dashboard.render.com
2. Sign up / Log in with GitHub (click "Sign in with GitHub")
3. Click **"New +"** → **"Web Service"**
4. Select **"Build and deploy from a Git repository"**
5. Click **"Connect GitHub"** and authorize
6. Select your **`ridhi-chat`** repository
7. Fill in the form:
   ```
   Name:           ridhi-chat-backend
   Environment:    Node
   Region:         (Select closest to you)
   Build Command:  npm install
   Start Command:  npm start
   Instance Type:  Free (or Starter for better performance)
   ```
8. Click **"Create Web Service"** and wait for initial build

### 2.2: Add Environment Variables
After service is created, go to the **Environment** tab and add each variable:

```
NODE_ENV                production
PORT                    5000
MONGO_URI               mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET              (generate random string: openssl rand -hex 32)
SMTP_HOST               smtp.gmail.com
SMTP_PORT               465
SMTP_SECURE             true
SMTP_USER               your-email@gmail.com
SMTP_PASS               (your 16-char gmail app password)
SMTP_FROM               Ridhi <your-email@gmail.com>
CLIENT_URL              (leave empty for now, update after frontend deploy)
```

**Click "Save Changes"** - Render will auto-restart your service

### 2.3: Verify Deployment
1. Wait for the service to show "Live" status
2. Copy your service URL (looks like `https://ridhi-chat-backend.onrender.com`)
3. Test the health endpoint:
   ```bash
   curl https://ridhi-chat-backend.onrender.com/api/health
   ```
   Should return: `{"success":true,"message":"OK"}`

✅ Backend is deployed!

---

## 🎨 Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1: Update Frontend URLs
Edit `client/.env.production`:

```
VITE_API_URL=https://ridhi-chat-backend.onrender.com/api
VITE_SOCKET_URL=https://ridhi-chat-backend.onrender.com
```

Replace `ridhi-chat-backend` with your actual Render service name.

### 3.2: Deploy to Vercel
Option A - Using Vercel Dashboard (Easiest):
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Build Settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Dir: `dist`
5. Environment Variables:
   - `VITE_API_URL` = `https://ridhi-chat-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://ridhi-chat-backend.onrender.com`
6. Click "Deploy"

Option B - Using Vercel CLI:
```bash
npm install -g vercel
cd client
vercel --prod
```

✅ Frontend is deployed!

---

## 🔐 Step 4: Update Backend CORS (1 minute)

Now that frontend is deployed:

1. Go to Render Dashboard → Your Service → Environment
2. Add new variable:
   ```
   CLIENT_URL    https://your-vercel-frontend.vercel.app
   ```
3. Click "Save Changes" - Service will restart

---

## 🎉 You're Done!

Your app is now live:
- **Backend**: https://ridhi-chat-backend.onrender.com
- **Frontend**: https://your-app.vercel.app

---

## 📊 Future Deployments

Whenever you make changes:

```bash
# Commit and push
git add .
git commit -m "Update feature"
git push origin main

# Render and Vercel will automatically redeploy!
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Render Logs tab for errors, verify MONGO_URI is correct |
| CORS errors on frontend | Make sure CLIENT_URL env var on Render matches your Vercel URL |
| Database won't connect | Add `0.0.0.0/0` to MongoDB Atlas IP whitelist |
| Socket.io not connecting | Verify VITE_SOCKET_URL matches backend URL |
| Free tier too slow | Upgrade to Starter plan ($7/month) |

---

## 📚 More Info

- Full deployment guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs

**Need help?** Check service logs:
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → View Logs
