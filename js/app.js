// --- GLOBAL VİRGÜL ÇÖZÜCÜ (Tüm modüller için geçerlidir) ---
const _originalParseFloat = parseFloat;
window.parseFloat = function(val) {
    if (typeof val === 'string' && val.includes(',')) {
        val = val.replace(/,/g, '.');
    }
    return _originalParseFloat(val);
};

// --- ÖĞRENCİ BİLGİLERİ VE KALICI OTURUM ---
window.studentData = { no: '', name: '', email: '' };

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sayfa yüklendiğinde hafızada kayıt var mı bak
    const savedSession = localStorage.getItem('kineman_session');
    if (savedSession) {
        window.studentData = JSON.parse(savedSession);
        enterApp(); // Otomatik giriş yap
    }

    // 2. Giriş yap butonu tetikleyici
    const btnEnter = document.getElementById('btnEnterSystem');
    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            const no = document.getElementById('lpNo').value.trim();
            const name = document.getElementById('lpName').value.trim();
            const email = document.getElementById('lpEmail').value.trim();

            if (!no || !name || !email) { alert("Lütfen tüm alanları doldurun."); return; }

            window.studentData = { no, name, email };
            
            // Veriyi kaydet
            localStorage.setItem('kineman_session', JSON.stringify(window.studentData));
            enterApp();
        });
    }
});

function enterApp() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('mainAppContainer').style.display = 'flex';
    
    // Bilgileri ekrana yaz
    const displayBox = document.getElementById('studentInfoDisplay');
    if (displayBox) {
        displayBox.innerHTML = `
            <div style="color:white; font-weight:bold;">${window.studentData.name}</div>
            <div style="font-size:0.8em; color:#3498db;">${window.studentData.no}</div>
        `;
    }
}

// --- NAVBAR BUTONLARI İŞLEVLERİ ---

// 1. Ana Sayfaya Dönüş (Landing'i geri getir)
document.getElementById('btnHome').addEventListener('click', () => {
    document.getElementById('landingPage').style.display = 'flex';
    document.getElementById('mainAppContainer').style.display = 'none';
});

