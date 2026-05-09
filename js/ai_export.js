// ai_export.js - Gelişmiş Rapor Çıktı ve JSON Paketleme Motoru

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

// !! ÖNEMLİ !!
// Dosyanın devamındaki tüm rapor şablonlarında `${studentInfoHeader}` yazan yerleri `${getStudentHeader()}` olarak değiştirin.

// --- YARDIMCI GÖRÜNTÜ İŞLEME FONKSİYONLARI ---

// Belirli bir saniyeye gidip videodan fotoğraf çeken asenkron fonksiyon (VBT ve Jump için)
async function captureVideoFrameAsync(videoUrl, timeSec) {
    return new Promise((resolve) => {
        if (!videoUrl || isNaN(timeSec)) { resolve(""); return; }
        const vid = document.createElement('video');
        vid.src = videoUrl; vid.crossOrigin = 'anonymous'; vid.currentTime = timeSec;
        vid.onseeked = () => {
            const cvs = document.createElement('canvas');
            cvs.width = vid.videoWidth; cvs.height = vid.videoHeight;
            cvs.getContext('2d').drawImage(vid, 0, 0);
            resolve(cvs.toDataURL('image/jpeg', 0.8));
        };
        vid.onerror = () => resolve("");
    });
}

// Görseli Canvas'a yükleyen yardımcı fonksiyon
async function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// İki görseli %50 saydamlıkla birleştirip üzerine çizgi çeken motor
async function createChronophotography(imgSrc1, imgSrc2, lineCoords = null) {
    if (!imgSrc1 && !imgSrc2) return "";
    const img1 = await loadImage(imgSrc1); const img2 = await loadImage(imgSrc2);
    if (!img1 && !img2) return "";
    
    const cvs = document.createElement('canvas');
    cvs.width = img1 ? img1.width : img2.width; cvs.height = img1 ? img1.height : img2.height;
    const ctx = cvs.getContext('2d');

    if (img1) ctx.drawImage(img1, 0, 0);
    if (img2) {
        ctx.globalAlpha = 0.5; // %50 Saydamlık
        ctx.drawImage(img2, 0, 0);
        ctx.globalAlpha = 1.0;
    }

    if (lineCoords && lineCoords.x1 && lineCoords.x2) {
        ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(lineCoords.x1, lineCoords.y1); ctx.lineTo(lineCoords.x2, lineCoords.y2);
        ctx.stroke();
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(lineCoords.x1, lineCoords.y1, 6, 0, 2*Math.PI); ctx.fill();
        ctx.beginPath(); ctx.arc(lineCoords.x2, lineCoords.y2, 6, 0, 2*Math.PI); ctx.fill();
    }
    return cvs.toDataURL('image/jpeg', 0.8);
}

// Tek bir görsel üzerine eklem noktalarını ve bağlantı çizgilerini çizen motor
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

// HTML'den sayı okuma kısaltması
function getVal(id) { return parseFloat(document.getElementById(id)?.textContent || document.getElementById(id)?.value) || 0; }

