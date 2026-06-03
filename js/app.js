// --- GLOBAL VİRGÜL ÇÖZÜCÜ (Tüm modüller için geçerlidir) ---
// JavaScript'in yerleşik sayı okuma motorunu virgülleri anlayacak şekilde modifiye ediyoruz.
// Böylece diğer dosyalarda (agility, posture vb.) hiçbir kod değişikliği yapmanıza gerek kalmaz.
const _originalParseFloat = parseFloat;
window.parseFloat = function(val) {
    if (typeof val === 'string' && val.includes(',')) {
        val = val.replace(/,/g, '.');
    }
    return _originalParseFloat(val);
};

// --- ÖĞRENCİ BİLGİLERİ VE GİRİŞ KONTROLLERİ ---
window.studentData = { no: '', name: '', email: '' };

const btnEnter = document.getElementById('btnEnterSystem');
if (btnEnter) {
    btnEnter.addEventListener('click', () => {
        const no = document.getElementById('lpNo').value.trim();
        const name = document.getElementById('lpName').value.trim();
        const email = document.getElementById('lpEmail').value.trim();
        const err = document.getElementById('lpError');

        if (!no || !name || !email) { err.style.display = 'block'; return; }
        err.style.display = 'none';

        window.studentData = { no, name, email };
        
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('mainAppContainer').style.display = 'flex';
        
        const displayBox = document.getElementById('studentInfoDisplay');
        if (displayBox) {
            displayBox.innerHTML = `
                <div style="color: #ffffff; font-weight: 800; font-size: 1.05em; line-height: 1.1;">${name}</div>
                <div style="color: #bdc3c7; font-size: 0.85em;">No: ${no}</div>
                <div style="color: #bdc3c7; font-size: 0.85em;">${email}</div>
            `;
        }
    });
}

// Çıkış Yap Butonu
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        document.getElementById('mainAppContainer').style.display = 'none';
        document.getElementById('landingPage').style.display = 'flex';
        
        document.getElementById('lpNo').value = '';
        document.getElementById('lpName').value = '';
        document.getElementById('lpEmail').value = '';
        window.studentData = { no: '', name: '', email: '' };
        
        const mainVideo = document.getElementById('mainVideo');
        if (mainVideo) mainVideo.pause();
    });
}

// Açık / Koyu Mod Teması Butonu
const themeBtn = document.getElementById('btnThemeToggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.setAttribute('data-theme', 'light');
            themeBtn.textContent = '🌙 Koyu Mod';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeBtn.textContent = '☀️ Açık Mod';
        }
    });
}

window.openGuide = function(module) {
    // Kılavuz içerikleri kısmı (Burası önceki haliyle tamamen aynı çalışır)
    const guides = {
        'vbt': `<div class="academic-guide"><h2>Halter Hızı (VBT) Analizi Laboratuvar Kılavuzu</h2><section><p>VBT Kılavuz İçeriği...</p></section></div>`,
        'sprint': `<div class="academic-guide"><h2>20m Sprint Analizi Laboratuvar Kılavuzu</h2><section><p>Sprint Kılavuz İçeriği...</p></section></div>`,
        'fms': `<div class="academic-guide"><h2>FMS: Overhead Squat Analizi Laboratuvar Kılavuzu</h2><section><p>FMS Kılavuz İçeriği...</p></section></div>`,
        'posture': `<div class="academic-guide"><h2>Statik Postür Analizi Laboratuvar Kılavuzu</h2><section><p>Postür Kılavuz İçeriği...</p></section></div>`,
        'jump': `<div class="academic-guide"><h2>Dikey Sıçrama Analizi Laboratuvar Kılavuzu</h2><section><p>Jump Kılavuz İçeriği...</p></section></div>`,
        'agility': `<div class="academic-guide"><h2>505 Çeviklik Analizi Laboratuvar Kılavuzu</h2><section><p>Agility Kılavuz İçeriği...</p></section></div>`
    };

    const guideContent = `
        <html><head><title>KINEMAN Laboratuvar Kılavuzu</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
            body{font-family:'Inter', sans-serif; padding:40px; line-height:1.7; color:#1e293b; max-width:850px; margin:auto; background:#f1f5f9;}
            h2{color:#2563eb; border-bottom:3px solid #3b82f6; padding-bottom:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;}
            h3{color:#0f172a; margin-top:35px; font-weight:800; border-left:5px solid #2563eb; padding-left:15px; font-size:1.2em;}
            p{margin-bottom:15px; text-align:justify;}
            ul, ol{margin-bottom:25px; padding-left:20px;}
            li{margin-bottom:12px;}
            code{background:#e2e8f0; padding:3px 8px; border-radius:4px; font-family:monospace; font-weight:bold; color:#1e40af;}
            b{color:#2563eb; font-weight:700;}
            section{background:#ffffff; padding:25px; border-radius:12px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom:25px; border:1px solid #e2e8f0;}
            i{color:#64748b; font-style:italic;}
        </style>
        </head><body>${guides[module] || '<section><h2>Kılavuz bulunamadı</h2></section>'}</body></html>
    `;
    
    const win = window.open('', '_blank');
    win.document.write(guideContent);
    win.document.close();
};

