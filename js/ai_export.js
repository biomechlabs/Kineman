// ai_export.js - Gelişmiş Rapor Çıktı ve JSON Paketleme Motoru

const studentInfoHeader = `
    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #2c3e50; display: flex; justify-content: space-between; font-size: 0.9em; color: #34495e;">
        <div><strong>Öğrenci No:</strong> ......................................</div>
        <div><strong>Adı Soyadı:</strong> ............................................................</div>
        <div><strong>E-posta:</strong> ............................................................</div>
    </div>
`;

// 1. VBT MODÜLÜ ÇIKTILARI
document.getElementById('btnSubmitFormVbt')?.addEventListener('click', function() { alert("VBT Analizi değerlendirme bilgi paketi (JSON) kuyruğa alındı."); });
document.getElementById('btnPrintReportVbt')?.addEventListener('click', function() {
    const reportContent = `
        <html><head><title>VBT Analiz Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#2980b9; color:white;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">Halter Hızı (VBT) Analiz Raporu</h1>
            ${studentInfoHeader}
            <div style="width:100%; height:200px; background:#ecf0f1; border:2px dashed #bdc3c7; display:flex; align-items:center; justify-content:center; text-align:center; color:#7f8c8d; font-weight:bold; margin-bottom:20px; padding: 20px;">
                [Sistem Tarafından 3 Setin Başlangıç ve Bitiş Karelerinin %50 Saydamlıkla Üst Üste Bindiği Chronophotography Görselleri, Kırmızı Doğru Parçası ve (W, t, y, v) Verileri Buraya Basılacaktır]
            </div>
            <table>
                <tr><th>Set</th><th>Ağırlık (W - kg)</th><th>Süre (t - sn)</th><th>Mesafe (y - m)</th><th>Ort. Hız (v - m/sn)</th></tr>
                <tr><td>1</td><td>${document.getElementById('sumW_1').textContent}</td><td>${document.getElementById('time_diff_1').value||'-'}</td><td>${document.getElementById('disp_y_1').value||'-'}</td><td>${document.getElementById('sumS_1').textContent}</td></tr>
                <tr><td>2</td><td>${document.getElementById('sumW_2').textContent}</td><td>${document.getElementById('time_diff_2').value||'-'}</td><td>${document.getElementById('disp_y_2').value||'-'}</td><td>${document.getElementById('sumS_2').textContent}</td></tr>
                <tr><td>3</td><td>${document.getElementById('sumW_3').textContent}</td><td>${document.getElementById('time_diff_3').value||'-'}</td><td>${document.getElementById('disp_y_3').value||'-'}</td><td>${document.getElementById('sumS_3').textContent}</td></tr>
            </table>
            <div style="display:flex; justify-content:space-between; margin-top:20px;">
                <div style="flex:1; height:150px; background:#ecf0f1; border:1px solid #bdc3c7; display:flex; align-items:center; justify-content:center; margin-right:10px;">[Yük-Hız Çizgi Grafiği]</div>
                <div style="flex:1; height:150px; background:#ecf0f1; border:1px solid #bdc3c7; display:flex; align-items:center; justify-content:center;">[Yük-Hız Regresyon Scatter Grafiği (1TM)]</div>
            </div>
            <h2 style="color:#16a085; text-align:center; margin-top:20px;">Tahmini 1TM: ${document.getElementById('input1RM').value||'-'} kg</h2>
        </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close(); printWin.print();
});

// 2. SPRINT MODÜLÜ ÇIKTILARI
document.getElementById('btnSprintSubmit')?.addEventListener('click', function() { alert("20m Sprint değerlendirme bilgi paketi kuyruğa alındı."); });
document.getElementById('btnSprintPrint')?.addEventListener('click', function() {
    const reportContent = `
        <html><head><title>20m Sprint Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#d35400; color:white;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">20m Sprint (İvmelenme) Analiz Raporu</h1>
            ${studentInfoHeader}
            <div style="width:100%; height:200px; background:#ecf0f1; border:2px dashed #bdc3c7; display:flex; align-items:center; justify-content:center; text-align:center; color:#7f8c8d; font-weight:bold; margin-bottom:20px; padding: 20px;">
                [Sistemin Başlangıç Anı ve Her Adımın Yerden Kesilme Anlarındaki Video Karelerini %50 Saydamlıkla Üst Üste Bindirdiği "Chronophotography" Görseli Buraya Basılacaktır]
            </div>
            <table>
                <tr><th>Bölge Fazı (m)</th><th>Ort. Uzunluk (m)</th><th>Ort. Temas (sn)</th><th>Ort. Hız (m/sn)</th><th>Ort. İvme (m/sn²)</th></tr>
                <tr><td>0 - 5</td><td>${document.getElementById('avg_len_0_5').value||'-'}</td><td>${document.getElementById('avg_time_0_5').value||'-'}</td><td>${document.getElementById('avg_spd_0_5').value||'-'}</td><td>${document.getElementById('avg_acc_0_5').value||'-'}</td></tr>
                <tr><td>5 - 10</td><td>${document.getElementById('avg_len_5_10').value||'-'}</td><td>${document.getElementById('avg_time_5_10').value||'-'}</td><td>${document.getElementById('avg_spd_5_10').value||'-'}</td><td>${document.getElementById('avg_acc_5_10').value||'-'}</td></tr>
                <tr><td>10 - 15</td><td>${document.getElementById('avg_len_10_15').value||'-'}</td><td>${document.getElementById('avg_time_10_15').value||'-'}</td><td>${document.getElementById('avg_spd_10_15').value||'-'}</td><td>${document.getElementById('avg_acc_10_15').value||'-'}</td></tr>
                <tr><td>15 - 20</td><td>${document.getElementById('avg_len_15_20').value||'-'}</td><td>${document.getElementById('avg_time_15_20').value||'-'}</td><td>${document.getElementById('avg_spd_15_20').value||'-'}</td><td>${document.getElementById('avg_acc_15_20').value||'-'}</td></tr>
            </table>
            <div style="width:100%; height:180px; background:#ecf0f1; border:1px solid #bdc3c7; display:flex; align-items:center; justify-content:center; margin-top:20px;">
                [4 Kinematik Parametrenin Evrelere Göre Değişimini Gösteren Statik Çizgisel/Sütun Grafikler]
            </div>
        </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close(); printWin.print();
});

