// ai_export.js - Gelişmiş Rapor Çıktı ve Değerlendirme Motoru

function getStudentHeader() {
    const no = window.studentData?.no || '......................................';
    const name = window.studentData?.name || '............................................................';
    const email = window.studentData?.email || '............................................................';
    return `
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #2c3e50; display: flex; justify-content: space-between; font-size: 0.9em; color: #34495e;">
            <div><strong>Öğrenci No:</strong> ${no}</div>
            <div><strong>Adı Soyadı:</strong> ${name}</div>
            <div><strong>E-posta:</strong> ${email}</div>
        </div>
    `;
}

function getVal(id) { 
    const el = document.getElementById(id);
    if (!el) return NaN;
    // Değeri al, virgülü noktaya çevir ve boşlukları sil
    const val = (el.textContent || el.value).replace(/,/g, '.').trim();
    // Eğer kutu boşsa veya tire varsa NaN döndür (böylece 0 üzerinden Hatalı Puan verilmesini önler)
    if (val === '' || val === '-') return NaN;
    return parseFloat(val); 
}

// MAC/SAFARİ UYUMLU, GÜVENLİ GÖRSEL ÇEKİM MOTORU
async function captureVideoFrameAsync(videoUrl, timeSec, points = []) {
    return new Promise((resolve) => {
        if (!videoUrl || isNaN(timeSec)) { resolve(""); return; }
        const vid = document.createElement('video');
        
        // Safari'de Blob URL'lerde CORS hatasını önlemek için kontrol
        if (!videoUrl.startsWith('blob:')) {
            vid.crossOrigin = "anonymous";
        }
        vid.muted = true;
        vid.playsInline = true;

        // Safari'de sonsuz döngüyü engellemek için 2 saniyelik zaman aşımı koruması
        const timer = setTimeout(() => { resolve(""); }, 2000);

        vid.addEventListener('loadeddata', () => {
            vid.currentTime = timeSec;
        });

        vid.addEventListener('seeked', () => {
            clearTimeout(timer); // Başarılıysa zamanlayıcıyı iptal et
            try {
                const canvas = document.createElement('canvas');
                canvas.width = vid.videoWidth; canvas.height = vid.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
                points.forEach(p => {
                    if (p.x > 0 && p.y > 0) {
                        ctx.beginPath();
                        const radius = Math.max(canvas.width / 200, 4); 
                        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = p.color || '#e74c3c';
                        ctx.fill();
                        ctx.lineWidth = radius / 2;
                        ctx.strokeStyle = '#ffffff';
                        ctx.stroke();
                    }
                });
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            } catch(e) {
                resolve("");
            }
        });

        vid.addEventListener('error', () => {
            clearTimeout(timer);
            resolve("");
        });

        vid.src = videoUrl;
        vid.load(); // Safari tetikleyicisi
    });
}

// MAC/SAFARİ UYUMLU, GÜVENLİ RESİM YÜKLEME MOTORU
async function loadImage(src) {
    return new Promise((resolve) => {
        if (!src) { resolve(null); return; } // Safari'nin boş src'de kilitlenmesini önler
        const img = new Image(); 
        img.onload = () => resolve(img); 
        img.onerror = () => resolve(null); 
        img.src = src;
    });
}

async function createChronophotography(imgSrc1, imgSrc2, lineCoords = null) {
    if (!imgSrc1 && !imgSrc2) return "";
    const img1 = await loadImage(imgSrc1); const img2 = await loadImage(imgSrc2);
    if (!img1 && !img2) return "";
    const cvs = document.createElement('canvas');
    cvs.width = img1 ? img1.width : img2.width; cvs.height = img1 ? img1.height : img2.height;
    const ctx = cvs.getContext('2d');
    if (img1) ctx.drawImage(img1, 0, 0);
    if (img2) { ctx.globalAlpha = 0.5; ctx.drawImage(img2, 0, 0); ctx.globalAlpha = 1.0; }
    if (lineCoords && lineCoords.x1 && lineCoords.x2) {
        ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 4; ctx.beginPath();
        ctx.moveTo(lineCoords.x1, lineCoords.y1); ctx.lineTo(lineCoords.x2, lineCoords.y2); ctx.stroke();
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(lineCoords.x1, lineCoords.y1, 6, 0, 2*Math.PI); ctx.fill();
        ctx.beginPath(); ctx.arc(lineCoords.x2, lineCoords.y2, 6, 0, 2*Math.PI); ctx.fill();
    }
    return cvs.toDataURL('image/jpeg', 0.8);
}

async function drawJointLines(imgSrc, pointsArray) {
    if (!imgSrc) return "";
    const img = await loadImage(imgSrc); if (!img) return "";
    const cvs = document.createElement('canvas');
    cvs.width = img.width; cvs.height = img.height;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0);
    ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 4; ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    for (let i = 0; i < pointsArray.length; i++) {
        const p = pointsArray[i];
        if (isNaN(p.x) || isNaN(p.y)) continue;
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    for (let i = 0; i < pointsArray.length; i++) {
        const p = pointsArray[i];
        if (isNaN(p.x) || isNaN(p.y)) continue;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 2*Math.PI); ctx.fill();
    }
    return cvs.toDataURL('image/jpeg', 0.8);
}

