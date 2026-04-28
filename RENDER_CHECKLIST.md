# Render Deployment Checklist

Use this checklist to track your deployment progress.

## ✅ Pre-Deployment Setup

- [ ] Created MongoDB Atlas account and cluster
- [ ] Generated MongoDB connection string (MONGO_URI)
- [ ] Enabled 2FA on Gmail
- [ ] Generated Gmail App Password
- [ ] Created GitHub account
- [ ] Have Git installed locally

## ✅ Step 1: GitHub Setup

- [ ] Initialized git repository: `git init`
- [ ] Added all files: `git add .`
- [ ] Created initial commit: `git commit -m "Initial commit"`
- [ ] Created GitHub repository at https://github.com/new
- [ ] Pushed code: `git push -u origin main`
- [ ] Verified code appears on GitHub

## ✅ Step 2: Render Backend Deployment

### Service Creation
- [ ] Signed up to Render: https://dashboard.render.com
- [ ] Connected GitHub account to Render
- [ ] Created Web Service from repository
- [ ] Named service: `ridhi-chat-backend`
- [ ] Selected Node environment
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Service created and initial build triggered

### Environment Variables (Add in Render Dashboard → Environment)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `MONGO_URI` = `mongodb+srv://...` (from MongoDB Atlas)
- [ ] `JWT_SECRET` = (strong random string)
- [ ] `SMTP_HOST` = `smtp.gmail.com`
- [ ] `SMTP_PORT` = `465`
- [ ] `SMTP_SECURE` = `true`
- [ ] `SMTP_USER` = your Gmail address
- [ ] `SMTP_PASS` = 16-character Gmail app password
- [ ] `SMTP_FROM` = `Ridhi <your-email@gmail.com>`
- [ ] `CLIENT_URL` = (leave empty, will update after frontend deployment)

### Verification
- [ ] Service shows "Live" status
- [ ] Copied backend URL (e.g., `https://ridhi-chat-backend.onrender.com`)
- [ ] Tested health endpoint with curl
- [ ] Response received: `{"success":true,"message":"OK"}`

## ✅ Step 3: Frontend Deployment

### Update Environment
- [ ] Updated `client/.env.production` with backend URL
- [ ] `VITE_API_URL` = `https://ridhi-chat-backend.onrender.com/api`
- [ ] `VITE_SOCKET_URL` = `https://ridhi-chat-backend.onrender.com`

### Deploy to Vercel
- [ ] Signed up to Vercel: https://vercel.com
- [ ] Imported GitHub repository to Vercel
- [ ] Set Framework: `Vite`
- [ ] Set Build Command: `npm run build`
- [ ] Set Output Dir: `dist`
- [ ] Added environment variables
- [ ] Deployment completed successfully
- [ ] Copied Vercel frontend URL

### Verify Frontend
- [ ] Frontend URL is accessible
- [ ] Can log in to the app
- [ ] Socket connection works

## ✅ Step 4: Final Backend Configuration

- [ ] Noted Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- [ ] Updated Render → Environment → `CLIENT_URL`
- [ ] Service restarted on Render
- [ ] Cross-origin requests work from frontend

## ✅ Post-Deployment

- [ ] Tested login/signup functionality
- [ ] Tested chat/messaging features
- [ ] Tested socket.io connections
- [ ] Email notifications work (if applicable)
- [ ] Reviewed Render logs for any errors
- [ ] Reviewed Vercel logs for any errors

## 📝 Important URLs

**Backend (Render):**
```
https://ridhi-chat-backend.onrender.com
Health: https://ridhi-chat-backend.onrender.com/api/health
```

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Environment Variables Saved:**
```
MONGO_URI: ___________________________________
JWT_SECRET: ___________________________________
GMAIL_PASS: ___________________________________
```

## 🚀 Next Steps

- Make code changes locally
- Push to GitHub: `git push origin main`
- Render and Vercel will auto-redeploy
- Monitor logs for any issues

## 📞 Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com/
- Socket.io Docs: https://socket.io/docs/
