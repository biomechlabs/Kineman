// sprint_hesapla.js - 20m Sprint Analiz Motoru ve Adım Zincirleme Algoritması

let sprCalibMode = 0;
let sprClickMode = 0; 
let sprintStepCount = 0;
let activeStepMode = { id: 0, phase: 0 }; 

document.getElementById('btnSprintCalibrate')?.addEventListener('click', function() {
    sprCalibMode = 1; this.textContent = "👉 5m hunisine tıklayın...";
});

document.getElementById('btnSprintStart')?.addEventListener('click', function() {
    sprClickMode = 1; this.textContent = "👉 Harekete başlama anına tıklayın...";
});

let splitIndex = 5;
document.getElementById('btnSprintSplits')?.addEventListener('click', function() {
    sprClickMode = 2; splitIndex = 5; this.textContent = `👉 ${splitIndex}m geçişine tıklayın...`;
});

document.addEventListener('videoTiklandi', function(event) {
    if (!document.getElementById('module-sprint').classList.contains('active')) return;

    const x = event.detail.x;
    const time = parseFloat(event.detail.zaman);

    // Kalibrasyon
    if (sprCalibMode === 1) {
        document.getElementById('spr_cal_x1').textContent = x; sprCalibMode = 2;
        document.getElementById('btnSprintCalibrate').textContent = "👉 10m hunisine tıklayın..."; return;
    } else if (sprCalibMode === 2) {
        document.getElementById('spr_cal_x2').textContent = x; sprCalibMode = 0;
        document.getElementById('btnSprintCalibrate').textContent = "✅ Kalibrasyon Alındı"; return;
    }

    // Başlangıç (0m)
    if (sprClickMode === 1) {
        document.getElementById('spr_t_0').textContent = time.toFixed(3);
        document.getElementById('spr_x_0').textContent = x; sprClickMode = 0;
        document.getElementById('btnSprintStart').textContent = "✅ Başlangıç Alındı"; return;
    }

    // Geçiş Kapıları (Splits)
    if (sprClickMode === 2) {
        if (splitIndex <= 20) {
            document.getElementById(`spr_t_${splitIndex}`).textContent = time.toFixed(3);
            splitIndex += 5;
            if (splitIndex <= 20) {
                document.getElementById('btnSprintSplits').textContent = `👉 ${splitIndex}m geçişine tıklayın...`;
            } else {
                sprClickMode = 0; document.getElementById('btnSprintSplits').textContent = "✅ Tüm Geçişler Alındı";
            }
        }
        return;
    }

    // Zincirleme Adım Döngüleri İşaretlemesi
    if (activeStepMode.id > 0) {
        const id = activeStepMode.id;
        const nextId = id + 1;
        
        if (activeStepMode.phase === 1) {
            document.getElementById(`step_t1_${id}`).textContent = time.toFixed(3);
            document.getElementById(`step_x1_${id}`).textContent = x;
            activeStepMode.phase = 2;
            document.getElementById(`btnStep_${id}`).textContent = `👉 Adım ${id} Yere Temas anına tıklayın...`;
        } 
        else if (activeStepMode.phase === 2) {
            document.getElementById(`step_t2_${id}`).textContent = time.toFixed(3);
            document.getElementById(`step_x2_${id}`).textContent = x;
            activeStepMode.phase = 3;
            document.getElementById(`btnStep_${id}`).textContent = `👉 Adım ${nextId} Yerden Kesilme anına tıklayın...`;
        }
        else if (activeStepMode.phase === 3) {
            document.getElementById(`step_t3_${id}`).textContent = time.toFixed(3);
            document.getElementById(`step_x3_${id}`).textContent = x;
            activeStepMode.id = 0;
            activeStepMode.phase = 0;
            document.getElementById(`btnStep_${id}`).textContent = "✅ Döngü Alındı";
            document.getElementById(`btnStep_${id}`).style.backgroundColor = "#27ae60";
        }
    }
});

