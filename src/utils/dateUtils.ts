// src/utils/dateUtils.ts

/**
 * 🛡️ المحرك الرياضي الحتمي لحساب التاريخ الهجري (بديلاً عن نظام أندرويد الهش)
 * يعتمد على التحويل الفلكي لضمان الدقة على كافة الأجهزة.
 */
export const getHijriDateDeterministic = (date: Date, offsetDays: number = 0): string => {
  try {
    // 1. حقن إزاحة رؤية الهلال (Offset)
    const targetDate = new Date(date.getTime() + offsetDays * 86400000);
    
    let day = targetDate.getDate();
    let month = targetDate.getMonth();
    let year = targetDate.getFullYear();

    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    if (y === 1582) {
      if (m > 10) b = -10;
      if (m === 10) {
        b = 0;
        if (day > 4) b = -10;
      }
    }

    let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

    b = 0;
    if (jd > 2299160) {
      a = Math.floor((jd - 1867216.25) / 36524.25);
      b = 1 + a - Math.floor(a / 4);
    }
    let bb = jd + b + 1524;
    let cc = Math.floor((bb - 122.1) / 365.25);
    let dd = Math.floor(365.25 * cc);
    let ee = Math.floor((bb - dd) / 30.6001);
    
    // حسابات التقويم الهجري
    let iyear = 10631 / 30;
    let epochastro = 1948084;
    let shift1 = 8.01 / 60;

    let z = jd - epochastro;
    let cyc = Math.floor(z / 10631);
    z = z - 10631 * cyc;
    let j = Math.floor((z - shift1) / iyear);
    let iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    let im = Math.floor((z + 28.5001) / 29.5);
    if (im === 13) im = 12;
    let id = z - Math.floor(29.5001 * im - 29);

    const hijriMonths = [
      "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
      "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
    ];

    return `${id} ${hijriMonths[im - 1]} ${iy}`;
  } catch (error) {
    console.error("Hijri conversion failed:", error);
    return "التاريخ الهجري غير متاح"; // تطبيق سياسة الصفر-عدم
  }
};

/**
 * 🛡️ جلب التاريخ الميلادي باللغة العربية بحتمية
 */
export const getGregorianDateAr = (date: Date): string => {
  try {
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    return "تاريخ غير صالح";
  }
};

/**
 * 🛡️ جلب اسم اليوم باللغة العربية بحتمية
 */
export const getDayNameAr = (date: Date): string => {
  try {
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    return days[date.getDay()];
  } catch (error) {
    return "يوم غير صالح";
  }
};