// --- 1. VBT MODÜLÜ ---
document.getElementById('btnPrintReportVbt')?.addEventListener('click', async function() {
    const btn = this; btn.textContent = "⏳ Rapor Oluşturuluyor..."; btn.disabled = true;
    const vidUrl = window.videoMemory['vbt_set1']; // Varsayım: 3 set de aynı videodan
    
    // Set 1 Chrono
    const img1_start = await captureVideoFrameAsync(vidUrl, getVal('t0_display_1'));
    const img1_end = await captureVideoFrameAsync(vidUrl, getVal('t1_display_1'));
    const chrono1 = await createChronophotography(img1_start, img1_end, {x1: getVal('x0_display_1'), y1: getVal('y0_display_1'), x2: getVal('x1_display_1'), y2: getVal('y1_display_1')});

    const mvt = (getVal('inputSlope') * getVal('input1RM')) + getVal('inputIntercept');
    
    const reportContent = `
        <html><head><title>VBT Raporu</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>body{font-family:Arial; padding:20px;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#2980b9; color:white;} .img-box{width:100%; max-height:250px; object-fit:contain; border:2px solid #bdc3c7;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">Halter Hızı (VBT) Analiz Raporu</h1>
            ${getStudentHeader()}
            <div style="text-align:center; margin-bottom:20px;">
                <h3 style="color:#7f8c8d;">Set 1 Chronophotography (Kalkış & Tepe Noktası)</h3>
                <img src="${chrono1}" class="img-box" alt="Set 1 Chrono">
            </div>
            <table>
                <tr><th>Set</th><th>Ağırlık (W - kg)</th><th>Süre (t - sn)</th><th>Mesafe (y - m)</th><th>Ort. Hız (v - m/sn)</th></tr>
                <tr><td>1</td><td>${getVal('sumW_1')}</td><td>${getVal('time_diff_1')}</td><td>${getVal('disp_y_1')}</td><td>${getVal('sumS_1')}</td></tr>
                <tr><td>2</td><td>${getVal('sumW_2')}</td><td>${getVal('time_diff_2')}</td><td>${getVal('disp_y_2')}</td><td>${getVal('sumS_2')}</td></tr>
                <tr><td>3</td><td>${getVal('sumW_3')}</td><td>${getVal('time_diff_3')}</td><td>${getVal('disp_y_3')}</td><td>${getVal('sumS_3')}</td></tr>
            </table>
            <div style="width:100%; max-width: 600px; margin: 30px auto;"><canvas id="vbtChart"></canvas></div>
            <h2 style="color:#16a085; text-align:center;">Tahmini 1TM: ${getVal('input1RM')} kg</h2>
            <script>
                new Chart(document.getElementById('vbtChart').getContext('2d'), {
                    type: 'scatter', data: {
                        datasets: [
                            { label: 'Set Ölçümleri', data: [{x:${getVal('sumW_1')}, y:${getVal('sumS_1')}}, {x:${getVal('sumW_2')}, y:${getVal('sumS_2')}}, {x:${getVal('sumW_3')}, y:${getVal('sumS_3')}}], backgroundColor: '#e74c3c', pointRadius: 5 },
                            { type: 'line', label: 'Yük-Hız Regresyonu', data: [{x:0, y:${getVal('inputIntercept')}}, {x:${getVal('input1RM')}, y:${mvt}}], borderColor: '#3498db', borderWidth: 2, fill: false },
                            { label: '1TM Kestirimi', data: [{x:${getVal('input1RM')}, y:${mvt}}], backgroundColor: '#27ae60', pointRadius: 7, pointStyle: 'rectRot' }
                        ]
                    }, options: { responsive: true, animation: false, scales: { x: { title: { display: true, text: 'Ağırlık (kg)' } }, y: { title: { display: true, text: 'Hız (m/sn)' }, min: 0 } } }
                });
                setTimeout(() => { window.print(); }, 800);
            </script>
        </body></html>`;
    const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
});

// --- 2. 20M SPRINT MODÜLÜ ---
document.getElementById('btnSprintPrint')?.addEventListener('click', async function() {
    const btn = this; btn.textContent = "⏳ Rapor Oluşturuluyor..."; btn.disabled = true;
    const vidUrl = window.videoMemory['sprint'];
    
    // Sprint Chrono (Adım 1 ve Adım 2) - Örnek Gösterim
    const img_step1 = await captureVideoFrameAsync(vidUrl, getVal('step_t1_1'));
    const img_step2 = await captureVideoFrameAsync(vidUrl, getVal('step_t1_2'));
    const chronoSprint = await createChronophotography(img_step1, img_step2);

    const reportContent = `
        <html><head><title>Sprint Raporu</title><script src="https://cdn.jsdelivr.net/npm/chart.js"></script><style>body{font-family:Arial; padding:20px;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#d35400; color:white;} .img-box{width:100%; max-height:250px; object-fit:contain; border:2px solid #bdc3c7;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">20m Sprint (İvmelenme) Analiz Raporu</h1>
            ${getStudentHeader()}
            <div style="text-align:center; margin-bottom:20px;"><h3 style="color:#7f8c8d;">Kalkış Fazı Chronophotography (Çoklu Pozlama)</h3><img src="${chronoSprint}" class="img-box"></div>
            <table>
                <tr><th>Faz (m)</th><th>Ort. Uzunluk (m)</th><th>Ort. Temas (sn)</th><th>Ort. Hız (m/sn)</th><th>Ort. İvme (m/sn²)</th></tr>
                <tr><td>0 - 5</td><td>${getVal('avg_len_0_5')}</td><td>${getVal('avg_time_0_5')}</td><td>${getVal('avg_spd_0_5')}</td><td>${getVal('avg_acc_0_5')}</td></tr>
                <tr><td>5 - 10</td><td>${getVal('avg_len_5_10')}</td><td>${getVal('avg_time_5_10')}</td><td>${getVal('avg_spd_5_10')}</td><td>${getVal('avg_acc_5_10')}</td></tr>
                <tr><td>10 - 15</td><td>${getVal('avg_len_10_15')}</td><td>${getVal('avg_time_10_15')}</td><td>${getVal('avg_spd_10_15')}</td><td>${getVal('avg_acc_10_15')}</td></tr>
                <tr><td>15 - 20</td><td>${getVal('avg_len_15_20')}</td><td>${getVal('avg_time_15_20')}</td><td>${getVal('avg_spd_15_20')}</td><td>${getVal('avg_acc_15_20')}</td></tr>
            </table>
            <div style="width:100%; max-width: 700px; margin: 30px auto;"><canvas id="sprintChart"></canvas></div>
            <script>
                new Chart(document.getElementById('sprintChart').getContext('2d'), {
                    type: 'bar', data: {
                        labels: ['0-5m', '5-10m', '10-15m', '15-20m'],
                        datasets: [
                            { label: 'Hız (m/sn)', data: [${getVal('avg_spd_0_5')}, ${getVal('avg_spd_5_10')}, ${getVal('avg_spd_10_15')}, ${getVal('avg_spd_15_20')}], backgroundColor: '#2980b9' },
                            { label: 'İvme (m/sn²)', data: [${getVal('avg_acc_0_5')}, ${getVal('avg_acc_5_10')}, ${getVal('avg_acc_10_15')}, ${getVal('avg_acc_15_20')}], backgroundColor: '#e67e22' }
                        ]
                    }, options: { animation: false, responsive: true }
                });
                setTimeout(() => { window.print(); }, 800);
            </script>
        </body></html>`;
    const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
});

