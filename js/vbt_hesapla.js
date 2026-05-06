// vbt_hesapla.js - Halter Hızı Analiz Motoru

let vbtCalibMode = 0; 
let vbtKcal = null; 

document.getElementById('btnCalibrate').addEventListener('click', function() {
    vbtCalibMode = 1;
    this.textContent = "👉 Üst noktayı işaretleyin...";
});

// Set işaretleme state değişkenleri
let activeVbtSet = 0; // 0: pasif, 1,2,3: aktif set
let vbtMarkStep = 0; // 0: pasif, 1: başlangıç bekle, 2: bitiş bekle

['1', '2', '3'].forEach(setNum => {
    document.getElementById(`btnVbtMark${setNum}`).addEventListener('click', function() {
        activeVbtSet = parseInt(setNum);
        vbtMarkStep = 1;
        this.textContent = "👉 Başlangıç karesinde bar ucunu işaretleyin";
        this.style.backgroundColor = "#e67e22";
    });
});

document.addEventListener('videoTiklandi', function(event) {
    if (!document.getElementById('module-vbt').classList.contains('active')) return;

    const x = event.detail.x;
    const y = event.detail.y;
    const zaman = parseFloat(event.detail.zaman);

    // Kalibrasyon Döngüsü
    if (vbtCalibMode === 1) {
        document.getElementById('cal_x1').textContent = x;
        document.getElementById('cal_y1').textContent = y;
        vbtCalibMode = 2;
        document.getElementById('btnCalibrate').textContent = "👉 Şimdi alt noktayı işaretleyin...";
        return;
    } else if (vbtCalibMode === 2) {
        document.getElementById('cal_x2').textContent = x;
        document.getElementById('cal_y2').textContent = y;
        vbtCalibMode = 0;
        document.getElementById('btnCalibrate').textContent = "✅ Kalibrasyon Koordinatları Alındı";
        return;
    }

    // Set İşaretleme Döngüsü
    if (activeVbtSet > 0) {
        if (vbtMarkStep === 1) {
            document.getElementById(`t0_display_${activeVbtSet}`).textContent = zaman.toFixed(3);
            document.getElementById(`x0_display_${activeVbtSet}`).textContent = x;
            document.getElementById(`y0_display_${activeVbtSet}`).textContent = y;
            
            vbtMarkStep = 2;
            const btn = document.getElementById(`btnVbtMark${activeVbtSet}`);
            btn.textContent = "👉 Şimdi bitiş karesinde bar ucunu işaretleyin";
            btn.style.backgroundColor = "#8e44ad";
        } 
        else if (vbtMarkStep === 2) {
            document.getElementById(`t1_display_${activeVbtSet}`).textContent = zaman.toFixed(3);
            document.getElementById(`x1_display_${activeVbtSet}`).textContent = x;
            document.getElementById(`y1_display_${activeVbtSet}`).textContent = y;
            
            vbtMarkStep = 0;
            const btn = document.getElementById(`btnVbtMark${activeVbtSet}`);
            btn.textContent = "✅ İşaretleme Tamamlandı";
            btn.style.backgroundColor = "#27ae60";
            activeVbtSet = 0;
        }
    }
});

// VBT Sekme Kontrolleri
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.getAttribute('data-target')).classList.add('active');
        
        window.switchVideoContext('vbt_' + this.getAttribute('data-target'));
    });
});

window.resetSet = function(setNum) {
    document.getElementById(`t0_display_${setNum}`).textContent = '-';
    document.getElementById(`x0_display_${setNum}`).textContent = '-';
    document.getElementById(`y0_display_${setNum}`).textContent = '-';
    document.getElementById(`t1_display_${setNum}`).textContent = '-';
    document.getElementById(`x1_display_${setNum}`).textContent = '-';
    document.getElementById(`y1_display_${setNum}`).textContent = '-';
    
    document.getElementById(`btnVbtMark${setNum}`).textContent = "⏱️ Tıklama (İşaretleme) Başlat";
    document.getElementById(`btnVbtMark${setNum}`).style.backgroundColor = "#2980b9";
    
    document.getElementById(`time_diff_${setNum}`).value = '';
    document.getElementById(`disp_y_${setNum}`).value = '';
    document.getElementById(`speed_${setNum}`).value = '';
    
    activeVbtSet = 0;
    vbtMarkStep = 0;
    window.clearDots();
};

// Summary Senkronizasyonu
document.querySelectorAll('.sync-weight').forEach(input => {
    input.addEventListener('input', function() {
        const setNum = this.getAttribute('data-set');
        document.getElementById(`sumW_${setNum}`).textContent = this.value || '-';
    });
});

document.querySelectorAll('.sync-speed').forEach(input => {
    input.addEventListener('input', function() {
        const setNum = this.getAttribute('data-set');
        document.getElementById(`sumS_${setNum}`).textContent = this.value || '-';
    });
});