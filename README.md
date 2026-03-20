This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Familjeplaneraren – Klingsten/Tongring

En familjeplanerare med:
- ✅ Uppgifter, matlista, påminnelser, Lunas matarschema
- 🏆 Poängsystem med topplista och belöningsbutik
- 🔄 **Realtidssynk** – alla enheter ser ändringar direkt (kräver Firebase, se nedan)

---

## Synkronisering mellan enheter (Firebase)

För att ändringar ska synas på **alla** familjemedlemmars enheter (mamma, pappa, barn) behöver du koppla appen till Firebase Realtime Database.

### Steg för steg

1. **Skapa ett Firebase-projekt**
   - Gå till [https://console.firebase.google.com](https://console.firebase.google.com)
   - Klicka **"Add project"** → ange ett namn (t.ex. `familjeplaneraren`) → skapa

2. **Aktivera Realtime Database**
   - I sidomenyn: **Build → Realtime Database → Create database**
   - Välj serverplats närmast er (t.ex. `europe-west1`)
   - Välj **"Start in test mode"** (kan låsas senare)

3. **Registrera en webbapp**
   - Kugghjulet ⚙️ → **Project settings → Your apps → Add app → Web (`</>`)**
   - Ge den ett namn och klicka **Register app**
   - Kopiera värdena från `firebaseConfig`-objektet

4. **Skapa `.env.local`**
   ```bash
   cp .env.local.example .env.local
   ```
   Fyll i värdena från steg 3:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://<projekt-id>-default-rtdb.europe-west1.firebasedatabase.app
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

5. **Starta om servern** – `npm run dev`

6. **Driftsätt på Vercel** – lägg till samma miljövariabler under *Project → Settings → Environment Variables*

> **Utan Firebase** fungerar appen precis som tidigare med localStorage (enbart på den egna enheten).

---

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