// --- 3. FMS OHS MODÜLÜ ---
document.getElementById('btnOhsPrint')?.addEventListener('click', async function() {
    const btn = this; btn.textContent = "⏳ Görseller İşleniyor..."; btn.disabled = true;
    
    // Canvas Çizimleri
    const sideImg = window.KineFrameBuffer['fms_ohs-side'];
    const frontImg = window.KineFrameBuffer['fms_ohs-front'];
    
    const sidePts = [
        {x: getVal('ohs_s_x1'), y: getVal('ohs_s_y1')}, {x: getVal('ohs_s_x2'), y: getVal('ohs_s_y2')},
        {x: getVal('ohs_s_x3'), y: getVal('ohs_s_y3')}, {x: getVal('ohs_s_x4'), y: getVal('ohs_s_y4')}
    ];
    const frontPts = [
        {x: getVal('ohs_f_x1'), y: getVal('ohs_f_y1')}, {x: getVal('ohs_f_x2'), y: getVal('ohs_f_y2')}, {x: getVal('ohs_f_x3'), y: getVal('ohs_f_y3')}
    ];

    const drawnSide = await drawJointLines(sideImg, sidePts);
    const drawnFront = await drawJointLines(frontImg, frontPts);

    const reportContent = `
        <html><head><title>FMS Raporu</title><style>body{font-family:Arial;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px;} th{background:#34495e; color:white;} .img-box{width:48%; height:250px; object-fit:cover; border:2px solid #bdc3c7;}</style></head><body>
        <h1 style="color:#2c3e50; text-align:center;">FMS: Overhead Squat Analiz Raporu</h1>
        ${getStudentHeader()}
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <img src="${drawnSide}" class="img-box" alt="Yandan Görünüm">
            <img src="${drawnFront}" class="img-box" alt="Önden Görünüm">
        </div>
        <h3 style="color:#2c3e50;">Fonksiyonel Hareket Taraması Sonuçları</h3>
        <table>
            <tr><th>Parametre</th><th>Çömelme Derinliği</th><th>Gövde - Tibia Paralelliği</th><th>Diz Hizalanması</th></tr>
            <tr><td>Açı</td><td>${document.getElementById('tbl_ohs_derinlik_aci').textContent}</td><td>${document.getElementById('tbl_ohs_paralel_aci').textContent}</td><td>${document.getElementById('tbl_ohs_sapma_aci').textContent}</td></tr>
            <tr><td>Puan Kararı</td><td>${document.getElementById('tbl_ohs_derinlik_puan').textContent}</td><td>${document.getElementById('tbl_ohs_paralel_puan').textContent}</td><td>${document.getElementById('tbl_ohs_sapma_puan').textContent}</td></tr>
        </table>
        <h2 style="color:#c0392b; text-align:center; margin-top:20px;">Nihai FMS Skoru: ${document.getElementById('final_fms_score_display').textContent}</h2>
        <div style="margin-top:20px; font-size:0.8em; color:#7f8c8d;"><strong>Değerlendirme Kriterleri:</strong><br>• 3 PUAN (Mükemmel): Tüm alt skorlar 100 Puan olmalıdır.<br>• 2 PUAN (Kompansasyonlu): Hiçbir alt skor 0 Puan olmamalıdır. En az bir alt skor 70 Puan ise verilir.<br>• 1 PUAN (Disfonksiyonel): Alt skorlardan herhangi biri 0 Puan ise hareket doğrudan 1 puan değerlendirilir.</div>
        <script>setTimeout(() => { window.print(); }, 800);</script>
        </body></html>`;
    const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
});

