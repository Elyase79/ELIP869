# دليل النشر لمنصة سوق اليمن

هذا الدليل يقدم تعليمات تفصيلية لنشر تطبيق سوق اليمن على مختلف بيئات الاستضافة.

## جدول المحتويات

1. [متطلبات ما قبل النشر](#متطلبات-ما-قبل-النشر)
2. [النشر على استضافة تقليدية](#النشر-على-استضافة-تقليدية)
3. [النشر باستخدام Docker](#النشر-باستخدام-docker)
4. [النشر على منصات السحابة](#النشر-على-منصات-السحابة)
5. [إعداد قاعدة البيانات](#إعداد-قاعدة-البيانات)
6. [المتغيرات البيئية](#المتغيرات-البيئية)

## متطلبات ما قبل النشر

قبل البدء بعملية النشر، تأكد من توفر المتطلبات التالية:

- Node.js (الإصدار 18 أو أحدث)
- NPM أو Yarn
- قاعدة بيانات PostgreSQL
- حساب Stripe (للمدفوعات)
- مفاتيح reCAPTCHA (للأمان)

## النشر على استضافة تقليدية

لنشر التطبيق على خادم تقليدي مثل VPS:

1. قم بتثبيت Node.js و PM2 و Nginx:
   ```bash
   # تثبيت Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # تثبيت PM2 (لإدارة التطبيق)
   npm install -g pm2

   # تثبيت Nginx (للبروكسي العكسي)
   sudo apt-get install -y nginx
   ```

2. نسخ مشروع التطبيق إلى الخادم وإعداده:
   ```bash
   git clone https://github.com/your-username/yemen-market.git
   cd yemen-market
   npm ci
   npm run build
   ```

3. إعداد PM2 لإدارة التطبيق:
   ```bash
   # نسخ ملف التكوين
   cp ecosystem.config.js.example ecosystem.config.js
   # تحرير ملف التكوين حسب الحاجة
   nano ecosystem.config.js
   # بدء التطبيق
   pm2 start ecosystem.config.js
   # ضبط PM2 للتشغيل عند إعادة تشغيل الخادم
   pm2 startup
   pm2 save
   ```

4. إعداد Nginx كبروكسي عكسي:
   ```bash
   # نسخ ملف تكوين Nginx المرفق
   sudo cp nginx/nginx.conf /etc/nginx/sites-available/yemen-market.conf
   # تحرير الملف حسب احتياجاتك
   sudo nano /etc/nginx/sites-available/yemen-market.conf
   # إنشاء رابط رمزي للملف
   sudo ln -s /etc/nginx/sites-available/yemen-market.conf /etc/nginx/sites-enabled/
   # التحقق من صحة تكوين Nginx
   sudo nginx -t
   # إعادة تشغيل Nginx
   sudo systemctl restart nginx
   ```

5. إعداد شهادة SSL باستخدام Let's Encrypt:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## النشر باستخدام Docker

لنشر التطبيق باستخدام Docker:

1. تأكد من تثبيت Docker و Docker Compose:
   ```bash
   # تثبيت Docker
   curl -fsSL https://get.docker.com | sh
   # تثبيت Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. إعداد متغيرات البيئة:
   ```bash
   cp .env.docker .env
   # تحرير الملف وتعيين المتغيرات المناسبة
   nano .env
   ```

3. تشغيل التطبيق باستخدام Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. إعداد Nginx على الخادم المضيف (اختياري):
   ```bash
   # نفس الخطوات المذكورة سابقًا لإعداد Nginx
   ```

## النشر على منصات السحابة

### Heroku

1. قم بتثبيت Heroku CLI:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. إنشاء تطبيق Heroku وإعداده:
   ```bash
   heroku create yemen-market
   heroku stack:set container -a yemen-market
   git push heroku main
   ```

3. إعداد متغيرات البيئة:
   ```bash
   heroku config:set NODE_ENV=production -a yemen-market
   heroku config:set RECAPTCHA_SITE_KEY=your_key -a yemen-market
   # أضف باقي المتغيرات البيئية
   ```

### Google App Engine

1. قم بتثبيت Google Cloud SDK وتسجيل الدخول:
   ```bash
   gcloud init
   gcloud auth login
   ```

2. نشر التطبيق:
   ```bash
   gcloud app deploy app.yaml
   ```

### DigitalOcean App Platform

1. قم بإنشاء تطبيق في لوحة تحكم DigitalOcean App Platform
2. ربط التطبيق بمستودع GitHub الخاص بك
3. تكوين المتغيرات البيئية في واجهة DigitalOcean
4. تعديل إعدادات النشر وفقًا لملف `digitalocean-app.yaml`

## إعداد قاعدة البيانات

1. إنشاء قاعدة بيانات PostgreSQL:
   ```bash
   # على الخادم التقليدي
   sudo -u postgres createuser yemen_user
   sudo -u postgres createdb yemen_market
   sudo -u postgres psql -c "ALTER USER yemen_user WITH ENCRYPTED PASSWORD 'your_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE yemen_market TO yemen_user;"
   ```

2. تطبيق مخطط قاعدة البيانات:
   ```bash
   # بعد إعداد متغيرات البيئة
   npm run db:push
   ```

## المتغيرات البيئية

تأكد من تكوين جميع المتغيرات البيئية المطلوبة:

- `DATABASE_URL`: رابط اتصال PostgreSQL (مثال: `postgresql://username:password@localhost:5432/database`)
- `SESSION_SECRET`: كلمة سر عشوائية آمنة لإدارة الجلسات
- `RECAPTCHA_SITE_KEY` و `RECAPTCHA_SECRET_KEY`: مفاتيح Google reCAPTCHA
- `VITE_STRIPE_PUBLIC_KEY` و `STRIPE_SECRET_KEY`: مفاتيح Stripe للمدفوعات
- `STRIPE_PRICE_ID`: معرف باقة الاشتراك في Stripe
- `NODE_ENV`: بيئة التشغيل (`development` أو `production`)
- `PORT`: المنفذ الذي سيعمل عليه التطبيق

يمكنك الاطلاع على الملفات `.env.example`، `.env.docker` و `.env.production` كأمثلة على كيفية تكوين هذه المتغيرات لمختلف بيئات التشغيل.