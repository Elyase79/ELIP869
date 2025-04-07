import React from 'react';
import { Link } from 'wouter';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 font-tajawal">
      <div className="max-w-4xl mx-auto">
        {/* صورة الشعار والعنوان */}
        <div className="text-center mb-10">
          <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <div className="text-4xl text-primary font-bold">سوق اليمن</div>
          </div>
          <h1 className="text-3xl font-bold mb-2">من نحن</h1>
          <p className="text-textMedium">نبذة عن منصة سوق اليمن وقصة نجاحنا</p>
        </div>
        
        {/* قسم قصتنا */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-primary pr-4">قصتنا</h2>
          <p className="mb-4 text-textMedium leading-relaxed">
            تأسس سوق اليمن في عام 2023 بهدف توفير منصة تسوق إلكتروني موثوقة للشعب اليمني، حيث رأينا فرصة لتطوير صناعة التجارة الإلكترونية في اليمن وإتاحة الفرصة للتجار المحليين للوصول إلى جمهور أوسع.
          </p>
          <p className="mb-4 text-textMedium leading-relaxed">
            بدأنا كفكرة بسيطة وتطورنا بسرعة لنصبح إحدى المنصات الرائدة في مجال التسوق الإلكتروني في اليمن، ونفخر اليوم بشبكة واسعة من المتاجر والمستخدمين الذين يثقون بنا كل يوم.
          </p>
        </div>
        
        {/* قسم رؤيتنا */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-primary pr-4">رؤيتنا</h2>
          <p className="mb-4 text-textMedium leading-relaxed">
            نطمح في سوق اليمن إلى بناء أكبر منصة للتجارة الإلكترونية في اليمن، وتوفير تجربة تسوق آمنة وسلسة لكل مستخدم، ودعم الاقتصاد المحلي من خلال ربط التجار المحليين بالمستهلكين في جميع أنحاء البلاد.
          </p>
        </div>
        
        {/* قسم مهمتنا */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-primary pr-4">مهمتنا</h2>
          <p className="mb-4 text-textMedium leading-relaxed">
            تتمثل مهمتنا في تحسين تجربة التسوق للمستهلك اليمني وتوفير منصة سهلة الاستخدام وآمنة للمتاجر المحلية. نسعى لتحقيق ذلك من خلال:
          </p>
          <ul className="list-disc mr-8 space-y-2 text-textMedium mb-4">
            <li>توفير تجربة تسوق سلسة وآمنة للمستخدمين.</li>
            <li>دعم المتاجر المحلية وتمكينها من الوصول إلى جمهور أوسع.</li>
            <li>توفير خدمة عملاء استثنائية وحلول دفع متنوعة وآمنة.</li>
            <li>المساهمة في تطوير قطاع التجارة الإلكترونية في اليمن.</li>
          </ul>
        </div>
        
        {/* قسم قيمنا */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-primary pr-4">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-primary">الجودة والموثوقية</h3>
              <p className="text-textMedium">نلتزم بتوفير منتجات وخدمات ذات جودة عالية ونعمل بشفافية وموثوقية مع جميع الأطراف.</p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-primary">خدمة العملاء</h3>
              <p className="text-textMedium">نضع رضا العملاء في مقدمة أولوياتنا ونسعى جاهدين لتوفير تجربة استثنائية لكل مستخدم.</p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-primary">الابتكار</h3>
              <p className="text-textMedium">نسعى دائمًا للتطوير والابتكار لتحسين منصتنا وتجربة المستخدم.</p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-primary">المسؤولية المجتمعية</h3>
              <p className="text-textMedium">نلتزم بمسؤوليتنا تجاه المجتمع اليمني ونسعى للمساهمة في تنميته وازدهاره.</p>
            </div>
          </div>
        </div>
        
        {/* دعوة للتواصل */}
        <div className="bg-gradient-to-l from-primary/10 to-white p-8 rounded-lg text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">انضم إلينا في رحلة النجاح</h2>
          <p className="text-textMedium mb-6">سواء كنت مستهلكًا تبحث عن منتجات عالية الجودة أو متجرًا يتطلع للنمو، فإننا في سوق اليمن نرحب بك.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-lg font-medium transition-colors">
              سجل كمستخدم
            </Link>
            <Link href="/store-registration" className="bg-white border border-primary text-primary hover:bg-primary/5 py-2 px-6 rounded-lg font-medium transition-colors">
              سجل متجرك
            </Link>
          </div>
        </div>
        
        {/* تواصل معنا */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">تواصل معنا</h2>
          <p className="text-textMedium mb-2">لديك أسئلة أو استفسارات؟ نحن هنا للمساعدة!</p>
          <p className="text-textMedium mb-2">البريد الإلكتروني: <a href="mailto:info@souqalyemen.com" className="text-primary">info@souqalyemen.com</a></p>
          <p className="text-textMedium mb-2">هاتف: <a href="tel:+967123456789" className="text-primary">+967 123 456 789</a></p>
        </div>
      </div>
    </div>
  );
};

export default About;