// -----------------------------------------------------------------------------
// 1. VBT KOMBİNE RAPOR VE DEĞERLENDİRME MOTORU
// -----------------------------------------------------------------------------
document.getElementById('btnPrintReportVbt')?.addEventListener('click', async function() {
    const btn = this;
    const mvtSelect = document.getElementById('vbt_exercise_select');
    if (!mvtSelect || !mvtSelect.value) { alert("Lütfen önce değerlendirilecek hareketi seçin! (MVT)"); return; }
    
    const selectedMVT = parseFloat(mvtSelect.value);
    btn.textContent = "⏳ Analiz ve Rapor Oluşturuluyor..."; btn.disabled = true;

    try {
        let correctParams = 0; let totalPoints = 0;

        function evalParam(sys, stu, weight, tol=0.05) {
            if(isNaN(sys) || isNaN(stu)) return {text: "Hatalı (0 Puan)", css: "color:#c0392b; font-weight:bold;"};
            const diff = Math.abs(sys - stu); 
            const limit = Math.abs(sys * tol) + 0.01;
            if(diff <= limit) { correctParams++; totalPoints += weight; return {text: `Doğru (+${weight} Puan)`, css: "color:#16a085; font-weight:bold;"}; }
            return {text: "Hatalı (0 Puan)", css: "color:#c0392b; font-weight:bold;"};
        }

        const realL = getVal('inputRealLength');
        const cal_x1 = getVal('cal_x1'); const cal_y1 = getVal('cal_y1');
        const cal_x2 = getVal('cal_x2'); const cal_y2 = getVal('cal_y2');
        const sysKcal = Math.abs(cal_y1 - cal_y2) > 0 ? realL / Math.abs(cal_y1 - cal_y2) : 0;
        
        const sets = [1, 2, 3]; const sysSetData = [];
        sets.forEach(s => {
            const t0 = getVal(`t0_display_${s}`); const y0 = getVal(`y0_display_${s}`);
            const t1 = getVal(`t1_display_${s}`); const y1 = getVal(`y1_display_${s}`);
            const w = getVal(`weight_${s}`);
            const sysDt = Math.abs(t1 - t0); const sysDy = Math.abs(y1 - y0) * sysKcal;
            sysSetData.push({ w, sysDt, sysDy, sysSpeed: sysDt > 0 ? (sysDy / sysDt) : 0 });
        });

        const wDiff = sysSetData[2].w - sysSetData[0].w;
        const sysSlope = wDiff !== 0 ? (sysSetData[2].sysSpeed - sysSetData[0].sysSpeed) / wDiff : 0;
        const sysIntercept = sysSetData[0].sysSpeed - (sysSlope * sysSetData[0].w);
        const sys1RM = sysSlope !== 0 ? (selectedMVT - sysIntercept) / sysSlope : 0; 

        const stuKcal = getVal('inputKcal');
        const kcalGrade = evalParam(sysKcal, stuKcal, 4, 0.02); 
        const s1DtGrade = evalParam(sysSetData[0].sysDt, getVal('time_diff_1'), 8);
        const s1DyGrade = evalParam(sysSetData[0].sysDy, getVal('disp_y_1'), 8);
        const s1SpeedGrade = evalParam(sysSetData[0].sysSpeed, getVal('speed_1'), 8);
        const s2DtGrade = evalParam(sysSetData[1].sysDt, getVal('time_diff_2'), 8);
        const s2DyGrade = evalParam(sysSetData[1].sysDy, getVal('disp_y_2'), 8);
        const s2SpeedGrade = evalParam(sysSetData[1].sysSpeed, getVal('speed_2'), 8);
        const s3DtGrade = evalParam(sysSetData[2].sysDt, getVal('time_diff_3'), 8);
        const s3DyGrade = evalParam(sysSetData[2].sysDy, getVal('disp_y_3'), 8);
        const s3SpeedGrade = evalParam(sysSetData[2].sysSpeed, getVal('speed_3'), 8);
        const slopeGrade = evalParam(sysSlope, getVal('inputSlope'), 8, 0.05);
        const interGrade = evalParam(sysIntercept, getVal('inputIntercept'), 8, 0.05);
        const rmGrade = evalParam(sys1RM, getVal('input1RM'), 8, 0.05);

        const vidUrl = window.videoMemory['vbt_set1']; 
        const img1_start = await captureVideoFrameAsync(vidUrl, getVal('t0_display_1'));
        const img1_end = await captureVideoFrameAsync(vidUrl, getVal('t1_display_1'));
        const chrono1 = await createChronophotography(img1_start, img1_end, {x1: getVal('x0_display_1'), y1: getVal('y0_display_1'), x2: getVal('x1_display_1'), y2: getVal('y1_display_1')});
        
        const reportContent = `
            <html><head><title>KINEMAN VBT Raporu</title><script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-bottom:20px;} th,td{border:1px solid #bdc3c7; padding:8px; text-align:center; font-size:13px;} th{background:#34495e; color:white;} .img-box{width:100%; max-height:250px; object-fit:contain;} .score-card{background:#ecf0f1; border-left:5px solid #27ae60; padding:15px; margin-bottom:20px;}</style></head><body>
                <h1 style="text-align:center;">Halter Hızı (VBT) Raporu</h1>${getStudentHeader()}
                <div class="score-card"><h2 style="margin-top:0;">Otonom Değerlendirme</h2><p>13 parametrenin <strong>${correctParams}</strong> adedi doğru.</p><p style="font-size:20px;">TOPLAM PUAN: <strong style="color:${totalPoints >= 60 ? '#27ae60' : '#c0392b'};">${totalPoints} / 100</strong></p></div>
                <h3>1. Parametre Doğruluk Tablosu</h3>
                <table>
                    <tr><th style="background:#2980b9;">Parametre</th><th style="background:#2980b9;">Öğrenci Girdisi</th><th style="background:#2980b9;">Sistem Kararı</th></tr>
                    <tr><td>Kalibrasyon (m/px)</td><td>${!isNaN(stuKcal) ? stuKcal.toFixed(5) : '-'}</td><td style="${kcalGrade.css}">${kcalGrade.text}</td></tr>
                    <tr><td>Set 1 - Süre</td><td>${!isNaN(getVal('time_diff_1')) ? getVal('time_diff_1') : '-'} sn</td><td style="${s1DtGrade.css}">${s1DtGrade.text}</td></tr>
                    <tr><td>Set 1 - Mesafe</td><td>${!isNaN(getVal('disp_y_1')) ? getVal('disp_y_1') : '-'} m</td><td style="${s1DyGrade.css}">${s1DyGrade.text}</td></tr>
                    <tr><td>Set 1 - Ort. Hız</td><td>${!isNaN(getVal('speed_1')) ? getVal('speed_1') : '-'} m/sn</td><td style="${s1SpeedGrade.css}">${s1SpeedGrade.text}</td></tr>
                    <tr><td>Set 2 - Süre</td><td>${!isNaN(getVal('time_diff_2')) ? getVal('time_diff_2') : '-'} sn</td><td style="${s2DtGrade.css}">${s2DtGrade.text}</td></tr>
                    <tr><td>Set 2 - Mesafe</td><td>${!isNaN(getVal('disp_y_2')) ? getVal('disp_y_2') : '-'} m</td><td style="${s2DyGrade.css}">${s2DyGrade.text}</td></tr>
                    <tr><td>Set 2 - Ort. Hız</td><td>${!isNaN(getVal('speed_2')) ? getVal('speed_2') : '-'} m/sn</td><td style="${s2SpeedGrade.css}">${s2SpeedGrade.text}</td></tr>
                    <tr><td>Set 3 - Süre</td><td>${!isNaN(getVal('time_diff_3')) ? getVal('time_diff_3') : '-'} sn</td><td style="${s3DtGrade.css}">${s3DtGrade.text}</td></tr>
                    <tr><td>Set 3 - Mesafe</td><td>${!isNaN(getVal('disp_y_3')) ? getVal('disp_y_3') : '-'} m</td><td style="${s3DyGrade.css}">${s3DyGrade.text}</td></tr>
                    <tr><td>Set 3 - Ort. Hız</td><td>${!isNaN(getVal('speed_3')) ? getVal('speed_3') : '-'} m/sn</td><td style="${s3SpeedGrade.css}">${s3SpeedGrade.text}</td></tr>
                    <tr><td>Regresyon Eğimi</td><td>${!isNaN(getVal('inputSlope')) ? getVal('inputSlope') : '-'}</td><td style="${slopeGrade.css}">${slopeGrade.text}</td></tr>
                    <tr><td>Regresyon Kesişimi</td><td>${!isNaN(getVal('inputIntercept')) ? getVal('inputIntercept') : '-'}</td><td style="${interGrade.css}">${interGrade.text}</td></tr>
                    <tr><td>Nihai 1TM</td><td>${!isNaN(getVal('input1RM')) ? getVal('input1RM') : '-'} kg</td><td style="${rmGrade.css}">${rmGrade.text}</td></tr>
                </table>
                <div style="page-break-before: always;"></div>
                <div style="text-align:center;"><img src="${chrono1}" class="img-box"><br><i>Set 1 Chronophotography</i></div>
                <div style="width:100%; max-width: 600px; margin: 30px auto;"><canvas id="vbtChart"></canvas></div>
                <script>
                    new Chart(document.getElementById('vbtChart').getContext('2d'), {
                        type: 'scatter', data: {
                            datasets: [
                                { label: 'Set Ölçümleri', data: [{x:${getVal('sumW_1')}, y:${getVal('speed_1')}}, {x:${getVal('sumW_2')}, y:${getVal('speed_2')}}, {x:${getVal('sumW_3')}, y:${getVal('speed_3')}}], backgroundColor: '#e74c3c', pointRadius: 5 },
                                { type: 'line', label: 'Yük-Hız Regresyonu', data: [{x:0, y:${getVal('inputIntercept')}}, {x:${getVal('input1RM')}, y:${selectedMVT}}], borderColor: '#3498db', borderWidth: 2, fill: false },
                                { label: '1TM Kestirimi', data: [{x:${getVal('input1RM')}, y:${selectedMVT}}], backgroundColor: '#27ae60', pointRadius: 7, pointStyle: 'rectRot' }
                            ]
                        }, options: { animation: false, scales: { x: { title: { display: true, text: 'Ağırlık (kg)' } }, y: { title: { display: true, text: 'Hız (m/sn)' }, min: 0 } } }
                    });
                    setTimeout(() => { window.print(); }, 1000);
                </script>
            </body></html>`;
        const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    } catch(err) {
        alert("Rapor oluşturulurken bir hata meydana geldi: " + err.message);
    } finally {
        btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
    }
});

