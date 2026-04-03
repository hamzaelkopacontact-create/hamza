// ==================== DATA MODELS & CALCULATIONS ====================
const MODELS = {
    fullCircle: { nameAr: "فستان كلوش (كامل)", nameEn: "Full Circle Dress", baseFactor: 2.5, sleeveFactor: 0.3 },
    halfCircle: { nameAr: "فستان كلوش (نصف)", nameEn: "Half Circle Dress", baseFactor: 1.8, sleeveFactor: 0.25 },
    quarterCircle: { nameAr: "فستان كلوش (ربع)", nameEn: "Quarter Circle Dress", baseFactor: 1.2, sleeveFactor: 0.2 },
    mensShirtShort: { nameAr: "قميص رجالي - كم قصير", nameEn: "Men's Short Sleeve Shirt", baseFactor: 1.2, sleeveFactor: 0.2 },
    mensShirtLong: { nameAr: "قميص رجالي - كم طويل", nameEn: "Men's Long Sleeve Shirt", baseFactor: 1.4, sleeveFactor: 0.4 },
    mensPants: { nameAr: "بنطلون رجالي", nameEn: "Men's Pants", baseFactor: 1.3, sleeveFactor: 0 },
    womensWidePants: { nameAr: "بنطلون حريمي واسع", nameEn: "Women's Wide Pants", baseFactor: 1.6, sleeveFactor: 0 },
    abaya: { nameAr: "عباية", nameEn: "Abaya", baseFactor: 1.8, sleeveFactor: 0.35 },
    jacket: { nameAr: "جاكيت", nameEn: "Jacket", baseFactor: 2.0, sleeveFactor: 0.5 },
    kimono: { nameAr: "كيمونو", nameEn: "Kimono", baseFactor: 2.2, sleeveFactor: 0.45 }
};

// Fabric width multipliers (relative to 120cm baseline)
const FABRIC_MULTIPLIER = { 90: 1.4, 120: 1.0, 150: 0.85 };

// State
let currentLang = 'ar';
let projects = [];

// DOM Elements
const elements = {
    modelSelect: document.getElementById('modelSelect'),
    length: document.getElementById('length'),
    chest: document.getElementById('chest'),
    shoulder: document.getElementById('shoulder'),
    sleeveLength: document.getElementById('sleeveLength'),
    fabricWidth: document.getElementById('fabricWidth'),
    fabricPrice: document.getElementById('fabricPrice'),
    accessoriesCost: document.getElementById('accessoriesCost'),
    liningCost: document.getElementById('liningCost'),
    workHours: document.getElementById('workHours'),
    hourlyRate: document.getElementById('hourlyRate'),
    profitMargin: document.getElementById('profitMargin'),
    taxRate: document.getElementById('taxRate'),
    extraCosts: document.getElementById('extraCosts'),
    fabricMeters: document.getElementById('fabricMeters'),
    wastagePercent: document.getElementById('wastagePercent'),
    fabricTotalCost: document.getElementById('fabricTotalCost'),
    materialsTotal: document.getElementById('materialsTotal'),
    laborCost: document.getElementById('laborCost'),
    otherCosts: document.getElementById('otherCosts'),
    totalCost: document.getElementById('totalCost'),
    sellingPrice: document.getElementById('sellingPrice'),
    netProfit: document.getElementById('netProfit'),
    hourlyReturn: document.getElementById('hourlyReturn'),
    patternCanvas: document.getElementById('patternCanvas'),
    projectsList: document.getElementById('projectsList')
};

// ==================== CORE CALCULATION ====================
function calculateFabricMeters() {
    const model = MODELS[elements.modelSelect.value];
    if (!model) return 0;
    
    let length = parseFloat(elements.length.value) || 0;
    let chest = parseFloat(elements.chest.value) || 0;
    let sleeve = parseFloat(elements.sleeveLength.value) || 0;
    let fabricWidth = parseFloat(elements.fabricWidth.value);
    
    if (length < 30) length = 30;
    if (chest < 50) chest = 50;
    
    // Base calculation
    let meters = ((length + sleeve + model.sleeveFactor) * model.baseFactor) * (chest / 80);
    
    // Apply fabric width multiplier
    meters *= FABRIC_MULTIPLIER[fabricWidth];
    
    // Add 10% wastage
    meters *= 1.10;
    
    return Math.ceil(meters * 100) / 100;
}

