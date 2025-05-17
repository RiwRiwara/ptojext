import { resources } from '@/utils/translations';
import { QuizTheme, TranslationResource } from './types';

// Translation mapping for medical terms
export const medicalTerms: Record<string, string> = {
    tumor: 'เนื้องอก',
    lesion: 'รอยโรค',
    fracture: 'กระดูกหัก',
    anomaly: 'ความผิดปกติ',
    enhancement: 'การเพิ่มคุณภาพ',
    contrast: 'ความเปรียบต่าง',
    brightness: 'ความสว่าง',
    'gamma correction': 'การแก้ไขแกมมา',
    'histogram equalization': 'การปรับเท่าฮิสโตแกรม',
    'smoothing filters': 'ตัวกรองการเรียบ',
    'sharpening filters': 'ตัวกรองเพิ่มความคมชัด',
    'edge detection': 'การตรวจจับขอบ',
    'image subtraction': 'การลบภาพ',
    identify: 'ระบุ',
    detection: 'การตรวจจับ',
    analysis: 'การวิเคราะห์',
    examination: 'การตรวจสอบ',
    scan: 'การสแกน',
    image: 'ภาพ',
    medical: 'ทางการแพทย์',
    challenge: 'ความท้าทาย',
    'CT Scan': 'ซีทีสแกน',
    Ultrasound: 'อัลตราซาวนด์',
    Brain: 'สมอง',
    Chest: 'ทรวงอก',
    Lung: 'ปอด',
    Heart: 'หัวใจ',
    Bone: 'กระดูก',
    Abdomen: 'ช่องท้อง',
    Liver: 'ตับ',
    Kidney: 'ไต',
    Spine: 'กระดูกสันหลัง',
    Tumor: 'เนื้องอก',
    Fracture: 'กระดูกหัก',
    Angiogram: 'ภาพหลอดเลือด',
    Mammogram: 'แมมโมแกรม',
    'PET Scan': 'เพ็ทสแกน',
    'X-ray': 'เอกซเรย์',
    MRI: 'เอ็มอาร์ไอ',
    'Medical Image': 'ภาพทางการแพทย์',
    Enhance: 'เพิ่มประสิทธิภาพ',
    Adjust: 'ปรับ',
    Apply: 'ใช้',
    Optimize: 'ปรับให้เหมาะสม',
    visibility: 'การมองเห็น',
    details: 'รายละเอียด',
    structures: 'โครงสร้าง',
    tissues: 'เนื้อเยื่อ',
    features: 'ลักษณะเด่น',
    'diagnostic quality': 'คุณภาพการวินิจฉฉัย',
    visualize: 'มองเห็น',
};

/**
 * Generates a Thai title based on the English title and theme
 */
export function getThaiTitle(theme: QuizTheme, englishTitle: string): string {
    const quizKeys = Object.keys(resources.en.imageQuizTranslations ).filter((key) => key.includes('quiz') && key.includes('Title'));
    for (const key of quizKeys) {
        if ((resources.en.imageQuizTranslations as TranslationResource)[key] === englishTitle && (resources.th.imageQuizTranslations as TranslationResource)[key]) {
            return (resources.th.imageQuizTranslations as TranslationResource)[key];
        }
    }

    let thaiTitle = englishTitle;
    Object.keys(medicalTerms).forEach((englishWord) => {
        if (thaiTitle.includes(englishWord)) {
            thaiTitle = thaiTitle.replace(new RegExp(englishWord, 'g'), medicalTerms[englishWord]);
        }
    });

    const themeTranslation: Record<QuizTheme, string> = {
        general: 'ทั่วไป',
        radiology: 'รังสีวิทยา',
        cardiology: 'หัวใจวิทยา',
        neurology: 'ประสาทวิทยา',
        oncology: 'มะเร็งวิทยา',
    };

    if (!thaiTitle.includes(themeTranslation[theme])) {
        thaiTitle = `${themeTranslation[theme]}: ${thaiTitle}`;
    }

    return thaiTitle;
}

/**
 * Generates a Thai description based on the English description
 */
export function getThaiDescription(englishDescription: string): string {
    const quizKeys = Object.keys(resources.en.imageQuizTranslations).filter((key) => key.includes('quiz') && key.includes('Description'));
    for (const key of quizKeys) {
        if ((resources.en.imageQuizTranslations as TranslationResource)[key] === englishDescription && (resources.th.imageQuizTranslations as TranslationResource)[key]) {
            return (resources.th.imageQuizTranslations as TranslationResource)[key];
        }
    }

    let thaiDescription = englishDescription;
    Object.keys(medicalTerms).forEach((englishWord) => {
        if (thaiDescription.includes(englishWord)) {
            thaiDescription = thaiDescription.replace(new RegExp(englishWord, 'g'), medicalTerms[englishWord]);
        }
    });

    return thaiDescription;
}

/**
 * Extracts keywords from text
 */
export function extractKeywords(text: string): string[] {
    const commonWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'with', 'and', 'or', 'of', 'this', 'that'];
    return text
        .split(/\s+/)
        .filter((word) => word.length > 3 && !commonWords.includes(word.toLowerCase()))
        .map((word) => word.replace(/[.,;?!()]/g, ''));
}
