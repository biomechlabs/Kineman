// agility_hesapla.js - 505 Çeviklik Motoru ve Asimetri Algoritması

const agTabBtns = document.querySelectorAll('.agility-tab-btn');
const agTabContents = document.querySelectorAll('.agility-tab-content');

agTabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        agTabBtns.forEach(b => b.classList.remove('active'));
        agTabContents.forEach(c => c.style.display = 'none');
        this.classList.add('active');
        document.getElementById(this.getAttribute('data-target')).style.display = 'block';
        window.switchVideoContext('agility_' + this.getAttribute('data-target')); 
    });
});

let agClickMode = 0; 

// Sağ Butonlar
document.getElementById('btnAgilityRightIn').addEventListener('click', function() { agClickMode = 101; this.textContent = "👉 İşaretleyin"; });
document.getElementById('btnAgilityRightOut').addEventListener('click', function() { agClickMode = 102; this.textContent = "👉 İşaretleyin"; });
document.getElementById('btnAgilityRightBrakeStart').addEventListener('click', function() { agClickMode = 103; this.textContent = "👉 İşaretleyin"; });
document.getElementById('btnAgilityRightBrakeEnd').addEventListener('click', function() { agClickMode = 104; this.textContent = "👉 İşaretleyin"; });

// Sol Butonlar
document.getElementById('btnAgilityLeftIn').addEventListener('click', function() { agClickMode = 201; this.textContent = "👉 İşaretleyin"; });
document.getElementById('btnAgilityLeftOut').addEventListener('click', function() { agClickMode = 202; this.textContent = "👉 İşaretleyin"; });
document.getElementById('btnAgilityLeftBrakeStart').addEventListener('click', function() { agClickMode = 203; this.textContent = "👉 İşaretleyin"; });
document.getElementById('btnAgilityLeftBrakeEnd').addEventListener('click', function() { agClickMode = 204; this.textContent = "👉 İşaretleyin"; });

document.addEventListener('videoTiklandi', function(event) {
    if (!document.getElementById('module-agility').classList.contains('active')) return;
    const time = event.detail.zaman;

    if (agClickMode === 101) { document.getElementById('ag_r_in').textContent = time; agClickMode = 0; document.getElementById('btnAgilityRightIn').textContent = "✅ Alındı"; }
    else if (agClickMode === 102) { document.getElementById('ag_r_out').textContent = time; agClickMode = 0; document.getElementById('btnAgilityRightOut').textContent = "✅ Alındı"; }
    else if (agClickMode === 103) { document.getElementById('ag_r_brake_in').textContent = time; agClickMode = 0; document.getElementById('btnAgilityRightBrakeStart').textContent = "✅ Alındı"; }
    else if (agClickMode === 104) { document.getElementById('ag_r_brake_out').textContent = time; agClickMode = 0; document.getElementById('btnAgilityRightBrakeEnd').textContent = "✅ Alındı"; }

    else if (agClickMode === 201) { document.getElementById('ag_l_in').textContent = time; agClickMode = 0; document.getElementById('btnAgilityLeftIn').textContent = "✅ Alındı"; }
    else if (agClickMode === 202) { document.getElementById('ag_l_out').textContent = time; agClickMode = 0; document.getElementById('btnAgilityLeftOut').textContent = "✅ Alındı"; }
    else if (agClickMode === 203) { document.getElementById('ag_l_brake_in').textContent = time; agClickMode = 0; document.getElementById('btnAgilityLeftBrakeStart').textContent = "✅ Alındı"; }
    else if (agClickMode === 204) { document.getElementById('ag_l_brake_out').textContent = time; agClickMode = 0; document.getElementById('btnAgilityLeftBrakeEnd').textContent = "✅ Alındı"; }
});

// Otomatik Asimetri Tablosu ve Değerlendirme Algoritması
function updateAgilitySummary() {
    const rTotal = parseFloat(document.getElementById('ag_r_total_time').value) || 0;
    const lTotal = parseFloat(document.getElementById('ag_l_total_time').value) || 0;
    const rContact = parseFloat(document.getElementById('ag_r_contact_time').value) || 0;
    const lContact = parseFloat(document.getElementById('ag_l_contact_time').value) || 0;

    // Tabloyu Güncelle
    document.getElementById('ag_r_total_table').textContent = rTotal ? rTotal.toFixed(3) : "-";
    document.getElementById('ag_l_total_table').textContent = lTotal ? lTotal.toFixed(3) : "-";
    document.getElementById('ag_r_contact_table').textContent = rContact ? rContact.toFixed(3) : "-";
    document.getElementById('ag_l_contact_table').textContent = lContact ? lContact.toFixed(3) : "-";

    let totalDiff = 0; 
    let contactDiff = 0;
    
    // Farkları Hesapla
    if(rTotal && lTotal) {
        totalDiff = Math.abs(rTotal - lTotal);
        document.getElementById('ag_total_diff').textContent = totalDiff.toFixed(3);
    } else {
        document.getElementById('ag_total_diff').textContent = "-";
    }
    
    if(rContact && lContact) {
        contactDiff = Math.abs(rContact - lContact);
        document.getElementById('ag_contact_diff').textContent = contactDiff.toFixed(3);
    } else {
        document.getElementById('ag_contact_diff').textContent = "-";
    }

    // %10 Asimetri Kuralı (Fark / Maksimum Süre * 100)
    if (rTotal && lTotal && rContact && lContact) {
        const totalAsymPct = (totalDiff / Math.max(rTotal, lTotal)) * 100;
        const contactAsymPct = (contactDiff / Math.max(rContact, lContact)) * 100;

        const evalDisplay = document.getElementById('final_agility_score_display');
        
        // Eğer her iki metrikteki asimetri de %10'dan küçük veya eşitse Dengeli
        if (totalAsymPct <= 10 && contactAsymPct <= 10) {
            evalDisplay.textContent = "Dengeli (Asimetri Yok)";
            evalDisplay.style.color = "#27ae60"; // Yeşil
        } else {
            evalDisplay.textContent = "Kuvvetlendirme Gerekli (Dengesiz)";
            evalDisplay.style.color = "#c0392b"; // Kırmızı
        }
        
        // Menüdeki seçeneği de otomatik eşle (Eğer öğrenci manuel değiştirmek istemezse)
        const evalSelect = document.getElementById('ag_asym_eval');
        if (totalAsymPct <= 10 && contactAsymPct <= 10) evalSelect.value = "balanced";
        else evalSelect.value = "imbalanced";
    } else {
        document.getElementById('final_agility_score_display').textContent = "-";
    }
}

// Event Listener'ları Ekle
const agInputs = ['ag_r_total_time', 'ag_l_total_time', 'ag_r_contact_time', 'ag_l_contact_time'];
agInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateAgilitySummary);
});