// 2. Çıkış Yap (Hafızayı temizle ve sayfayı yenile)
document.getElementById('btnLogout').addEventListener('click', () => {
    if (confirm("Sistemden çıkış yapmak istiyor musunuz?")) {
        localStorage.removeItem('kineman_session');
        window.location.reload(); // Sayfayı yenileyerek landing ekranına döndürür
    }
});

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
            <div class="academic-guide" style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #2c3e50; padding: 20px; background: #ffffff; border-radius: 8px;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Kılavuz: Halter Hızı (VBT) Analiz Süreçleri</h2>
                
                <h3>1. Analiz Hakkında</h3>
                <p>Hız Temelli Antrenman (VBT), sporcunun antrenman şiddetini 1TM (Tekrar Maksimum) gibi statik verilerle değil, kaldırışın gerçek zamanlı kinematik hızı üzerinden belirleyen otonom bir sistemdir. VBT'nin temelindeki "nedensellik", sporcunun merkezi sinir sistemi (MSS) yorgunluğunun bar hızına doğrudan yansımasıdır. Dinç bir günde üretilen hız ile yorgun bir gündeki hız arasındaki fark, bizlere antrenman yükünün o an değiştirilmesi (otoregülasyon) için en somut veriyi sağlar.</p>

                <h3>2. Video Oluşturma ve Hareketin Tanımı</h3>
                <p>Geçerli bir kuvvet-hız profili oluşturmak için hareket düzlemine tam paralel ve yüksek kare hızlı (HFR) bir kayıt gereklidir.</p>
                <ul>
                    <li><strong>Hareketin Tanımı:</strong> Hareket (Squat, Bench Press, Clean vb.) "maksimal niyetle" (intent) yapılmalıdır. Eksantrik faz kontrollü, ancak konsantrik (yukarı itiş) fazı patlayıcı olmalıdır. İtme hızının kasten yavaşlatıldığı setler, MSS yorgunluğunu maskeler ve analizi geçersiz kılar.</li>
                    <li><strong>Kamera ve Ortam:</strong> Kamera barın hareket hattına tam 90 derece dik (yandan) yerleştirilmelidir. Kamera açısı kayıksa barın dikey yer değiştirmesi (Y ekseni) hatalı ölçülür.</li>
                    <li><strong>Referanslar:</strong> Barın tam hizasına veya barla aynı derinlikte, netliği bozulmayacak şekilde yerleştirilmiş bir referans objesi (örn: 1 metrelik kalibrasyon şeridi) kadraja alınmalıdır.</li>
                </ul>

                <h3>3. Analiz Adımları ve Hesaplamalar</h3>
                <p><strong>Aşama 1: Mekansal Kalibrasyon (Piksel-Metre Dönüşümü)</strong><br>
                Videodaki piksellerin gerçek dünyaya karşılığını bulmalıyız. "Kalibrasyon için tıkla" butonuna basın.<br>
                - <strong>İşlem:</strong> Referans objenin üst ve alt (veya iki uç) noktasına sırayla tıklayın.<br>
                - <strong>Matematik:</strong> <code>Katsayı (m/piksel) = Gerçek Uzunluk (m) / |Y2 - Y1| (Piksel Farkı)</code>.<br>
                Bu katsayı, görüntünün her bir pikselinin gerçek dünyada kaç metreye tekabül ettiğini belirleyen biyomekanik çarpandır.</p>

                <p><strong>Aşama 2: Ağırlık ve Set Girişi</strong><br>
                Analiz edilecek her bir set için o sette kullanılan toplam yükü (bar + plakalar) kg cinsinden kutucuğa girin. Bu veri, regresyon eğrisinin X eksenini (yük) temsil eder.</p>

                <p><strong>Aşama 3: Kinematik Veri Toplama (Etiketleme)</strong><br>
                "Etiketleme Başlat" diyerek, barın konsantrik (yükseliş) fazının başladığı en alt kareyi ve hareketin bittiği (en tepe) kareyi işaretleyin.<br>
                - <strong>t0, Y0:</strong> Kaldırışın başladığı an ve barın Y koordinatı.<br>
                - <strong>t1, Y1:</strong> Kaldırışın bittiği an ve barın Y koordinatı.<br>
                - <strong>Nedensellik:</strong> Yazılım, <code>Δt = t1 - t0</code> (süre) ve <code>Δy = |Y1 - Y0| * Katsayı</code> (yer değiştirme) verilerini anında işler.</p>

                <p><strong>Aşama 4: Hız Hesabı ve 1TM Kestirimi</strong><br>
                - <strong>Ortalama Hız:</strong> <code>V = Δy / Δt</code>. Setlerin ortalama hızı, set boyunca barın katettiği toplam mesafenin zamana oranıdır.<br>
                - <strong>Regresyon Analizi:</strong> Farklı yüklerdeki (örn: %40, %60, %80) setleri tamamladıktan sonra yazılım, hız-yük arasındaki doğrusal ilişkiyi kurar.<br>
                - <strong>1TM Hesaplama:</strong> <code>1TM = (Seçilen MVT - Kesişim) / Eğim</code>. MVT (Minimum Hız Eşiği), seçilen hareketin (Squat/Bench vb.) tükeniş anındaki karakteristik hızıdır. Bu denklemle, sporcunun maksimallerini denemesine gerek kalmadan 1TM kapasitesi tahmin edilir.</p>

                <h3>4. Raporlama</h3>
                <p>Tüm verileri girdikten sonra "Raporu Oluştur"a basın. KINEMAN'ın otonom denetim mekanizması, sizin manuel işaretlediğiniz koordinatları ve girdiğiniz süreleri, video karelerinden elde edilen ham verilerle karşılaştırır.</p>
                <ul>
                    <li><strong>Doğru/Hatalı Onayı:</strong> Hata payınız bilimsel tolerans (piksel kayması) sınırları içindeyse raporunuz onaylanır.</li>
                    <li><strong>Düzeltme:</strong> Eğer "Hatalı" sonucu alırsanız, analiz sekmesine dönerek t0 ve t1 işaretlemelerinizi yeniden kontrol edebilir, hesaplamalarınızı güncelleyerek raporu yeniden oluşturabilirsiniz.</li>
                </ul>
            </div>`,

        'sprint': `
        <div class="academic-guide" style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #ffffff; border-radius: 8px; border-left: 5px solid #3498db;">
            <h2 style="color: #3498db; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; font-weight: 800;">20m Sprint (İvmelenme) Analiz Süreçleri</h2>
            
            <h3>1. Analiz Hakkında</h3>
            <p>Sprint, salt bir hızlı koşu eylemi değil; yer tepki kuvvetlerinin yatay hıza dönüştürüldüğü son derece karmaşık bir nöromüsküler organizasyondur. Sprintin ilk 20 metresi, sporcunun "pozitif ivmelenme" fazını temsil eder. Bu evrede, adım uzunluğu ve yerle temas süresi arasındaki hassas mekanik denge, maksimal hıza ulaşma verimliliğini doğrudan belirler. KINEMAN analizi ile sporcunun hangi mesafe diliminde hız kaybı yaşadığını veya adım frekansının nerede bozulduğunu tespit ederek, teknik defektleri saptamak ve spesifik hız antrenmanları planlamak hedeflenir.</p>

            <h3>2. Video Oluşturma ve Hareketin Tanımı</h3>
            <p>Geçerli bir kinematik matris oluşturabilmek için hareket düzlemine tam paralel, tercihen yüksek kare hızlı (HFR) çekilmiş bir koşu videosuna ihtiyacınız vardır.</p>
            <ul>
                <li><strong>Kamera Yerleşimi:</strong> Kamera, 20 metrelik koridorun tam ortasına (10. metre hizasına) ve koşu hattına paralel, yaklaşık 15-20 metre uzağa yerleştirilmelidir (Paralaks hatasını azaltmak için).</li>
                <li><strong>Referanslar:</strong> Koridorun 0, 5, 10, 15 ve 20. metrelerine net görünen huniler konulmalıdır. Bu huniler, süreyi ve mesafeyi ölçmemiz için "geçiş kapılarıdır".</li>
            </ul>

            <h3>3. Analiz Adımları ve Hesaplamalar</h3>
            <p><strong>Aşama 1: Mekansal Kalibrasyon (Piksel-Metre Dönüşümü)</strong><br>
            Videodaki piksellerin gerçek dünyaya karşılığını bulmalıyız. "Kalibrasyon için tıkla" butonuna basın. 5 ve 10. metre hunilerinin taban merkezlerine sırayla tıklayın.<br>
            - <strong>Matematik:</strong> <code>Katsayı (m/piksel) = 5 metre / |X10 - X5| (Piksel Farkı)</code>.<br>
            Bu katsayı, görüntünün her bir pikselinin gerçek dünyada kaç metreye tekabül ettiğini belirleyen çarpandır.</p>

            <p><strong>Aşama 2: Süre Analizi (Geçiş Kapıları)</strong><br>
            Sporcunun çıkış yaptığı anı (0m) ve gövdesinin 5, 10, 15 ve 20. metre hunilerinden geçtiği anları tespit edip işaretleyin.<br>
            - <strong>Neden:</strong> Bu veriler, ivmelenmenin hangi mesafe dilimlerinde (örn: 0-5m arası mı, 15-20m arası mı) gerçekleştiğini gösteren "zaman çizelgesini" oluşturur.</p>

            <p><strong>Aşama 3: Kinematik Adım Analizi (Adım Döngüleri)</strong><br>
            "Yeni Adım Döngüsü Ekle" butonuna basın. Her bir adım için 3 kritik noktayı işaretleyin:<br>
            - <strong>t1 (Yerden kesilme):</strong> Ayağın zeminle bağının koptuğu an.<br>
            - <strong>t2 (Yere temas):</strong> Ayağın tekrar yere değdiği an.<br>
            - <strong>t3 (Yerden ikinci kesilme):</strong> Adımın tamamlandığı an.<br>
            - <strong>Formüller:</strong> <code>Adım Uzunluğu = |X_t3 - X_t1| * Katsayı</code> | <code>Temas Süresi = t3 - t2</code>.<br>
            - <strong>Kritik Detay:</strong> Her adımı, düştüğü mesafe aralığına (örn: 0-5m fazı) göre açılır menüden atamalısınız. Bu, mekanik yapının hızlandıkça nasıl değiştiğini (frekans artışı, temas kısalması) kanıtlar.</p>

            <p><strong>Aşama 4: Hız ve İvme Matrisi</strong><br>
            - <strong>Hız:</strong> <code>V = Mesafe (5m) / Δt (Geçiş Süresi)</code>.<br>
            - <strong>İvme:</strong> <code>a = ΔV / Δt</code> (Hız değişiminin zamana bölümü).<br>
            - <strong>Analitik Beklenti:</strong> Başlangıçta ivme en yüksek, hız düşüktür. Mesafe ilerledikçe ivme azalır, hız zirveye çıkar. Matrisinizde bu "ters orantıyı" görmelisiniz.</p>

            <h3>4. Raporlama</h3>
            <p>Tüm verileri girdikten sonra "Raporu Oluştur"a basın. Yazılım arka planda tüm hesaplamalarınızı denetler. Analiz sonucunda oluşan sütun grafiği, 4 mesafe fazındaki hız ve ivme profilinizi görselleştirerek teknik analizinizin biyomekanik kanıtını sunar.</p>
        </div>    `,
        
        'fms': `
        <div class="academic-guide" style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #ffffff; border-radius: 8px; border-left: 5px solid #27ae60;">
            <h2 style="color: #27ae60; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; font-weight: 800;">FMS: Overhead Squat Analiz Süreçleri</h2>
            
            <h3>1. Analiz Hakkında</h3>
            <p>Overhead Squat testi, kinetik zincir boyunca omuz, kalça, diz ve ayak bileği komplekslerinin mobilite ve stabilite kısıtlılıklarını eş zamanlı tarar. Subjektif gözle puanlama yerine nicel iki boyutlu analitik geometri kurallarıyla eklem sapmalarını ölçerek, nöromüsküler disfonksiyonları kronik sakatlıklara dönüşmeden yakalamayı amaçlar.</p>

            <h3>2. Video Oluşturma ve Hareketin Tanımı</h3>
            <ul>
                <li><strong>Hareket:</strong> Sporcu, ayaklarını omuz genişliğinde açar, kollarını tam yukarı (baş üstü) uzatır ve topuklarını yerden kaldırmadan maksimum derinliğe çömelip kalkar.</li>
                <li><strong>Kamera:</strong> İki ayrı açı gereklidir: Tam profilden (sagittal) ve tam karşıdan (frontal). Kayıtlar, sporcunun ulaştığı maksimum çömelme derinliğinde dondurulmalıdır.</li>
            </ul>

            <h3>3. Analiz Adımları ve Hesaplamalar</h3>
            <p><strong>Aşama 1: Sagittal (Yandan) Evre:</strong><br>
            En alt fazda Omuz, Kalça, Diz ve Ayak Bileği merkezlerini işaretleyin.<br>
            - <strong>Femur Açısı:</strong> <code>m_femur = (Y_kalça - Y_diz) / (X_kalça - X_diz)</code>. Excel'de <code>=DERECE(MUTLAK(ATAN(m_femur)))</code> ile uyluk açısı elde edilir. Açı < 0° ise kalça dizin altına inmiştir (Kusursuz derinlik).<br>
            - <strong>Paralellik:</strong> Gövde ve Tibia (kaval kemiği) mutlak açılarını hesaplayın. <code>Fark = |Açı_Gövde - Açı_Tibia|</code>. Fark ≤ 5° ise mükemmel uyumdur; yüksek farklar stabilite kaybını kanıtlar.</p>

            <p><strong>Aşama 2: Frontal (Önden) Evre:</strong><br>
            Maksimum derinlikte ASIS (kalça çıkıntısı), diz kapağı merkezi ve ayak bileği orta noktasını işaretleyin.<br>
            - <strong>Valgus/Varus Sapma:</strong> Üst ve alt bacak vektör eğimlerini hesaplayın. <code>Sapma Açısı = |Açı_Uyluk - Açı_Kaval|</code>. Sapma > 10° ACL (ön çapraz bağ) yaralanma riski için kritik uyarıdır.</p>

            <h3>4. Raporlama</h3>
            <p>Yazılım, girilen bu nicel açılara göre 1-3 arası FMS skorunu otonom olarak üretir. Raporunuzda "Hatalı" onayı alırsanız, işaretlediğiniz eklem merkezlerinin doğruluğunu (piksel hassasiyeti) kontrol edip analizi güncelleyin.</p>
        </div>`,

    'posture': `
        <div class="academic-guide" style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #ffffff; border-radius: 8px; border-left: 5px solid #8e44ad;">
            <h2 style="color: #8e44ad; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; font-weight: 800;">Statik Postür Analiz Süreçleri</h2>
            
            <h3>1. Analiz Hakkında</h3>
            <p>Statik Postür modülü, yerçekimi çizgisi ekseninde kas-iskelet sistemi eklem hizalanmalarını, kranial kaymaları ve frontal düzlem asimetrilerini mutlak açılar cinsinden nicel olarak belgeler. Postüral sapmalar, zamanla doku üzerindeki mekanik stres yükünü değiştirerek kronik ağrı ve sakatlık döngülerini başlatır.</p>

            <h3>2. Video/Görsel Oluşturma ve Hareketin Tanımı</h3>
            <ul>
                <li><strong>Hareket:</strong> Sporcu anatomik referanslar önünde, tamamen doğal, rahat ve statik bir duruşta (anatomik pozisyon) sabit durmalıdır.</li>
                <li><strong>Kamera:</strong> Tam profil (sagittal) ve tam karşıdan (frontal) çekim gereklidir. Arka planda dikey bir referans çizgisi olması, hizalamayı doğrulamanıza yardımcı olur.</li>
            </ul>

            <h3>3. Analiz Adımları ve Hesaplamalar</h3>
            <p><strong>Aşama 1: Kraniovertebral Açı (CVA):</strong><br>
            C7 omuru ve kulak tragus noktasına tıklayın.<br>
            - <strong>Matematik:</strong> <code>Eğim (m) = (Y_Kulak - Y_C7) / (X_Kulak - X_C7)</code>.<br>
            - <strong>Hesap:</strong> <code>CVA = DERECE(MUTLAK(ATAN(m)))</code>. Açı < 50° ise "Forward Head" (başın öne kayması) sendromu mevcuttur.</p>

            <p><strong>Aşama 2: Dikey Şakül Hattı:</strong><br>
            Ayak bileği dış çıkıntısı ve omuz üst noktasını işaretleyin. 90° dikey hattan sapma, ağırlık merkezinin öne veya arkaya kaydığını nicel olarak kanıtlar.</p>

            <p><strong>Aşama 3: Frontal Asimetri:</strong><br>
            Sağ/sol omuz akromion uçları ve ASIS (kalça çıkıntıları) noktalarına tıklayın.<br>
            - <strong>Hesap:</strong> <code>Eğim = (Y_sol - Y_sag) / (X_sol - X_sag)</code>. <code>Asimetri = DERECE(MUTLAK(ATAN(Eğim)))</code>. 2° üzerindeki sapmalar, skolyotik veya pelvik eğrilik şüphesini uyandırır.</p>

            <h3>4. Raporlama</h3>
            <p>Elde ettiğiniz açılar, yazılımın "Statik Postür Puanı" matrisine aktarılır. "Doğru" onayı almak, işaretlediğiniz noktaların anatomik karşılıklarının sistemin beklediği biyomekanik normlarla örtüştüğünü gösterir. Raporunuzdaki grafik, postüral sapmaların vücut üzerindeki mekanik yük dağılımını gösterir.</p>
        </div>`,
        'jump': `
        <div class="academic-guide" style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #ffffff; border-radius: 8px; border-left: 5px solid #e67e22;">
            <h2 style="color: #e67e22; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; font-weight: 800;">Dikey Sıçrama (SJ/CMJ) Analiz Süreçleri</h2>
            
            <h3>1. Analiz Hakkında</h3>
            <p>Dikey sıçrama testleri, alt ekstremite patlayıcı gücünü ve Streç-Kısalma Döngüsü (SSC) verimliliğini değerlendirir. Analiz, sadece sıçranan mesafeyi değil, yerçekimine karşı kütlenin fırlatılma anındaki "Zirve Mekanik Güç" (Peak Power) çıktısını Watt biriminde hesaplar. Bu veri, sporcunun hız-güç spektrumundaki yerini belirlemek ve periyotlama modelindeki patlayıcılık adaptasyonunu izlemek için kritiktir.</p>

            <h3>2. Video Oluşturma ve Hareketin Tanımı</h3>
            <ul>
                <li><strong>Hareket:</strong> Sporcu, SJ (sabit çömelmeden) veya CMJ (hızlı bir eksantrik fazdan) sıçramayı, kollar serbest veya yanda maksimum yükseklikte gerçekleştirir. İniş anında dizleri bükerek süre çalmak, analizin bilimsel geçerliliğini bozar.</li>
                <li><strong>Kamera:</strong> Ayak uçlarının zeminden kesildiği ve tekrar bastığı anları milisaniye netliğinde yakalamak için yere yakın, sarsıntısız ve minimum 120 FPS çekim zorunludur.</li>
            </ul>

            <h3>3. Analiz Adımları ve Hesaplamalar</h3>
            <p><strong>Aşama 1: Kütle Girişi:</strong> Sporcunun vücut ağırlığını (kg) sisteme girin. Kütle, Sayers denkleminde güç çıktısını belirleyen temel değişkendir.</p>
            <p><strong>Aşama 2: Uçuş Süresi (Δt):</strong> Ayak ucunun yerden tamamen kesildiği ilk kareyi (t_kalkış) ve havada asılı kaldıktan sonra yere dokunduğu o ilk kareyi (t_iniş) işaretleyin.<br>
            - <strong>Matematik:</strong> <code>Δt = t_iniş - t_kalkış</code>.</p>
            <p><strong>Aşama 3: Yükseklik ve Güç Hesabı:</strong><br>
            - <strong>Yükseklik:</strong> <code>Yükseklik (m) = (g * Δt²) / 8</code> (g=9.81 m/s²). Bu, serbest düşme kinematiğinin tersine çevrilmiş halidir.<br>
            - <strong>Zirve Güç (Peak Power):</strong> <code>Watt = (60.7 * Yükseklik_cm) + (45.3 * Kütle_kg) - 2055</code> (Sayers Denklemi).</p>

            <h3>4. Raporlama</h3>
            <p>Sistem, girdiğiniz verileri otonom hesaplama algoritmasıyla karşılaştırır. Raporunuzda sıçrama yüksekliğinin ve üretilen Watt değerinin, sporcunun kütlesine göre oransal performansı grafiksel olarak sunulur. "Doğru" onayı, kalkış/iniş anı tespitinizin biyomekanik normlara uygun olduğunu teyit eder.</p>
        </div>`,

    'agility': `
        <div class="academic-guide" style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #ffffff; border-radius: 8px; border-left: 5px solid #d35400;">
            <h2 style="color: #d35400; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; font-weight: 800;">505 Çeviklik Analiz Süreçleri</h2>
            
            <h3>1. Analiz Hakkında</h3>
            <p>505 Çeviklik testi, 180 derecelik keskin bir dönüş anındaki frenleme hızı ve yön değiştirme kapasitesini ölçer. Analizin biyomekanik önemi Bilateral Asimetri tespitidir. Sağ ve sol bacak dönüşleri arasındaki %10'u aşan performans farkları, sporcunun o yöne dönerken eksantrik kuvveti absorbe edemediğini ve o ekstremitede yaralanma (örn: ACL kopması) riskinin yüksek olduğunu bilimsel olarak kanıtlar.</p>

            <h3>2. Video Oluşturma ve Hareketin Tanımı</h3>
            <ul>
                <li><strong>Hareket:</strong> Sporcu 10. metredeki giriş hattından hızla geçer, 15. metredeki dönüş çizgisinde 180 derece döner ve tekrar 10. metreye döner. Sağ ve sol dönüşler için ayrı videolar kaydedilmelidir.</li>
                <li><strong>Kamera:</strong> 12.5 metre hizasına, koşu hattına paralel yerleştirilmelidir. Dönüş hunisi kadrajın merkezinde olmalıdır.</li>
            </ul>

            <h3>3. Analiz Adımları ve Hesaplamalar</h3>
            <p><strong>Aşama 1: Toplam Çeviklik Süresi (Δt_toplam):</strong> Giriş hattından (10m) geçiş ile çıkış hattından (10m) geçiş anlarını işaretleyin.<br>
            - <code>Δt_toplam = t_çıkış - t_giriş</code>. Bu veri, sporcunun genel reaksiyon ve dönüş hızını gösterir.</p>
            <p><strong>Aşama 2: Frenleme (Dönüş) Temas Süresi (Δt_temas):</strong> Dönüş adımının yere temas ettiği an (t_temas) ve kuvvet üretip yön değiştirdikten sonra zemini terk ettiği an (t_kesilme) etiketlenir.<br>
            - <code>Δt_temas = t_kesilme - t_temas</code>. Bu, sporcunun frenleme verimliliğini (eksantrik fazın kısalığını) gösterir.</p>
            <p><strong>Aşama 3: Asimetri Kararı:</strong> Yazılım, sağ ve sol bacak verilerini <code>Asimetri % = |Sağ - Sol| / Maksimum * 100</code> formülüyle işler. %10'un üzerindeki farklar, "Kuvvetlendirme Gereksinimi" kararını tetikler.</p>

            <h3>4. Raporlama</h3>
            <p>Raporunuz, dönüş sırasında gerçekleşen temas sürelerini karşılaştırmalı sütun grafiği ile sunar. Sağ ve sol bacak arasındaki farkın "Doğru" tespiti, işaretlediğiniz dönüş anlarının (temas/kesilme) video kareleriyle uyumunu sistemin otonom denetim algoritması ile doğrular.</p>
        </div>`,
        'announcement': `
        <div class="academic-guide" style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; padding: 25px; background: #ffffff; border-radius: 12px; border-left: 5px solid #2c3e50; max-width: 800px; margin: auto;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; font-weight: 800;">Dönem Sonu Projesi Duyurusu</h2>
            
            <p><strong>Değerli Öğrenciler,</strong><br>
            Dönem sonu projemiz kapsamında, atletik performans ve postür değerlendirmelerini KINEMAN platformu üzerinden iki boyutlu kinematik analizlerle gerçekleştireceksiniz.</p>

            <h3>Projenin Amacı</h3>
            <p>Bu projede yazılımın verileri sizin yerinize otomatik hesaplaması beklenmemektedir. Koordinat düzlemini okumanız, mekansal kalibrasyonu yapmanız, hız/ivme/açı denklemlerini bizzat kurarak hesaplamanız ve elde ettiğiniz verileri sisteme manuel olarak girmeniz hedeflenmektedir. Temel gaye, ekranda görülen her bir sayının arka planındaki biyomekanik nedenselliği kavramanızdır.</p>

            <h3>Proje Kapsamı ve Analiz Grupları</h3>
            <p>Proje süreci, seçeceğiniz analizler için uygun hareket videolarının kaydedilmesi ve bu videoların platformda analiz edilmesini içerir. İşlemler üç temel gruba ayrılmıştır. Başarılı bir teslim için bu 3 grubun her birinden en az 1 adet analiz seçerek, toplamda minimum 3 analiz gerçekleştirmeniz zorunludur:</p>
            <ul>
                <li>• Grup 1: Halter Hızı (VBT) veya 20m Sprint Analizi</li>
                <li>• Grup 2: Fonksiyonel Hareket Taraması (FMS) veya Statik Postür Analizi</li>
                <li>• Grup 3: Dikey Sıçrama Analizi veya 505 Çeviklik Analizi</li>
            </ul>

            <h3>Çalışma Süreci ve Teknik Gereksinimler</h3>
            <ul>
                <li>• Platform: Tüm analizler KINEMAN web arayüzü (<a href="https://biomechlabs.github.io/Kineman/" target="_blank">https://biomechlabs.github.io/Kineman/</a>) kullanılarak yapılacaktır.</li>
                <li>• Eğitim Materyalleri: Her analiz modülünün kendi sayfasında, işlemlerin nasıl yapılacağını adım adım anlatan eğitim videoları ve uygulama kılavuzları bulunmaktadır. Analizlere başlamadan önce bu materyalleri incelemeniz zorunludur.</li>
                <li>• Tarayıcı: Platformun sorunsuz ve stabil çalışması için işlemlerinizi bilgisayarınızdaki Google Chrome web tarayıcısı üzerinden yürütmeniz tavsiye edilir.</li>
            </ul>

            <h3>Değerlendirme ve Notlandırma</h3>
            <p>Final notunuz, KINEMAN platformunun ürettiği PDF raporlarında yer alan "Otonom Değerlendirme" puanları üzerinden hesaplanacaktır:</p>
            <ul>
                <li>• Sisteme manuel girdiğiniz veriler, yazılımın arka planda yaptığı bağımsız hesaplamalarla karşılaştırılır.</li>
                <li>• Hata payınız bilimsel tolerans sınırları içerisindeyse o işlemden "Doğru" onayı ve tam puan alırsınız.</li>
                <li>• Raporlardaki "Hatalı" tespitlerini inceleyerek analiz sekmesine dönebilir, hesaplamalarınızı düzeltip raporu yeniden oluşturabilirsiniz.</li>
            </ul>

            <h3>Teslim Formatı ve Tarihi</h3>
            <ul>
                <li>• Son Teslim Tarihi: 11 Haziran Perşembe, saat 23:59.</li>
                <li>• Teslim Biçimi: Seçtiğiniz üç analiz için KINEMAN'da ürettiğiniz sonuç raporlarını (PDF formatında) bilgisayarınıza kaydettikten sonra, GUZEM sistemindeki ilgili analizin dosya yükleme sekmelerine yüklemeniz gerekmektedir.</li>
            </ul>

            <p>Karşılaştığınız teknik sorunlar, eksiklikler veya projeyle ilgili sorularınız için dilediğiniz zaman cihanbaykal@gmail.com adresi üzerinden iletişime geçebilirsiniz.<br>
            Çalışmalarınızda başarılar dilerim.<br>
            <strong>Dr. Cihan Baykal</strong></p>
        </div>`
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