// 3. FMS (OHS) MODÜLÜ ÇIKTILARI
document.getElementById('btnOhsSubmit')?.addEventListener('click', function() { alert("FMS OHS değerlendirme bilgi paketi iletildi."); });
document.getElementById('btnOhsPrint')?.addEventListener('click', function() {
    const reportContent = `
        <html><head><title>FMS Raporu</title><style>body{font-family:Arial;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#34495e; color:white;}</style></head><body>
        <h1 style="color:#2c3e50; text-align:center;">FMS: Overhead Squat Analiz Raporu</h1>
        ${studentInfoHeader}
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <div style="flex:1; height:220px; background:#ecf0f1; border:2px dashed #bdc3c7; display:flex; align-items:center; justify-content:center; text-align:center; margin-right:10px; padding:10px;">
                [Yandan Görünüm: Eklemleri İşaretlenmiş, Doğru Parçalarıyla Birleştirilmiş ve Açıları Çizilmiş Canvas Görseli]
            </div>
            <div style="flex:1; height:220px; background:#ecf0f1; border:2px dashed #bdc3c7; display:flex; align-items:center; justify-content:center; text-align:center; padding:10px;">
                [Önden Görünüm: Eklemleri İşaretlenmiş ve Açıları Çizilmiş Canvas Görseli]
            </div>
        </div>
        <h3 style="color:#2c3e50;">Fonksiyonel Hareket Taraması Sonuçları</h3>
        <table>
            <tr><th>Parametre</th><th>Çömelme Derinliği</th><th>Gövde - Tibia Paralelliği</th><th>Diz Hizalanması</th></tr>
            <tr><td>Açı</td><td>${document.getElementById('tbl_ohs_derinlik_aci').textContent}</td><td>${document.getElementById('tbl_ohs_paralel_aci').textContent}</td><td>${document.getElementById('tbl_ohs_sapma_aci').textContent}</td></tr>
            <tr><td>Puan Kararı</td><td>${document.getElementById('tbl_ohs_derinlik_puan').textContent}</td><td>${document.getElementById('tbl_ohs_paralel_puan').textContent}</td><td>${document.getElementById('tbl_ohs_sapma_puan').textContent}</td></tr>
        </table>
        <h2 style="color:#c0392b; text-align:center; margin-top:20px;">Nihai FMS Skoru: ${document.getElementById('final_fms_score_display').textContent}</h2>
        <div style="margin-top:20px; font-size:0.8em; color:#7f8c8d;">
            <strong>Değerlendirme Kriterleri:</strong><br>
            • 3 PUAN (Mükemmel): Tüm alt skorlar 100 Puan olmalıdır.<br>
            • 2 PUAN (Kompansasyonlu): Hiçbir alt skor 0 Puan olmamalıdır. En az bir alt skor 70 Puan ise verilir.<br>
            • 1 PUAN (Disfonksiyonel): Alt skorlardan herhangi biri 0 Puan ise hareket doğrudan 1 puan değerlendirilir.
        </div>
        </body></html>`;
    const w = window.open('','_blank'); w.document.write(reportContent); w.document.close(); w.print();
});

