// آرایه متن‌های رندوم برای تست تایپ
const typingTexts = [
    "برنامه‌نویسی یکی از مهارت‌های مهم در دنیای امروز است که به افراد کمک می‌کند تا با کامپیوترها ارتباط برقرار کنند و مشکلات مختلف را حل کنند.",
    "تکنولوژی و فناوری اطلاعات نقش بسیار مهمی در پیشرفت جوامع امروزی دارد و هر روز شاهد نوآوری‌های جدیدی در این زمینه هستیم.",
    "یادگیری زبان‌های برنامه‌نویسی مختلف مانند پایتون، جاوا، و جاوااسکریپت می‌تواند فرصت‌های شغلی خوبی را برای افراد فراهم کند.",
    "هوش مصنوعی و یادگیری ماشین از موضوعات داغ در حوزه تکنولوژی هستند که آینده دنیای دیجیتال را شکل خواهند داد.",
    "شبکه‌های اجتماعی و اینترنت تأثیر عمیقی بر نحوه ارتباطات و تعاملات اجتماعی افراد در سراسر جهان داشته‌اند.",
    "امنیت سایبری یکی از چالش‌های مهم در عصر دیجیتال است و نیاز به توجه ویژه‌ای در طراحی و پیاده‌سازی سیستم‌های مختلف دارد.",
    "توسعه نرم‌افزارهای کاربردی و وب‌سایت‌ها نیاز به مهارت‌های مختلفی از جمله طراحی رابط کاربری، برنامه‌نویسی و مدیریت پایگاه داده دارد.",
    "کلود کامپیوتینگ و خدمات ابری انقلابی در نحوه ذخیره‌سازی و پردازش داده‌ها ایجاد کرده‌اند و مزایای زیادی برای کسب‌وکارها دارند.",
    "موبایل اپلیکیشن‌ها و توسعه نرم‌افزارهای موبایل از حوزه‌های پرطرفدار در صنعت نرم‌افزار هستند که نیاز به مهارت‌های خاصی دارند.",
    "دیتا ساینس و تحلیل داده‌ها از مهارت‌های ارزشمند در دنیای امروز است که به تصمیم‌گیری بهتر در کسب‌وکارها کمک می‌کند."
];

// متغیرهای اصلی
let currentText = '';
let timeLeft = 60;
let timer = null;
let isTestActive = false;
let startTime = null;
let endTime = null;
let typedText = '';
let errors = [];
let totalCharacters = 0;
let correctCharacters = 0;
let currentPosition = 0;
let errorMap = new Map(); // نگهداری موقعیت اشتباهات
let extraCharacters = 0;
let missingCharacters = 0;
let spacingErrors = 0;

// عناصر DOM
const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('time');
const resultsDiv = document.getElementById('results');
// عناصر DOM برای نتایج - کارت‌ها حذف شدند
const errorDetails = document.getElementById('errorDetails');
const liveStats = document.getElementById('liveStats');
const liveChars = document.getElementById('liveChars');
const liveProgress = document.getElementById('liveProgress');

// تابع انتخاب متن رندوم
function getRandomText() {
    const randomIndex = Math.floor(Math.random() * typingTexts.length);
    return typingTexts[randomIndex];
}

// تابع نمایش متن آماده
function displayReadyText() {
    textDisplay.textContent = currentText;
    textDisplay.classList.add('ready');
}

// تابع نمایش متن ساده
function updateTextDisplay() {
    if (!isTestActive) {
        displayReadyText();
        return;
    }
    
    textDisplay.classList.remove('ready');
    textDisplay.textContent = currentText;
}

// تابع به‌روزرسانی آمار زنده
function updateLiveStats() {
    if (!isTestActive) return;
    
    liveChars.textContent = typedText.length;
    
    // محاسبه پیشرفت
    const progressValue = Math.round((typedText.length / currentText.length) * 100);
    liveProgress.textContent = progressValue + '%';
    
    // تغییر رنگ پیشرفت
    if (progressValue >= 100) {
        liveProgress.style.color = '#4CAF50';
    } else if (progressValue >= 50) {
        liveProgress.style.color = '#ff9800';
    } else {
        liveProgress.style.color = '#D8F3DC';
    }
}

// تابع محاسبه دقیق آمار
function calculateAccurateStats() {
    const timeElapsed = (endTime - startTime) / 1000; // به ثانیه
    const totalTyped = typedText.length;
    
    // محاسبه دقیق کلمات
    const cleanTypedText = typedText.trim();
    const words = cleanTypedText.length > 0 ? cleanTypedText.split(/\s+/).length : 0;
    
    // محاسبه دقیق اشتباهات
    let errorCount = 0;
    const targetText = currentText;
    const typed = typedText;
    
    // محاسبه اشتباهات در کاراکترهای مشترک
    const minLength = Math.min(targetText.length, typed.length);
    for (let i = 0; i < minLength; i++) {
        if (targetText[i] !== typed[i]) {
            errorCount++;
        }
    }
    
    // اضافه کردن کاراکترهای اضافی یا کم
    const lengthDiff = Math.abs(targetText.length - typed.length);
    errorCount += lengthDiff;
    
    // محاسبه دقت دقیق
    const accuracy = totalTyped > 0 ? Math.max(0, Math.min(100, Math.round(((totalTyped - errorCount) / totalTyped) * 100))) : 0;
    
    // محاسبه سرعت دقیق
    const wpm = timeElapsed > 0 ? Math.round((words / timeElapsed) * 60) : 0;
    
    return {
        words: words,
        errors: errorCount,
        accuracy: accuracy,
        wpm: wpm,
        timeElapsed: timeElapsed
    };
}