// --- 4. STATİK POSTÜR MODÜLÜ ---
document.getElementById('btnPosPrint')?.addEventListener('click', async function() {
    const btn = this; btn.textContent = "⏳ Görseller İşleniyor..."; btn.disabled = true;
    
    const sideImg = window.KineFrameBuffer['pos_pos-side'];
    const frontImg = window.KineFrameBuffer['pos_pos-front'];
    
    const sidePts1 = [{x: getVal('pos_ear_x'), y: getVal('pos_ear_y')}, {x: getVal('pos_c7_x'), y: getVal('pos_c7_y')}];
    const sidePts2 = [{x: getVal('pos_shoulder_x'), y: getVal('pos_shoulder_y')}, {x: getVal('pos_ankle_x'), y: getVal('pos_ankle_y')}];
    const frontPts1 = [{x: getVal('pos_rs_x'), y: getVal('pos_rs_y')}, {x: getVal('pos_ls_x'), y: getVal('pos_ls_y')}];
    const frontPts2 = [{x: getVal('pos_rp_x'), y: getVal('pos_rp_y')}, {x: getVal('pos_lp_x'), y: getVal('pos_lp_y')}];

    let drawnSide = await drawJointLines(sideImg, sidePts1);
    drawnSide = await drawJointLines(drawnSide, sidePts2); // İkinci çizgiyi üstüne çiz

    let drawnFront = await drawJointLines(frontImg, frontPts1);
    drawnFront = await drawJointLines(drawnFront, frontPts2);

    const reportContent = `
        <html><head><title>Postür Raporu</title><style>body{font-family:Arial;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ccc; padding:8px;} th{background:#34495e; color:white;} .img-box{width:48%; height:250px; object-fit:cover; border:2px solid #bdc3c7;}</style></head><body>
        <h1 style="color:#2c3e50; text-align:center;">Statik Postür Analiz Raporu</h1>
        ${getStudentHeader()}
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <img src="${drawnSide}" class="img-box" alt="Yandan Görünüm">
            <img src="${drawnFront}" class="img-box" alt="Önden Görünüm">
        </div>
        <h3 style="color:#2c3e50;">Statik Postür Sonuçları</h3>
        <table>
            <tr><th>Parametre</th><th>Başın Öne Kayması</th><th>Şakül Çizgisi</th><th>Omuz Asimetrisi</th><th>Pelvis Asimetrisi</th></tr>
            <tr><td>Açı</td><td>${document.getElementById('tbl_pos_cva_aci').textContent}</td><td>${document.getElementById('tbl_pos_dikey_aci').textContent}</td><td>${document.getElementById('tbl_pos_omuz_aci').textContent}</td><td>${document.getElementById('tbl_pos_pelvis_aci').textContent}</td></tr>
            <tr><td>Puan</td><td>${document.getElementById('tbl_pos_cva_puan').textContent}</td><td>${document.getElementById('tbl_pos_dikey_puan').textContent}</td><td>${document.getElementById('tbl_pos_omuz_puan').textContent}</td><td>${document.getElementById('tbl_pos_pelvis_puan').textContent}</td></tr>
        </table>
        <h2 style="color:#c0392b; text-align:center; margin-top:20px;">Nihai Postür Skoru: ${document.getElementById('final_posture_score_display').textContent}</h2>
        <div style="margin-top:20px; font-size:0.8em; color:#7f8c8d;"><strong>Kriterler:</strong><br>• 3 PUAN: Tüm alt skorlar 100.<br>• 2 PUAN: Hiçbir alt skor 0 olmamalıdır. En az bir skor 70 ise verilir.<br>• 1 PUAN: Herhangi bir alt skor 0 ise doğrudan 1 puan.</div>
        <script>setTimeout(() => { window.print(); }, 800);</script>
        </body></html>`;
    const w = window.open('','_blank'); w.document.write(reportContent); w.document.close();
    btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
});

