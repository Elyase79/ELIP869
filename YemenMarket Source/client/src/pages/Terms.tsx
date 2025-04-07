import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">الشروط والأحكام</h1>
            <p className="text-textMedium">آخر تحديث: 10 أبريل 2023</p>
          </div>
          
          <div className="mb-8">
            <p className="text-textMedium leading-relaxed mb-4">
              مرحباً بك في منصة سوق اليمن. تحدد هذه الشروط والأحكام القواعد والأنظمة لاستخدام موقع سوق اليمن المتاح على souqalyemen.com.
            </p>
            <p className="text-textMedium leading-relaxed mb-4">
              من خلال الوصول إلى هذا الموقع، نفترض أنك تقبل هذه الشروط والأحكام بالكامل. لا تستمر في استخدام سوق اليمن إذا كنت لا توافق على جميع الشروط والأحكام المذكورة في هذه الصفحة.
            </p>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">1. التعريفات</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                "العميل" يشير إلى أي شخص يقوم بالتصفح أو يضع طلبًا عبر الموقع.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                "المنصة" تشير إلى موقع سوق اليمن الإلكتروني.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                "الشركة" تشير إلى سوق اليمن.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                "المتجر" يشير إلى البائعين المسجلين في المنصة والذين يقدمون منتجاتهم للبيع.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                "الخدمة" تشير إلى الخدمات التي تقدمها منصة سوق اليمن.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">2. شروط المستخدمين</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                يجب أن تكون عمرك 18 عامًا على الأقل، أو أن تستخدم المنصة تحت إشراف ولي أمر أو وصي قانوني.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور والحد من الوصول إلى جهاز الكمبيوتر الخاص بك، وتوافق على تحمل المسؤولية عن جميع الأنشطة التي تتم تحت حسابك أو كلمة المرور الخاصة بك.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                يُحظر على المستخدمين نشر أي محتوى مسيء أو غير قانوني أو مخالف للقوانين المحلية أو الدولية.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">3. المنتجات والخدمات</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                تعرض المنصة مجموعة متنوعة من المنتجات والخدمات من مختلف المتاجر. نحن نبذل قصارى جهدنا لضمان دقة وصف المنتجات والخدمات المعروضة على المنصة، ومع ذلك، لا نضمن أن جميع الأوصاف دقيقة أو كاملة أو خالية من الأخطاء.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                الشركة غير مسؤولة عن جودة المنتجات أو الخدمات المقدمة من قبل المتاجر. المتاجر وحدها هي المسؤولة عن جودة منتجاتها وخدماتها وعن التعامل مع شكاوى العملاء المتعلقة بها.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">4. الدفع والتسليم</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                تتوفر في المنصة وسائل دفع متعددة وآمنة. يتم تشفير جميع المعاملات المالية وحماية بياناتك الشخصية.
              </p>
              <p className="text-textMedium leading-relaxed mb-2">
                يتم تحديد رسوم الشحن وأوقات التسليم من قبل المتاجر وتختلف حسب المنطقة والمنتج. يرجى مراجعة سياسة الشحن والتوصيل لمزيد من التفاصيل.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">5. سياسة الإلغاء والاسترداد</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                يمكن إلغاء الطلبات قبل شحنها. بعد الشحن، تطبق سياسة الإرجاع والاسترداد الخاصة بكل متجر. يرجى مراجعة سياسة الإرجاع الخاصة بالمتجر قبل إجراء عملية الشراء.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">6. الملكية الفكرية</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                جميع المحتويات الموجودة على المنصة، بما في ذلك النصوص والرسومات والشعارات والصور، هي ملكية حصرية لشركة سوق اليمن أو المتاجر المشاركة. لا يجوز استخدام أي من هذه المواد دون الحصول على إذن خطي مسبق.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">7. تعديل الشروط والأحكام</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                تحتفظ الشركة بالحق في تعديل هذه الشروط والأحكام في أي وقت. ستكون التغييرات سارية المفعول فور نشرها على الموقع. يرجى مراجعة هذه الشروط بانتظام للبقاء على اطلاع.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 border-r-4 border-primary pr-4">8. القانون الحاكم</h2>
              <p className="text-textMedium leading-relaxed mb-2">
                تخضع هذه الشروط والأحكام وتفسر وفقًا لقوانين الجمهورية اليمنية، وتخضع أي نزاعات للاختصاص الحصري للمحاكم اليمنية.
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-3">الاتصال بنا</h2>
            <p className="text-textMedium leading-relaxed mb-2">
              إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا:
            </p>
            <p className="text-textMedium mb-1">سوق اليمن</p>
            <p className="text-textMedium mb-1">صنعاء، اليمن</p>
            <p className="text-textMedium mb-1">البريد الإلكتروني: <a href="mailto:terms@souqalyemen.com" className="text-primary">terms@souqalyemen.com</a></p>
            <p className="text-textMedium mb-1">هاتف: <a href="tel:+967123456789" className="text-primary">+967 123 456 789</a></p>
          </div>
        </div>
      </div>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Terms;