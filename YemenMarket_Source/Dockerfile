# استخدام صورة Node.js 18
FROM node:18-alpine AS builder

# تعيين دليل العمل
WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci

# نسخ بقية الملفات
COPY . .

# بناء التطبيق
RUN npm run build

# صورة الإنتاج
FROM node:18-alpine AS runner

# تعيين متغيرات البيئة
ENV NODE_ENV production
ENV PORT 5000

# تعيين دليل العمل
WORKDIR /app

# نسخ التبعيات والملفات المبنية من المرحلة السابقة
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/package.json ./package.json

# إنشاء مجلدات التحميل والسجلات
RUN mkdir -p uploads logs
RUN chown -R node:node /app

# استخدام مستخدم غير الجذر
USER node

# كشف المنفذ
EXPOSE 5000

# أمر التشغيل
CMD ["node", "dist/index.js"]