// -----------------------------------------------------------------------------
// 2. SPRINT KOMBİNE RAPOR VE DEĞERLENDİRME MOTORU
// -----------------------------------------------------------------------------
document.getElementById('btnSprintPrint')?.addEventListener('click', async function() {
    const btn = this; btn.textContent = "⏳ Analiz ve Rapor Oluşturuluyor..."; btn.disabled = true;
    
    try {
        let totalParams = 0; let correctParams = 0;
        function check(sys, stu, tol=0.05) {
            totalParams++;
            if (isNaN(sys) || isNaN(stu)) return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
            const diff = Math.abs(sys - stu); const limit = Math.abs(sys * tol) + 0.01;
            if (diff <= limit) { correctParams++; return `<td style="color:#16a085; font-weight:bold;">Doğru</td>`; }
            return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
        }

        const sysKcal = Math.abs(getVal('spr_cal_x2') - getVal('spr_cal_x1')) > 0 ? 5 / Math.abs(getVal('spr_cal_x2') - getVal('spr_cal_x1')) : 0;
        let evalRows = `<tr><td>Kalibrasyon Katsayısı</td><td>${!isNaN(getVal('inputSprintKcal')) ? getVal('inputSprintKcal').toFixed(5) : '-'}</td>${check(sysKcal, getVal('inputSprintKcal'), 0.02)}</tr>`;

        document.querySelectorAll('[id^="step_len_"]').forEach(input => {
            let id = input.id.split('_')[2];
            let sysLen = Math.abs(getVal(`step_x3_${id}`) - getVal(`step_x1_${id}`)) * sysKcal;
            let sysTime = Math.abs(getVal(`step_t3_${id}`) - getVal(`step_t2_${id}`));
            evalRows += `<tr><td>Adım ${id} Uzunluk (m)</td><td>${!isNaN(getVal(`step_len_${id}`)) ? getVal(`step_len_${id}`) : '-'}</td>${check(sysLen, getVal(`step_len_${id}`))}</tr>`;
            evalRows += `<tr><td>Adım ${id} Temas Süresi (sn)</td><td>${!isNaN(getVal(`step_time_${id}`)) ? getVal(`step_time_${id}`) : '-'}</td>${check(sysTime, getVal(`step_time_${id}`))}</tr>`;
        });

        const phases = [{ id: '0_5', name: '0 - 5m' }, { id: '5_10', name: '5 - 10m' }, { id: '10_15', name: '10 - 15m' }, { id: '15_20', name: '15 - 20m' }];
        phases.forEach(p => {
            let count = 0; let sumL = 0; let sumT = 0;
            document.querySelectorAll(`[id^="step_phase_"]`).forEach(sel => {
                if(sel.value.replace('-', '_').replace('m', '') === p.id) {
                    let id = sel.id.split('_')[2];
                    sumL += Math.abs(getVal(`step_x3_${id}`) - getVal(`step_x1_${id}`)) * sysKcal;
                    sumT += Math.abs(getVal(`step_t3_${id}`) - getVal(`step_t2_${id}`));
                    count++;
                }
            });
            let sL = count > 0 ? sumL / count : 0; let sT = count > 0 ? sumT / count : 0;
            let sS = sT > 0 ? sL / sT : 0; let sA = sT > 0 ? sS / sT : 0;

            evalRows += `<tr><td style="background:#f9f9f9;">Faz ${p.name} - Ort. Uzunluk</td><td style="background:#f9f9f9;">${!isNaN(getVal(`avg_len_${p.id}`)) ? getVal(`avg_len_${p.id}`) : '-'}</td>${check(sL, getVal(`avg_len_${p.id}`))}</tr>`;
            evalRows += `<tr><td style="background:#f9f9f9;">Faz ${p.name} - Ort. Temas</td><td style="background:#f9f9f9;">${!isNaN(getVal(`avg_time_${p.id}`)) ? getVal(`avg_time_${p.id}`) : '-'}</td>${check(sT, getVal(`avg_time_${p.id}`))}</tr>`;
            evalRows += `<tr><td style="background:#f9f9f9;">Faz ${p.name} - Ort. Hız</td><td style="background:#f9f9f9;">${!isNaN(getVal(`avg_spd_${p.id}`)) ? getVal(`avg_spd_${p.id}`) : '-'}</td>${check(sS, getVal(`avg_spd_${p.id}`))}</tr>`;
            evalRows += `<tr><td style="background:#f9f9f9;">Faz ${p.name} - Ort. İvme</td><td style="background:#f9f9f9;">${!isNaN(getVal(`avg_acc_${p.id}`)) ? getVal(`avg_acc_${p.id}`) : '-'}</td>${check(sA, getVal(`avg_acc_${p.id}`))}</tr>`;
        });

        const scorePct = totalParams > 0 ? Math.round((correctParams / totalParams) * 100) : 0;
        
        const vidUrl = window.videoMemory['sprint'];
        const img_step1 = await captureVideoFrameAsync(vidUrl, getVal('step_t1_1'));
        const img_step2 = await captureVideoFrameAsync(vidUrl, getVal('step_t1_2'));
        const chronoSprint = await createChronophotography(img_step1, img_step2);

        const reportContent = `
            <html><head><title>KINEMAN Sprint Raporu</title><script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-bottom:20px;} th,td{border:1px solid #bdc3c7; padding:8px; text-align:center; font-size:13px;} th{background:#34495e; color:white;} .img-box{width:100%; max-height:250px; object-fit:contain;} .score-card{background:#ecf0f1; border-left:5px solid #27ae60; padding:15px; margin-bottom:20px;}</style></head><body>
                <h1 style="text-align:center;">20m Sprint Analiz Raporu</h1>${getStudentHeader()}
                <div class="score-card"><h2 style="margin-top:0;">Otonom Değerlendirme</h2><p>${totalParams} parametrenin <strong>${correctParams}</strong> adedi doğru.</p><p style="font-size:20px;">TOPLAM PUAN: <strong style="color:${scorePct >= 60 ? '#27ae60' : '#c0392b'};">${scorePct} / 100</strong></p></div>
                <h3>1. Parametre Doğruluk Tablosu</h3>
                <table><tr><th style="background:#d35400;">Parametre</th><th style="background:#d35400;">Öğrenci Girdisi</th><th style="background:#d35400;">Sistem Kararı</th></tr>${evalRows}</table>
                <div style="page-break-before: always;"></div>
                <div style="text-align:center;"><img src="${chronoSprint}" class="img-box"><br><i>Adım Döngüsü Chronophotography</i></div>
                <div style="width:100%; max-width: 700px; margin: 30px auto;"><canvas id="sprintChart"></canvas></div>
                <script>
                    new Chart(document.getElementById('sprintChart').getContext('2d'), {
                        type: 'bar', data: {
                            labels: ['0-5m', '5-10m', '10-15m', '15-20m'],
                            datasets: [
                                { label: 'Hız (m/sn)', data: [${getVal('avg_spd_0_5')}, ${getVal('avg_spd_5_10')}, ${getVal('avg_spd_10_15')}, ${getVal('avg_spd_15_20')}], backgroundColor: '#2980b9' },
                                { label: 'İvme (m/sn²)', data: [${getVal('avg_acc_0_5')}, ${getVal('avg_acc_5_10')}, ${getVal('avg_acc_10_15')}, ${getVal('avg_acc_15_20')}], backgroundColor: '#e67e22' }
                            ]
                        }, options: { animation: false }
                    });
                    setTimeout(() => { window.print(); }, 1000);
                </script>
            </body></html>`;
        const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    } catch(err) {
        alert("Rapor oluşturulurken bir hata meydana geldi: " + err.message);
    } finally {
        btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
    }
});