// 4. STATİK POSTÜR MODÜLÜ ÇIKTILARI
document.getElementById('btnPosSubmit')?.addEventListener('click', function() { alert("Postür değerlendirme bilgi paketi iletildi."); });
document.getElementById('btnPosPrint')?.addEventListener('click', function() {
    const reportContent = `
        <html><head><title>Postür Raporu</title><style>body{font-family:Arial;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#34495e; color:white;}</style></head><body>
        <h1 style="color:#2c3e50; text-align:center;">Statik Postür Analiz Raporu</h1>
        ${studentInfoHeader}
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <div style="flex:1; height:220px; background:#ecf0f1; border:2px dashed #bdc3c7; display:flex; align-items:center; justify-content:center; text-align:center; margin-right:10px; padding:10px;">
                [Yandan Görünüm: Baş ve Şakül Çizgisi Eklemleri İşaretlenmiş ve Açıları Çizilmiş Canvas Görseli]
            </div>
            <div style="flex:1; height:220px; background:#ecf0f1; border:2px dashed #bdc3c7; display:flex; align-items:center; justify-content:center; text-align:center; padding:10px;">
                [Önden Görünüm: Omuz ve Pelvis Asimetrisi İşaretlenmiş ve Açıları Çizilmiş Canvas Görseli]
            </div>
        </div>
        <h3 style="color:#2c3e50;">Statik Postür Sonuçları</h3>
        <table>
            <tr><th>Parametre</th><th>Başın Öne Kayması</th><th>Şakül Çizgisi</th><th>Omuz Asimetrisi</th><th>Pelvis Asimetrisi</th></tr>
            <tr><td>Açı</td><td>${document.getElementById('tbl_pos_cva_aci').textContent}</td><td>${document.getElementById('tbl_pos_dikey_aci').textContent}</td><td>${document.getElementById('tbl_pos_omuz_aci').textContent}</td><td>${document.getElementById('tbl_pos_pelvis_aci').textContent}</td></tr>
            <tr><td>Puan Kararı</td><td>${document.getElementById('tbl_pos_cva_puan').textContent}</td><td>${document.getElementById('tbl_pos_dikey_puan').textContent}</td><td>${document.getElementById('tbl_pos_omuz_puan').textContent}</td><td>${document.getElementById('tbl_pos_pelvis_puan').textContent}</td></tr>
        </table>
        <h2 style="color:#c0392b; text-align:center; margin-top:20px;">Nihai Postür Skoru: ${document.getElementById('final_posture_score_display').textContent}</h2>
        <div style="margin-top:20px; font-size:0.8em; color:#7f8c8d;">
            <strong>Değerlendirme Kriterleri:</strong><br>
            • 3 PUAN (Mükemmel): Tüm alt skorlar 100 Puan olmalıdır.<br>
            • 2 PUAN (Hafif Kusurlu): Hiçbir alt skor 0 Puan olmamalıdır. En az bir alt skor 70 Puan ise verilir.<br>
            • 1 PUAN (Disfonksiyonel): Alt skorlardan herhangi biri 0 Puan ise postür doğrudan 1 puan değerlendirilir.
        </div>
        </body></html>`;
    const w = window.open('','_blank'); w.document.write(reportContent); w.document.close(); w.print();
});

// 5. DİKEY SIÇRAMA MODÜLÜ ÇIKTILARI
document.getElementById('btnJumpSubmit')?.addEventListener('click', function() { alert("Dikey Sıçrama değerlendirme paketi iletildi."); });
document.getElementById('btnJumpPrint')?.addEventListener('click', function() { 
    const reportContent = `
        <html><head><title>Dikey Sıçrama Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#8e44ad; color:white;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">Dikey Sıçrama Yükseklik ve Güç Analiz Raporu</h1>
            ${studentInfoHeader}
            <div style="width:100%; height:250px; background:#ecf0f1; border:2px dashed #bdc3c7; display:flex; align-items:center; justify-content:center; text-align:center; color:#7f8c8d; font-weight:bold; margin-bottom:20px; padding: 20px;">
                [Ayakların Yerden Kesildiği An ile Uçuş Süresinin Tam Ortasındaki (Tepe Noktası) Video Karelerinin %50 Saydamlıkla Üst Üste Bindirildiği "Chronophotography" Görseli Buraya Basılacaktır]
            </div>
            <h3 style="color:#2c3e50;">Kinetik Çıktılar</h3>
            <table>
                <tr><th>Uçuş Süresi (sn)</th><th>Sıçrama Yüksekliği (m)</th><th>Zirve Güç / Peak Power (Watt)</th></tr>
                <tr>
                    <td style="font-size:1.2em; font-weight:bold;">${document.getElementById('jump_flight_time').value||'-'}</td>
                    <td style="font-size:1.2em; font-weight:bold;">${document.getElementById('jump_height_m').value||'-'}</td>
                    <td style="font-size:1.2em; font-weight:bold; color:#d35400;">${document.getElementById('jump_peak_power').value||'-'}</td>
                </tr>
            </table>
        </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close(); printWin.print();
});

// 6. 505 ÇEVİKLİK MODÜLÜ ÇIKTILARI
document.getElementById('btnAgilitySubmit')?.addEventListener('click', function() { alert("505 Çeviklik değerlendirme paketi iletildi."); });
document.getElementById('btnAgilityPrint')?.addEventListener('click', function() { 
    const reportContent = `
        <html><head><title>Çeviklik Raporu</title><style>body{font-family:Arial,sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-top:15px;} th,td{border:1px solid #ccc; padding:8px; text-align:center;} th{background:#16a085; color:white;}</style></head><body>
            <h1 style="color:#2c3e50; text-align:center;">505 Çeviklik ve Yön Değiştirme Analiz Raporu</h1>
            ${studentInfoHeader}
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
        </body></html>`;
    const printWin = window.open('','_blank'); printWin.document.write(reportContent); printWin.document.close(); printWin.print();
});