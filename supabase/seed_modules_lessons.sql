-- Seeder for Learning Modules and Lessons
-- Run this after the schema migrations

-- ============================================
-- CLEAR EXISTING DATA (optional, uncomment if needed)
-- ============================================
-- DELETE FROM module_lessons;
-- DELETE FROM learning_modules;

-- ============================================
-- LEARNING MODULES
-- ============================================

-- Use DO block to capture returned IDs
DO $$
DECLARE
    module1_id INTEGER;
    module2_id INTEGER;
    module3_id INTEGER;
    module4_id INTEGER;
    module5_id INTEGER;
    lesson1_1_id INTEGER;
    lesson1_2_id INTEGER;
    lesson2_1_id INTEGER;
BEGIN
    -- Module 1: Dasar-Dasar Keuangan Pribadi
    INSERT INTO learning_modules (title, description, difficulty_level, content_type, category, duration, is_published, order_index)
    VALUES (
        'Dasar-Dasar Keuangan Pribadi',
        'Pelajari fundamental pengelolaan keuangan pribadi, mulai dari budgeting, menabung, hingga membangun dana darurat. Cocok untuk pemula yang ingin memulai perjalanan finansial mereka.',
        'basic',
        'text',
        'Keuangan Pribadi',
        '2 jam',
        true,
        1
    ) RETURNING module_id INTO module1_id;

    -- Module 2: Investasi untuk Pemula
    INSERT INTO learning_modules (title, description, difficulty_level, content_type, category, duration, is_published, order_index)
    VALUES (
        'Investasi untuk Pemula',
        'Panduan lengkap memulai investasi dari nol. Pahami berbagai instrumen investasi seperti saham, reksa dana, dan obligasi dengan bahasa yang mudah dipahami.',
        'basic',
        'text',
        'Investasi',
        '3 jam',
        true,
        2
    ) RETURNING module_id INTO module2_id;

    -- Module 3: Memahami Pasar Modal
    INSERT INTO learning_modules (title, description, difficulty_level, content_type, category, duration, is_published, order_index)
    VALUES (
        'Memahami Pasar Modal',
        'Pelajari cara kerja pasar modal Indonesia, bagaimana saham diperdagangkan, dan cara membaca laporan keuangan perusahaan.',
        'intermediate',
        'text',
        'Investasi',
        '4 jam',
        true,
        3
    ) RETURNING module_id INTO module3_id;

    -- Module 4: Perencanaan Keuangan Jangka Panjang
    INSERT INTO learning_modules (title, description, difficulty_level, content_type, category, duration, is_published, order_index)
    VALUES (
        'Perencanaan Keuangan Jangka Panjang',
        'Strategi membangun kekayaan jangka panjang melalui perencanaan yang matang, termasuk persiapan dana pensiun dan proteksi asuransi.',
        'intermediate',
        'text',
        'Perencanaan Keuangan',
        '3 jam',
        true,
        4
    ) RETURNING module_id INTO module4_id;

    -- Module 5: Cryptocurrency dan Blockchain
    INSERT INTO learning_modules (title, description, difficulty_level, content_type, category, duration, is_published, order_index)
    VALUES (
        'Cryptocurrency dan Blockchain',
        'Pahami teknologi blockchain dan aset kripto secara mendalam. Pelajari cara kerja Bitcoin, Ethereum, dan berbagai altcoin lainnya.',
        'advanced',
        'text',
        'Cryptocurrency',
        '5 jam',
        true,
        5
    ) RETURNING module_id INTO module5_id;

    -- ============================================
    -- MODULE 1 LESSONS: Dasar-Dasar Keuangan Pribadi
    -- ============================================

    -- Lesson 1.1: Pengantar (Parent with children)
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module1_id, NULL, 'Mengenal Keuangan Pribadi',
        '<h2>Selamat Datang di Modul Keuangan Pribadi!</h2>
        <p>Keuangan pribadi adalah fondasi dari kebebasan finansial. Dalam materi ini, Anda akan mempelajari konsep-konsep dasar yang akan membantu Anda mengelola uang dengan lebih baik.</p>
        <h3>Apa yang akan Anda pelajari?</h3>
        <ul>
            <li>Memahami hubungan pendapatan dan pengeluaran</li>
            <li>Membuat anggaran yang realistis</li>
            <li>Membangun kebiasaan menabung</li>
            <li>Menghindari jebakan utang</li>
        </ul>
        <blockquote>💡 <strong>Tips:</strong> Pengelolaan keuangan yang baik dimulai dari kesadaran akan kondisi finansial Anda saat ini.</blockquote>',
        1, true
    ) RETURNING id INTO lesson1_1_id;

    -- Sub-lesson 1.1.1
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module1_id, lesson1_1_id, 'Mengapa Keuangan Pribadi Penting?',
        '<h2>Pentingnya Mengelola Keuangan Pribadi</h2>
        <p>Banyak orang beranggapan bahwa mengelola keuangan hanya diperlukan oleh mereka yang memiliki penghasilan besar. Padahal, justru sebaliknya.</p>
        <h3>5 Alasan Mengapa Keuangan Pribadi Penting:</h3>
        <ol>
            <li><strong>Keamanan Finansial</strong> - Melindungi diri dari situasi darurat</li>
            <li><strong>Mencapai Tujuan</strong> - Mewujudkan impian seperti rumah, pendidikan, atau pensiun nyaman</li>
            <li><strong>Mengurangi Stres</strong> - Masalah finansial adalah penyebab utama stres</li>
            <li><strong>Kebebasan Memilih</strong> - Tidak terikat pada pekerjaan karena kebutuhan uang</li>
            <li><strong>Warisan untuk Keluarga</strong> - Meninggalkan sesuatu untuk generasi berikutnya</li>
        </ol>
        <p>Ingat, tidak ada kata terlambat untuk mulai mengelola keuangan dengan baik!</p>',
        1, true
    );

    -- Sub-lesson 1.1.2
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module1_id, lesson1_1_id, 'Mindset Finansial yang Benar',
        '<h2>Membangun Mindset Finansial</h2>
        <p>Sebelum belajar teknik pengelolaan uang, Anda perlu memahami bahwa <strong>90% kesuksesan finansial ditentukan oleh mindset</strong>.</p>
        <h3>Mindset yang Perlu Diubah:</h3>
        <table>
            <tr><th>Mindset Lama ❌</th><th>Mindset Baru ✅</th></tr>
            <tr><td>"Saya tidak punya cukup uang untuk ditabung"</td><td>"Saya menabung dulu, sisanya untuk pengeluaran"</td></tr>
            <tr><td>"Saya akan mulai berinvestasi nanti saja"</td><td>"Waktu terbaik berinvestasi adalah sekarang"</td></tr>
            <tr><td>"Utang itu normal"</td><td>"Utang konsumtif harus dihindari"</td></tr>
        </table>
        <blockquote>📚 <strong>Fakta:</strong> Warren Buffett mulai berinvestasi sejak usia 11 tahun!</blockquote>',
        2, true
    );

    -- Lesson 1.2: Budgeting (Parent with children)
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module1_id, NULL, 'Membuat Anggaran (Budgeting)',
        '<h2>Seni Membuat Anggaran</h2>
        <p>Anggaran adalah peta jalan keuangan Anda. Tanpa anggaran, Anda seperti berkendara tanpa GPS - mungkin sampai tujuan, tapi boros waktu dan bensin.</p>
        <h3>Dalam sub-materi ini, Anda akan belajar:</h3>
        <ul>
            <li>Metode budgeting populer (50/30/20)</li>
            <li>Cara tracking pengeluaran</li>
            <li>Tools dan aplikasi yang membantu</li>
        </ul>',
        2, true
    ) RETURNING id INTO lesson1_2_id;

    -- Sub-lesson 1.2.1
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module1_id, lesson1_2_id, 'Metode 50/30/20',
        '<h2>Metode Budgeting 50/30/20</h2>
        <p>Metode ini dipopulerkan oleh Senator Elizabeth Warren dalam bukunya "All Your Worth".</p>
        <h3>Pembagiannya:</h3>
        <ul>
            <li><strong>50% - Kebutuhan (Needs)</strong>: Sewa/cicilan rumah, makanan, transportasi, utilitas, asuransi kesehatan</li>
            <li><strong>30% - Keinginan (Wants)</strong>: Hiburan, makan di luar, hobi, streaming, belanja non-esensial</li>
            <li><strong>20% - Tabungan & Investasi (Savings)</strong>: Dana darurat, investasi, bayar utang</li>
        </ul>
        <h3>Contoh Perhitungan:</h3>
        <p>Jika gaji Rp 10.000.000/bulan:</p>
        <ul>
            <li>Kebutuhan: Rp 5.000.000</li>
            <li>Keinginan: Rp 3.000.000</li>
            <li>Tabungan: Rp 2.000.000</li>
        </ul>
        <blockquote>💡 Sesuaikan persentase dengan kondisi Anda. Di kota besar, mungkin kebutuhan bisa 60%.</blockquote>',
        1, true
    );

    -- Sub-lesson 1.2.2
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module1_id, lesson1_2_id, 'Tracking Pengeluaran',
        '<h2>Cara Melacak Pengeluaran</h2>
        <p>Tidak bisa mengelola apa yang tidak bisa diukur. Tracking pengeluaran adalah langkah pertama menuju kontrol finansial.</p>
        <h3>Langkah-langkah Tracking:</h3>
        <ol>
            <li><strong>Catat semua pengeluaran</strong> - Sekecil apapun, termasuk kopi dan parkir</li>
            <li><strong>Kategorikan</strong> - Makanan, transportasi, hiburan, dll</li>
            <li><strong>Review mingguan</strong> - Lihat pola pengeluaran Anda</li>
            <li><strong>Identifikasi kebocoran</strong> - Temukan pengeluaran yang tidak perlu</li>
        </ol>
        <h3>Tools yang Bisa Digunakan:</h3>
        <ul>
            <li>Spreadsheet (Excel/Google Sheets)</li>
            <li>Aplikasi: Money Lover, Wallet, YNAB</li>
            <li>Fitur tracking di aplikasi banking</li>
        </ul>',
        2, true
    );

    -- Lesson 1.3: Dana Darurat (Standalone - no children)
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module1_id, NULL, 'Membangun Dana Darurat',
        '<h2>Dana Darurat: Benteng Pertama Keuangan Anda</h2>
        <p>Dana darurat adalah uang yang disisihkan khusus untuk situasi tidak terduga seperti PHK, sakit, atau kerusakan properti.</p>
        <h3>Berapa Jumlah Ideal Dana Darurat?</h3>
        <ul>
            <li><strong>Single/Lajang:</strong> 3-6 bulan pengeluaran</li>
            <li><strong>Menikah tanpa anak:</strong> 6-9 bulan pengeluaran</li>
            <li><strong>Menikah dengan anak:</strong> 9-12 bulan pengeluaran</li>
            <li><strong>Freelancer/Pengusaha:</strong> 12+ bulan pengeluaran</li>
        </ul>
        <h3>Di Mana Menyimpan Dana Darurat?</h3>
        <p>Dana darurat harus:</p>
        <ol>
            <li><strong>Likuid</strong> - Mudah dicairkan kapan saja</li>
            <li><strong>Aman</strong> - Tidak berisiko rugi</li>
            <li><strong>Terpisah</strong> - Tidak campur dengan rekening sehari-hari</li>
        </ol>
        <p>Pilihan terbaik: Rekening tabungan terpisah atau deposito dengan tenor pendek.</p>
        <blockquote>⚠️ <strong>Penting:</strong> Dana darurat BUKAN untuk investasi! Jangan taruh di saham atau reksa dana.</blockquote>',
        3, true
    );

    -- ============================================
    -- MODULE 2 LESSONS: Investasi untuk Pemula
    -- ============================================

    -- Lesson 2.1: Pengantar Investasi (Parent)
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module2_id, NULL, 'Apa Itu Investasi?',
        '<h2>Memahami Konsep Investasi</h2>
        <p>Investasi adalah menempatkan uang Anda pada instrumen yang berpotensi memberikan keuntungan di masa depan. Berbeda dengan menabung, investasi memiliki risiko tapi juga potensi return yang lebih tinggi.</p>
        <h3>Mengapa Harus Berinvestasi?</h3>
        <p>Karena <strong>inflasi</strong>. Jika uang hanya ditabung di rekening biasa dengan bunga 0.5%/tahun, sementara inflasi 5%/tahun, maka nilai uang Anda sebenarnya menyusut!</p>
        <h3>Formula Ajaib: Compound Interest</h3>
        <p>Albert Einstein menyebut compound interest sebagai "keajaiban dunia ke-8".</p>
        <p><strong>Rumus:</strong> A = P(1 + r)ⁿ</p>
        <ul>
            <li>A = Nilai akhir</li>
            <li>P = Modal awal</li>
            <li>r = Return per tahun</li>
            <li>n = Jumlah tahun</li>
        </ul>
        <p><strong>Contoh:</strong> Rp 10 juta dengan return 10%/tahun selama 20 tahun = Rp 67,2 juta!</p>',
        1, true
    ) RETURNING id INTO lesson2_1_id;

    -- Sub-lesson 2.1.1
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module2_id, lesson2_1_id, 'Risiko vs Return',
        '<h2>Memahami Hubungan Risiko dan Return</h2>
        <p>Prinsip dasar investasi: <strong>Semakin tinggi potensi return, semakin tinggi risikonya</strong>.</p>
        <h3>Spektrum Risiko-Return:</h3>
        <table>
            <tr><th>Instrumen</th><th>Risiko</th><th>Potensi Return</th></tr>
            <tr><td>Deposito</td><td>Rendah</td><td>3-5%/tahun</td></tr>
            <tr><td>Obligasi Negara</td><td>Rendah-Menengah</td><td>5-8%/tahun</td></tr>
            <tr><td>Reksa Dana</td><td>Menengah</td><td>5-15%/tahun</td></tr>
            <tr><td>Saham</td><td>Tinggi</td><td>10-30%/tahun</td></tr>
            <tr><td>Cryptocurrency</td><td>Sangat Tinggi</td><td>-80% s/d +500%</td></tr>
        </table>
        <blockquote>⚖️ Kunci: Diversifikasi! Jangan taruh semua telur dalam satu keranjang.</blockquote>',
        1, true
    );

    -- Lesson 2.2: Reksa Dana (Standalone)
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module2_id, NULL, 'Mengenal Reksa Dana',
        '<h2>Reksa Dana: Investasi untuk Semua</h2>
        <p>Reksa dana adalah wadah yang menghimpun dana dari banyak investor untuk diinvestasikan oleh Manajer Investasi profesional.</p>
        <h3>Kelebihan Reksa Dana:</h3>
        <ul>
            <li>✅ Modal kecil (mulai dari Rp 10.000)</li>
            <li>✅ Dikelola profesional</li>
            <li>✅ Otomatis terdiversifikasi</li>
            <li>✅ Mudah dicairkan</li>
        </ul>
        <h3>Jenis-jenis Reksa Dana:</h3>
        <ol>
            <li><strong>Reksa Dana Pasar Uang</strong> - Risiko rendah, return rendah</li>
            <li><strong>Reksa Dana Pendapatan Tetap</strong> - Fokus pada obligasi</li>
            <li><strong>Reksa Dana Campuran</strong> - Mix saham dan obligasi</li>
            <li><strong>Reksa Dana Saham</strong> - Fokus pada saham, risiko lebih tinggi</li>
        </ol>',
        2, true
    );

    -- Lesson 2.3: Saham (Standalone)
    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module2_id, NULL, 'Pengantar Investasi Saham',
        '<h2>Menjadi Pemilik Perusahaan lewat Saham</h2>
        <p>Saat Anda membeli saham, Anda sebenarnya membeli sebagian kepemilikan perusahaan tersebut.</p>
        <h3>Keuntungan dari Saham:</h3>
        <ol>
            <li><strong>Capital Gain</strong> - Keuntungan dari selisih harga jual dan beli</li>
            <li><strong>Dividen</strong> - Pembagian keuntungan perusahaan kepada pemegang saham</li>
        </ol>
        <h3>Cara Memulai:</h3>
        <ol>
            <li>Buka rekening saham di sekuritas (Ajaib, Stockbit, Mirae Asset, dll)</li>
            <li>Setor dana</li>
            <li>Pilih saham yang ingin dibeli</li>
            <li>Beli minimal 1 lot (100 lembar)</li>
        </ol>
        <blockquote>📈 <strong>Tips:</strong> Mulai dengan saham blue chip (perusahaan besar dan stabil) seperti BBCA, BBRI, TLKM, UNVR.</blockquote>',
        3, true
    );

    -- ============================================
    -- MODULE 3 LESSONS: Memahami Pasar Modal
    -- ============================================

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module3_id, NULL, 'Struktur Pasar Modal Indonesia',
        '<h2>Mengenal Pasar Modal Indonesia</h2>
        <p>Pasar modal Indonesia dikelola oleh Bursa Efek Indonesia (BEI) yang berlokasi di Jakarta.</p>
        <h3>Pemain Utama di Pasar Modal:</h3>
        <ul>
            <li><strong>OJK</strong> - Regulator yang mengawasi pasar</li>
            <li><strong>BEI</strong> - Penyelenggara bursa</li>
            <li><strong>KSEI</strong> - Lembaga penyimpanan saham</li>
            <li><strong>Sekuritas</strong> - Perantara perdagangan</li>
            <li><strong>Emiten</strong> - Perusahaan yang menerbitkan saham</li>
            <li><strong>Investor</strong> - Anda!</li>
        </ul>',
        1, true
    );

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module3_id, NULL, 'Membaca Laporan Keuangan',
        '<h2>Dasar Analisis Fundamental</h2>
        <p>Untuk memilih saham yang baik, Anda perlu bisa membaca laporan keuangan perusahaan.</p>
        <h3>3 Laporan Utama:</h3>
        <ol>
            <li><strong>Laporan Laba Rugi (Income Statement)</strong> - Pendapatan dan pengeluaran</li>
            <li><strong>Neraca (Balance Sheet)</strong> - Aset, liabilitas, dan ekuitas</li>
            <li><strong>Laporan Arus Kas (Cash Flow)</strong> - Pergerakan uang masuk dan keluar</li>
        </ol>
        <h3>Rasio-rasio Penting:</h3>
        <ul>
            <li><strong>PER (Price to Earnings Ratio)</strong> - Harga saham dibagi laba per saham</li>
            <li><strong>PBV (Price to Book Value)</strong> - Harga saham dibagi nilai buku</li>
            <li><strong>ROE (Return on Equity)</strong> - Laba dibagi ekuitas</li>
            <li><strong>DER (Debt to Equity Ratio)</strong> - Utang dibagi ekuitas</li>
        </ul>',
        2, true
    );

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module3_id, NULL, 'Analisis Teknikal Dasar',
        '<h2>Membaca Grafik Harga Saham</h2>
        <p>Analisis teknikal adalah metode untuk memprediksi pergerakan harga berdasarkan data historis.</p>
        <h3>Konsep Dasar:</h3>
        <ul>
            <li><strong>Support</strong> - Batas bawah di mana harga cenderung memantul naik</li>
            <li><strong>Resistance</strong> - Batas atas di mana harga cenderung tertahan</li>
            <li><strong>Trend</strong> - Arah pergerakan harga (uptrend, downtrend, sideways)</li>
            <li><strong>Volume</strong> - Jumlah transaksi, menunjukkan kekuatan tren</li>
        </ul>
        <blockquote>⚠️ <strong>Peringatan:</strong> Analisis teknikal bukan ilmu pasti. Gunakan sebagai salah satu pertimbangan, bukan satu-satunya.</blockquote>',
        3, true
    );

    -- ============================================
    -- MODULE 4 LESSONS: Perencanaan Keuangan Jangka Panjang
    -- ============================================

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module4_id, NULL, 'Menyusun Tujuan Keuangan',
        '<h2>Goal Setting dalam Keuangan</h2>
        <p>Tanpa tujuan yang jelas, Anda hanya berputar-putar tanpa arah. Tujuan keuangan harus SMART:</p>
        <ul>
            <li><strong>S</strong>pecific - Spesifik dan jelas</li>
            <li><strong>M</strong>easurable - Bisa diukur</li>
            <li><strong>A</strong>chievable - Realistis dicapai</li>
            <li><strong>R</strong>elevant - Sesuai dengan nilai hidup Anda</li>
            <li><strong>T</strong>ime-bound - Ada batas waktu</li>
        </ul>
        <h3>Contoh Tujuan SMART:</h3>
        <p>❌ "Saya ingin punya rumah"</p>
        <p>✅ "Saya akan membeli rumah seharga Rp 500 juta dengan DP 20% (Rp 100 juta) dalam 5 tahun ke depan"</p>',
        1, true
    );

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module4_id, NULL, 'Perencanaan Dana Pensiun',
        '<h2>Berapa Uang yang Dibutuhkan untuk Pensiun?</h2>
        <p>Banyak orang tidak memikirkan pensiun karena terasa jauh. Padahal, semakin cepat mulai, semakin ringan bebannya.</p>
        <h3>Rumus Sederhana:</h3>
        <p>Dana Pensiun = Pengeluaran Bulanan × 12 × (Ekspektasi Hidup − Usia Pensiun) × Faktor Inflasi</p>
        <h3>Contoh Perhitungan:</h3>
        <ul>
            <li>Pengeluaran bulanan: Rp 10 juta</li>
            <li>Pensiun usia 55, ekspektasi hidup 80 tahun = 25 tahun</li>
            <li>Tanpa memperhitungkan inflasi: 10 juta × 12 × 25 = Rp 3 Miliar!</li>
        </ul>
        <blockquote>⏰ <strong>Mulai sekarang!</strong> Dengan investasi konsisten Rp 3 juta/bulan selama 25 tahun dengan return 10%/tahun, Anda bisa mencapai Rp 3 Miliar.</blockquote>',
        2, true
    );

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module4_id, NULL, 'Proteksi Asuransi',
        '<h2>Asuransi: Proteksi Bukan Investasi</h2>
        <p>Asuransi adalah transfer risiko, bukan alat investasi. Jangan terjebak produk asuransi yang menjanjikan return investasi tinggi.</p>
        <h3>Asuransi yang Wajib Dimiliki:</h3>
        <ol>
            <li><strong>Asuransi Kesehatan</strong> - Paling penting! Biaya rumah sakit sangat mahal.</li>
            <li><strong>Asuransi Jiwa</strong> - Wajib jika Anda tulang punggung keluarga.</li>
        </ol>
        <h3>Prinsip Membeli Asuransi:</h3>
        <ul>
            <li>✅ Beli term life (asuransi jiwa murni), bukan unit link</li>
            <li>✅ Uang pertanggungan minimal 10× pendapatan tahunan</li>
            <li>✅ Pisahkan asuransi dan investasi (BTID: Buy Term Invest the Difference)</li>
        </ul>',
        3, true
    );

    -- ============================================
    -- MODULE 5 LESSONS: Cryptocurrency dan Blockchain
    -- ============================================

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module5_id, NULL, 'Apa Itu Blockchain?',
        '<h2>Teknologi di Balik Cryptocurrency</h2>
        <p>Blockchain adalah database terdistribusi yang menyimpan catatan transaksi secara transparan dan tidak bisa diubah (immutable).</p>
        <h3>Karakteristik Blockchain:</h3>
        <ul>
            <li><strong>Desentralisasi</strong> - Tidak ada otoritas pusat</li>
            <li><strong>Transparansi</strong> - Semua transaksi bisa dilihat publik</li>
            <li><strong>Keamanan</strong> - Menggunakan kriptografi tingkat tinggi</li>
            <li><strong>Immutability</strong> - Data yang sudah masuk tidak bisa diubah</li>
        </ul>
        <h3>Cara Kerja Sederhana:</h3>
        <ol>
            <li>Transaksi terjadi</li>
            <li>Transaksi diverifikasi oleh jaringan (nodes)</li>
            <li>Transaksi digabung dengan transaksi lain menjadi "block"</li>
            <li>Block ditambahkan ke "chain" yang sudah ada</li>
            <li>Transaksi selesai dan tidak bisa diubah</li>
        </ol>',
        1, true
    );

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module5_id, NULL, 'Bitcoin: Mata Uang Digital Pertama',
        '<h2>Mengenal Bitcoin</h2>
        <p>Bitcoin (BTC) diciptakan tahun 2009 oleh seseorang (atau kelompok) dengan nama samaran Satoshi Nakamoto.</p>
        <h3>Fakta Menarik Bitcoin:</h3>
        <ul>
            <li>Supply terbatas: Hanya 21 juta BTC yang akan ada</li>
            <li>Halving: Setiap 4 tahun, reward mining berkurang setengah</li>
            <li>Desentralisasi: Tidak dikendalikan pemerintah atau bank manapun</li>
        </ul>
        <h3>Pro dan Kontra:</h3>
        <table>
            <tr><th>Kelebihan ✅</th><th>Kekurangan ❌</th></tr>
            <tr><td>Potensi return tinggi</td><td>Volatilitas ekstrem</td></tr>
            <tr><td>Hedge terhadap inflasi</td><td>Regulasi tidak jelas</td></tr>
            <tr><td>Transfer lintas negara mudah</td><td>Konsumsi energi tinggi</td></tr>
        </table>
        <blockquote>⚠️ <strong>Peringatan:</strong> Hanya investasikan uang yang Anda siap kehilangan 100%!</blockquote>',
        2, true
    );

    INSERT INTO module_lessons (module_id, parent_id, title, content, order_index, is_published)
    VALUES (
        module5_id, NULL, 'Altcoin dan DeFi',
        '<h2>Dunia di Luar Bitcoin</h2>
        <p>Altcoin adalah sebutan untuk semua cryptocurrency selain Bitcoin.</p>
        <h3>Altcoin Populer:</h3>
        <ul>
            <li><strong>Ethereum (ETH)</strong> - Platform smart contract terbesar</li>
            <li><strong>Solana (SOL)</strong> - Blockchain cepat dan murah</li>
            <li><strong>Cardano (ADA)</strong> - Fokus pada penelitian akademis</li>
            <li><strong>Polygon (MATIC)</strong> - Layer 2 untuk Ethereum</li>
        </ul>
        <h3>DeFi (Decentralized Finance):</h3>
        <p>DeFi adalah ekosistem aplikasi keuangan yang berjalan di blockchain, tanpa perantara bank.</p>
        <ul>
            <li><strong>Staking</strong> - Mengunci crypto untuk mendapat reward</li>
            <li><strong>Lending</strong> - Meminjamkan crypto dan dapat bunga</li>
            <li><strong>DEX</strong> - Exchange terdesentralisasi seperti Uniswap</li>
        </ul>
        <blockquote>🎓 <strong>DYOR!</strong> Do Your Own Research sebelum investasi di altcoin manapun.</blockquote>',
        3, true
    );

    RAISE NOTICE 'Seeder completed successfully!';
    RAISE NOTICE 'Created % modules:', 5;
    RAISE NOTICE '  - Module 1 ID: %', module1_id;
    RAISE NOTICE '  - Module 2 ID: %', module2_id;
    RAISE NOTICE '  - Module 3 ID: %', module3_id;
    RAISE NOTICE '  - Module 4 ID: %', module4_id;
    RAISE NOTICE '  - Module 5 ID: %', module5_id;

END $$;