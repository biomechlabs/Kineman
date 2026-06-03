// --- GLOBAL VİRGÜL ÇÖZÜCÜ (Tüm modüller için geçerlidir) ---
const _originalParseFloat = parseFloat;
window.parseFloat = function(val) {
    if (typeof val === 'string' && val.includes(',')) {
        val = val.replace(/,/g, '.');
    }
    return _originalParseFloat(val);
};

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
        document.getElementById('mainAppContainer').style.display = 'none';
        document.getElementById('landingPage').style.display = 'flex';
        
        document.getElementById('lpNo').value = '';
        document.getElementById('lpName').value = '';
        document.getElementById('lpEmail').value = '';
        window.studentData = { no: '', name: '', email: '' };
        
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

// --- YENİ POPUP (MODAL) KILAVUZ SİSTEMİ (Engellenemez) ---
window.openGuide = function(module) {
    const guides = {
        'vbt': `
            <div class="academic-guide">
                <h2>Halter Hızı (VBT) Analizi Laboratuvar Kılavuzu</h2>
                <section>
                    <h3>1. Analiz Hakkında</h3>
                    <p>Hız Temelli Antrenman (VBT), yük ve hız arasındaki doğrusal ilişkiyi kullanarak sporcunun nöromüsküler durumunu takip eder. Bu analizin en kritik yönü <b>Auto-regulation (Otonom Düzenleme)</b> kapasitesidir. Sporcunun her gün aynı ağırlığı aynı hızda kaldıramayacağı gerçeğinden yola çıkarak, günlük hız kaybı takibi yapılır. Eğer hedeflenen hızda %10-20'lik bir düşüş varsa, bu durum merkezi sinir sistemi yorgunluğunu kanıtlar ve antrenman yükünün o an düşürülmesini gerektirir. Bu yöntem, sporcuyu aşırı sürantrenmandan (overtraining) korurken, o günkü hazırbulunuşluk seviyesine göre en verimli yükün seçilmesini sağlar.</p>
                </section>
                <section>
                    <h3>2. Video Oluşturma ve Hareket Tanımı</h3>
                    <p><b>Hareket:</b> Analiz edilecek hareket (Squat, Bench Press vb.) maksimum konsantrik hızda, yani kaldırış fazında ağırlık en hızlı şekilde yukarı itilerek uygulanmalıdır. Hareketin eksantrik (iniş) fazı kontrollü, konsantrik (çıkış) fazı ise patlayıcı olmalıdır.</p>
                    <p><b>Kamera ve Ortam:</b> Kamera, barın hareket düzlemine tam 90 derece dik (yandan) bakacak şekilde tripod ile sabitlenmelidir. Barın hareket hattı üzerinde, barla aynı derinlikte gerçek uzunluğu bilinen bir referans objesi (örn: 1m'lik bir boru) yerleştirilmelidir. Çekim hızı barın titrememesi (blur olmaması) için minimum 60 FPS, ideal olarak 120+ FPS olmalıdır.</p>
                </section>
                <section>
                    <h3>3. Analiz Adımları ve Hesaplamalar</h3>
                    <ul>
                        <li><b>Kalibrasyon (Aşama 1):</b> Videodaki referans objenin üst ve alt noktalarına tıklayarak piksel mesafesini ölçün. Ardından objenin gerçek metre değerini girin. <code>K_cal = Gerçek Uzunluk / Piksel Farkı</code> formülü ile yazılım, video üzerindeki her bir pikselin gerçek dünyada kaç metreye denk geldiğini öğrenir.</li>
                        <li><b>Ağırlık Girişi:</b> Set için kullanılan toplam yükü (plaka + bar) kilogram cinsinden girin. Bu veri, 1TM regresyon eğrisinin yatay eksenini (X) oluşturacaktır.</li>
                        <li><b>Etiketleme (Aşama 2):</b> Kaldırışın (konsantrik faz) başladığı en alt kareyi bulup "Etiketleme Başlat" diyerek bar ucuna tıklayın (t0). Ardından kaldırışın bittiği en üst kareye ilerleyip tekrar bar ucuna tıklayın (t1). 
                            <i>Bu işlemle; <code>Δt = t1 - t0</code> (süre) ve <code>Δy = |Y1 - Y0| * K_cal</code> (mesafe) verileri elde edilir.</i></li>
                        <li><b>Hız Hesabı:</b> <code>Hız = Δy / Δt</code> formülüyle o yükteki ortalama konsantrik hız bulunur.</li>
                        <li><b>1TM Kestirimi (Aşama 3):</b> Farklı yüklerdeki hızlar toplandıktan sonra regresyon eğimi hesaplanır. <code>1TM = (MVT - Kesişim) / Eğim</code> formülüyle, sporcunun teorik olarak en ağır yükü kaldırabileceği minimum hız eşiğindeki (MVT) gücü tahmin edilir.</li>
                    </ul>
                </section>
            </div>
        `,
        'sprint': `
            <div class="academic-guide">
                <h2>20m Sprint Analizi Laboratuvar Kılavuzu</h2>
                <section>
                    <h3>1. Analiz Hakkında</h3>
                    <p>Sprint analizi, ivmelenme mekaniğini ve sporcunun yer tepki kuvvetlerini nasıl yatay hıza dönüştürdüğünü inceler. İlk 20 metre, sporcunun "pozitif ivmelenme" fazıdır. Bu evrede adım uzunluğu ve temas süresi arasındaki denge, maksimal hıza ulaşma verimliliğini belirler. Analiz sayesinde sporcunun hangi mesafe diliminde (örn: 5-10m arası) hız kaybı yaşadığı veya adım frekansının nerede bozulduğu tespit edilerek spesifik sprint antrenmanları planlanır.</p>
                </section>
                <section>
                    <h3>2. Video Oluşturma ve Hareket Tanımı</h3>
                    <p><b>Hareket:</b> Sporcu, çıkış çizgisinde statik veya dinamik start alarak 20 metrelik koridoru maksimum eforla kat etmelidir. Çizgi üzerine basılması veya erken yavaşlanması veriyi bozar.</p>
                    <p><b>Kamera ve Ortam:</b> Kamera, 20 metrelik koridorun tam ortasına (10. metre hizasına) ve koşu hattına paralel, yaklaşık 15-20 metre uzağa yerleştirilmelidir (parallax hatasını azaltmak için). Koridorun 0, 5, 10, 15 ve 20. metrelerine net görünen huniler konulmalıdır. Video 120 FPS veya üstü olmalıdır.</p>
                </section>
                <section>
                    <h3>3. Analiz Adımları ve Hesaplamalar</h3>
                    <ul>
                        <li><b>Kalibrasyon (Aşama 1):</b> 5. ve 10. metre hunilerinin taban merkezlerine tıklayın. Bu 5 metrelik fark, <code>K_cal = 5 / |X10 - X5|</code> formülüyle yatay düzlem katsayısını belirler.</li>
                        <li><b>Süre Analizi (Aşama 2):</b> Sporcunun elinin veya ayağının yerden ilk kesildiği anı (0m) ve gövdesinin huni hizalarından geçtiği anları (5, 10, 15, 20m) işaretleyin. Bu sayede her bir 5 metrelik dilimin geçiş süresi ve hızı (V = 5 / Δt) hesaplanır.</li>
                        <li><b>Adım Döngüsü (Aşama 3):</b> "Adım Ekle" diyerek ayağın yerden kesildiği ve yere temas ettiği kareleri işaretleyin.
                            <i>Neden:</i> <code>Adım Uzunluğu = |X_temas2 - X_temas1| * K_cal</code> ve <code>Temas Süresi = t_kesilme - t_temas</code> verileriyle sprintin kalitesi (frekans ve uzunluk) ölçülür.</li>
                        <li><b>Kinematik Matris (Aşama 4):</b> Toplanan adım verileri ilgili evrelere (0-5m, 5-10m vb.) dağıtılarak ortalama hız ve ivme (a = ΔV / Δt) değerleri üzerinden rapor oluşturulur.</li>
                    </ul>
                </section>
            </div>
        `,
        'fms': `
            <div class="academic-guide">
                <h2>FMS: Overhead Squat Analizi Laboratuvar Kılavuzu</h2>
                <section>
                    <h3>1. Analiz Hakkında</h3>
                    <p>Overhead Squat, sporcunun tüm kinetik zincirindeki mobilite ve stabilite kısıtlılıklarını ortaya çıkaran bir tarama testidir. Analiz; ayak bileği, diz, kalça ve omuz komplekslerinin eş zamanlı çalışmasını değerlendirir. Bilimsel önemi, sporcunun yaralanma riskini (örn: diz valgus açısı) nicel olarak belirlemek ve nöromüsküler kontrol eksikliklerini sagittal ve frontal düzlemlerde kanıtlamaktır.</p>
                </section>
                <section>
                    <h3>2. Video Oluşturma ve Hareket Tanımı</h3>
                    <p><b>Hareket:</b> Sporcu, ayaklarını omuz genişliğinde açar, kollarını tam yukarı (baş üstü) uzatır ve topuklarını yerden kaldırmadan maksimum derinliğe çömelip tekrar kalkar. Hareket 3 kez tekrarlanmalı ve en derin inilen an analiz edilmelidir.</p>
                    <p><b>Kamera ve Ortam:</b> Analiz için iki ayrı video çekilmelidir: Birincisi tam yandan (sagittal), ikincisi tam önden (frontal). Kamera eklem merkezlerini net görecek yükseklikte sabitlenmelidir.</p>
                </section>
                <section>
                    <h3>3. Analiz Adımları ve Hesaplamalar</h3>
                    <ul>
                        <li><b>Yandan Görünüm Etiketleme:</b> En derin çömelme anında Omuz, Kalça, Diz ve Ayak Bileği merkezlerine tıklayın.
                            <i>Hesap:</i> <code>m_femur = (Y_kalça - Y_diz) / (X_kalça - X_diz)</code> eğimi ile uyluk kemiği açısı bulunur. Eğer açı < 0 ise kalça dizin altına inmiştir (Kusursuz derinlik).</li>
                        <li><b>Gövde-Tibia Paralelliği:</b> Yazılım gövde ve kaval kemiği arasındaki açı farkını hesaplar. <code>Fark = |Açı_Gövde - Açı_Tibia|</code>. Fark ≤ 5° ise mükemmel uyum kabul edilir; yüksek farklar alt ekstremite stabilite kaybını gösterir.</li>
                        <li><b>Önden Görünüm Etiketleme:</b> Kalça (ASIS), Diz Kapağı ve Ayak Bileği orta noktalarını işaretleyin. 
                            <i>Neden:</i> Yazılım <code>Q Açısı</code> benzeri bir sapma (valgus/varus) hesaplar. Sapma > 10° ise sporcuda diz yaralanma riski yüksektir.</li>
                        <li><b>Puanlama:</b> Nicel açılara göre (Kusursuz, Sınırda, Disfonksiyonel) seçim yapın. Yazılım en düşük puana göre nihai FMS skorunu (3, 2 veya 1) otonom olarak üretir.</li>
                    </ul>
                </section>
            </div>
        `,
        'posture': `
            <div class="academic-guide">
                <h2>Statik Postür Analizi Laboratuvar Kılavuzu</h2>
                <section>
                    <h3>1. Analiz Hakkında</h3>
                    <p>Statik postür analizi, yerçekimi kuvvetine karşı vücut bölümlerinin dizilimini inceler. Kas-iskelet sistemi üzerindeki mekanik yüklerin dengeli dağılıp dağılmadığını belirler. Özellikle Kraniovertebral Açı (CVA) üzerinden başın öne kayması gibi durumların tespiti, servikal omurga sağlığı ve kronik ağrı risklerinin önceden tahmin edilmesi açısından kritik akademik öneme sahiptir.</p>
                </section>
                <section>
                    <h3>2. Video Oluşturma ve Hareket Tanımı</h3>
                    <p><b>Hareket:</b> Sporcu, nötral (rahat) duruşta, kollar yanlarda sarkık ve karşıya bakacak şekilde sabit durmalıdır. Ayak uçları karşıyı göstermelidir.</p>
                    <p><b>Kamera ve Ortam:</b> Kamera sporcunun tam yanından ve tam önünden çekim yapmalıdır. Arka planda dik çizgiler (şakül çizgisi veya duvar köşesi) olması görsel referans sağlar. Sporcunun anatomik işaretleyicileri (C7, ASIS vb.) görülebilir olmalıdır.</p>
                </section>
                <section>
                    <h3>3. Analiz Adımları ve Hesaplamalar</h3>
                    <ul>
                        <li><b>CVA (Baş Pozisyonu):</b> C7 omuru ve kulağın tragus noktasına tıklayın. 
                            <i>Sonuç:</i> Yazılım bu iki nokta arasındaki açıyı yatay düzleme göre hesaplar. 50° altındaki değerler "Forward Head Posture" (ileri baş postürü) kanıtıdır.</li>
                        <li><b>Şakül Çizgisi:</b> Ayak bileği dış çıkıntısı ve omuz üst noktasına tıklayın. 
                            <i>Hesap:</i> Dikey referans hattından (90°) sapma miktarı bulunur. Sapma arttıkça vücut ağırlık merkezi güvenli alandan uzaklaşır.</li>
                        <li><b>Asimetri (Önden):</b> Her iki omuz ve her iki kalça çıkıntısına (ASIS) tıklayın. 
                            <i>Neden:</i> <code>Eğim = (Y2 - Y1) / (X2 - X1)</code> formülüyle omuz veya pelvisteki sağ-sol yükseklik farkı (asimetri) derece cinsinden bulunur. 2° üzerindeki sapmalar skolyoz veya kas dengesizliği işareti olabilir.</li>
                    </ul>
                </section>
            </div>
        `,
        'jump': `
            <div class="academic-guide">
                <h2>Dikey Sıçrama Analizi Laboratuvar Kılavuzu</h2>
                <section>
                    <h3>1. Analiz Hakkında</h3>
                    <p>Dikey sıçrama, alt ekstremite patlayıcı gücünü ve Streç-Kısalma Döngüsü (SSC) verimliliğini ölçer. Sadece yükseklik değil, hesaplanan <b>Zirve Güç (Peak Power)</b>, sporcunun hıza karşı koyabildiği kuvvet üretim kapasitesini gösterir. Bu veri, Matveyev periyotlama modelinde hazırlık döneminden müsabaka dönemine geçişteki "güç-hız" dönüşümünü takip etmek için kullanılır.</p>
                </section>
                <section>
                    <h3>2. Video Oluşturma ve Hareket Tanımı</h3>
                    <p><b>Hareket:</b> Sporcu SJ (aktif iniş olmadan) veya CMJ (hızlı çökerek) sıçramayı kollar yanda veya serbest şekilde maksimum yükseklikte gerçekleştirir. İniş anında dizlerin kırılmasına (süre çalmak için) izin verilmemelidir.</p>
                    <p><b>Kamera ve Ortam:</b> Kamera tam yandan veya tam önden, ayakların yerden kesildiği anı milisaniye hassasiyetinde görecek şekilde, zemine yakın yerleştirilmelidir. 120-240 FPS çekim zorunludur.</p>
                </section>
                <section>
                    <h3>3. Analiz Adımları ve Hesaplamalar</h3>
                    <ul>
                        <li><b>Sporcu Verisi:</b> Sporcunun kütlesini (kg) girin. Bu veri Sayers denklemi ile güç (Watt) hesabı için temeldir.</li>
                        <li><b>Uçuş Süresi (Δt):</b> Ayağın yerden tamamen kesildiği ilk kareyi (t_kalkış) ve yere ilk temas ettiği kareyi (t_iniş) işaretleyin.
                            <i>Hesap:</i> <code>Δt = t_iniş - t_kalkış</code>.</li>
                        <li><b>Yükseklik Hesabı:</b> Yerçekimi ivmesi (g=9.81) kullanılarak; <code>Yükseklik (m) = (g * Δt²) / 8</code> formülü uygulanır. Bu, parabolik uçuş mekaniğinin matematiksel karşılığıdır.</li>
                        <li><b>Güç Hesabı (Watt):</b> Sayers Denklemi <code>[60.7 * Yükseklik(cm)] + [45.3 * Kütle(kg)] - 2055</code> kullanılarak anlık üretilen zirve güç bulunur. Bu değer sporcunun patlayıcılık seviyesini akademik normlarla kıyaslamayı sağlar.</li>
                    </ul>
                </section>
            </div>
        `,
        'agility': `
            <div class="academic-guide">
                <h2>505 Çeviklik Analizi Laboratuvar Kılavuzu</h2>
                <section>
                    <h3>1. Analiz Hakkında</h3>
                    <p>505 Testi, sporcunun 180 derece yön değiştirme (COD) hızını ve frenleme kapasitesini ölçer. Analizin en büyük önemi <b>Bilateral Asimetri</b> tespitidir. Sağ ve sol bacak üzerindeki dönüş performansları arasındaki %10'dan fazla fark, sporcunun bir yöne dönerken eksantrik kuvvet absorpsiyonu yapamadığını ve o tarafta yaralanma (örn: ACL kopması) riskinin çok daha yüksek olduğunu gösterir.</p>
                </section>
                <section>
                    <h3>2. Video Oluşturma ve Hareket Tanımı</h3>
                    <p><b>Hareket:</b> Sporcu 10. metredeki hayali çizgiden hızla geçer, 15. metredeki hunide tam 180 derece dönüp tekrar 10. metre çizgisine döner. Her iki bacak (dönüş bacağı olarak) ayrı ayrı test edilmeli ve kaydedilmelidir.</p>
                    <p><b>Kamera ve Ortam:</b> Kamera, 10-15m arasındaki alanı tam yandan görecek şekilde 12.5 metre hizasına yerleştirilmelidir. Hunilerin ve yer çizgilerinin netliği etiketleme doğruluğu için esastır.</p>
                </section>
                <section>
                    <h3>3. Analiz Adımları ve Hesaplamalar</h3>
                    <ul>
                        <li><b>Toplam Süre (A):</b> Sporcunun 10m çizgisinden girişi ve dönüşten sonra aynı çizgiden çıkışı arasındaki kareleri işaretleyin. 
                            <i>Neden:</i> <code>Δt_toplam = t_çıkış - t_giriş</code>. Bu, yön değiştirme hızını temsil eder.</li>
                        <li><b>Dönüş Temas Süresi (B):</b> Dönüş anında (15m hunisinde) ayağın yere değdiği ilk kareyi ve yerden kesildiği son kareyi işaretleyin. 
                            <i>Hesap:</i> <code>Δt_temas = t_kesilme - t_temas</code>. Bu veri, sporcunun frenleme ve tekrar ivmelenme verimliliğini gösterir.</li>
                        <li><b>Asimetri Değerlendirmesi (Aşama 3):</b> Sağ ve sol bacak verilerini girin. Yazılım <code>Fark = |Sağ - Sol| / Maksimum * 100</code> formülüyle asimetriyi hesaplar. %10 üzeri fark "Kuvvetlendirme Gerekli" kararıyla sonuçlanır.</li>
                    </ul>
                </section>
            </div>
        `
    };

    const guideHtml = guides[module] || "<div style='padding:20px; text-align:center;'>Kılavuz Bulunamadı.</div>";
    
    // Popup (Modal) Arka Planı
    const modal = document.createElement('div');
    modal.id = 'kineGuideModal';
    modal.style.position = 'fixed';
    modal.style.top = '0'; modal.style.left = '0';
    modal.style.width = '100%'; modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
    modal.style.zIndex = '99999';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.backdropFilter = 'blur(4px)';
    
    // Popup (Modal) İçeriği
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#f8fafc';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '850px';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflowY = 'auto';
    modalContent.style.borderRadius = '12px';
    modalContent.style.padding = '35px 40px';
    modalContent.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.3)';
    modalContent.style.position = 'relative';
    
    // Kapatma Butonu
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✖ KAPAT';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '15px';
    closeBtn.style.right = '20px';
    closeBtn.style.padding = '8px 15px';
    closeBtn.style.backgroundColor = '#e74c3c';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '6px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    // CSS ve İçerik Şablonu
    const textWrapper = document.createElement('div');
    textWrapper.innerHTML = `
        <style>
            .academic-guide { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.6; }
            .academic-guide h2 { color: #2563eb; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-top:0; font-weight:800; font-size:1.6em; text-transform:uppercase;}
            .academic-guide h3 { color: #0f172a; margin-top: 25px; font-weight: 800; border-left: 4px solid #2563eb; padding-left: 12px; font-size:1.2em;}
            .academic-guide p { margin-bottom: 15px; text-align: justify; }
            .academic-guide ul { margin-bottom: 15px; padding-left: 20px; }
            .academic-guide li { margin-bottom: 10px; }
            .academic-guide code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #1e40af; }
            .academic-guide b { color: #2563eb; }
            .academic-guide i { color: #64748b; font-style: italic; }
            .academic-guide section { background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;}
        </style>
        ${guideHtml}
    `;
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(textWrapper);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
};

