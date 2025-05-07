import { QuizTheme, ThemeContent } from './types';

/**
 * Theme-specific content for quiz generation
 */
export const themeContent: Record<QuizTheme, ThemeContent> = {
    general: {
        organs: ['X-ray', 'MRI', 'CT Scan', 'Ultrasound', 'Medical Image'],
        scenarios: [
            {
                titlePrefix: 'Enhance',
                descriptionTemplate: 'Adjust the [ADJUSTMENT] to improve the visibility of important features in this [ORGAN].',
            },
            {
                titlePrefix: 'Optimize',
                descriptionTemplate: 'Use [ADJUSTMENT] to enhance the clarity of structures in this [ORGAN].',
            },
        ],
    },
    radiology: {
        organs: ['Chest X-ray', 'Bone Radiograph', 'Abdominal CT', 'Brain MRI', 'Spine X-ray'],
        scenarios: [
            {
                titlePrefix: 'Identify Fracture in',
                descriptionTemplate: 'Adjust the [ADJUSTMENT] to clearly identify any fractures or abnormalities in this [ORGAN].',
            },
            {
                titlePrefix: 'Enhance Detail in',
                descriptionTemplate: 'Use [ADJUSTMENT] to improve the visibility of fine structures in this [ORGAN].',
            },
        ],
    },
    cardiology: {
        organs: ['Heart CT', 'Coronary Angiogram', 'Cardiac MRI', 'Echocardiogram', 'Aortic CT'],
        scenarios: [
            {
                titlePrefix: 'Visualize Vessels in',
                descriptionTemplate: 'Apply [ADJUSTMENT] to better visualize the blood vessels in this [ORGAN].',
            },
            {
                titlePrefix: 'Enhance Chambers in',
                descriptionTemplate: 'Use [ADJUSTMENT] to improve the definition of heart chambers and structures in this [ORGAN].',
            },
        ],
    },
    neurology: {
        organs: ['Brain MRI', 'Brain CT', 'Spine MRI', 'Cerebral Angiogram', 'PET Scan'],
        scenarios: [
            {
                titlePrefix: 'Detect Anomaly in',
                descriptionTemplate: 'Adjust the [ADJUSTMENT] to identify any abnormalities in this [ORGAN].',
            },
            {
                titlePrefix: 'Enhance Structures in',
                descriptionTemplate: 'Use [ADJUSTMENT] to better visualize the neural structures in this [ORGAN].',
            },
        ],
    },
    oncology: {
        organs: ['Lung CT', 'Liver MRI', 'Mammogram', 'PET Scan', 'Bone Scan'],
        scenarios: [
            {
                titlePrefix: 'Identify Lesion in',
                descriptionTemplate: 'Apply [ADJUSTMENT] to better identify potential lesions or tumors in this [ORGAN].',
            },
            {
                titlePrefix: 'Enhance Margins in',
                descriptionTemplate: 'Use [ADJUSTMENT] to better define the margins of abnormal tissue in this [ORGAN].',
            },
        ],
    },
};

/**
 * Gets an appropriate image path for the theme
 */
export function getImageForTheme(theme: QuizTheme, id: number): string {
    const themeImages: Record<QuizTheme, string[]> = {
        general: ['/xray.jpg', '/ct_scan.jpg', '/mri.jpg', '/ultrasound.jpg'],
        radiology: ['/radiograph.jpg', '/xray.jpg', '/ct_scan.jpg', '/angiogram.jpg'],
        cardiology: ['/angiogram.jpg', '/ultrasound.jpg', '/subtract1_1.jpg'],
        neurology: ['/mri.jpg', '/ct_scan.jpg', '/retinal_scan.jpg'],
        oncology: ['/tumor_ct.jpg', '/mammogram.jpg', '/ct_scan.jpg'],
    };

    const images = themeImages[theme] || themeImages.general;
    return images[id % images.length];
}
