import React from 'react';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen font-tajawal">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">خدمة غير متوفرة</h1>
          <p className="text-textMedium mb-8">
            المعذرة، هذه الصفحة غير متوفرة حالياً. 
            يرجى العودة إلى الصفحة الرئيسية واستخدام قنوات التواصل الاجتماعي للتواصل معنا.
          </p>
          
          <div className="mt-8">
            <Link href="/">
              <a>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  العودة إلى الصفحة الرئيسية
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Contact;