window.currentVideoContext = 'vbt_set1';
window.videoMemory = {};

window.clearDots = function() {
    const dots = document.querySelectorAll('.click-dot');
    dots.forEach(d => d.remove());
};

window.switchVideoContext = function(newContext) {
    window.currentVideoContext = newContext;
    mainVideo.pause();
    window.clearDots(); 
    
    if (window.videoMemory[window.currentVideoContext]) {
        mainVideo.src = window.videoMemory[window.currentVideoContext];
        showVideoUI();
    } else {
        mainVideo.src = "";
        showUploaderUI();
    }
};

const menuButtons = document.querySelectorAll('#mainMenu button');
const modules = document.querySelectorAll('.module-content');

menuButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        menuButtons.forEach(b => b.classList.remove('active'));
        modules.forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        const target = this.getAttribute('data-target');
        document.getElementById(target).classList.add('active');

        if(target === 'module-vbt') {
            const activeTab = document.querySelector('#module-vbt .tab-btn.active').getAttribute('data-target');
            window.switchVideoContext('vbt_' + activeTab);
        } else if (target === 'module-sprint') {
            window.switchVideoContext('sprint');
        } else if (target === 'module-fms') {
            const activeTab = document.querySelector('#module-fms .ohs-tab-btn.active').getAttribute('data-target');
            window.switchVideoContext('fms_' + activeTab);
        } else if (target === 'module-posture') {
            const activeTab = document.querySelector('#module-posture .pos-tab-btn.active').getAttribute('data-target');
            window.switchVideoContext('pos_' + activeTab);
        } else if (target === 'module-jump') {
            window.switchVideoContext('jump');
        } else if (target === 'module-agility') {
            const activeTab = document.querySelector('#module-agility .agility-tab-btn.active').getAttribute('data-target');
            window.switchVideoContext('agility_' + activeTab);
        }
    });
});

const videoUploader = document.getElementById('videoUploader');
const mainVideo = document.getElementById('mainVideo');
const coordinateDisplay = document.getElementById('coordinateDisplay');
const videoTimeDisplay = document.getElementById('videoTimeDisplay');
const videoMetadata = document.getElementById('videoMetadata');
const customControls = document.getElementById('customControls');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnSlowMotion = document.getElementById('btnSlowMotion');
const videoTimeline = document.getElementById('videoTimeline');
const uploadText = document.getElementById('uploadText');
const btnPrevFrame = document.getElementById('btnPrevFrame');
const btnNextFrame = document.getElementById('btnNextFrame');
const btnNewVideo = document.getElementById('btnNewVideo');
const videoWrapper = document.getElementById('videoWrapper');

const frameTime = 1 / 30; 

const magCanvas = document.createElement('canvas');
magCanvas.width = 160; magCanvas.height = 160;
magCanvas.style.position = 'fixed';
magCanvas.style.border = '3px solid #3498db';
magCanvas.style.borderRadius = '50%'; 
magCanvas.style.pointerEvents = 'none'; 
magCanvas.style.display = 'none';
magCanvas.style.zIndex = '1000';
magCanvas.style.boxShadow = '0 8px 15px rgba(0,0,0,0.4)';
document.body.appendChild(magCanvas);
const magCtx = magCanvas.getContext('2d');
let isShiftPressed = false;
let lastMouseEvent = null;

document.addEventListener('keydown', e => { 
    if (e.key === 'Shift') { isShiftPressed = true; updateMagnifier(lastMouseEvent); } 
});
document.addEventListener('keyup', e => { 
    if (e.key === 'Shift') { isShiftPressed = false; magCanvas.style.display = 'none'; } 
});

if (btnNewVideo) {
    btnNewVideo.addEventListener('click', () => {
        videoUploader.style.display = 'block';
        videoUploader.style.pointerEvents = 'auto'; 
        videoUploader.click();
    });
}

videoUploader.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);
        window.videoMemory[window.currentVideoContext] = videoURL;
        mainVideo.src = videoURL;
        showVideoUI();
    }
});

