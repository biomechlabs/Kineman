// ohs_hesapla.js - OHS FMS Analiz Motoru ve Otomatik Puanlama

const ohsTabBtns = document.querySelectorAll('.ohs-tab-btn');
const ohsTabContents = document.querySelectorAll('.ohs-tab-content');

ohsTabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        ohsTabBtns.forEach(b => b.classList.remove('active'));
        ohsTabContents.forEach(c => c.style.display = 'none');
        this.classList.add('active');
        document.getElementById(this.getAttribute('data-target')).style.display = 'block';
        window.switchVideoContext('fms_' + this.getAttribute('data-target')); 
    });
});

let ohsClickMode = 0; 
// 1-4 Yandan, 5-7 Önden

document.getElementById('btnOhsSide').addEventListener('click', function() {
    ohsClickMode = 1; this.textContent = "👉 1. Omuz Merkezine Tıklayın"; this.style.backgroundColor = "#e67e22";
});

document.getElementById('btnOhsFront').addEventListener('click', function() {
    ohsClickMode = 5; this.textContent = "👉 1. Kalçaya (ASIS) Tıklayın"; this.style.backgroundColor = "#e67e22";
});

document.addEventListener('videoTiklandi', function(event) {
    if (!document.getElementById('module-fms').classList.contains('active')) return;
    const x = event.detail.x; const y = event.detail.y;

    // Yandan Görünüm İşlemleri
    if (ohsClickMode === 1) {
        document.getElementById('ohs_s_x1').textContent = x; document.getElementById('ohs_s_y1').textContent = y;
        ohsClickMode = 2; document.getElementById('btnOhsSide').textContent = "👉 2. Kalçaya (Trokanter) Tıklayın";
    } else if (ohsClickMode === 2) {
        document.getElementById('ohs_s_x2').textContent = x; document.getElementById('ohs_s_y2').textContent = y;
        ohsClickMode = 3; document.getElementById('btnOhsSide').textContent = "👉 3. Dize Tıklayın";
    } else if (ohsClickMode === 3) {
        document.getElementById('ohs_s_x3').textContent = x; document.getElementById('ohs_s_y3').textContent = y;
        ohsClickMode = 4; document.getElementById('btnOhsSide').textContent = "👉 4. Ayak Bileğine Tıklayın";
    } else if (ohsClickMode === 4) {
        document.getElementById('ohs_s_x4').textContent = x; document.getElementById('ohs_s_y4').textContent = y;
        ohsClickMode = 0; document.getElementById('btnOhsSide').textContent = "✅ Yandan Görünüm Alındı";
        document.getElementById('btnOhsSide').style.backgroundColor = "#27ae60";
    }

    // Önden Görünüm İşlemleri
    else if (ohsClickMode === 5) {
        document.getElementById('ohs_f_x1').textContent = x; document.getElementById('ohs_f_y1').textContent = y;
        ohsClickMode = 6; document.getElementById('btnOhsFront').textContent = "👉 2. Diz Kapağına (Patella) Tıklayın";
    } else if (ohsClickMode === 6) {
        document.getElementById('ohs_f_x2').textContent = x; document.getElementById('ohs_f_y2').textContent = y;
        ohsClickMode = 7; document.getElementById('btnOhsFront').textContent = "👉 3. Ayak Bileği Ortasına Tıklayın";
    } else if (ohsClickMode === 7) {
        document.getElementById('ohs_f_x3').textContent = x; document.getElementById('ohs_f_y3').textContent = y;
        ohsClickMode = 0; document.getElementById('btnOhsFront').textContent = "✅ Önden Görünüm Alındı";
        document.getElementById('btnOhsFront').style.backgroundColor = "#27ae60";
    }
});

// OTOMATİK TABLO VE SKOR GÜNCELLEME MEKANİZMASI
function updateFmsTableAndScore() {
    // Açı Değerlerini Çek
    const femurDeg = document.getElementById('ohs_femur_deg').value;
    const paralelDeg = document.getElementById('ohs_diff_deg').value;
    const sapmaDeg = document.getElementById('ohs_valgus_deg').value;

    document.getElementById('tbl_ohs_derinlik_aci').textContent = femurDeg ? femurDeg + "°" : "-";
    document.getElementById('tbl_ohs_paralel_aci').textContent = paralelDeg ? paralelDeg + "°" : "-";
    document.getElementById('tbl_ohs_sapma_aci').textContent = sapmaDeg ? sapmaDeg + "°" : "-";

    // Select Kutu Değerlerini Çek
    const depthEl = document.getElementById('ohs_depth_eval');
    const paralelEl = document.getElementById('ohs_paralel_eval');
    const valgusEl = document.getElementById('ohs_valgus_eval');

    const depthVal = depthEl.value;
    const paralelVal = paralelEl.value;
    const valgusVal = valgusEl.value;

    // Sadece ": " işaretinden önceki başlığı al
    document.getElementById('tbl_ohs_derinlik_puan').textContent = depthVal ? depthEl.options[depthEl.selectedIndex].text.split(':')[0] : "-";
    document.getElementById('tbl_ohs_paralel_puan').textContent = paralelVal ? paralelEl.options[paralelEl.selectedIndex].text.split(':')[0] : "-";
    document.getElementById('tbl_ohs_sapma_puan').textContent = valgusVal ? valgusEl.options[valgusEl.selectedIndex].text.split(':')[0] : "-";

    // Nihai Skoru Hesapla
    if(depthVal === "" || paralelVal === "" || valgusVal === "") {
        document.getElementById('final_fms_score_display').textContent = "-";
        return;
    }

    let finalScore = 0;
    if(depthVal === "100" && paralelVal === "100" && valgusVal === "100") {
        finalScore = 3;
    } else if (depthVal === "0" || paralelVal === "0" || valgusVal === "0") {
        finalScore = 1;
    } else {
        finalScore = 2;
    }

    document.getElementById('final_fms_score_display').textContent = finalScore + " PUAN";
}

// Event Listener'ları ekle
const ohsInputs = ['ohs_femur_deg', 'ohs_diff_deg', 'ohs_valgus_deg', 'ohs_depth_eval', 'ohs_paralel_eval', 'ohs_valgus_eval'];
ohsInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateFmsTableAndScore);
});