// --- EKRAN GEÇİŞLERİ VE KARE KONTROLLERİ ---
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
        videoUploader.style.pointerEvents = 'auto'; 
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
    videoUploader.style.pointerEvents = 'none'; 
    uploadText.style.display = 'none';
    mainVideo.style.display = 'block'; 
    customControls.style.display = 'flex'; 
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
    
    try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = mainVideo.videoWidth;
        offCanvas.height = mainVideo.videoHeight;
        offCanvas.getContext('2d').drawImage(mainVideo, 0, 0, offCanvas.width, offCanvas.height);
        window.KineFrameBuffer[window.currentVideoContext] = offCanvas.toDataURL('image/jpeg', 0.8);
    } catch(e) {
        console.warn("Kare yakalanamadı. Video yüklenmemiş olabilir.");
    }

    document.dispatchEvent(new CustomEvent('videoTiklandi', { detail: { x: lastX, y: lastY, zaman: timeStr } }));
});

// --- YENİ VE GÜVENLİ HESAP MAKİNESİ (ÜSLÜ SAYI DESTEKLİ) ---
const btnCalcToggle = document.getElementById('btnCalcToggle');
const floatingCalc = document.getElementById('floatingCalc');
const btnCloseCalc = document.getElementById('btnCloseCalc');
const calcInput = document.getElementById('calcInput');