// -----------------------------------------------------------------------------
// 3. FMS (OHS) KOMBİNE RAPOR VE DEĞERLENDİRME MOTORU
// -----------------------------------------------------------------------------
document.getElementById('btnOhsPrint')?.addEventListener('click', async function() {
    const btn = this; btn.textContent = "⏳ Analiz ve Rapor Oluşturuluyor..."; btn.disabled = true;
    
    try {
        let totalParams = 0; let correctParams = 0;
        function check(sys, stu, tol=0.05) {
            totalParams++;
            if (isNaN(sys) || isNaN(stu)) return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
            const limit = Math.abs(sys * tol) + 0.01;
            if (Math.abs(sys - stu) <= limit) { correctParams++; return `<td style="color:#16a085; font-weight:bold;">Doğru</td>`; }
            return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
        }

        const m_femur = getVal('ohs_s_x2') !== getVal('ohs_s_x3') ? (getVal('ohs_s_y2') - getVal('ohs_s_y3')) / (getVal('ohs_s_x2') - getVal('ohs_s_x3')) : 0;
        const sysFemur = Math.abs(Math.atan(m_femur) * 180 / Math.PI);
        
        const m_torso = getVal('ohs_s_x1') !== getVal('ohs_s_x2') ? (getVal('ohs_s_y1') - getVal('ohs_s_y2')) / (getVal('ohs_s_x1') - getVal('ohs_s_x2')) : 0;
        const sysTorso = Math.abs(Math.atan(m_torso) * 180 / Math.PI);
        const m_tibia = getVal('ohs_s_x3') !== getVal('ohs_s_x4') ? (getVal('ohs_s_y3') - getVal('ohs_s_y4')) / (getVal('ohs_s_x3') - getVal('ohs_s_x4')) : 0;
        const sysTibia = Math.abs(Math.atan(m_tibia) * 180 / Math.PI);
        const sysDiff = Math.abs(sysTorso - sysTibia);

        const m_thigh = getVal('ohs_f_x1') !== getVal('ohs_f_x2') ? (getVal('ohs_f_y1') - getVal('ohs_f_y2')) / (getVal('ohs_f_x1') - getVal('ohs_f_x2')) : 0;
        const sysThigh = Math.abs(Math.atan(m_thigh) * 180 / Math.PI);
        const m_shin = getVal('ohs_f_x2') !== getVal('ohs_f_x3') ? (getVal('ohs_f_y2') - getVal('ohs_f_y3')) / (getVal('ohs_f_x2') - getVal('ohs_f_x3')) : 0;
        const sysShin = Math.abs(Math.atan(m_shin) * 180 / Math.PI);
        const sysValgus = Math.abs(sysThigh - sysShin);

        let evalRows = `<tr><td>Çömelme Derinliği Açısı (Femur)</td><td>${!isNaN(getVal('ohs_femur_deg')) ? getVal('ohs_femur_deg') + '°' : '-'}</td>${check(sysFemur, getVal('ohs_femur_deg'))}</tr>`;
        evalRows += `<tr><td>Gövde-Tibia Paralelliği (Açı Farkı)</td><td>${!isNaN(getVal('ohs_diff_deg')) ? getVal('ohs_diff_deg') + '°' : '-'}</td>${check(sysDiff, getVal('ohs_diff_deg'))}</tr>`;
        evalRows += `<tr><td>Diz Hizalanması (Valgus/Varus Açısı)</td><td>${!isNaN(getVal('ohs_valgus_deg')) ? getVal('ohs_valgus_deg') + '°' : '-'}</td>${check(sysValgus, getVal('ohs_valgus_deg'))}</tr>`;
        
        const scorePct = totalParams > 0 ? Math.round((correctParams / totalParams) * 100) : 0;

        const sideImg = window.KineFrameBuffer['fms_ohs-side']; const frontImg = window.KineFrameBuffer['fms_ohs-front'];
        const sidePts = [{x: getVal('ohs_s_x1'), y: getVal('ohs_s_y1')}, {x: getVal('ohs_s_x2'), y: getVal('ohs_s_y2')}, {x: getVal('ohs_s_x3'), y: getVal('ohs_s_y3')}, {x: getVal('ohs_s_x4'), y: getVal('ohs_s_y4')}];
        const frontPts = [{x: getVal('ohs_f_x1'), y: getVal('ohs_f_y1')}, {x: getVal('ohs_f_x2'), y: getVal('ohs_f_y2')}, {x: getVal('ohs_f_x3'), y: getVal('ohs_f_y3')}];
        const drawnSide = await drawJointLines(sideImg, sidePts); const drawnFront = await drawJointLines(frontImg, frontPts);

        const reportContent = `
            <html><head><title>KINEMAN FMS Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-bottom:20px;} th,td{border:1px solid #bdc3c7; padding:8px; text-align:center; font-size:13px;} th{background:#34495e; color:white;} .img-box{width:48%; height:300px; object-fit:contain;} .score-card{background:#ecf0f1; border-left:5px solid #27ae60; padding:15px; margin-bottom:20px;}</style></head><body>
                <h1 style="text-align:center;">FMS: Overhead Squat Analiz Raporu</h1>${getStudentHeader()}
                <div class="score-card"><h2 style="margin-top:0;">Otonom Değerlendirme</h2><p>${totalParams} açının <strong>${correctParams}</strong> adedi doğru hesaplandı.</p><p style="font-size:20px;">HESAPLAMA BAŞARISI: <strong style="color:${scorePct >= 60 ? '#27ae60' : '#c0392b'};">%${scorePct}</strong></p></div>
                <h3>1. Geometrik Doğruluk Tablosu</h3>
                <table><tr><th style="background:#27ae60;">Parametre</th><th style="background:#27ae60;">Öğrenci Girdisi</th><th style="background:#27ae60;">Sistem Kararı</th></tr>${evalRows}</table>
                
                <h3>2. Kinematik Eklem Çizimleri</h3>
                <div style="display:flex; justify-content:space-between; margin-bottom:20px;"><img src="${drawnSide}" class="img-box"><img src="${drawnFront}" class="img-box"></div>
                
                <h3>3. Nihai Klinik Karar</h3>
                <table><tr><th>Parametre</th><th>Karar</th></tr>
                <tr><td>Derinlik</td><td>${document.getElementById('tbl_ohs_derinlik_puan').textContent}</td></tr>
                <tr><td>Paralellik</td><td>${document.getElementById('tbl_ohs_paralel_puan').textContent}</td></tr>
                <tr><td>Valgus/Varus</td><td>${document.getElementById('tbl_ohs_sapma_puan').textContent}</td></tr></table>
                <h2 style="color:#c0392b; text-align:center;">Nihai FMS Skoru: ${document.getElementById('final_fms_score_display').textContent}</h2>
                <script>setTimeout(() => { window.print(); }, 800);</script>
            </body></html>`;
        const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    } catch(err) {
        alert("Rapor oluşturulurken bir hata meydana geldi: " + err.message);
    } finally {
        btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
    }
});

