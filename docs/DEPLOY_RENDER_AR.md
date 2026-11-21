# نشر علوان للعطور على Render + Neon

هذا المشروع **Monorepo**: المجلد `backend/` خاص بخدمة NestJS REST API، و`mobile/` خاص بتطبيق Expo الذي لا يُرفع كـRender Web Service. شغّل التطبيق على الجهاز باستخدام Expo أو أنشئ APK باستخدام EAS Build.

## 1. تجهيز قاعدة البيانات

1. أنشئ مشروع PostgreSQL مستقل للمحل على [Neon](https://console.neon.tech/). **لا تستخدم قاعدة بيانات مشروع آخر**.
2. انسخ سلسلة اتصال PostgreSQL المناسبة إلى متغير `DATABASE_URL` عبر Render (مع TLS مثل `sslmode=require` بحسب تعليمات Neon). لا تضف هذه السلسلة إلى GitHub أو إلى `EXPO_PUBLIC_*`.
3. أنشئ سر JWT عشوائيًا من 32 حرفًا أو أكثر؛ ملف `render.yaml` يطلب من Render توليده آليًا.

## 2. نشر الخدمة على Render

### باستخدام Blueprint (أبسط)

1. افتح [Render Dashboard](https://dashboard.render.com/) ثم **New → Blueprint**.
2. اربط GitHub واختر الريبو `besher0/Alwan-Perfumes` والفرع `main`.
3. سيقرأ Render ملف `render.yaml` الموجود في جذر الريبو، وسيقترح Web Service باسم `alwan-perfumes-api`.
4. أدخل قيمة `DATABASE_URL` عندما يطلبها. اترك `JWT_SECRET` لميزة التوليد الآلي.
5. ابدأ النشر وراقب Build Logs. اختبر `https://<اسم-الخدمة>.onrender.com/api/health`؛ يجب أن يعيد `status: ok`.

### يدويًا بدلاً من Blueprint

| الإعداد | القيمة |
|---|---|
| New | Web Service |
| Repository | `besher0/Alwan-Perfumes` |
| Branch | `main` |
| Language / Runtime | Node |
| Root Directory | `backend` |
| Build Command | `npm install --include=dev && npm run prisma:generate && npm run build` |
| Start Command | `npm run db:deploy && npm run start:prod` |
| Health Check Path | `/api/health` |
| Env Vars | `DATABASE_URL`, `JWT_SECRET`, `NODE_VERSION=22.23.2` |

الـBuild يثبت الحزم ويولّد Prisma Client ويبني NestJS. عند التشغيل، يطبق `prisma migrate deploy` تلقائيًا ثم يشغل `node dist/main.js`. هذا مناسب لنسخة أولية بخدمة واحدة؛ للتوسع استخدم خطة تدعم Pre-Deploy منفصل. الخطة المجانية قد تتوقف عند عدم الاستخدام (cold start).

## 3. إنشاء حساب صاحب المحل وبيانات النوتات (مرة أولى)

**هذا ضروري!** التشغيل الطبيعي لا يشغل seed عمدًا؛ لأن `seed` يحدّث كلمة مرور صاحب المحل في كل مرة تشغّله. نفّذ الأمر التالي على جهازك مرة واحدة مع وضع نفس `DATABASE_URL` المستخدمة في Render، مع اسم دخول وكلمة مرور قويين:

```bash
cd backend
npm install
npm run prisma:generate
# عيّن DATABASE_URL و OWNER_USERNAME و OWNER_PASSWORD ببيئتك المحلية في backend/.env
npm run db:deploy
npm run db:seed
```

يمكنك نسخ `backend/.env.example` إلى `backend/.env` وملء القيم. **لا ترفع `.env` إلى GitHub**. يتطلب `OWNER_PASSWORD` 12 حرفًا على الأقل. لا تجعل `SEED_DEMO=true` في الإنتاج إن لم تكن تريد بيانات اختبارية.

## 4. ربط تطبيق React Native بالـAPI المنشور

في `mobile/.env` على جهاز التطوير:

```env
EXPO_PUBLIC_API_URL=https://alwan-perfumes-api.onrender.com/api
```

استبدل الاسم بالعنوان الفعلي الذي أعطاك Render. هذا URL عام فقط، **لا** تضع فيه مفاتيح JWT ولا رابط قاعدة البيانات. ثم شغّل:

```bash
cd mobile
npm install
npx expo install --fix
npx expo start --clear
```

لفتحه على جهاز Android استخدم Expo Go المتوافق مع SDK المشروع، أو Dev Build. لتجهيز APK قابل للتثبيت، أعد إعداد EAS Build واتبع دليل Expo الرسمي؛ Render لا يولّد ملف APK.

## 5. تشخيص سريع

- `DATABASE_URL is required` → متغير قاعدة البيانات غير موجود في Render.
- `P1001`/تعذر الاتصال → تحقق من Neon وSSL ورابط قاعدة البيانات.
- `JWT_SECRET ...` → أنشئ JWT_SECRET بطول كافٍ.
- تسجيل الدخول يرجع 401 → هل نفذت `npm run db:seed`؟ وهل كلمة المرور هي التي حددتها آنذاك؟
- التطبيق يطلب `localhost` → أعد تحديد `EXPO_PUBLIC_API_URL` بعنوان Render وأعد تشغيل Metro.
- Build يفشل → راجع الـlogs، نسخة Node، الحزم ومرحلة Prisma؛ لا تستخدم `npm ci` قبل أن يتوفر `package-lock.json`.

## تنبيه قبل استخدام المحل الفعلي

المشروع Starter ولم يُختبر End-to-End على Neon/Render/تابلت فعلي. أجرِ اختبارًا كاملًا للعملاء والمشتريات والتحليلات، وفعّل نسخًا احتياطيًا للبيانات وحماية الحساب وسجلات تشغيل مناسبة قبل استقبال بيانات زبائن حقيقية.

الوثائق الرسمية:
- Render Node: https://render.com/docs/deploy-node-express-app
- Render Prisma: https://render.com/docs/deploy-prisma-orm
- Render Blueprints: https://render.com/docs/infrastructure-as-code
- Expo builds: https://docs.expo.dev/build/