function calculateCosts() {
    const fabricMeters = calculateFabricMeters();
    const fabricPrice = parseFloat(elements.fabricPrice.value) || 0;
    const accessories = parseFloat(elements.accessoriesCost.value) || 0;
    const lining = parseFloat(elements.liningCost.value) || 0;
    const hours = parseFloat(elements.workHours.value) || 0;
    const hourly = parseFloat(elements.hourlyRate.value) || 0;
    const profit = parseFloat(elements.profitMargin.value) / 100;
    const tax = parseFloat(elements.taxRate.value) / 100;
    const extra = parseFloat(elements.extraCosts.value) || 0;
    
    const fabricCost = fabricMeters * fabricPrice;
    const materials = fabricCost + accessories + lining;
    const labor = hours * hourly;
    const subtotal = materials + labor + extra;
    const profitAmount = subtotal * profit;
    const taxAmount = (subtotal + profitAmount) * tax;
    const total = subtotal + profitAmount + taxAmount;
    const selling = Math.ceil(total);
    const netProfitValue = selling - subtotal;
    const hourlyReturnValue = netProfitValue / hours;
    
    // Update display
    elements.fabricMeters.innerText = fabricMeters.toFixed(2);
    elements.fabricTotalCost.innerText = fabricCost.toFixed(2);
    elements.materialsTotal.innerText = materials.toFixed(2);
    elements.laborCost.innerText = labor.toFixed(2);
    elements.otherCosts.innerText = extra.toFixed(2);
    elements.totalCost.innerText = subtotal.toFixed(2);
    elements.sellingPrice.innerText = selling.toFixed(2);
    elements.netProfit.innerText = netProfitValue.toFixed(2);
    elements.hourlyReturn.innerText = hourlyReturnValue.toFixed(2);
    
    drawPatternLayout();
    return { fabricMeters, selling };
}

// ==================== PATTERN LAYOUT DRAWING ====================
function drawPatternLayout() {
    const canvas = elements.patternCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 300;
    const height = canvas.height = 200;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    const fabricWidthVal = parseFloat(elements.fabricWidth.value);
    let layoutType = 'horizontal';
    if (fabricWidthVal >= 150) layoutType = 'wide';
    if (fabricWidthVal <= 90) layoutType = 'narrow';
    
    // Draw fabric rectangle
    ctx.strokeRect(20, 20, width - 40, height - 40);
    
    // Draw pattern pieces based on layout type
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(40, 40, 60, 80);  // Front piece
    ctx.fillRect(120, 40, 60, 80); // Back piece
    ctx.fillRect(200, 40, 50, 60); // Sleeve
    
    if (layoutType === 'wide') {
        ctx.fillRect(40, 140, 70, 40); // Collar
    } else if (layoutType === 'narrow') {
        ctx.fillRect(40, 140, 50, 50); // Pocket
    } else {
        ctx.fillRect(40, 140, 60, 40); // Accessory
    }
    
    ctx.fillStyle = '#2c3e50';
    ctx.font = '10px Tajawal';
    ctx.fillText('أمام', 55, 90);
    ctx.fillText('خلف', 135, 90);
    ctx.fillText('كم', 210, 70);
}

// ==================== PDF GENERATION ====================
function generateJobSheetPDF() {
    const jobNumber = 'ORD-' + Math.floor(Math.random() * 10000);
    const date = new Date().toLocaleDateString('ar-EG');
    const modelName = elements.modelSelect.options[elements.modelSelect.selectedIndex].text;
    const lengthVal = elements.length.value;
    const chestVal = elements.chest.value;
    const shoulderVal = elements.shoulder.value;
    const fabricMeters = calculateFabricMeters();
    const selling = parseFloat(elements.sellingPrice.innerText);
    const deliveryDate = new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('ar-EG');
    
    const pdfContent = `
        <div style="font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl;">
            <h1 style="color: #c0392b;">🧵 أمر تشغيل - Fabric & Cost Estimator</h1>
            <hr/>
            <p><strong>📋 رقم الأمر:</strong> ${jobNumber}</p>
            <p><strong>📅 التاريخ:</strong> ${date}</p>
            <p><strong>👗 نوع الموديل:</strong> ${modelName}</p>
            <p><strong>📏 القياسات:</strong> طول: ${lengthVal} سم | صدر: ${chestVal} سم | أكتاف: ${shoulderVal} سم</p>
            <p><strong>🧵 كمية القماش:</strong> ${fabricMeters.toFixed(2)} متر</p>
            <p><strong>💰 سعر البيع المقترح:</strong> ${selling.toFixed(2)} ريال</p>
            <p><strong>📦 تاريخ التسليم المقترح:</strong> ${deliveryDate}</p>
            <hr/>
            <p style="font-size: 12px;">تم الإنشاء بواسطة حاسبة القماش الذكية - Fabric & Cost Estimator</p>
        </div>
    `;
    
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `job_sheet_${jobNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    document.body.appendChild(element);
    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
    });
}

// ==================== PRINT JOB SHEET ====================
function printJobSheet() {
    const jobNumber = 'ORD-' + Math.floor(Math.random() * 10000);
    const date = new Date().toLocaleDateString('ar-EG');
    const modelName = elements.modelSelect.options[elements.modelSelect.selectedIndex].text;
    const lengthVal = elements.length.value;
    const chestVal = elements.chest.value;
    const shoulderVal = elements.shoulder.value;
   