// -----------------------------------------------------------------------------
// 4. POSTURE KOMBİNE RAPOR VE DEĞERLENDİRME MOTORU
// -----------------------------------------------------------------------------
document.getElementById('btnPosPrint')?.addEventListener('click', async function() {
    const btn = this; btn.textContent = "⏳ Analiz ve Rapor Oluşturuluyor..."; btn.disabled = true;
    
    try {
        let totalParams = 0; let correctParams = 0;
        function check(sys, stu, tol=0.05) {
            totalParams++;
            if (isNaN(sys) || isNaN(stu)) return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
            const limit = Math.abs(sys * tol) + 0.01;
            if (Math.abs(sys - stu) <= limit) { correctParams++; return `<td style="color:#16a085; font-weight:bold;">Doğru</td>`; }
            return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
        }

        const cva_m = getVal('pos_ear_x') !== getVal('pos_c7_x') ? (getVal('pos_ear_y') - getVal('pos_c7_y')) / (getVal('pos_ear_x') - getVal('pos_c7_x')) : 0;
        const sysCVA = Math.abs(Math.atan(cva_m) * 180 / Math.PI);
        
        const plumb_m = getVal('pos_shoulder_x') !== getVal('pos_ankle_x') ? (getVal('pos_shoulder_y') - getVal('pos_ankle_y')) / (getVal('pos_shoulder_x') - getVal('pos_ankle_x')) : 0;
        const sysPlumb = Math.abs(Math.atan(plumb_m) * 180 / Math.PI);
        
        const sa_m = getVal('pos_ls_x') !== getVal('pos_rs_x') ? (getVal('pos_ls_y') - getVal('pos_rs_y')) / (getVal('pos_ls_x') - getVal('pos_rs_x')) : 0;
        const sysSA = Math.abs(Math.atan(sa_m) * 180 / Math.PI);
        
        const pa_m = getVal('pos_lp_x') !== getVal('pos_rp_x') ? (getVal('pos_lp_y') - getVal('pos_rp_y')) / (getVal('pos_lp_x') - getVal('pos_rp_x')) : 0;
        const sysPA = Math.abs(Math.atan(pa_m) * 180 / Math.PI);

        let evalRows = `<tr><td>Kraniovertebral Açı (CVA)</td><td>${!isNaN(getVal('pos_cva_deg')) ? getVal('pos_cva_deg') + '°' : '-'}</td>${check(sysCVA, getVal('pos_cva_deg'))}</tr>`;
        evalRows += `<tr><td>Dikey Şakül Çizgisi Açısı</td><td>${!isNaN(getVal('pos_plumb_deg')) ? getVal('pos_plumb_deg') + '°' : '-'}</td>${check(sysPlumb, getVal('pos_plumb_deg'))}</tr>`;
        evalRows += `<tr><td>Omuz Asimetrisi Açısı</td><td>${!isNaN(getVal('pos_sa_deg')) ? getVal('pos_sa_deg') + '°' : '-'}</td>${check(sysSA, getVal('pos_sa_deg'))}</tr>`;
        evalRows += `<tr><td>Pelvis Asimetrisi Açısı</td><td>${!isNaN(getVal('pos_pa_deg')) ? getVal('pos_pa_deg') + '°' : '-'}</td>${check(sysPA, getVal('pos_pa_deg'))}</tr>`;

        const scorePct = totalParams > 0 ? Math.round((correctParams / totalParams) * 100) : 0;

        const sideImg = window.KineFrameBuffer['pos_pos-side']; const frontImg = window.KineFrameBuffer['pos_pos-front'];
        const sidePts1 = [{x: getVal('pos_ear_x'), y: getVal('pos_ear_y')}, {x: getVal('pos_c7_x'), y: getVal('pos_c7_y')}];
        const sidePts2 = [{x: getVal('pos_shoulder_x'), y: getVal('pos_shoulder_y')}, {x: getVal('pos_ankle_x'), y: getVal('pos_ankle_y')}];
        const frontPts1 = [{x: getVal('pos_rs_x'), y: getVal('pos_rs_y')}, {x: getVal('pos_ls_x'), y: getVal('pos_ls_y')}];
        const frontPts2 = [{x: getVal('pos_rp_x'), y: getVal('pos_rp_y')}, {x: getVal('pos_lp_x'), y: getVal('pos_lp_y')}];

        let drawnSide = await drawJointLines(sideImg, sidePts1); drawnSide = await drawJointLines(drawnSide, sidePts2);
        let drawnFront = await drawJointLines(frontImg, frontPts1); drawnFront = await drawJointLines(drawnFront, frontPts2);

        const reportContent = `
            <html><head><title>KINEMAN Postür Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-bottom:20px;} th,td{border:1px solid #bdc3c7; padding:8px; text-align:center; font-size:13px;} th{background:#34495e; color:white;} .img-box{width:48%; height:300px; object-fit:contain;} .score-card{background:#ecf0f1; border-left:5px solid #27ae60; padding:15px; margin-bottom:20px;}</style></head><body>
                <h1 style="text-align:center;">Statik Postür Analiz Raporu</h1>${getStudentHeader()}
                <div class="score-card"><h2 style="margin-top:0;">Otonom Değerlendirme</h2><p>${totalParams} açının <strong>${correctParams}</strong> adedi doğru hesaplandı.</p><p style="font-size:20px;">HESAPLAMA BAŞARISI: <strong style="color:${scorePct >= 60 ? '#27ae60' : '#c0392b'};">%${scorePct}</strong></p></div>
                <h3>1. Geometrik Doğruluk Tablosu</h3>
                <table><tr><th style="background:#8e44ad;">Parametre</th><th style="background:#8e44ad;">Öğrenci Girdisi</th><th style="background:#8e44ad;">Sistem Kararı</th></tr>${evalRows}</table>
                
                <h3>2. Postür Eklem Çizimleri</h3>
                <div style="display:flex; justify-content:space-between; margin-bottom:20px;"><img src="${drawnSide}" class="img-box"><img src="${drawnFront}" class="img-box"></div>
                
                <h3>3. Nihai Klinik Karar</h3>
                <table><tr><th>Parametre</th><th>Karar</th></tr>
                <tr><td>Başın Öne Kayması</td><td>${document.getElementById('tbl_pos_cva_puan').textContent}</td></tr>
                <tr><td>Şakül Çizgisi</td><td>${document.getElementById('tbl_pos_dikey_puan').textContent}</td></tr>
                <tr><td>Omuz Asimetrisi</td><td>${document.getElementById('tbl_pos_omuz_puan').textContent}</td></tr>
                <tr><td>Pelvis Asimetrisi</td><td>${document.getElementById('tbl_pos_pelvis_puan').textContent}</td></tr></table>
                <h2 style="color:#c0392b; text-align:center;">Nihai Postür Skoru: ${document.getElementById('final_posture_score_display').textContent}</h2>
                <script>setTimeout(() => { window.print(); }, 800);</script>
            </body></html>`;
        const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    } catch(err) {
        alert("Rapor oluşturulurken bir hata meydana geldi: " + err.message);
    } finally {
        btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
    }
});

