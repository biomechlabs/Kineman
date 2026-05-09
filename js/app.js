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
        
        // ÖNEMLİ: Bilgileri Header'a basan kısım
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
        // Sistemi gizle, açılış sayfasını göster
        document.getElementById('mainAppContainer').style.display = 'none';
        document.getElementById('landingPage').style.display = 'flex';
        
        // Form alanlarını temizle
        document.getElementById('lpNo').value = '';
        document.getElementById('lpName').value = '';
        document.getElementById('lpEmail').value = '';
        window.studentData = { no: '', name: '', email: '' };
        
        // Eğer yüklü video varsa durdur
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
    const guides = {
        'vbt': `<h2>Halter Hızı (VBT) Analizi Laboratuvar Kılavuzu</h2>
            <p>Hız Temelli Antrenman (Velocity Based Training - VBT) analizi, sporcunun farklı ağırlık (yük) seviyelerindeki konsantrik kaldırış hızını hesaplayarak, doğrusal regresyon mantığıyla maksimal kuvvetini (1TM) tahmin etmeye yarayan kinematik bir ölçüm protokolüdür.</p>
            <h3>Ön Hazırlık ve Video Çekim Standartları</h3><ul><li><strong>Kamera Açısı:</strong> Kamera yere sabitlenmeli ve harekete tam yandan (sagittal düzlem), 90 derecelik dik bir açıyla bakmalıdır.</li><li><strong>Referans Objesi:</strong> Videonun çekildiği düzlemde, barın hareket hattı ile aynı derinlikte fiziksel uzunluğu bilinen bir obje bulunmalıdır.</li></ul>
            <h3>Aşama 1: Sistemsel Kalibrasyon</h3><ol><li>Videoyu yükleyin.</li><li><strong>"Kalibrasyon İçin Tıkla"</strong> butonuna basın.</li><li>Referans objenin üst ve alt noktasına tıklayın.</li><li>Gerçek uzunluğu girin.</li><li><code>Gerçek Uzunluk / |Y_üst - Y_alt|</code> formülüyle katsayıyı hesaplayın.</li></ol>
            <h3>Aşama 2: Kinematik Veri Toplama</h3><ol><li>Kaldırılan ağırlığı girin.</li><li>Konsantrik fazın başladığı anı bulup <strong>"Tıklama Başlat"</strong> diyerek bara tıklayın.</li><li>Bitiş anına ilerleyip tekrar tıklayın.</li><li>Formülleri kullanarak Süre, Mesafe ve Ortalama Hızı hesaplayın.</li></ol>
            <h3>Aşama 3: 1TM Kestirimi</h3><ol><li>Regresyon Eğimini <code>(Hız3 - Hız1) / (Yük3 - Yük1)</code> ile hesaplayın.</li><li>Kesişimi <code>Hız1 - (Eğim x Yük1)</code> ile hesaplayın.</li><li>MVT'yi seçip 1TM'yi <code>(MVT - Kesişim) / Eğim</code> formülüyle bulun.</li></ol>`,
        
        'sprint': `<h2>20m Sprint (İvmelenme) Analizi Laboratuvar Kılavuzu</h2>
            <p>Sporcunun kalkış, ivmelenme, geçiş ve maksimum hız evrelerindeki kinematik parametrelerini (adım uzunluğu, temas süresi, hız ve ivme) hesaplamak için kullanılır.</p>
            <h3>Kamera Yerleşimi</h3><p>20 metrelik alanı yandan dik görecek, 20m'nin 0, 5, 10, 15 ve 20. metrelerine huni yerleştirilecek, kalibrasyon 5. ve 10. metrelerdeki hunilerle yapılacaktır.</p>
            <h3>Aşama 1: Kalibrasyon</h3><ol><li>Videoyu yükleyin ve <strong>"Kalibrasyon İçin Tıkla"</strong>ya basın.</li><li>5. ve 10. metre hunilerine tıklayın.</li><li><code>5 / |X_10m - X_5m|</code> formülüyle katsayıyı hesaplayın.</li></ol>
            <h3>Aşama 2: Süre Analizi</h3><ol><li>0m kalkış anını işaretleyin.</li><li>Sırasıyla 5, 10, 15 ve 20. metre geçişlerini işaretleyin.</li></ol>
            <h3>Aşama 3 & 4: Adım Döngüleri ve Hesaplamalar</h3><ol><li><strong>"Yeni Adım Döngüsü Ekle"</strong>ye basarak adımın yerden kesilme ve yere temas anlarını tıklayın.</li><li>Temas ve uzunluğu hesaplayın.</li><li>Evre ortalamalarını bularak matrise girin.</li></ol>`,
        
        'fms': `<h2>FMS: Overhead Squat Analizi Laboratuvar Kılavuzu</h2>
            <p>Sporcunun sagittal ve frontal düzlemlerdeki bilateral simetrisini ve mekaniğini değerlendiren ölçüm protokolüdür.</p>
            <h3>Aşama 1: Yandan Görünüm</h3><ol><li>En alt noktada Omuz, Kalça, Diz ve Bilek noktalarına tıklayın.</li><li><strong>Derinlik:</strong> Femur eğimi yatay açısını hesaplayıp puan verin (Kalça dizin altındaysa 100 Puan).</li><li><strong>Paralellik:</strong> Gövde ve Tibia açıları farkını bulun (Fark <= 5° ise 100 Puan).</li></ol>
            <h3>Aşama 2: Önden Görünüm</h3><ol><li>Kalça (ASIS), Diz Kapağı ve Ayak Bileği orta noktasına tıklayın.</li><li><strong>Hizalanma:</strong> Uyluk ve Kaval kemiği dikey açıları sapmasını bulun (Sapma <= 5° ise 100 Puan).</li></ol>`,
        
        'posture': `<h2>Statik Postür Analizi Laboratuvar Kılavuzu</h2>
            <p>Nötral duruştaki omurga eğriliklerini ve vücut asimetrilerini açısal olarak tespit eden klinik protokoldür.</p>
            <h3>Aşama 1: Yandan Görünüm</h3><ol><li><strong>CVA:</strong> C7 Omuru ve Kulağa (Tragus) tıklayarak açıyı bulun (Açı >= 50° ise 100 Puan).</li><li><strong>Şakül Çizgisi:</strong> Bilek ve Omuza tıklayıp dikey hizalamayı bulun (Açı >= 87° ise 100 Puan).</li></ol>
            <h3>Aşama 2: Önden Görünüm</h3><ol><li><strong>Omuz Asimetrisi:</strong> Sağ ve Sol omuz noktalarını işaretleyin (Sapma <= 2° ise 100 Puan).</li><li><strong>Pelvis Asimetrisi:</strong> Sağ ve Sol kalça çıkıntılarını işaretleyin.</li></ol>`,
        
        'jump': `<h2>Dikey Sıçrama (SJ/CMJ) Analizi Laboratuvar Kılavuzu</h2>
            <p>Sıçrama yüksekliği ve patlayıcı güç, uçuş süresi üzerinden hesaplanır.</p>
            <h3>Uygulama</h3><ol><li>Sporcunun kütlesini girin.</li><li>Kalkış anını ve İniş anını işaretleyin.</li><li><code>İniş Zamanı - Kalkış Zamanı</code> ile uçuş süresini bulun.</li><li><code>[9.81 x (Uçuş Süresi²)] / 8</code> formülüyle metre cinsinden yüksekliği bulun.</li><li>Sayers denklemi <code>(60.7 x Yükseklik[cm]) + (45.3 x Ağırlık[kg]) - 2055</code> ile zirve gücü hesaplayın.</li></ol>`,
        
        'agility': `<h2>505 Çeviklik ve Yön Değiştirme Analizi Laboratuvar Kılavuzu</h2>
            <p>Sporcunun hızlanma, sert frenleme ve 180 derece yön değiştirme (COD) mekaniğini ve sağ/sol bacak arası kuvvet asimetrilerini inceler.</p>
            <h3>Uygulama</h3><ol><li>Sağ ayak dönüş videosunu yükleyin.</li><li>10m giriş ve çıkışını işaretleyip Toplam Süreyi hesaplayın.</li><li>Frenleme (Dönüş) ayağının ilk temas ve yerden kesilme anlarını işaretleyip Dönüş Temas Süresini hesaplayın.</li><li>Sol ayak için tekrarlayın.</li><li>Sistem mutlak farkı hesaplayarak %10 asimetri eşiğine göre "Dengeli" veya "Kuvvetlendirme Gerekli" kararını verecektir.</li></ol>`
    };

    const guideContent = `
        <html><head><title>Laboratuvar Kılavuzu</title>
        <style>body{font-family:Arial,sans-serif; padding:30px; line-height:1.6; color:#2c3e50; max-width:800px; margin:auto;} h2{color:#2980b9; border-bottom:2px solid #ecf0f1; padding-bottom:10px;} h3{color:#16a085; margin-top:25px;}</style>
        </head><body>${guides[module]}</body></html>
    `;
    
    const win = window.open('', '_blank');
    win.document.write(guideContent);
    win.document.close();
};