function showVideoUI() {
    videoUploader.style.display = 'none'; 
    videoUploader.style.pointerEvents = 'none'; 
    uploadText.style.display = 'none';
    mainVideo.style.display = 'block'; 
    customControls.style.display = 'flex'; 
    btnPlayPause.textContent = 'Oynat'; btnPlayPause.style.backgroundColor = '#3498db';
}

function showUploaderUI() {
    videoUploader.value = ""; videoUploader.style.display = 'block';
    videoUploader.style.pointerEvents = 'auto';
    uploadText.style.display = 'block'; mainVideo.style.display = 'none';
    customControls.style.display = 'none';
    videoMetadata.innerHTML = 'Çözünürlük: Yüklenmedi';
}

mainVideo.addEventListener('loadedmetadata', function() { 
    videoTimeline.max = mainVideo.duration; 
    videoMetadata.innerHTML = `Çözünürlük: <b>${mainVideo.videoWidth} x ${mainVideo.videoHeight}</b> piksel`;
});

btnPlayPause.addEventListener('click', function() {
    if (mainVideo.paused) { mainVideo.play(); btnPlayPause.textContent = 'Duraklat'; btnPlayPause.style.backgroundColor = '#e74c3c'; } 
    else { mainVideo.pause(); btnPlayPause.textContent = 'Oynat'; btnPlayPause.style.backgroundColor = '#3498db'; }
});

let isSlowMo = false;
btnSlowMotion.addEventListener('click', function() {
    isSlowMo = !isSlowMo;
    mainVideo.playbackRate = isSlowMo ? 0.25 : 1.0;
    btnSlowMotion.textContent = isSlowMo ? 'Normal Hız (1x)' : 'Yavaş Oynat (0.25x)';
    btnSlowMotion.style.backgroundColor = isSlowMo ? '#e67e22' : '#8e44ad';
});

btnNextFrame.addEventListener('click', function() { mainVideo.pause(); mainVideo.currentTime += frameTime; updateMagnifier(lastMouseEvent); });
btnPrevFrame.addEventListener('click', function() { mainVideo.pause(); mainVideo.currentTime -= frameTime; updateMagnifier(lastMouseEvent); });

let lastX = 0; let lastY = 0;

function updateCoordinateDisplay() {
    const timeStr = mainVideo.currentTime.toFixed(3);
    if(videoTimeDisplay) videoTimeDisplay.textContent = `${timeStr} sn`;
    coordinateDisplay.textContent = `X: ${lastX}, Y: ${lastY}`;
}

function getTrueVideoCoordinates(event) {
    const rect = mainVideo.getBoundingClientRect();
    const scale = Math.min(rect.width / mainVideo.videoWidth, rect.height / mainVideo.videoHeight);
    const renderedW = mainVideo.videoWidth * scale;
    const renderedH = mainVideo.videoHeight * scale;
    const offsetX = (rect.width - renderedW) / 2;
    const offsetY = (rect.height - renderedH) / 2;
    let clickX = event.clientX - rect.left - offsetX;
    let clickY = event.clientY - rect.top - offsetY;

    if (clickX < 0 || clickX > renderedW || clickY < 0 || clickY > renderedH) { return { x: -1, y: -1 }; }
    return { x: Math.round(clickX / scale), y: Math.round(clickY / scale) };
}

function updateMagnifier(e) {
    if (!e || !isShiftPressed || !mainVideo.src || mainVideo.videoWidth === 0) return;
    const coords = getTrueVideoCoordinates(e);
    if (coords.x < 0 || coords.y < 0) { magCanvas.style.display = 'none'; return; } 
    
    magCanvas.style.display = 'block';
    magCanvas.style.left = (e.clientX + 20) + 'px'; 
    magCanvas.style.top = (e.clientY - 180) + 'px'; 

    magCtx.clearRect(0,0, 160, 160);
    const zoomLevel = 4; 
    const srcW = 160 / zoomLevel; const srcH = 160 / zoomLevel;
    const srcX = coords.x - (srcW / 2); const srcY = coords.y - (srcH / 2);

    magCtx.drawImage(mainVideo, srcX, srcY, srcW, srcH, 0, 0, 160, 160);
    magCtx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
    magCtx.lineWidth = 2;
    magCtx.beginPath();
    magCtx.moveTo(80, 70); magCtx.lineTo(80, 90); 
    magCtx.moveTo(70, 80); magCtx.lineTo(90, 80); 
    magCtx.stroke();
    magCtx.beginPath(); magCtx.arc(80, 80, 1, 0, 2*Math.PI); magCtx.fillStyle = 'red'; magCtx.fill();
}

mainVideo.addEventListener('mousemove', function(event) {
    lastMouseEvent = event;
    const coords = getTrueVideoCoordinates(event);
    if (coords.x !== -1) { lastX = coords.x; lastY = coords.y; }
    updateCoordinateDisplay();
    if (isShiftPressed) updateMagnifier(event);
});