if (btnCalcToggle && floatingCalc) {
    btnCalcToggle.addEventListener('click', () => {
        floatingCalc.style.display = floatingCalc.style.display === 'none' ? 'block' : 'none';
        if (floatingCalc.style.display === 'block') calcInput.focus();
    });

    btnCloseCalc.addEventListener('click', () => {
        floatingCalc.style.display = 'none';
    });

    calcInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            try {
                let expr = this.value.replace(/,/g, '.');
                expr = expr.replace(/\^/g, '**');
                const sanitized = expr.replace(/[^0-9+\-*/().* ]/g, '');
                
                if (sanitized) {
                    const result = new Function('return ' + sanitized)();
                    this.value = Number.isInteger(result) ? result.toString() : result.toFixed(3).replace('.', ',');
                }
            } catch (err) {
                const oldVal = this.value;
                this.value = "Hatalı İşlem!";
                setTimeout(() => this.value = oldVal, 1200);
            }
        }
    });
}

// --- GLOBAL NOKTA (.) ENGELLEYİCİ VE VİRGÜL UYARICI ---
document.addEventListener('keypress', function(e) {
    if (e.target.tagName === 'INPUT' && e.key === '.') {
        e.preventDefault(); 
        alert("Lütfen ondalık sayı ayracı olarak virgül kullanınız.");
        
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const val = e.target.value;
        e.target.value = val.substring(0, start) + ',' + val.substring(end);
        e.target.setSelectionRange(start + 1, start + 1);
        
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
});