// app.js - Çekirdek Motor ve Zaman Damgalı Kırmızı Nokta (Red Dot) Mekanizması

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
        videoUploader.style.pointerEvents = 'auto'; // Tıklanabilir yap
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
    videoUploader.style.pointerEvents = 'none'; // Videoya tıklamayı engellememesi için
    uploadText.style.display = 'none';
    mainVideo.style.display = 'block'; 
    customControls.style.display = 'flex'; // Video yüklenince panel görünür
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

// --- app.js SON KISIM GÜNCELLEMESİ (GÖRSEL HAFIZA EKLENDİ) ---

// Kinetik kareleri saklayacağımız global bellek
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
    
    // ANLIK KARE YAKALAMA VE BELLEĞE YAZMA (Canvas Frame Buffer)
    try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = mainVideo.videoWidth;
        offCanvas.height = mainVideo.videoHeight;
        offCanvas.getContext('2d').drawImage(mainVideo, 0, 0, offCanvas.width, offCanvas.height);
        // İlgili modülün sekme adına göre son kareyi hafızaya alıyoruz (OHS ve Postür çizimleri için kullanılacak)
        window.KineFrameBuffer[window.currentVideoContext] = offCanvas.toDataURL('image/jpeg', 0.8);
    } catch(e) {
        console.warn("Kare yakalanamadı. Video yüklenmemiş olabilir.");
    }

    document.dispatchEvent(new CustomEvent('videoTiklandi', { detail: { x: lastX, y: lastY, zaman: timeStr } }));
});

