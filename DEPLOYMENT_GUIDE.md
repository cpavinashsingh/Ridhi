# MERN Deployment Guide: Render (Backend) + Vercel (Frontend)

## Prerequisites
- Node.js v18+ installed
- npm or yarn installed
- MongoDB Atlas account (free tier available)
- Gmail account with App Password enabled
- GitHub account (free)
- Render account (free tier)
- Vercel account (free tier)

---

## PART 1: MongoDB Atlas Setup (Required First)

### Step 1: Create MongoDB Atlas Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a free cluster
4. Create a database user with username and password
5. Add IP whitelist: `0.0.0.0/0` (allows all IPs)
6. Copy connection string:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/dbname?retryWrites=true&w=majority
   ```

---

## PART 2: GitHub Setup (Required for Render)

Render requires a GitHub connection. Since you haven't pushed yet, follow these steps:

### Step 1: Initialize Git Repository (If Not Already Done)
```bash
cd /path/to/your/project

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MERN chat application"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `ridhi-chat` (or your preferred name)
3. **Do NOT initialize with README/gitignore** (we already have them)
4. Copy the repository URL (HTTPS): `https://github.com/your-username/ridhi-chat.git`

### Step 3: Push Code to GitHub
```bash
# Add remote origin
git remote add origin https://github.com/your-username/ridhi-chat.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## PART 3: Deploy Backend to Render

### Step 1: Connect Render to GitHub
1. Go to https://dashboard.render.com
2. Sign up / Log in with GitHub
3. Click "New +" → "Web Service"
4. Select "Build and deploy from a Git repository"
5. Click "Connect Account" to link your GitHub
6. Authorize Render to access your repositories

### Step 2: Create Web Service on Render
1. After authorization, select your `ridhi-chat` repository
2. Configure:
   - **Name**: `ridhi-chat-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Choose Free tier (or Starter for better performance)

### Step 3: Set Environment Variables on Render

After creating the service, go to **Environment** tab and add:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_me
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=Ridhi <your-email@gmail.com>
CLIENT_URL=https://your-vercel-frontend.vercel.app
```

**Important**: Replace values with your actual credentials:
- `MONGO_URI`: From MongoDB Atlas
- `JWT_SECRET`: Generate a strong random string
- `SMTP_USER` & `SMTP_PASS`: Your Gmail credentials
- `CLIENT_URL`: Updated after frontend deployment

### Step 4: Deploy
1. Click the **"Deploy"** button
2. Monitor deployment in the **Logs** tab
3. Wait for "Your service is live on..."
4. Copy your Render backend URL (e.g., `https://ridhi-chat-backend.onrender.com`)

### Step 5: Verify Backend is Running
```bash
curl https://ridhi-chat-backend.onrender.com/api/health
```

Expected response:
```json
{"success":true,"message":"OK"}
```

---

## PART 4: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Update Frontend Environment
1. Update [client/.env.production](client/.env.production):
   ```
   VITE_API_URL=https://ridhi-chat-backend.onrender.com
   ```

### Step 3: Deploy with Vercel CLI
```bash
cd client
vercel --prod
```

Or deploy via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click "Import Project"
3. Select your GitHub repository
4. Set build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL=https://ridhi-chat-backend.onrender.com`
6. Click "Deploy"

### Step 4: Update Backend CORS
After frontend is deployed, update backend environment variable on Render:
- Go to Render Dashboard → Service → Environment
- Update `CLIENT_URL` with your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- Restart the service

---

## Useful Commands

### For Backend (server directory)
```bash
# Local development
npm start

# Check health endpoint
curl http://localhost:5000/api/health
```

### For Frontend (client directory)
```bash
# Development
npm run dev

# Production build
npm run build
```

### Git Commands
```bash
# Pull latest changes
git pull origin main

# Make changes and commit
git add .
git commit -m "Your message"
git push origin main

# Render will automatically redeploy on push to main
```

---

## Troubleshooting

### Backend won't start on Render
- Check **Logs** in Render Dashboard
- Verify all environment variables are set
- Ensure MongoDB URI is correct and IP whitelist includes `0.0.0.0/0`

### CORS errors on frontend
- Verify `CLIENT_URL` is set correctly on Render
- Check that frontend URL matches `CLIENT_URL` value
- Restart the Render service

