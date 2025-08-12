import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/UI/LoadingSpinner';
import { ArrowLeft, Shield, FileText, AlertTriangle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 rotate-180" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-arabic">
              سياسة الخصوصية وسياسة الاستخدام
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-arabic">
              يرجى قراءة هذه السياسة بعناية قبل استخدام الموقع
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Section 1 - مقدمة */}
        <Card className="p-8">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold font-arabic">1</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
              مقدمة
            </h2>
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg">
            <p>
              باستخدامك لهذا الموقع وخدماته، فإنك تقر وتوافق صراحةً على هذه السياسة بجميع بنودها وأحكامها، وتؤكد أنك قرأت وفهمت مضمونها بالكامل، وأنك المسؤول الوحيد عن استخدامك للموقع والخدمات المرتبطة به. استمرارك في استخدام الموقع يعني موافقتك الكاملة والنهائية على هذه الشروط دون قيد أو شرط.
            </p>
          </div>
        </Card>

        {/* Section 2 - جمع واستخدام البيانات */}
        <Card className="p-8">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 font-bold font-arabic">2</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
              جمع واستخدام البيانات
            </h2>
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg space-y-4">
            <p>
              يقوم الموقع بجمع البيانات التي يقوم المستخدم بإدخالها طوعًا أثناء عملية التسجيل أو تنفيذ المهام أو طلب سحب الأرباح.
            </p>
            <p>
              يتم استخدام البيانات فقط للأغراض التشغيلية اللازمة لتقديم الخدمة، ولا يتم بيعها أو مشاركتها مع أي طرف ثالث إلا في الحالات التي يفرضها القانون.
            </p>
          </div>
        </Card>

        {/* Section 3 - أمن المعلومات */}
        <Card className="p-8">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 font-bold font-arabic">3</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
              أمن المعلومات
            </h2>
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg space-y-4">
            <p>
              يبذل الموقع جهودًا معقولة لتأمين البيانات وحمايتها من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.
            </p>
            <p>
              مع ذلك، فإن أي نقل للبيانات عبر الإنترنت يتم على مسؤولية المستخدم بالكامل، والموقع لا يضمن أمان البيانات بنسبة 100% ضد أي خروقات أو هجمات خارجية.
            </p>
          </div>
        </Card>

        {/* Section 4 - مسؤوليتك أنت (وليس نحن) */}
        <Card className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold font-arabic">4</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
              مسؤوليتك أنت (وليس نحن)
            </h2>
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg space-y-4">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              باستخدامك للموقع، فإنك تقر وتوافق على ما يلي:
            </p>
            <ul className="space-y-3 mr-6">
              <li className="flex items-start space-x-3 space-x-reverse">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xl">•</span>
                <span>
                  أنت تتحمل وحدك المسؤولية الكاملة عن حماية بياناتك الشخصية والحساسة، بما في ذلك — على سبيل المثال لا الحصر — معلوماتك البنكية، أرقام البطاقات، رموز التحقق (OTP)، وأي بيانات مالية أو شخصية أخرى.
                </span>
              </li>
              <li className="flex items-start space-x-3 space-x-reverse">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xl">•</span>
                <span>
                  الموقع وفريقه ومالكيه والمبرمجين ومزودي خدمة الاستضافة لا يملكون صلاحية الوصول إلى بياناتك البنكية السرية ولا يطلبون منك هذه البيانات في أي وقت.
                </span>
              </li>
              <li className="flex items-start space-x-3 space-x-reverse">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xl">•</span>
                <span>
                  أي إفصاح منك عن بياناتك البنكية أو كلمات مرورك أو رموز التحقق هو تصرف شخصي منك وعلى مسؤوليتك وحدك، ولن يتحمل الموقع أو أي من القائمين عليه أي تبعات قانونية أو مالية أو تشغيلية ناتجة عن ذلك.
                </span>
              </li>
              <li className="flex items-start space-x-3 space-x-reverse">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xl">•</span>
                <span>
                  تقع على عاتقك وحدك مسؤولية التأكد من صحة بياناتك البنكية وطلب السحب إلى الحساب الصحيح، وأي خطأ أو فقدان أو تأخير في التحويل الناتج عن إدخال بيانات غير صحيحة هو مسؤوليتك الكاملة.
                </span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Section 5 - حدود المسؤولية */}
        <Card className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 font-bold font-arabic">5</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
              حدود المسؤولية
            </h2>
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg space-y-4">
            <p>
              أنت توافق على أن الموقع، وفريقه، ومبرمجيه، ومالكيه، ومزودي الاستضافة لا يتحملون أي مسؤولية عن أي خسائر أو أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية قد تنتج عن استخدامك للموقع أو عدم قدرتك على استخدامه.
            </p>
            <p>
              يشمل ذلك — دون حصر — الأخطاء البشرية، أو التقنية، أو الأمنية، أو أي أعطال في أنظمة الدفع أو التحويلات البنكية.
            </p>
          </div>
        </Card>

        {/* Section 6 - إقرار بالموافقة */}
        <Card className="p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold font-arabic">6</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic">
              إقرار بالموافقة
            </h2>
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg">
            <p>
              باستمرارك في استخدام الموقع، فإنك تقر وتوافق صراحةً على أنك قرأت هذه السياسة وفهمتها بشكل كامل، وأنك تتحمل كامل المسؤولية عن أي بيانات تقوم بمشاركتها، وأنك تعفي الموقع وجميع القائمين عليه من أي مطالبات أو دعاوى أو تعويضات ناتجة عن استخدامك للخدمة.
            </p>
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-center space-x-4 space-x-reverse pt-8">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium font-arabic transition-colors"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium font-arabic transition-colors"
          >
            طباعة السياسة
          </button>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 font-arabic pt-4 border-t border-gray-200 dark:border-gray-700">
          آخر تحديث: {new Date().toLocaleDateString('ar')}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;