// -----------------------------------------------------------------------------
// 5. JUMP KOMBİNE RAPOR VE DEĞERLENDİRME MOTORU
// -----------------------------------------------------------------------------
document.getElementById('btnJumpPrint')?.addEventListener('click', async function() { 
    const btn = this; btn.textContent = "⏳ Analiz Çıkarılıyor..."; btn.disabled = true;

    try {
        let totalParams = 0; let correctParams = 0;
        function check(sys, stu, tol=0.05) {
            totalParams++;
            if (isNaN(sys) || isNaN(stu)) return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
            const limit = Math.abs(sys * tol) + 0.01;
            if (Math.abs(sys - stu) <= limit) { correctParams++; return `<td style="color:#16a085; font-weight:bold;">Doğru</td>`; }
            return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
        }

        const sysFlight = Math.abs(getVal('jump_t_landing') - getVal('jump_t_takeoff'));
        const sysHm = (9.81 * Math.pow(sysFlight, 2)) / 8;
        const sysHcm = sysHm * 100;
        const sysPow = (60.7 * sysHcm) + (45.3 * getVal('jump_body_mass')) - 2055;

        let evalRows = `<tr><td>Uçuş Süresi (sn)</td><td>${!isNaN(getVal('jump_flight_time')) ? getVal('jump_flight_time') : '-'}</td>${check(sysFlight, getVal('jump_flight_time'))}</tr>`;
        evalRows += `<tr><td>Sıçrama Yüksekliği (m)</td><td>${!isNaN(getVal('jump_height_m')) ? getVal('jump_height_m') : '-'}</td>${check(sysHm, getVal('jump_height_m'))}</tr>`;
        evalRows += `<tr><td>Sıçrama Yüksekliği (cm)</td><td>${!isNaN(getVal('jump_height_cm')) ? getVal('jump_height_cm') : '-'}</td>${check(sysHcm, getVal('jump_height_cm'))}</tr>`;
        evalRows += `<tr><td>Zirve Güç / Peak Power (Watt)</td><td>${!isNaN(getVal('jump_peak_power')) ? getVal('jump_peak_power') : '-'}</td>${check(sysPow, getVal('jump_peak_power'))}</tr>`;

        const scorePct = totalParams > 0 ? Math.round((correctParams / totalParams) * 100) : 0;

        const vidUrl = window.videoMemory['jump']; 
        const t_takeoff = getVal('jump_t_takeoff'); const t_landing = getVal('jump_t_landing'); const t_mid = (t_takeoff + t_landing) / 2;
        const img_takeoff = await captureVideoFrameAsync(vidUrl, t_takeoff); 
        const img_mid = await captureVideoFrameAsync(vidUrl, t_mid);
        const chronoJump = await createChronophotography(img_takeoff, img_mid);

        const reportContent = `
            <html><head><title>KINEMAN Dikey Sıçrama Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-bottom:20px;} th,td{border:1px solid #bdc3c7; padding:8px; text-align:center; font-size:13px;} th{background:#34495e; color:white;} .img-box{width:100%; max-height:300px; object-fit:contain;} .score-card{background:#ecf0f1; border-left:5px solid #27ae60; padding:15px; margin-bottom:20px;}</style></head><body>
                <h1 style="text-align:center;">Dikey Sıçrama Analiz Raporu</h1>${getStudentHeader()}
                <div class="score-card"><h2 style="margin-top:0;">Otonom Değerlendirme</h2><p>${totalParams} parametrenin <strong>${correctParams}</strong> adedi doğru hesaplandı.</p><p style="font-size:20px;">HESAPLAMA BAŞARISI: <strong style="color:${scorePct >= 60 ? '#27ae60' : '#c0392b'};">%${scorePct}</strong></p></div>
                <h3>1. Parametre Doğruluk Tablosu</h3>
                <table><tr><th style="background:#f39c12;">Parametre</th><th style="background:#f39c12;">Öğrenci Girdisi</th><th style="background:#f39c12;">Sistem Kararı</th></tr>${evalRows}</table>
                <div style="text-align:center; margin-bottom:20px;"><img src="${chronoJump}" class="img-box"><br><i>Sıçrama Çoklu Pozlama</i></div>
                <script>setTimeout(() => { window.print(); }, 800);</script>
            </body></html>`;
        const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close();
    } catch(err) {
        alert("Rapor oluşturulurken bir hata meydana geldi: " + err.message);
    } finally {
        btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
    }
});

