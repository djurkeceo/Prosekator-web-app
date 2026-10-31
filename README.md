# 📊 Prosekator

**Prosekator** je moderna web aplikacija za praćenje školskog proseka i ocena. Zamenjuje digitron i ručno sabiranje: predmeti, ocene, prosek, statistika i simulator cilja — sve na jednom mestu.

🔗 **Aplikacija:** [prosekator.vercel.app](https://prosekator.vercel.app)

---

## ✨ Funkcionalnosti

- **Automatski prosek** — prosek svakog predmeta i ukupan školski prosek.
- **Predmeti i ocene** — dodavanje, izmena i brisanje, sa opisom i datumom ocene.
- **Statistika** — raspodela ocena, najviša/najniža ocena, najbolji predmet i trend napretka.
- **Simulator cilja** — izaberi željeni prosek i vidi šta ti treba na preostalim predmetima.
- **Gost režim** — radi bez naloga; podaci se čuvaju lokalno na uređaju.
- **Nalog u oblaku** — isti podaci na svim uređajima, uz mogućnost prenosa lokalnih podataka.
- **Tamna i svetla tema** — pamti se na uređaju.
- **PWA / offline** — instalacija na početni ekran i rad sa poslednjim sačuvanim podacima.
- **Bezbednost** — HttpOnly JWT kolačić, heširane lozinke, ograničenje broja pokušaja prijave.

Ukupan prosek se računa kao **prosek proseka predmeta koji imaju bar jednu ocenu**. Predmeti bez ocena ne ulaze u trenutni prosek, ali ulaze u simulator cilja.

---

## 🧱 Tehnologije

| Sloj | Tehnologija |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Jezik | TypeScript |
| Stilovi | Tailwind CSS v4 |
| Baza | MongoDB + Mongoose |
| Autentifikacija | JWT (`jose`) u HttpOnly kolačiću + `bcryptjs` |
| Ikonice | `lucide-react` |

---

## 🚀 Pokretanje lokalno

### Preduslovi

- Node.js 20 ili noviji
- MongoDB baza (lokalna ili MongoDB Atlas)

### Koraci

```bash
git clone https://github.com/djurkeceo/Prosekator-web-app.git
cd Prosekator-web-app
npm install
```

Kopiraj `.env.example` u `.env.local` i popuni vrednosti:

```bash
cp .env.example .env.local
```

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/prosekator
JWT_SECRET=dugacki-slucajni-secret-od-najmanje-32-karaktera
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Pokreni razvojni server:

```bash
npm run dev
```

Aplikacija je dostupna na [http://localhost:3000](http://localhost:3000).

### Skripte

| Komanda | Opis |
| --- | --- |
| `npm run dev` | Razvojni server |
| `npm run build` | Produkcijski build |
| `npm start` | Pokretanje produkcijskog builda |
| `npm run typecheck` | Provera TypeScript tipova |

---

## 🔐 Promenljive okruženja

| Promenljiva | Obavezno | Opis |
| --- | --- | --- |
| `MONGO_URI` ili `MONGODB_URI` | Da | MongoDB connection string. `MONGO_URI` ima prioritet. |
| `JWT_SECRET` | Da u produkciji | Tajni ključ za potpisivanje sesije. Preporuka: 32+ slučajna karaktera. |
| `NEXT_PUBLIC_SITE_URL` | Ne | Javni URL sajta za canonical linkove, sitemap i OG metapodatke. |

> U razvoju, ako `JWT_SECRET` nije postavljen, koristi se lokalni razvojni ključ. **U produkciji aplikacija neće raditi bez `JWT_SECRET`.**

---

## 🗄️ Podaci i kompatibilnost

- Model i kolekcija `User` su zadržani, pa **postojeći nalozi i podaci rade bez migracije**.
- Lozinke su kompatibilne sa prethodnom verzijom (`bcrypt` heševi).
- Stare ocene su čuvane kao obični brojevi. Server ih pri čitanju normalizuje u objekte `{ id, value, description, createdAt }` i automatski upisuje normalizovan oblik.
- Lokalni gost podaci koriste `localStorage` ključ `prosekator.guest.v1`.
- Keš po korisniku koristi `prosekator.cache.v1.<userId>`.

---

## 📁 Struktura projekta

```text
app/
  api/                 # Next.js route handlers (auth + korisnički podaci)
  about/               # O aplikaciji
  contact/             # Kontakt
  login/ signup/       # Prijava i registracija
  offline/             # Offline fallback za PWA
  layout.tsx           # Root layout, metadata, provajderi
  page.tsx             # Dashboard
  globals.css          # Tailwind tema i komponente
components/
  auth/                # Forme za prijavu i registraciju
  dashboard/           # Dashboard komponente
  providers/           # Auth, tema, toast, service worker
  ui/                  # Modali, potvrde, inputi, spinner
lib/
  models/User.ts       # Mongoose model (backward-compatible)
  session.ts           # JWT sesija i kolačići
  gradebook-server.ts  # Normalizacija i validacija podataka
  calculations.ts      # Prosek, statistika, simulator cilja
  validation.ts        # Validacija emaila, lozinke, ocena
hooks/                 # useGradebook, useOnlineStatus
public/                # Ikonice, manifest assets, service worker
```

---

## ☁️ Deploy na Vercel

1. Poveži GitHub repozitorijum sa Vercel projektom.
2. U **Settings → Environment Variables** dodaj:
   - `MONGO_URI` (ili `MONGODB_URI`)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (npr. `https://prosekator.vercel.app`)
3. Deploy. Next.js API rute rade kao Vercel serverless funkcije.

> Stari `api/` folder sa Express serverless funkcijama je uklonjen kako se ne bi deployovale dve verzije API-ja.

---

## 🤝 Doprinesi projektu

1. Forkuj repozitorijum.
2. Napravi granu: `git checkout -b nova-funkcija`.
3. Commitaj izmene: `git commit -m "Dodata nova funkcija"`.
4. Pushuj granu: `git push origin nova-funkcija`.
5. Otvori Pull Request.

---

## 📬 Kontakt

- **Email:** [prosekator.app@gmail.com](mailto:prosekator.app@gmail.com)
- **GitHub Issues:** [github.com/djurkeceo/Prosekator-web-app/issues](https://github.com/djurkeceo/Prosekator-web-app/issues)

---

**© 2026 Prosekator. Sva prava zadržana.**