// --- GÖNDER BUTONLARINI İNAKTİF ETME (YAKINDA AKTİF) ---
    const submitBtns = document.querySelectorAll('.submit-btn');
    submitBtns.forEach(btn => {
        // 1. Butonu klonlayarak üzerindeki eski "tıklama / dosya gönderme" özelliklerini tamamen siliyoruz (Güvenlik)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // 2. Butonu görsel olarak pasif (gri) ve yasaklı imleç hale getiriyoruz
        newBtn.style.backgroundColor = '#95a5a6';
        newBtn.style.color = '#ffffff';
        newBtn.style.opacity = '0.8';
        newBtn.style.cursor = 'not-allowed';
        newBtn.style.transition = '0.3s';
        
        // 3. Orijinal metni ("📤 Değerlendirme Dosyasını Gönder") hafızaya alıyoruz
        const originalText = newBtn.innerHTML;
        
        // 4. İmleç butonun üzerine geldiğinde (Hover)
        newBtn.addEventListener('mouseenter', () => {
            newBtn.innerHTML = '⏳ YAKINDA AKTİF';
            newBtn.style.backgroundColor = '#7f8c8d'; // Biraz daha koyu gri
        });
        
        // 5. İmleç butonun üzerinden çekildiğinde
        newBtn.addEventListener('mouseleave', () => {
            newBtn.innerHTML = originalText;
            newBtn.style.backgroundColor = '#95a5a6'; // Eski griye dön
        });
    });