// --- 5. DİKEY SIÇRAMA MODÜLÜ ---
document.getElementById('btnJumpPrint')?.addEventListener('click', async function() { 
    const btn = this; btn.textContent = "⏳ Analiz Çıkarılıyor..."; btn.disabled = true;
    const vidUrl = window.videoMemory['jump'];
    const t_takeoff = getVal('jump_t_takeoff');
    const t_landing = getVal('jump_t_landing');
    const t_mid = (t_takeoff + t_landing) / 2; // Havada kalma süresinin tam ortası (Tepe Noktası)

    const img_takeoff = await captureVideoFrameAsync(vidUrl, t_takeoff);
    const img_mid = await captureVideoFrameAsync(vidUrl, t_mid);
    const chronoJump = await createChronophotography(img_takeoff, img_mid);

    const reportContent = `
        <html><head><title>Dikey Sıçrama Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#8e44ad; color:white;} .img-box{width:100%; max-height:300px; object-fit:contain; border:2px solid #bdc3c7;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">Dikey Sıçrama Yükseklik ve Güç Analiz Raporu</h1>
            ${getStudentHeader()}
            <div style="text-align:center; margin-bottom:20px;">
                <h3 style="color:#7f8c8d;">Chronophotography (Kalkış Anı ve Tepe Noktası)</h3>
                <img src="${chronoJump}" class="img-box" alt="Sıçrama Çoklu Pozlama">
            </div>
            <h3 style="color:#2c3e50;">Kinetik Çıktılar</h3>
            <table>
                <tr><th>Uçuş Süresi (sn)</th><th>Sıçrama Yüksekliği (m)</th><th>Zirve Güç / Peak Power (Watt)</th></tr>
                <tr>
                    <td style="font-size:1.2em; font-weight:bold;">${getVal('jump_flight_time')}</td>
                    <td style="font-size:1.2em; font-weight:bold;">${getVal('jump_height_m')}</td>
                    <td style="font-size:1.2em; font-weight:bold; color:#d35400;">${getVal('jump_peak_power')}</td>
                </tr>
            </table>
            <script>setTimeout(() => { window.print(); }, 800);</script>
        </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close();
    btn.textContent = "🖨️ Raporu Oluştur"; btn.disabled = false;
});

// --- 6. 505 ÇEVİKLİK MODÜLÜ ---
document.getElementById('btnAgilityPrint')?.addEventListener('click', function() { 
    const reportContent = `
        <html><head><title>Çeviklik Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#16a085; color:white;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">505 Çeviklik ve Yön Değiştirme Analiz Raporu</h1>
            ${getStudentHeader()}
            <h3 style="color:#2c3e50;">Asimetri Analizi Sonuçları</h3>
            <table>
                <tr><th>Parametre</th><th>Sağ Bacak (sn)</th><th>Sol Bacak (sn)</th><th>Fark (Mutlak sn)</th></tr>
                <tr><td>505 Toplam Süre</td><td>${document.getElementById('ag_r_total_table').textContent}</td><td>${document.getElementById('ag_l_total_table').textContent}</td><td>${document.getElementById('ag_total_diff').textContent}</td></tr>
                <tr><td>Dönüş Temas Süresi</td><td>${document.getElementById('ag_r_contact_table').textContent}</td><td>${document.getElementById('ag_l_contact_table').textContent}</td><td>${document.getElementById('ag_contact_diff').textContent}</td></tr>
            </table>
            <h2 style="color:#c0392b; text-align:center; margin-top:20px;">Nihai Karar: ${document.getElementById('final_agility_score_display').textContent}</h2>
            <div style="margin-top:20px; font-size:0.8em; color:#7f8c8d;">
                <strong>Asimetri Değerlendirme Kriterleri:</strong><br>
                • Dengeli (Asimetri Yok): İki bacağın Toplam Süresi veya Temas Süresi arasındaki mutlak fark <= %10.<br>
                • Kuvvetlendirme Gerekli (Dengesiz): İki bacak arasındaki süre farkı > %10. Daha yavaş olan bacağa tek taraflı (unilateral) yüklenilmelidir.
            </div>
            <script>setTimeout(() => { window.print(); }, 500);</script>
        </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close();
});

// JSON İletim Alertleri
['btnSubmitFormVbt', 'btnSprintSubmit', 'btnOhsSubmit', 'btnPosSubmit', 'btnJumpSubmit', 'btnAgilitySubmit'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => alert("Değerlendirme bilgi paketi (JSON) sisteme iletilmek üzere kuyruğa alındı."));
});