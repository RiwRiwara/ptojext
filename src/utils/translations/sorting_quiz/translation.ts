// translations.ts
export const resources = {
    en: {
      translation: {
        // Quiz UI
        "quizTitle": "Soring Algorithms Quiz",
        "predefinedQuizzes": "Complexity Analysis",
        "aiGeneratedQuiz": "Coding Quiz",
        "algorithmType": "Sorting Types",
        "challengeLevel": "Challenge Level",
        "checkAnswer": "Check Answer",
        "showHintAnswer": "Show Hint Answer",
        "hideHintAnswer": "Hide Hint Answer",
        "hintAnswer": "This shows the answer with the correct time and space complexity",
        "quizComplete": "Quiz Complete!",
        "finalScore": "Your final score: {{score}} out of {{total}}",
        "restartQuiz": "Restart Quiz",
        "previous": "Previous",
        "next": "Next",
        "question": "Question {{current}} of {{total}}",
        "score": "Score: {{score}}",
        "attempts": "Attempts: {{current}}/{{max}}",
        "currentScore": "Current Score: {{score}}",
        
        // Sorting types
        "bubble": "Bubble Sort",
        "selection": "Selection Sort",
        "quick": "Quick Sort",
        "insertion": "Insertion Sort",
        "merge": "Merge Sort",
        
        // Difficulty levels
        "beginner": "Beginner",
        "intermediate": "Intermediate",
        "advanced": "Advanced",
                
        // Predefined quiz data (titles and descriptions)
        "quiz1Title": "Enhance Chest X-ray",
        "quiz1Description": "Adjust the contrast to improve the visibility of lung structures in this chest X-ray.",
        "quiz1Hint": "Try increasing the contrast to make the lung structures more visible against the background.",
        
        "quiz2Title": "Brighten Dark MRI",
        "quiz2Description": "Increase the brightness to reveal details in this underexposed brain MRI.",
        "quiz2Hint": "Increasing brightness will help reveal details in the darker regions of the image.",
        
        "quiz3Title": "Adjust Gamma in CT Scan",
        "quiz3Description": "Modify the gamma correction to enhance the visibility of soft tissues in this abdominal CT scan.",
        "quiz3Hint": "Gamma correction can help balance the midtones without affecting the darkest and brightest parts too much.",
        
        "quiz4Title": "Equalize Histogram in Ultrasound",
        "quiz4Description": "Apply histogram equalization to improve the contrast in this ultrasound image.",
        "quiz4Hint": "Histogram equalization redistributes intensity values to improve overall contrast in images with poor contrast.",
        
        "quiz5Title": "Apply Smoothing to Noisy Image",
        "quiz5Description": "Use a smoothing filter to reduce noise in this medical image while preserving important details.",
        "quiz5Hint": "Smoothing filters can help reduce noise but may blur important details. Try different kernel sizes.",
        
        "quiz6Title": "Sharpen Radiograph",
        "quiz6Description": "Apply a sharpening filter to enhance the edges in this bone radiograph.",
        "quiz6Hint": "Sharpening enhances edges and can make boundaries between structures more visible.",
        
        "quiz7Title": "Detect Boundaries in Retinal Scan",
        "quiz7Description": "Use edge detection to highlight the boundaries between different structures in this retinal scan.",
        "quiz7Hint": "Edge detection can help identify the boundaries between different structures in the retina.",
        
        "quiz8Title": "Isolate Contrast Medium in Angiogram",
        "quiz8Description": "Use image subtraction to isolate the contrast medium in this angiogram.",
        "quiz8Hint": "Adjust the subtraction value until only the blood vessels with contrast medium are visible.",
        
        "quiz9Title": "Combination Enhancement for Chest X-ray",
        "quiz9Description": "Apply a combination of contrast, brightness, and gamma adjustments to enhance this chest X-ray for better diagnosis.",
        "quiz9Hint": "A combination of adjustments can reveal both bone structure and soft tissue details."
      }
    },
    th: {
      translation: {
        // Quiz UI
        "quizTitle": "แบบทดสอบการปรับปรุงภาพ",
        "predefinedQuizzes": "แบบทดสอบที่กำหนดไว้ล่วงหน้า",
        "aiGeneratedQuiz": "แบบทดสอบที่สร้างโดย AI",
        "medicalSpecialty": "สาขาการแพทย์",
        "challengeLevel": "ระดับความท้าทาย",
        "generateNewAiQuiz": "สร้างแบบทดสอบ AI ใหม่",
        "aiGeneratingQuiz": "กำลังสร้างแบบทดสอบด้วย AI...",
        "checkAnswer": "ตรวจสอบคำตอบ",
        "showHintImage": "แสดงภาพคำใบ้",
        "hideHintImage": "ซ่อนภาพคำใบ้",
        "hintImageTitle": "ภาพคำใบ้ (ปรับปรุงอย่างถูกต้อง)",
        "hintImageDescription": "นี่แสดงภาพที่มีการปรับค่าอย่างถูกต้อง",
        "quizComplete": "แบบทดสอบเสร็จสิ้น!",
        "finalScore": "คะแนนสุดท้ายของคุณ: {{score}} จาก {{total}}",
        "restartQuiz": "เริ่มแบบทดสอบใหม่",
        "previous": "ก่อนหน้า",
        "next": "ถัดไป",
        "question": "คำถามที่ {{current}} จาก {{total}}",
        "score": "คะแนน: {{score}}",
        "attempts": "ความพยายาม: {{current}}/{{max}}",
        "currentScore": "คะแนนปัจจุบัน: {{score}}",
        
        // Medical specialties
        "general": "ทั่วไปทางการแพทย์",
        "radiology": "รังสีวิทยา",
        "cardiology": "โรคหัวใจ",
        "neurology": "ประสาทวิทยา",
        "oncology": "มะเร็งวิทยา",
        
        // Difficulty levels
        "beginner": "มือใหม่",
        "intermediate": "ปานกลาง",
        "advanced": "ขั้นสูง",
        
        // AI generation info
        "aiGeneratedFor": "สร้างโดย AI สำหรับสาขา {{specialty}} ที่ระดับ {{level}}",
        
        // Predefined quiz data (titles and descriptions)
        "quiz1Title": "ปรับปรุงภาพเอกซเรย์ทรวงอก",
        "quiz1Description": "ปรับความคมชัดเพื่อปรับปรุงการมองเห็นโครงสร้างปอดในภาพเอกซเรย์ทรวงอกนี้",
        "quiz1Hint": "ลองเพิ่มความคมชัดเพื่อทำให้โครงสร้างปอดมองเห็นได้ชัดเจนขึ้นเมื่อเทียบกับพื้นหลัง",
        
        "quiz2Title": "เพิ่มความสว่างให้ภาพ MRI ที่มืด",
        "quiz2Description": "เพิ่มความสว่างเพื่อเผยรายละเอียดในภาพ MRI สมองที่มืดเกินไปนี้",
        "quiz2Hint": "การเพิ่มความสว่างจะช่วยเผยรายละเอียดในบริเวณที่มืดกว่าของภาพ",
        
        "quiz3Title": "ปรับแกมมาในภาพ CT Scan",
        "quiz3Description": "ปรับการแก้ไขแกมมาเพื่อเพิ่มการมองเห็นเนื้อเยื่ออ่อนในภาพ CT Scan ช่องท้องนี้",
        "quiz3Hint": "การแก้ไขแกมมาสามารถช่วยปรับสมดุลโทนกลางโดยไม่ส่งผลกระทบต่อส่วนที่มืดที่สุดและสว่างที่สุดมากเกินไป",
        
        "quiz4Title": "ปรับฮิสโตแกรมในภาพอัลตราซาวด์",
        "quiz4Description": "ใช้การปรับเท่าฮิสโตแกรมเพื่อปรับปรุงความคมชัดในภาพอัลตราซาวด์นี้",
        "quiz4Hint": "การปรับเท่าฮิสโตแกรมจะกระจายค่าความเข้มใหม่เพื่อปรับปรุงความคมชัดโดยรวมในภาพที่มีความคมชัดต่ำ",
        
        "quiz5Title": "ใช้การเรียบในภาพที่มีสัญญาณรบกวน",
        "quiz5Description": "ใช้ตัวกรองการเรียบเพื่อลดสัญญาณรบกวนในภาพทางการแพทย์นี้ในขณะที่รักษารายละเอียดสำคัญ",
        "quiz5Hint": "ตัวกรองการเรียบสามารถช่วยลดสัญญาณรบกวนแต่อาจทำให้รายละเอียดสำคัญเบลอ ลองใช้ขนาดเคอร์เนลที่แตกต่างกัน",
        
        "quiz6Title": "เพิ่มความคมชัดภาพรังสี",
        "quiz6Description": "ใช้ตัวกรองเพิ่มความคมชัดเพื่อเพิ่มขอบในภาพรังสีกระดูกนี้",
        "quiz6Hint": "การเพิ่มความคมชัดจะเน้นขอบและสามารถทำให้ขอบเขตระหว่างโครงสร้างมองเห็นได้ชัดเจนขึ้น",
        
        "quiz7Title": "ตรวจจับขอบเขตในภาพสแกนจอประสาทตา",
        "quiz7Description": "ใช้การตรวจจับขอบเพื่อเน้นขอบเขตระหว่างโครงสร้างต่างๆ ในภาพสแกนจอประสาทตานี้",
        "quiz7Hint": "การตรวจจับขอบสามารถช่วยระบุขอบเขตระหว่างโครงสร้างต่างๆ ในจอประสาทตา",
        
        "quiz8Title": "แยกสารทึบรังสีในภาพแองจิโอแกรม",
        "quiz8Description": "ใช้การลบภาพเพื่อแยกสารทึบรังสีในภาพแองจิโอแกรมนี้",
        "quiz8Hint": "ปรับค่าการลบจนกว่าจะเห็นเฉพาะหลอดเลือดที่มีสารทึบรังสีเท่านั้น",
        
        "quiz9Title": "การปรับปรุงแบบผสมผสานสำหรับภาพเอกซเรย์ทรวงอก",
        "quiz9Description": "ใช้การปรับความคมชัด ความสว่าง และแกมมาร่วมกันเพื่อปรับปรุงภาพเอกซเรย์ทรวงอกนี้สำหรับการวินิจฉัยที่ดีขึ้น",
        "quiz9Hint": "การปรับค่าร่วมกันสามารถเผยให้เห็นทั้งโครงสร้างกระดูกและรายละเอียดของเนื้อเยื่ออ่อน"
      }
    }
  };
  