// تابع شروع تست
function startTest() {
    currentText = getRandomText();
    displayReadyText();
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    
    isTestActive = true;
    startTime = new Date();
    timeLeft = 30;
    typedText = '';
    
    startBtn.disabled = true;
    resetBtn.disabled = false;
    resultsDiv.style.display = 'none';
    liveStats.style.display = 'flex';
    
    // شروع تایمر
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        // تغییر رنگ تایمر در ۱۰ ثانیه آخر
        if (timeLeft <= 10) {
            timeDisplay.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

// تابع پایان تست
function endTest() {
    clearInterval(timer);
    isTestActive = false;
    endTime = new Date();
    
    textInput.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    timeDisplay.classList.remove('warning');
    liveStats.style.display = 'none';
    
    calculateResults();
    showResults();
}

// تابع محاسبه نتایج دقیق
function calculateResults() {
    // اطمینان از اینکه متن تایپ شده به‌روز است
    typedText = textInput.value;
    
    // محاسبه آمار دقیق
    const stats = calculateAccurateStats();
    
    // نتایج در تابع showResults نمایش داده می‌شوند
}

// تابع نمایش نتایج دقیق
function showResults() {
    resultsDiv.style.display = 'block';
    
    // محاسبه آمار دقیق
    const stats = calculateAccurateStats();
    
    // نمایش تحلیل کامل نتایج
    let resultHTML = '<div class="speed-result">';
    resultHTML += '<h3>تحلیل دقیق نتایج تایپ شما:</h3>';
    
    // نمایش آمار دقیق
    resultHTML += `<p>📝 تعداد کلمات تایپ شده: ${stats.words} کلمه</p>`;
    resultHTML += `<p>❌ تعداد اشتباهات: ${stats.errors} اشتباه</p>`;
    resultHTML += `<p>🎯 دقت کلی: ${stats.accuracy}%</p>`;
    resultHTML += `<p>⚡ سرعت تایپ: ${stats.wpm} کلمه در دقیقه (WPM)</p>`;
    
    // تحلیل عملکرد دقیق
    if (stats.errors === 0 && stats.words > 0) {
        resultHTML += '<p>🎉 عالی! هیچ اشتباهی نداشتید.</p>';
    } else if (stats.errors <= 3 && stats.words > 0) {
        resultHTML += '<p>👍 عملکرد خوبی داشتید. فقط چند اشتباه کوچک.</p>';
    } else if (stats.errors <= 10 && stats.words > 0) {
        resultHTML += '<p>⚠️ دقت بیشتری نیاز دارید. اشتباهات قابل توجهی داشتید.</p>';
    } else if (stats.words === 0) {
        resultHTML += '<p>📝 هیچ متنی تایپ نشده است.</p>';
    } else {
        resultHTML += '<p>🔴 نیاز به تمرین بیشتر دارید. اشتباهات زیادی داشتید.</p>';
    }
    
    resultHTML += '<p>💡 برای بهبود سرعت و دقت تایپ، تمرین بیشتری انجام دهید.</p>';
    resultHTML += '</div>';
    
    errorDetails.innerHTML = resultHTML;
}

// تابع ریست کردن تست
function resetTest() {
    clearInterval(timer);
    isTestActive = false;
    timeLeft = 30;
    timeDisplay.textContent = timeLeft;
    timeDisplay.classList.remove('warning');
    
    textInput.value = '';
    textInput.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = true;
    resultsDiv.style.display = 'none';
    liveStats.style.display = 'none';
    
    currentText = 'متن نمونه برای شروع تست تایپ';
    displayReadyText();
}

// Event Listeners
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);

// تابع بررسی تایپ در حین تست
textInput.addEventListener('input', () => {
    if (!isTestActive) return;
    
    typedText = textInput.value;
    updateTextDisplay();
    updateLiveStats();
    
    // بررسی اینکه آیا کاربر متن را تمام کرده
    if (typedText.length >= currentText.length) {
        endTest();
    }
});

// تابع بررسی کلیدهای خاص
textInput.addEventListener('keydown', (e) => {
    if (!isTestActive) return;
    
    // اگر کلید Enter فشرده شد، تست را تمام کن
    if (e.key === 'Enter') {
        e.preventDefault();
        endTest();
    }
});

// تنظیمات اولیه
resetTest(); 