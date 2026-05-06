// posture_hesapla.js - Statik Postür Analiz Motoru ve Otomatik Puanlama

const posTabBtns = document.querySelectorAll('.pos-tab-btn');
const posTabContents = document.querySelectorAll('.pos-tab-content');

posTabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        posTabBtns.forEach(b => b.classList.remove('active'));
        posTabContents.forEach(c => c.style.display = 'none');
        this.classList.add('active');
        document.getElementById(this.getAttribute('data-target')).style.display = 'block';
        window.switchVideoContext('pos_' + this.getAttribute('data-target')); 
    });
});

let posClickMode = 0; 

document.getElementById('btnPosHead').addEventListener('click', function() {
    posClickMode = 101; this.textContent = "👉 1. C7 Omuruna Tıklayın"; this.style.backgroundColor = "#e67e22";
});
document.getElementById('btnPosPlumb').addEventListener('click', function() {
    posClickMode = 201; this.textContent = "👉 1. Ayak Bileğine Tıklayın"; this.style.backgroundColor = "#e67e22";
});
document.getElementById('btnPosShoulderAsym').addEventListener('click', function() {
    posClickMode = 301; this.textContent = "👉 1. SAĞ Omuza Tıklayın"; this.style.backgroundColor = "#e67e22";
});
document.getElementById('btnPosPelvisAsym').addEventListener('click', function() {
    posClickMode = 401; this.textContent = "👉 1. SAĞ Kalçaya (ASIS) Tıklayın"; this.style.backgroundColor = "#e67e22";
});

document.addEventListener('videoTiklandi', function(event) {
    if (!document.getElementById('module-posture').classList.contains('active')) return;
    const xVal = event.detail.x; const yVal = event.detail.y;

    if (posClickMode === 101) {
        document.getElementById('pos_c7_x').textContent = xVal; document.getElementById('pos_c7_y').textContent = yVal;
        posClickMode = 102; document.getElementById('btnPosHead').textContent = "👉 2. Kulağa (Tragus) Tıklayın";
    } else if (posClickMode === 102) {
        document.getElementById('pos_ear_x').textContent = xVal; document.getElementById('pos_ear_y').textContent = yVal;
        posClickMode = 0; document.getElementById('btnPosHead').textContent = "✅ CVA Noktaları Alındı"; document.getElementById('btnPosHead').style.backgroundColor = "#27ae60";
    }
    else if (posClickMode === 201) {
        document.getElementById('pos_ankle_x').textContent = xVal; document.getElementById('pos_ankle_y').textContent = yVal;
        posClickMode = 202; document.getElementById('btnPosPlumb').textContent = "👉 2. Omuz Üst Noktasına Tıklayın";
    } else if (posClickMode === 202) {
        document.getElementById('pos_shoulder_x').textContent = xVal; document.getElementById('pos_shoulder_y').textContent = yVal;
        posClickMode = 0; document.getElementById('btnPosPlumb').textContent = "✅ Dikey Hiza Noktaları Alındı"; document.getElementById('btnPosPlumb').style.backgroundColor = "#27ae60";
    }
    else if (posClickMode === 301) {
        document.getElementById('pos_rs_x').textContent = xVal; document.getElementById('pos_rs_y').textContent = yVal;
        posClickMode = 302; document.getElementById('btnPosShoulderAsym').textContent = "👉 2. SOL Omuza Tıklayın";
    } else if (posClickMode === 302) {
        document.getElementById('pos_ls_x').textContent = xVal; document.getElementById('pos_ls_y').textContent = yVal;
        posClickMode = 0; document.getElementById('btnPosShoulderAsym').textContent = "✅ Omuz Noktaları Alındı"; document.getElementById('btnPosShoulderAsym').style.backgroundColor = "#27ae60";
    }
    else if (posClickMode === 401) {
        document.getElementById('pos_rp_x').textContent = xVal; document.getElementById('pos_rp_y').textContent = yVal;
        posClickMode = 402; document.getElementById('btnPosPelvisAsym').textContent = "👉 2. SOL Kalçaya Tıklayın";
    } else if (posClickMode === 402) {
        document.getElementById('pos_lp_x').textContent = xVal; document.getElementById('pos_lp_y').textContent = yVal;
        posClickMode = 0; document.getElementById('btnPosPelvisAsym').textContent = "✅ Pelvis Noktaları Alındı"; document.getElementById('btnPosPelvisAsym').style.backgroundColor = "#27ae60";
    }
});

// OTOMATİK TABLO VE SKOR GÜNCELLEME MEKANİZMASI
function updatePostureTableAndScore() {
    const cvaDeg = document.getElementById('pos_cva_deg').value;
    const plumbDeg = document.getElementById('pos_plumb_deg').value;
    const saDeg = document.getElementById('pos_sa_deg').value;
    const paDeg = document.getElementById('pos_pa_deg').value;

    document.getElementById('tbl_pos_cva_aci').textContent = cvaDeg ? cvaDeg + "°" : "-";
    document.getElementById('tbl_pos_dikey_aci').textContent = plumbDeg ? plumbDeg + "°" : "-";
    document.getElementById('tbl_pos_omuz_aci').textContent = saDeg ? saDeg + "°" : "-";
    document.getElementById('tbl_pos_pelvis_aci').textContent = paDeg ? paDeg + "°" : "-";

    const cvaEl = document.getElementById('pos_cva_eval');
    const plumbEl = document.getElementById('pos_plumb_eval');
    const saEl = document.getElementById('pos_shoulder_eval');
    const paEl = document.getElementById('pos_pelvis_eval');

    const cvaVal = cvaEl.value; const plumbVal = plumbEl.value;
    const saVal = saEl.value; const paVal = paEl.value;

    document.getElementById('tbl_pos_cva_puan').textContent = cvaVal ? cvaEl.options[cvaEl.selectedIndex].text.split(':')[0] : "-";
    document.getElementById('tbl_pos_dikey_puan').textContent = plumbVal ? plumbEl.options[plumbEl.selectedIndex].text.split(':')[0] : "-";
    document.getElementById('tbl_pos_omuz_puan').textContent = saVal ? saEl.options[saEl.selectedIndex].text.split(':')[0] : "-";
    document.getElementById('tbl_pos_pelvis_puan').textContent = paVal ? paEl.options[paEl.selectedIndex].text.split(':')[0] : "-";

    if(cvaVal === "" || plumbVal === "" || saVal === "" || paVal === "") {
        document.getElementById('final_posture_score_display').textContent = "-"; return;
    }

    let finalScore = 0;
    if(cvaVal === "100" && plumbVal === "100" && saVal === "100" && paVal === "100") {
        finalScore = 3;
    } else if (cvaVal === "0" || plumbVal === "0" || saVal === "0" || paVal === "0") {
        finalScore = 1;
    } else {
        finalScore = 2;
    }
    document.getElementById('final_posture_score_display').textContent = finalScore + " PUAN";
}

const posInputs = ['pos_cva_deg', 'pos_plumb_deg', 'pos_sa_deg', 'pos_pa_deg', 'pos_cva_eval', 'pos_plumb_eval', 'pos_shoulder_eval', 'pos_pelvis_eval'];
posInputs.forEach(id => { document.getElementById(id).addEventListener('input', updatePostureTableAndScore); });