// -----------------------------------------------------------------------------
// 6. AGILITY KOMBİNE RAPOR VE DEĞERLENDİRME MOTORU
// -----------------------------------------------------------------------------
document.getElementById('btnAgilityPrint')?.addEventListener('click', function() { 
    const btn = this; btn.textContent = "⏳ Analiz Çıkarılıyor..."; btn.disabled = true;

    try {
        let totalParams = 0; let correctParams = 0;
        function check(sys, stu, tol=0.05) {
            totalParams++;
            if (isNaN(sys) || isNaN(stu)) return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
            const limit = Math.abs(sys * tol) + 0.01;
            if (Math.abs(sys - stu) <= limit) { correctParams++; return `<td style="color:#16a085; font-weight:bold;">Doğru</td>`; }
            return `<td style="color:#c0392b; font-weight:bold;">Hatalı</td>`;
        }

        const sysR_tot = Math.abs(getVal('ag_r_out') - getVal('ag_r_in'));
        const sysR_con = Math.abs(getVal('ag_r_brake_out') - getVal('ag_r_brake_in'));
        const sysL_tot = Math.abs(getVal('ag_l_out') - getVal('ag_l_in'));
        const sysL_con = Math.abs(getVal('ag_l_brake_out') - getVal('ag_l_brake_in'));

        let evalRows = `<tr><td>Sağ Bacak Toplam Süre</td><td>${!isNaN(getVal('ag_r_total_time')) ? getVal('ag_r_total_time') : '-'} sn</td>${check(sysR_tot, getVal('ag_r_total_time'))}</tr>`;
        evalRows += `<tr><td>Sağ Bacak Temas Süresi</td><td>${!isNaN(getVal('ag_r_contact_time')) ? getVal('ag_r_contact_time') : '-'} sn</td>${check(sysR_con, getVal('ag_r_contact_time'))}</tr>`;
        evalRows += `<tr><td>Sol Bacak Toplam Süre</td><td>${!isNaN(getVal('ag_l_total_time')) ? getVal('ag_l_total_time') : '-'} sn</td>${check(sysL_tot, getVal('ag_l_total_time'))}</tr>`;
        evalRows += `<tr><td>Sol Bacak Temas Süresi</td><td>${!isNaN(getVal('ag_l_contact_time')) ? getVal('ag_l_contact_time') : '-'} sn</td>${check(sysL_con, getVal('ag_l_contact_time'))}</tr>`;

        const scorePct = totalParams > 0 ? Math.round((correctParams / totalParams) * 100) : 0;

        const reportContent = `
            <html><head><title>KINEMAN Çeviklik Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-bottom:20px;} th,td{border:1px solid #bdc3c7; padding:8px; text-align:center; font-size:13px;} th{background:#34495e; color:white;} .score-card{background:#ecf0f1; border-left:5px solid #27ae60; padding:15px; margin-bottom:20px;}</style></head><body>
                <h1 style="text-align:center;">505 Çeviklik ve Yön Değiştirme Analiz Raporu</h1>${getStudentHeader()}
                <div class="score-card"><h2 style="margin-top:0;">Otonom Değerlendirme</h2><p>${totalParams} parametrenin <strong>${correctParams}</strong> adedi doğru hesaplandı.</p><p style="font-size:20px;">HESAPLAMA BAŞARISI: <strong style="color:${scorePct >= 60 ? '#27ae60' : '#c0392b'};">%${scorePct}</strong></p></div>
                <h3>1. Parametre Doğruluk Tablosu</h3>
                <table><tr><th style="background:#16a085;">Parametre</th><th style="background:#16a085;">Öğrenci Girdisi</th><th style="background:#16a085;">Sistem Kararı</th></tr>${evalRows}</table>
                
                <h3>2. Asimetri Bulguları</h3>
                <table><tr><th>Parametre</th><th>Sağ Bacak (sn)</th><th>Sol Bacak (sn)</th><th>Fark (Mutlak sn)</th></tr>
                <tr><td>505 Toplam Süre</td><td>${document.getElementById('ag_r_total_table').textContent}</td><td>${document.getElementById('ag_l_total_table').textContent}</td><td>${document.getElementById('ag_total_diff').textContent}</td></tr>
                <tr><td>Dönüş Temas Süresi</td><td>${document.getElementById('ag_r_contact_table').textContent}</td><td>${document.getElementById('ag_l_contact_table').textContent}</td><td>${document.getElementById('ag_contact_diff').textContent}</td></tr></table>
                <h2 style="color:#c0392b; text-align:center;">Nihai Karar: ${document.getElementById('final_agility_score_display').textContent}</h2>
                <script>setTimeout(() => { window.print(); }, 500);</script>
            </body></html>`;
        const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close();
    } catch(err) {
        alert("Rapor oluşturulurken bir hata meydana geldi: " + err.message);
    } finally {
        btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
    }
});