// Dinamik Tablo Güncelleyici
function updateSprintAutoSummary() {
    const tbody = document.getElementById('sprintAutoSummaryBody');
    if (!tbody) return;
    tbody.innerHTML = ''; // Temizle ve yeniden oluştur
    
    for(let i = 1; i <= sprintStepCount; i++) {
        const phaseVal = document.getElementById(`step_phase_${i}`)?.value || "-";
        const lenVal = document.getElementById(`step_len_${i}`)?.value || "-";
        const timeVal = document.getElementById(`step_time_${i}`)?.value || "-";
        
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>Adım ${i}</td><td>${phaseVal}</td><td>${lenVal}</td><td>${timeVal}</td>`;
        tbody.appendChild(tr);
    }
}

// Yeni Adım Kartı Üretimi
document.getElementById('btnAddSprintStep')?.addEventListener('click', function() {
    sprintStepCount++;
    const id = sprintStepCount;
    const nextId = id + 1;
    
    const div = document.createElement('div');
    div.className = 'data-group';
    div.style.backgroundColor = '#f9f9f9';
    div.style.border = '1px solid #ddd';
    div.style.marginBottom = '15px';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    
    // Bir önceki adımın "Sonraki Adım Yerden Kesilme" değerini otomatik çekme
    let autoFilledT1 = '-';
    let autoFilledX1 = '-';
    if(id > 1) {
        autoFilledT1 = document.getElementById(`step_t3_${id-1}`)?.textContent || '-';
        autoFilledX1 = document.getElementById(`step_x3_${id-1}`)?.textContent || '-';
    }
    
    // UI/UX İYİLEŞTİRMELERİ BURADA YAPILDI: Buton genişledi, formüller alt alta tam görünür oldu
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px;">
            <h4 style="margin: 0; color: #2c3e50; white-space: nowrap;">Adım ${id}</h4>
            <select id="step_phase_${id}" style="width: 120px; flex-shrink: 0; padding: 6px 4px; font-size:0.85em; border-radius:4px; border: 1px solid #ccc; cursor:pointer;">
                <option value="">Evre Seç...</option>
                <option value="0-5m">0 - 5m</option>
                <option value="5-10m">5 - 10m</option>
                <option value="10-15m">10 - 15m</option>
                <option value="15-20m">15 - 20m</option>
            </select>
            <button class="action-btn" id="btnStep_${id}" style="flex-grow: 1; padding: 6px 10px; margin: 0; background-color: #8e44ad; font-size: 0.85em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">⏱️ İşaretlemeyi Başlat</button>
        </div>
        
        <table class="coord-table" style="font-size: 0.85em; margin-bottom: 10px;">
            <tr><th>Anlık Evre</th><th>Zaman [t]</th><th>X Koor. [X]</th></tr>
            <tr><td>Adım ${id} Yerden Kesilme <b>(1)</b></td><td id="step_t1_${id}">${autoFilledT1}</td><td id="step_x1_${id}">${autoFilledX1}</td></tr>
            <tr><td>Adım ${id} Yere Temas <b>(2)</b></td><td id="step_t2_${id}">-</td><td id="step_x2_${id}">-</td></tr>
            <tr><td>Adım ${nextId} Yerden Kesilme <b>(3)</b></td><td id="step_t3_${id}">-</td><td id="step_x3_${id}">-</td></tr>
        </table>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <input type="number" id="step_len_${id}" placeholder="Uzunluk (m) Formülü: |X3 - X1| x K_cal" style="width: 100%; font-size: 0.9em; padding: 8px; border: 1px solid #2980b9; border-radius:4px;">
            <input type="number" id="step_time_${id}" placeholder="Temas Süresi (sn) Formülü: t3 - t2" style="width: 100%; font-size: 0.9em; padding: 8px; border: 1px solid #c0392b; border-radius:4px;">
        </div>
    `;
    
    document.getElementById('sprintStepsContainer').appendChild(div);
    
    // Otomatik Tablo tetikleyicileri
    document.getElementById(`step_phase_${id}`).addEventListener('change', updateSprintAutoSummary);
    document.getElementById(`step_len_${id}`).addEventListener('input', updateSprintAutoSummary);
    document.getElementById(`step_time_${id}`).addEventListener('input', updateSprintAutoSummary);
    
    // Buton Tıklama Mantığı
    document.getElementById(`btnStep_${id}`).addEventListener('click', function() {
        activeStepMode.id = id;
        
        // Eğer ID 1 ise 3 tıklama yapılacak, 1'den büyükse ilk veri otomatik dolduğu için 2 tıklama yapılacak.
        if (id === 1) {
            activeStepMode.phase = 1;
            this.textContent = `👉 (1) Yerden Kesilmeye Tıklayın`;
        } else {
            activeStepMode.phase = 2; 
            this.textContent = `👉 (2) Yere Temasa Tıklayın`;
        }
        this.style.backgroundColor = "#d35400";
    });
    
    updateSprintAutoSummary(); 
});