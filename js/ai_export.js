// ai_export.js - KINEMAN Analitik Raporlama ve Çıktı Motoru

// --- ORTAK RAPOR CSS VE BAŞLIK ŞABLONU ---
const reportBaseCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    body { font-family: 'Inter', sans-serif; color: #0f172a; line-height: 1.5; padding: 15mm; background: #fff; }
    @page { size: A4; margin: 0; }
    .report-header { border-bottom: 3px solid #1e293b; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
    .uni-info { font-weight: 800; font-size: 13px; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px; }
    .lab-title { font-weight: 600; font-size: 11px; color: #64748b; margin-top: 4px; }
    .student-info { text-align: right; font-size: 11px; display: flex; flex-direction: column; gap: 3px; }
    .report-title { text-align: center; font-size: 20px; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; color: #2563eb; }
    .section-title { font-size: 14px; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; color: #0f172a; text-transform: uppercase; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    .data-table th, .data-table td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: center; }
    .data-table th { background-color: #f8fafc; font-weight: 600; color: #334155; }
    .causal-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 20px; font-size: 12px; color: #334155; }
    .causal-title { font-weight: 800; margin-bottom: 5px; color: #0f172a; font-size: 13px; }
    .img-container { text-align: center; margin-bottom: 20px; }
    .img-container img { max-width: 100%; max-height: 250px; border: 1px solid #cbd5e1; border-radius: 4px; }
    .bar-chart-container { margin-top: 15px; width: 100%; }
    .bar-row { display: flex; align-items: center; margin-bottom: 8px; }
    .bar-label { width: 120px; font-size: 11px; font-weight: 600; }
    .bar-track { flex: 1; background: #e2e8f0; height: 16px; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; color: white; font-size: 10px; font-weight: bold; }
`;

function getStudentHeader() {
    const no = window.studentData?.no || 'Belirtilmedi';
    const name = window.studentData?.name || 'Belirtilmedi';
    const email = window.studentData?.email || 'Belirtilmedi';
    return `
        <div class="report-header">
            <div>
                <div class="uni-info">Gazi Üniversitesi Spor Bilimleri Fakültesi</div>
                <div class="lab-title">Antrenörlük Eğitimi Bölümü - KINEMAN Biyomekanik Laboratuvarı</div>
            </div>
            <div class="student-info">
                <span><strong>Öğrenci No:</strong> ${no}</span>
                <span><strong>Adı Soyadı:</strong> ${name}</span>
                <span><strong>E-posta:</strong> ${email}</span>
            </div>
        </div>
    `;
}

async function captureVideoFrameAsync(videoUrl, timeSec) {
    return new Promise((resolve) => {
        if (!videoUrl || isNaN(timeSec)) { resolve(""); return; }
        const vid = document.createElement('video');
        vid.crossOrigin = "anonymous"; vid.src = videoUrl; vid.currentTime = timeSec;
        vid.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = vid.videoWidth; canvas.height = vid.videoHeight;
            canvas.getContext('2d').drawImage(vid, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        });
        vid.addEventListener('error', () => resolve(""));
    });
}

// 1. HALTER HIZI (VBT) RAPORU
document.getElementById('btnPrintReportVbt')?.addEventListener('click', async function() {
    const imgData = window.KineFrameBuffer[window.currentVideoContext] || "";
    const imgHtml = imgData ? `<div class="img-container"><img src="${imgData}" alt="VBT Analiz Karesi"></div>` : "";
    
    const html = `<html><head><title>VBT Analiz Raporu</title><style>${reportBaseCSS}</style></head><body>
        ${getStudentHeader()}
        <div class="report-title">Hız Temelli Antrenman (VBT) 1TM Kestirim Raporu</div>
        ${imgHtml}
        <div class="section-title">Kestirim Verileri</div>
        <table class="data-table">
            <tr><th>Parametre</th><th>Değer</th></tr>
            <tr><td>Set 1 Hızı (%40)</td><td>${document.getElementById('sumS_1').textContent} m/sn</td></tr>
            <tr><td>Set 2 Hızı (%60)</td><td>${document.getElementById('sumS_2').textContent} m/sn</td></tr>
            <tr><td>Set 3 Hızı (%80)</td><td>${document.getElementById('sumS_3').textContent} m/sn</td></tr>
            <tr><td>Regresyon Eğimi</td><td>${document.getElementById('inputSlope').value || '-'}</td></tr>
            <tr><td>Hesaplanan 1TM</td><td><strong>${document.getElementById('input1RM').value || '-'} kg</strong></td></tr>
        </table>
        <div class="causal-box">
            <div class="causal-title">Analitik Nedensellik ve Periyotlama</div>
            Mekanik Çıktı: Doğrusal regresyon analizi ile elde edilen yük-hız profili kullanılarak sporcunun 1 Tekrar Maksimum (1TM) kapasitesi tahmin edilmiştir. Geleneksel Periyotlama (Matveyev) modelleri referans alındığında; tespit edilen 1TM değeri üzerinden hipertrofi fazı için %60-75, maksimal kuvvet makrosiklüsü için >%80 yüklenme bantları planlanmalıdır.
        </div>
        <script>setTimeout(() => { window.print(); }, 800);</script>
    </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(html); printWin.document.close();
});

// 2. 20M SPRINT RAPORU
document.getElementById('btnSprintPrint')?.addEventListener('click', function() {
    // Dinamik olarak eklenen adımların verilerini topla
    let stepsHtml = "";
    let i = 1;
    while (document.getElementById(`step_len_${i}`)) {
        const len = document.getElementById(`step_len_${i}`).value || '-';
        const time = document.getElementById(`step_time_${i}`).value || '-';
        const phase = document.getElementById(`step_phase_${i}`)?.value || '-';
        stepsHtml += `<tr><td>Adım ${i} (${phase})</td><td>${len} m</td><td>${time} sn</td></tr>`;
        i++;
    }

    const html = `<html><head><title>20m Sprint Raporu</title><style>${reportBaseCSS}</style></head><body>
        ${getStudentHeader()}
        <div class="report-title">20m Sprint İvmelenme ve Kinematik Raporu</div>
        
        <div class="section-title">Faz Bölgesi Ortalamaları</div>
        <table class="data-table">
            <tr><th>Bölge Fazı</th><th>Ort. Adım Uzunluğu</th><th>Ort. Temas Süresi</th><th>Ort. Hız</th><th>Ort. İvme</th></tr>
            <tr><td>0 - 5m</td><td>${document.getElementById('avg_len_0_5').value} m</td><td>${document.getElementById('avg_time_0_5').value} sn</td><td>${document.getElementById('avg_spd_0_5').value} m/s</td><td>${document.getElementById('avg_acc_0_5').value} m/s²</td></tr>
            <tr><td>5 - 10m</td><td>${document.getElementById('avg_len_5_10').value} m</td><td>${document.getElementById('avg_time_5_10').value} sn</td><td>${document.getElementById('avg_spd_5_10').value} m/s</td><td>${document.getElementById('avg_acc_5_10').value} m/s²</td></tr>
            <tr><td>10 - 15m</td><td>${document.getElementById('avg_len_10_15').value} m</td><td>${document.getElementById('avg_time_10_15').value} sn</td><td>${document.getElementById('avg_spd_10_15').value} m/s</td><td>${document.getElementById('avg_acc_10_15').value} m/s²</td></tr>
            <tr><td>15 - 20m</td><td>${document.getElementById('avg_len_15_20').value} m</td><td>${document.getElementById('avg_time_15_20').value} sn</td><td>${document.getElementById('avg_spd_15_20').value} m/s</td><td>${document.getElementById('avg_acc_15_20').value} m/s²</td></tr>
        </table>

        <div class="causal-box" style="margin-bottom: 25px;">
            <div class="causal-title">Analitik Nedensellik</div>
            İvmelenme Dinamikleri: 0-10m arasındaki pozitif ivmelenme fazında adım temas sürelerinin uzun, adım uzunluklarının kısa olması beklenir. 10m sonrası geçiş fazında yer tepki kuvveti yatay eksenden dikey eksene kayarak adım uzunluğunun artmasını ve hızın maksimize edilmesini sağlar.
        </div>

        <div class="section-title">Bireysel Adım Kinematiği</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Adım No (Evre)</th>
                    <th>Adım Uzunluğu (m)</th>
                    <th>Temas Süresi (sn)</th>
                </tr>
            </thead>
            <tbody>
                ${stepsHtml || '<tr><td colspan="3">Adım verisi bulunamadı.</td></tr>'}
            </tbody>
        </table>

        <script>setTimeout(() => { window.print(); }, 500);</script>
    </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(html); printWin.document.close();
});

// 3. FMS (OHS) RAPORU
document.getElementById('btnOhsPrint')?.addEventListener('click', function() {
    const imgData = window.KineFrameBuffer[window.currentVideoContext] || "";
    const imgHtml = imgData ? `<div class="img-container"><img src="${imgData}" alt="FMS Analiz Karesi"></div>` : "";
    
    const html = `<html><head><title>FMS OHS Raporu</title><style>${reportBaseCSS}</style></head><body>
        ${getStudentHeader()}
        <div class="report-title">FMS: Overhead Squat Kinematik Raporu</div>
        ${imgHtml}
        <div class="section-title">Eklem Açıları ve Skorlama</div>
        <table class="data-table">
            <tr><th>Parametre</th><th>Ölçülen Değer</th><th>Değerlendirme Puanı</th></tr>
            <tr><td>Çömelme Derinliği</td><td>${document.getElementById('tbl_ohs_derinlik_aci').textContent}°</td><td>${document.getElementById('tbl_ohs_derinlik_puan').textContent}</td></tr>
            <tr><td>Gövde - Tibia Paralelliği</td><td>Fark: ${document.getElementById('tbl_ohs_paralel_aci').textContent}°</td><td>${document.getElementById('tbl_ohs_paralel_puan').textContent}</td></tr>
            <tr><td>Diz Hizalanması (Valgus/Varus)</td><td>Sapma: ${document.getElementById('tbl_ohs_sapma_aci').textContent}°</td><td>${document.getElementById('tbl_ohs_sapma_puan').textContent}</td></tr>
        </table>
        <div style="font-size:16px; font-weight:800; color:#c0392b; text-align:center;">Nihai FMS Skoru: ${document.getElementById('final_fms_score_display').textContent}</div>
        <div class="causal-box">
            <div class="causal-title">Klinik Mekanik ve Nedensellik</div>
            Sagittal Düzlem: Gövde paralelliğinin bozulması (Açı farkı > 10°), ayak bileği dorsifleksiyon kısıtlılığına veya lumbopelvik bölge stabilite eksikliğine bağlı kompensasyon stratejisini gösterir.<br><br>
            Frontal Düzlem: Dizde tespit edilen valgus sapması, gluteus medius zayıflığı veya ayak bileği pronasyon disfonksiyonuna işaret eder. Motor kontrol mekanizmasının düzeltilmesi gereklidir.
        </div>
        <script>setTimeout(() => { window.print(); }, 800);</script>
    </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(html); printWin.document.close();
});

// 4. STATİK POSTÜR RAPORU
document.getElementById('btnPosPrint')?.addEventListener('click', function() {
    const imgData = window.KineFrameBuffer[window.currentVideoContext] || "";
    const imgHtml = imgData ? `<div class="img-container"><img src="${imgData}" alt="Postür Analiz Karesi"></div>` : "";
    
    const html = `<html><head><title>Statik Postür Raporu</title><style>${reportBaseCSS}</style></head><body>
        ${getStudentHeader()}
        <div class="report-title">Klinik Statik Postür Analiz Raporu</div>
        ${imgHtml}
        <div class="section-title">Açısal Asimetri Tespiti</div>
        <table class="data-table">
            <tr><th>Parametre</th><th>Ölçülen Değer</th><th>Değerlendirme Puanı</th></tr>
            <tr><td>Başın Öne Kayması (CVA)</td><td>${document.getElementById('tbl_pos_cva_aci').textContent}°</td><td>${document.getElementById('tbl_pos_cva_puan').textContent}</td></tr>
            <tr><td>Şakül Çizgisi</td><td>${document.getElementById('tbl_pos_dikey_aci').textContent}°</td><td>${document.getElementById('tbl_pos_dikey_puan').textContent}</td></tr>
            <tr><td>Omuz Asimetrisi</td><td>Sapma: ${document.getElementById('tbl_pos_omuz_aci').textContent}°</td><td>${document.getElementById('tbl_pos_omuz_puan').textContent}</td></tr>
            <tr><td>Pelvis Asimetrisi</td><td>Sapma: ${document.getElementById('tbl_pos_pelvis_aci').textContent}°</td><td>${document.getElementById('tbl_pos_pelvis_puan').textContent}</td></tr>
        </table>
        <div style="font-size:16px; font-weight:800; color:#c0392b; text-align:center;">Statik Postür Puanı: ${document.getElementById('final_posture_score_display').textContent}</div>
        <div class="causal-box">
            <div class="causal-title">Klinik Mekanik ve Nedensellik</div>
            Sagittal Düzlem: Kraniovertebral açının (CVA) 50°'nin altına düşmesi, derin servikal fleksörlerin inhibisyonunu ve üst trapez/sternokleidomastoid kaslarının aşırı aktivasyonunu kanıtlar. Vektörel kuvvet dağılımı servikal omurga üzerine binen mekanik stresi logaritmik olarak artırır.
        </div>
        <script>setTimeout(() => { window.print(); }, 800);</script>
    </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(html); printWin.document.close();
});

// 5. DİKEY SIÇRAMA RAPORU
document.getElementById('btnJumpPrint')?.addEventListener('click', function() {
    const html = `<html><head><title>Dikey Sıçrama Raporu</title><style>${reportBaseCSS}</style></head><body>
        ${getStudentHeader()}
        <div class="report-title">Dikey Sıçrama Zirve Güç Raporu</div>
        <div class="section-title">Uçuş Mekaniği ve Çıktılar</div>
        <table class="data-table">
            <tr><th>Parametre</th><th>Değer</th></tr>
            <tr><td>Vücut Ağırlığı</td><td>${document.getElementById('jump_body_mass').value || '-'} kg</td></tr>
            <tr><td>Uçuş Süresi (Δt)</td><td>${document.getElementById('jump_flight_time').value || '-'} sn</td></tr>
            <tr><td>Sıçrama Yüksekliği</td><td>${document.getElementById('jump_height_cm').value || '-'} cm</td></tr>
            <tr><td>Zirve Güç (Sayers Denklemi)</td><td><strong>${document.getElementById('jump_peak_power').value || '-'} Watt</strong></td></tr>
        </table>
        <div class="causal-box">
            <div class="causal-title">Analitik Nedensellik ve Periyotlama</div>
            Mekanik Çıktı: Yerçekimi kanunları ve uçuş süresi üzerinden hesaplanan Zirve Güç (Peak Power), sporcunun Streç-Kısalma Döngüsü (SSC) kapasitesini belirler. Geleneksel Periyotlama (Matveyev) modellerine göre; patlayıcı güç gelişimi, hazırlık döneminin sonu ve müsabaka dönemine geçiş aşamasında spesifik pliometrik uyaranlarla hedeflenmelidir.
        </div>
        <script>setTimeout(() => { window.print(); }, 500);</script>
    </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(html); printWin.document.close();
});

// 6. 505 ÇEVİKLİK RAPORU (CSS Bar Grafik Entegreli)
document.getElementById('btnAgilityPrint')?.addEventListener('click', function() {
    const rTot = parseFloat(document.getElementById('ag_r_total_table').textContent) || 0;
    const lTot = parseFloat(document.getElementById('ag_l_total_table').textContent) || 0;
    const rCon = parseFloat(document.getElementById('ag_r_contact_table').textContent) || 0;
    const lCon = parseFloat(document.getElementById('ag_l_contact_table').textContent) || 0;
    
    // Bar Chart yüzdelik hesaplama
    const maxTot = Math.max(rTot, lTot) || 1;
    const rTotPct = (rTot / maxTot) * 100;
    const lTotPct = (lTot / maxTot) * 100;

    const html = `<html><head><title>505 Çeviklik Raporu</title><style>${reportBaseCSS}</style></head><body>
        ${getStudentHeader()}
        <div class="report-title">505 Çeviklik ve Yön Değiştirme Asimetri Raporu</div>
        <div class="section-title">Bilateral Temas ve Tamamlanma Süreleri</div>
        <table class="data-table">
            <tr><th>Parametre</th><th>Sağ Bacak (sn)</th><th>Sol Bacak (sn)</th><th>Mutlak Fark (sn)</th></tr>
            <tr><td>Toplam Süre</td><td>${rTot}</td><td>${lTot}</td><td>${document.getElementById('ag_total_diff').textContent}</td></tr>
            <tr><td>Dönüş Temas Süresi</td><td>${rCon}</td><td>${lCon}</td><td>${document.getElementById('ag_contact_diff').textContent}</td></tr>
        </table>
        
        <div class="section-title">Görsel Asimetri Profili (Toplam Süre)</div>
        <div class="bar-chart-container">
            <div class="bar-row">
                <div class="bar-label">Sağ Bacak Dönüş</div>
                <div class="bar-track"><div class="bar-fill right" style="width: ${rTotPct}%; background-color:#3498db;">${rTot}s</div></div>
            </div>
            <div class="bar-row">
                <div class="bar-label">Sol Bacak Dönüş</div>
                <div class="bar-track"><div class="bar-fill left" style="width: ${lTotPct}%; background-color:#8e44ad;">${lTot}s</div></div>
            </div>
        </div>

        <div style="font-size:16px; font-weight:800; color:#c0392b; text-align:center; margin-top:25px;">Asimetri Kararı: ${document.getElementById('final_agility_score_display').textContent}</div>
        
        <div class="causal-box">
            <div class="causal-title">Analitik Nedensellik</div>
            Frenleme (Braking) Mekaniği: Çeviklik performansında >%10 asimetri saptanması, dönüş bacağındaki eksantrik kuvvet absorpsiyonu zayıflığını kanıtlar. Temas süresi uzun olan bacak tarafında, tek taraflı (unilateral) eksantrik kuvvetlendirme ve reaktif frenleme antrenmanları planlanmalıdır.
        </div>
        <script>setTimeout(() => { window.print(); }, 500);</script>
    </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(html); printWin.document.close();
});