### Database connection timeout
- Confirm `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist: should be `0.0.0.0/0`
- Verify network access in MongoDB Atlas console

### Socket.io connection issues
- Ensure backend and frontend URLs match
- Check browser console for connection errors
- Verify WebSocket is supported in your Render plan

---

## Free Tier Limitations

**Render Free Tier**:
- Services spin down after 15 minutes of inactivity
- CPU: Limited (may cause slow startups)
- Cold starts: ~30 seconds on first request

**Recommendations**:
- For production: Upgrade to Starter plan ($7/month)
- Monitor service health with Render's built-in monitoring
- Consider upgrading if experiencing timeouts
- Enter your email
- Verify email in browser
- Return to terminal

### Step 3: Build Frontend
```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Build the frontend
npm run build
```

### Step 4: Set Frontend Environment Variables
```bash
# In client folder, create .env.production.local
# Add your Railway backend URL:
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_SOCKET_URL=https://your-railway-backend.up.railway.app
```

### Step 5: Deploy Frontend to Vercel
```bash
# From client folder
vercel --prod

# Follow prompts:
# - Link to existing project? NO (new project)
# - Project name: ridhi-chat-frontend
# - Framework: Vite
# - Root directory: .
# - Build command: npm run build
# - Install command: npm install
# - Output directory: dist
```

### Step 6: Verify Frontend Deployment
- Vercel shows URL: `https://your-vercel-frontend.vercel.app`
- Open it in browser
- Should show homepage with "Hi Ridhi ✨"

---

## PART 4: Connect Frontend to Backend (CORS)

### Step 1: Update Backend CORS with Vercel URL
```bash
# Replace with your actual Vercel URL
railway variables set CLIENT_URL="https://your-vercel-frontend.vercel.app"
railway variables set CORS_ORIGIN="https://your-vercel-frontend.vercel.app"
```

### Step 2: Redeploy Backend
```bash
# From project root
railway up
```

---

## PART 5: Testing the Deployment

### Test 1: Homepage
```
Open: https://your-vercel-frontend.vercel.app
Expected: See "Hi Ridhi ✨" with cute messages
```

### Test 2: Signup
```
1. Click "Start Chatting"
2. Enter username: testuser
3. Enter email: testuser@iiitl.ac.in
4. Enter password: password123
5. Click "Send OTP"
6. Check email or backend logs for OTP
7. Enter OTP and complete signup
Expected: Redirects to /chat page
```

### Test 3: Login
```
1. Go to https://your-vercel-frontend.vercel.app/login
2. Enter username and password from signup
3. Click "Sign in"
Expected: Redirected to /chat page
```

### Test 4: Real-time Chat (Socket.io)
```
1. If you're the admin user, you'll see user list
2. If you're a regular user, you'll see chat input
3. Send a message
Expected: Message appears in real-time without page refresh
```

---

## PART 6: Update Deployments (After Code Changes)

### Update Backend (on Railway)
```bash
# Make your code changes
# From project root:
railway up
```

### Update Frontend (on Vercel)
```bash
# Make your code changes
# From client folder:
vercel --prod
```

---

## TROUBLESHOOTING

### WebSocket Connection Fails
**Problem**: Chat doesn't show real-time updates
**Solution**: Ensure `VITE_SOCKET_URL` matches your Railway URL exactly

### 404 on Frontend
**Problem**: Page shows "Cannot GET /"
**Solution**: Vercel auto-detected framework correctly. Check `client/vercel.json` exists

### MongoDB Connection Fails
**Problem**: Error in logs: "Cannot connect to MongoDB"
**Solution**:
1. Check `MONGO_URI` is correct
2. Verify IP whitelist in MongoDB includes `0.0.0.0/0`
3. Check password doesn't have special characters (URL-encode if needed)

### CORS Errors
**Problem**: Frontend can't reach backend API
**Solution**: Ensure `CLIENT_URL` and `CORS_ORIGIN` on Railway match your Vercel URL exactly

### Email OTP Not Sending
**Problem**: Signup OTP not received
**Solution**:
1. Use Gmail with App Password (not regular password)
2. Enable "Less secure apps" in Gmail settings if using regular password
3. Check EMAIL_USER and EMAIL_PASS are correct

---

## YOUR DEPLOYMENT URLS

After successful deployment, you'll have:
```
Frontend: https://your-vercel-frontend.vercel.app
Backend:  https://your-railway-backend.up.railway.app
```

Keep these URLs handy!

---

## NEXT STEPS

1. Custom domain? Add to Vercel/Railway settings
2. Want to modify backend? Update code → `railway up`
3. Want to modify frontend? Update code → `vercel --prod`
4. Need monitoring? Railway and Vercel dashboards show logs in real-time

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