function updateDotsVisibility() {
    const currentTime = mainVideo.currentTime;
    const dots = document.querySelectorAll('.click-dot');
    dots.forEach(dot => {
        const dotTime = parseFloat(dot.getAttribute('data-time'));
        if (Math.abs(currentTime - dotTime) <= 0.02) {
            dot.style.display = 'block';
        } else {
            dot.style.display = 'none';
        }
    });
}

mainVideo.addEventListener('timeupdate', function() {
    videoTimeline.value = mainVideo.currentTime;
    updateCoordinateDisplay();
    updateDotsVisibility();
    if (isShiftPressed) updateMagnifier(lastMouseEvent);
});

videoTimeline.addEventListener('input', function() { 
    mainVideo.currentTime = videoTimeline.value; 
    updateDotsVisibility();
});

window.KineFrameBuffer = {};

mainVideo.addEventListener('mousedown', function(event) {
    mainVideo.style.opacity = '0.6'; setTimeout(() => { mainVideo.style.opacity = '1'; }, 150);
    
    const timeStr = mainVideo.currentTime.toFixed(3);
    const wrapperRect = videoWrapper.getBoundingClientRect();
    const dotX = event.clientX - wrapperRect.left;
    const dotY = event.clientY - wrapperRect.top;
    
    const dot = document.createElement('div');
    dot.className = 'click-dot';
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    dot.setAttribute('data-time', timeStr); 
    videoWrapper.appendChild(dot);
    
    try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = mainVideo.videoWidth;
        offCanvas.height = mainVideo.videoHeight;
        offCanvas.getContext('2d').drawImage(mainVideo, 0, 0, offCanvas.width, offCanvas.height);
        window.KineFrameBuffer[window.currentVideoContext] = offCanvas.toDataURL('image/jpeg', 0.8);
    } catch(e) {
        console.warn("Kare yakalanamadı. Video yüklenmemiş olabilir.");
    }

    document.dispatchEvent(new CustomEvent('videoTiklandi', { detail: { x: lastX, y: lastY, zaman: timeStr } }));
});

// --- YENİ VE GÜVENLİ HESAP MAKİNESİ (ÜSLÜ SAYI DESTEKLİ) ---
const btnCalcToggle = document.getElementById('btnCalcToggle');
const floatingCalc = document.getElementById('floatingCalc');
const btnCloseCalc = document.getElementById('btnCloseCalc');
const calcInput = document.getElementById('calcInput');

if (btnCalcToggle && floatingCalc) {
    btnCalcToggle.addEventListener('click', () => {
        floatingCalc.style.display = floatingCalc.style.display === 'none' ? 'block' : 'none';
        if (floatingCalc.style.display === 'block') calcInput.focus();
    });

    btnCloseCalc.addEventListener('click', () => {
        floatingCalc.style.display = 'none';
    });

    calcInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            try {
                // Öğrencinin girdiği metindeki virgülleri matematiksel standarda (noktaya) çevir
                let expr = this.value.replace(/,/g, '.');
                
                // Üslü sayı işlemini (^) JavaScript'in anlayacağı üstel operatöre (**) çevir
                expr = expr.replace(/\^/g, '**');
                
                // Güvenlik Duvarı: Sadece sayılara, parantezlere ve işlemlere izin ver
                const sanitized = expr.replace(/[^0-9+\-*/().* ]/g, '');
                
                if (sanitized) {
                    const result = new Function('return ' + sanitized)();
                    // Sonucu virgüle dönüştürüp ekrana bas
                    this.value = Number.isInteger(result) ? result.toString() : result.toFixed(3).replace('.', ',');
                }
            } catch (err) {
                const oldVal = this.value;
                this.value = "Hatalı İşlem!";
                setTimeout(() => this.value = oldVal, 1200);
            }
        }
    });
}

// --- GLOBAL NOKTA (.) ENGELLEYİCİ VE VİRGÜL UYARICI ---
document.addEventListener('keypress', function(e) {
    if (e.target.tagName === 'INPUT' && e.key === '.') {
        e.preventDefault(); // Noktanın yazılmasını durdur
        alert("Lütfen ondalık sayı ayracı olarak virgül kullanınız.");
        
        // Kullanıcıyı yormadan nokta yerine otomatik olarak virgül yazdır
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const val = e.target.value;
        e.target.value = val.substring(0, start) + ',' + val.substring(end);
        e.target.setSelectionRange(start + 1, start + 1);
        
        // Sistemin değişikliği algılaması için input event'ini tetikle
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
});