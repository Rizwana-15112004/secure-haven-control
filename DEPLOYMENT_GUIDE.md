# 🚀 Ultimate 100% FREE Deployment Guide (Zero Cost)

This guide provides the exact, click-by-click steps to host your SDRRS system for **FREE** so you can sync multiple phones for your demonstration.

---

## Part 1: Setup your Cloud Database (TiDB Cloud) - FREE
TiDB Cloud is a free MySQL-compatible database.
1.  **Sign Up**: Go to [TiDB Cloud](https://pingcap.com/tidb-cloud) and create a free account.
2.  **Create Cluster**: Click **"Create Cluster"** and choose the **"Serverless" (Free Tier)**.
3.  **Get Connection Details & Set Password**: 
    *   Click on your cluster name.
    *   Click the **"Connect"** button in the top right.
    *   **CRITICAL STEP**: Look for the **"Password"** section. Click **"Reset Password"** or **"Generate"**. 
    *   **Write this password down!** This is your **DB_PASS**. It has *nothing* to do with your GitHub or Render password.
    *   Select **"Standard Connection"**.
    *   Note down your **Host**, **User**, and **Database Name** (usually `test`).
4.  **Import Data**: Use the SQL console in TiDB to run the code from your `database/setup.sql` file.

---

## Part 2: Host your Backend (Render.com) - FREE
Render will run your Java server in the cloud for free.
1.  **Push to GitHub**: Make sure your code is pushed to your GitHub repository.
2.  **Sign Up**: Log in to [Render.com](https://render.com).
3.  **New Web Service**: Click **"New +"** -> **"Web Service"**.
4.  **Connect Repo**: Connect your GitHub repository.
5.  **Settings**:
    *   **Name**: `sdrrs-backend`
    *   **Root Directory**: `server`
    *   **Runtime/Environment**: Select **"Docker"**. 
        *   *(Note: If you choose "Docker", you don't need to type a Start Command! My Dockerfile does it for you).*
    *   **Instance Type**: Choose **"Free"** (scroll down to find it).
6.  **Add Environment Variables**: Click the **"Env Vars"** tab and add these exactly:
    *   `DB_HOST` = (Your TiDB Host)
    *   `DB_USER` = (Your TiDB User)
    *   `DB_PASS` = (Your TiDB Password)
    *   `DB_NAME` = `test` (or whatever you named it in TiDB)
7.  **Deploy**: Click **"Create Web Service"**.
    *   If Render asks for a **Start Command**, copy and paste exactly this: 
        `java -jar target/control-0.0.1-SNAPSHOT.jar`
    *   Wait 5-10 minutes for it to build. Note your final URL (e.g., `https://sdrrs-backend.onrender.com`).

---

## Part 3: Host your Web App (Vercel) - FREE
Vercel will host the website part for free.
1.  **Sign Up**: Log in to [Vercel.com](https://vercel.com).
2.  **Add New Project**: Import your GitHub repository.
3.  **Settings**:
    *   **Environment Variables**: Add `VITE_API_URL` and set the value to your **Render URL** from Part 2.
4.  **Deploy**: Click **"Deploy"**. Vercel will give you a live website link!

---

## Part 4: Rebuild the Android App (Sync Mode)
To make your phone "talk" to your new cloud server:
1.  **Update code**: Open `src/hooks/useVolunteerAlert.ts` and ensure it points to your Render URL if you aren't using environment variables locally. (Vercel handles this automatically for the web version).
2.  **Build Web Bundle**:
    ```bash
    npm run build
    ```
3.  **Sync to Android**:
    ```bash
    npx cap sync android
    ```
4.  **Android Studio Build**:
    *   In **Android Studio**, click **Build** -> **Clean Project**.
    *   Click **Build** -> **Build APK(s)**.
    *   Install this new APK on **Phone A** and **Phone B**.

---

## Part 5: The Grand Demonstration (Sync Test)
1.  **Phone A**: Open the app and log in.
2.  **Phone B**: Open the app (log in or stay on home).
3.  **Action**: On Phone A, trigger an alert or change a status.
4.  **Result**: Watch Phone B update **instantly** without refreshing.
5.  **Proximity Alert**: 
    *   Start the `node alert-server.cjs` on your laptop.
    *   Click **"Send Alert"** on Phone A.
    *   If Phone B is next to you, it will scream and vibrate! 🚨

---

**You are now a 100% Live Multi-Device System!** 🦸🚀
