import { PositionInfo } from '../types';

export const POSITIONS_DATA: PositionInfo[] = [
  {
    id: 'mgr_ops',
    title: 'Manajer Operasional Produksi I',
    incumbentName: 'Lalu Mahendra Ali Akbar (NIP: BK-PP1-001)',
    department: 'Divisi Produksi I (Pengolahan)',
    directSupervisor: 'Direktur Perusahaan',
    subordinates: [
      'Plt. Kepala Pengolahan 2 (Andhik Dharmabakti)',
      'Kepala Administrasi 1 (Agustin Wulandari)',
      'Plt. Kepala Gudang Persediaan 1 (Yulia Wardana)',
      'Plt. Kepala Gudang Tembakau (Denny Karisma Gianto)',
      'Plt. Kepala Gudang Persediaan 3 (Suyanto)',
      'Seluruh Mandor, QC, dan Staf Administrasi'
    ],
    operationalScope: 'Pengolahan seluruh bahan baku (Tembakau, Krosok, Cengkeh, Saos Jadi, dan Tembakau Blended) dengan efisiensi tinggi, penekanan susut ketat, dan standar kualitas rasa PT Batu Karang.',
    summary: 'Pemimpin tertinggi operasional Divisi Produksi I. Bertanggung jawab atas seluruh alur pengolahan bahan, pengendalian kesusutan riil molen dan rajang, pengamanan persediaan, disiplin kerja staf, serta kepatuhan Bea & Cukai.',
    duties: [
      'Pelaksanaan dan penerapan disiplin kerja dan tata tertib di Divisi Produksi I (Pengolahan).',
      'Pengaturan dan pengawasan kerja bawahan langsung dalam pelaksanaan tugas, wewenang, dan hubungan kerja.',
      'Pengefektifan dan pengefisiensian kerja seluruh sekup (Tembakau, Cengkeh, Saos, dan Blend).',
      'Pemaksimalan kinerja seluruh jajaran staf dan karyawan divisi.',
      'Mengatur pendelegasian kerja bila ada kepala sekup atau staf yang berhalangan.',
      'Pengawasan berkala atas hasil proses perajangan tembakau & krosok, perajangan cengkeh, proses blend, serta sistem penyimpanan di gudang persediaan.',
      'Peningkatan kualitas rasa yang dihasilkan dari hasil akhir proses blending secara berkala.',
      'Pengawasan sistem pengamanan persediaan, mesin, aktiva, limbah, dan pengeluaran barang dalam pengawasan Bea & Cukai.'
    ],
    authorities: [
      'Penyempurnaan sistem kerja operasional (sepengetahuan Direktur).',
      'Penerapan kewenangan ketenagakerjaan (Teguran, Rolling, Demosi, Promosi, Mutasi keluar divisi) sesuai SK Perusahaan No: 01/AS/DRK/BKR/VII/2024.',
      'Persetujuan rotasi kerja / demosi yang diajukan bawahan langsung.',
      'Perintah perbaikan kualitas hasil proses & penyempurnaan sistem penyimpanan gudang.',
      'Perubahan penyempurnaan komposisi tembakau rajang / krosok / cengkeh (komposisi Pruf) sepengetahuan Direktur.',
      'Pengajuan anggaran biaya pengamanan dan operasional divisi.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Bertanggung jawab penuh atas kelancaran total divisi, validitas instruksi kerja, efisiensi bahan, dan pencapaian target output.',
      secondaryResponsibility: 'Ikut memikul tanggung jawab kedua bilamana terjadi kelalaian bawahan akibat lemahnya fungsi pengawasan manajerial.',
      conditions: 'Bila Manajer Ops memberikan perintah kerja salah dan bawahan menjalankannya tanpa memberi pertimbangan: Tanggung jawab Utama = Manajer Operasional, Tanggung jawab Kedua = Kepala Sekup terkait.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Kepala Pengolahan 2 & Mandor',
        focusAreas: ['Throughput pengolahan blend & cengkeh', 'Kesesuaian formula Pruf', 'Pengendalian susut tidak wajar'],
        criticalCheckpoints: ['Log waktu putar molen', 'Keseragaman saos & kadar air', 'Laporan susut antar mesin molen']
      },
      {
        partnerRole: 'Quality Control (QC Blend & Tembakau)',
        focusAreas: ['Standar rasa & profil tembakau', 'Otoritas stop-line / retur bahan reject'],
        criticalCheckpoints: ['Inspeksi awal bahan masuk', 'Inspeksi akhir tembakau blend siap kirim']
      },
      {
        partnerRole: 'Kepala Administrasi 1 & Divisi Akuntansi',
        focusAreas: ['Ketepatan waktu laporan (Deadline 09:00 WIB)', 'Validitas stok opname & BOS', 'Dokumen Bea Cukai CK-5'],
        criticalCheckpoints: ['Selisih timbangan vs BOS', 'Pengawasan barang kena cukai']
      }
    ]
  },
  {
    id: 'ka_pengolahan2',
    title: 'Plt. Kepala Pengolahan 2 (Cengkeh & Blend)',
    incumbentName: 'Andhik Dharmabakti (NIP: BK-PP1-021)',
    department: 'Sekup Pengolahan 2 (Cengkeh & Blend)',
    directSupervisor: 'Manajer Operasional Produksi I',
    subordinates: [
      'Mandor Proses Blend (Ogik Indrawan & Surya Ning Sasi)',
      'Mandor Proses Cengkeh (Indah Nurmala & Doni Irwan Himawan)',
      'Operator & Petugas Lini Pengolahan 2'
    ],
    operationalScope: 'Teknis pengolahan cengkeh rajang, pembuatan larutan saos cengkeh, pencampuran molen tembakau blend, serta pengemasan karung.',
    summary: 'Penanggung jawab operasional sekup pengolahan 2. Mengendalikan formula Pruf, waktu putar molen, nozzle spuyer saos, dan penekanan susut bahan secara komparatif riil.',
    duties: [
      'Penerapan disiplin kerja dan tatib pada sekup pengolahan 2 (cengkeh dan blend).',
      'Pengaturan & pengawasan kerja para Mandor Proses Blend dan Mandor Proses Cengkeh.',
      'Terlibat aktif dalam penyusunan planning kebutuhan tembakau blend berdasar permintaan Divisi Produksi II SKT & SKM.',
      'Pemeriksaan awal bersama mandor atas kualitas bahan baku sebelum masuk proses molen.',
      'Pengawasan operasional molen: urutan formula Pruf, penyemprotan saos casing & top saos, saos larutan cengkeh, dan pengawasan spuyer agar tidak tersumbat.',
      'Pemeriksaan awal hasil blend: kerataan campuran, kerataan saos, kadar air (%) sebelum QC akhir.',
      'Pengendalian kesusutan tembakau blend agar efisien dan pencegahan rekayasa susut antar molen.'
    ],
    authorities: [
      'Perintah retur bahan reject ke gudang jika ditemukan cacat saat penerimaan.',
      'Perintah penimbangan ulang dan penggantian label karung yang salah saat itu juga.',
      'Pemberian teguran kepada mandor dan operator yang tidak mematuhi SOP teknis.',
      'Usulan rotasi dan mutasi personil di sekup pengolahan 2 ke Manajer Operasional.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kualitas fisik blended, kebersihan spuyer molen, akurasi label, dan susut riil proses.',
      secondaryResponsibility: 'Tanggung jawab kedua atas kelalaian mandor proses akibat lemahnya supervisi di lini produksi.',
      conditions: 'Bila memberi instruksi keliru ke mandor dan mandor menjalankan tanpa sanggahan: Kepala Pengolahan = Utama, Mandor = Kedua.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Kepala Gudang Persediaan',
        focusAreas: ['Serah terima bahan rajang & blend jadi', 'Kesesuaian timbangan vs surat jalan'],
        criticalCheckpoints: ['Slip timbangan serah terima', 'Verifikasi koli dan identitas jenis tembakau']
      },
      {
        partnerRole: 'Quality Control (QC Blend)',
        focusAreas: ['Standar organoleptik, kadar air, kerataan saos', 'Persetujuan rilis blend'],
        criticalCheckpoints: ['Form inspeksi hasil blend', 'Pemeriksaan sampel drum molen']
      }
    ]
  },
  {
    id: 'ka_admin1',
    title: 'Kepala Administrasi 1',
    incumbentName: 'Agustin Wulandari (NIP: BK-PP1-003)',
    department: 'Sekup Administrasi Divisi Produksi I',
    directSupervisor: 'Manajer Operasional / Manager Akuntansi & Perpajakan 1',
    subordinates: [
      'Administrasi Proses & Gudang Tembakau (Restika & Nikmatul Azizah)',
      'Administrasi Proses & Gudang Cengkeh (Ambar Istiqomah & Adin Tri Wartono)',
      'Administrasi Proses & Gudang Blend (May Yesi Triana & Junita Ayu & Brilliant Rachma)'
    ],
    operationalScope: 'Sentral administrasi data seluruh sekup divisi, validasi program BOS, pelaporan Bea Cukai CK-5, dan rekonsiliasi akuntansi.',
    summary: 'Pengendali validitas seluruh data administrasi operasional. Memastikan laporan harian diserahkan ke Divisi Akuntansi tepat waktu (maksimal 09.00 WIB keesokan harinya) dan zero discrepancy di Program BOS.',
    duties: [
      'Penerapan disiplin dan pengawasan kerja seluruh staf administrasi divisi.',
      'Pemvalidan data sebelum diserahkan ke Divisi Akuntansi maksimal pukul 09.00 WIB keesokan harinya.',
      'Pengawasan penginputan Program BOS: mutasi bahan, pemakaian karung, biaya sparepart, dan surat jalan.',
      'Penganalisaan data kesusutan blend dan rajang yang tidak wajar bersama administrasi proses.',
      'Pemeriksaan kevalidan dokumen pengeluaran dalam pengawasan Bea & Cukai (CK-5).',
      'Pengaturan administrasi stok opname berkala bersama Divisi Akuntansi.'
    ],
    authorities: [
      'Penandatanganan resmi data Laporan Administrasi yang diserahkan ke Divisi Akuntansi.',
      'Perintah crosscheck ulang dan penimbangan ulang jika data fisik berbeda dengan catatan.',
      'Pemberian teguran dan penilaian kinerja berkala kepada seluruh staf administrasi divisi.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kevalidan data BOS, ketepatan waktu lapor max 09:00 WIB, dan analisa anomali data.',
      secondaryResponsibility: 'Tanggung jawab kedua atas perintah kerja administrasi yang dijalankan staf bawahan.',
      conditions: 'Bila terjadi keterlambatan laporan ke Akuntansi atau salah input BOS: Tanggung jawab Utama = Kepala Administrasi.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Divisi Akuntansi & Perpajakan',
        focusAreas: ['Laporan harian pukul 09:00 WIB', 'Hasil stok opname', 'Kesesuaian CK-5'],
        criticalCheckpoints: ['Buku ekspedisi tanda terima laporan', 'Rekonsiliasi saldo buku vs fisik']
      }
    ]
  },
  {
    id: 'ka_gudang_pers1',
    title: 'Plt. Kepala Gudang (Kecil) Persediaan',
    incumbentName: 'Yulia Wardana (NIP: BK-PP1-007) / Denny Karisma / Suyanto',
    department: 'Sekup Gudang (Kecil) Persediaan',
    directSupervisor: 'Manajer Operasional Produksi I',
    subordinates: [
      'Mandor Gudang Tembakau & Krosok (Teguh Andrias)',
      'Staf Gudang Cengkeh & Blend'
    ],
    operationalScope: 'Penyimpanan, penimbangan, pengamanan persediaan bahan baku (Tembakau, Krosok, Cengkeh, Saos Jadi, Tembakau Blend), sparepart, dan karung.',
    summary: 'Penanggung jawab fisik persediaan gudang kecil. Memastikan 100% akurasi timbangan masuk/keluar, keutuhan stok Bea & Cukai, dan keteraturan penataan FIFO.',
    duties: [
      'Penerapan disiplin dan pengawasan kerja mandor dan staf gudang kecil.',
      'Pemeriksaan awal kuantitas dan kualitas bahan baku yang diterima bersama mandor.',
      'Pengamanan fisik stok bahan dari kerusakan, penyusutan abnormal, atau kehilangan.',
      'Pengawasan pengiriman bahan ke lini proses disertai penimbangan presisi.',
      'Pengawasan penerimaan hasil blend jadi dari proses dan penataannya di gudang.',
      'Penyelenggaraan stok opname periodik bersama Kepala Administrasi dan Akuntansi.'
    ],
    authorities: [
      'Perintah retur bahan reject ke unit asal setelah pemeriksaan QC (sepengetahuan Manajer Ops).',
      'Perintah penimbangan ulang jika terdapat selisih fisik vs surat jalan.',
      'Pengajuan pengadaan karung dan bahan pembantu ke sekup administrasi.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas fisik kuantitas barang, penataan gudang, dan zero selisih timbangan.',
      secondaryResponsibility: 'Tanggung jawab kedua dipegang oleh Manajer Operasional bila pengawasan manajerial lemah.',
      conditions: 'Bila terjadi selisih stok tanpa bukti sah: Tanggung jawab Utama = Kepala Gudang.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Kepala Administrasi 1',
        focusAreas: ['Pencocokan fisik kartu stok vs Program BOS', 'Jadwal stok opname'],
        criticalCheckpoints: ['Rekonsiliasi harian cut-off 09:00 WIB', 'Berita acara selisih timbangan']
      }
    ]
  },
  {
    id: 'mandor_blend',
    title: 'Mandor Proses Blend',
    incumbentName: 'Ogik Indrawan (NIP: BK-PP1-004) & Surya Ning Sasi (NIP: BK-PP1-020)',
    department: 'Sekup Pengolahan Blend',
    directSupervisor: 'Plt. Kepala Pengolahan 2',
    subordinates: ['Operator Molen & Penimbang Blend'],
    operationalScope: 'Lantai produksi peracikan tembakau blend: pemuatan molen, penyemprotan saos, pencampuran, penimbangan hasil, dan pelabelan karung.',
    summary: 'Komandan lini peracikan tembakau blend. Mengawal durasi putaran molen, kebersihan spuyer saos, homogenitas campuran, dan akurasi label karung.',
    duties: [
      'Penerapan disiplin kerja dan K3 operator molen dan timbang.',
      'Pemeriksaan rutin nozzle spuyer molen agar semprotan saos merata dan tidak tersumbat.',
      'Penerapan jangka waktu putar molen sesuai ketetapan SOP per jenis tembakau.',
      'Pemeriksaan awal hasil blend: kerataan campuran, kerataan saos, dan kadar air sebelum tim QC.',
      'Pengawasan penimbangan hasil blend dan pelabelan lengkap pada karung (Nama jenis, tanggal, berat netto).',
      'Bersama atasan melakukan penekanan kesusutan blend secara efisien dan mencegah susut seragam fiktif.'
    ],
    authorities: [
      'Pemberian teguran langsung kepada operator yang tidak mematuhi SOP waktu putar dan spuyer.',
      'Perintah penimbangan ulang dan penggantian label karung yang cacat saat itu juga.',
      'Pelaksana fisik retur bahan baku reject ke gudang persediaan atas rekomendasi QC.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kepatuhan waktu putar molen, kebersihan spuyer saos, dan akurasi timbang karung.',
      secondaryResponsibility: 'Tanggung jawab kedua atas perintah yang diterima dari Kepala Pengolahan.',
      conditions: 'Bila memberi perintah keliru ke operator: Mandor = Utama, Operator = Kedua.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'QC Blend',
        focusAreas: ['Sampling kadar air & kerataan saos', 'Verifikasi label karung'],
        criticalCheckpoints: ['Form QC release per batch molen']
      }
    ]
  },
  {
    id: 'mandor_tembakau',
    title: 'Mandor Proses Tembakau',
    incumbentName: 'Yayan Rudianto (NIP: BK-PP1-014) & Adi Tri Vianto (NIP: BK-PP1-023)',
    department: 'Sekup Pengolahan Tembakau & Krosok',
    directSupervisor: 'Manajer Operasional Produksi I',
    subordinates: ['Operator Mesin Rajang KT 2 & RC 4'],
    operationalScope: 'Lantai perajangan tembakau & krosok: penjemuran tembakau bergula, pembersihan gagang krosok, perajangan mesin, dan penimbangan hasil.',
    summary: 'Pengendali operasional unit tembakau dan krosok. Memastikan hasil rajang halus merata, susut perajangan terkontrol, dan tembakau bersih dari gagang.',
    duties: [
      'Pengaturan pekerja dalam penjemuran tembakau bergula dan penjumputan gagang krosok.',
      'Pengawasan mesin rajang tembakau (KT-2 dan RC-4) agar hasil rajangan memenuhi spesifikasi.',
      'Pencatatan berat tembakau sebelum dan sesudah dirajang untuk memantau rasio susut harian.',
      'Pengamanan persediaan tembakau rajang sebelum ditransfer ke gudang blend.'
    ],
    authorities: [
      'Perintah penjemuran ulang jika tembakau masih bergula atau lembab.',
      'Perintah penjumputan ulang jika masih ditemukan gagang krosok yang lolos.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kebersihan tembakau rajang dari gagang dan susut rajang riil.',
      secondaryResponsibility: 'Tanggung jawab kedua atas arahan manajerial operasional.',
      conditions: 'Tembakau kotor atau gagang lolos ke molen: Mandor Tembakau = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'QC Tembakau',
        focusAreas: ['Uji kebersihan gagang & kelembaban tembakau rajang'],
        criticalCheckpoints: ['Form QC pass rajang tembakau']
      }
    ]
  },
  {
    id: 'mandor_cengkeh',
    title: 'Mandor Proses Cengkeh',
    incumbentName: 'Indah Nurmala (NIP: BK-PP1-015) & Doni Irwan Himawan (NIP: BK-PP1-026)',
    department: 'Sekup Pengolahan Cengkeh',
    directSupervisor: 'Plt. Kepala Pengolahan 2',
    subordinates: ['Operator Rajang Cengkeh & Larutan Saos'],
    operationalScope: 'Perajangan cengkeh, pengayakan cengkeh rajang, pembuatan saos larutan cengkeh, dan transfer ke gudang persediaan blend.',
    summary: 'Pengendali lini proses cengkeh. Memastikan cengkeh rajang bersih, saos larutan cengkeh terlarut sempurna, dan susut proses cengkeh terkendali.',
    duties: [
      'Pengawasan perajangan cengkeh dan pemisahan kotoran/serbuk cengkeh.',
      'Pengawasan pembuatan saos larutan cengkeh sesuai formula R&D.',
      'Pencatatan timbangan masuk dan keluar cengkeh serta analisis susut harian.',
      'Serah terima cengkeh rajang ke Gudang Persediaan Blend disertai surat jalan intern.'
    ],
    authorities: [
      'Penolakan bahan baku cengkeh yang berjamur atau berbau apek.',
      'Pemberian teguran kepada operator rajang cengkeh atas kelalaian mesin.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kualitas fisik cengkeh rajang dan homogenitas saos larutan cengkeh.',
      secondaryResponsibility: 'Tanggung jawab kedua atas pengawasan manajerial.',
      conditions: 'Cengkeh gosong atau tidak rata: Mandor Cengkeh = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Mandor Gudang Blend',
        focusAreas: ['Serah terima cengkeh rajang & timbangan presisi'],
        criticalCheckpoints: ['Slip timbangan serah terima cengkeh']
      }
    ]
  },
  {
    id: 'mandor_gudang_tbk',
    title: 'Mandor Gudang (Kecil) Tembakau & Krosok',
    incumbentName: 'Teguh Andrias (NIP: BK-PP1-005)',
    department: 'Sekup Gudang Tembakau & Krosok',
    directSupervisor: 'Plt. Kepala Gudang Persediaan',
    subordinates: ['Petugas Timbang & Muat Gudang Tembakau'],
    operationalScope: 'Penerimaan tembakau/krosok bale, penimbangan masuk, penataan tumpukan, dan pengeluaran ke lini rajang.',
    summary: 'Pengawas fisik gudang tembakau & krosok. Menjamin akurasi timbangan bale, keteraturan penataan gudang, dan kebersihan lingkungan simpan.',
    duties: [
      'Pemeriksaan fisik bahan yang diterima (jumlah bale dan berat = surat jalan).',
      'Penimbangan ulang dan pencocokan identitas jenis tembakau/krosok.',
      'Pengeluaran bahan ke unit rajang dengan penimbangan akurat.',
      'Pelaksanaan fisik stok opname berkala bersama staf administrasi.'
    ],
    authorities: [
      'Penolakan penerimaan bale yang basah atau rusak kemasannya.',
      'Perintah timbang ulang jika terjadi kecurigaan selisih timbangan.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas fisik stok tembakau & krosok serta zero selisih timbangan.',
      secondaryResponsibility: 'Tanggung jawab kedua atas perintah atasan.',
      conditions: 'Bale tembakau rusak/hilang: Mandor Gudang Tembakau = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Administrasi Tembakau',
        focusAreas: ['Pencocokan kartu stok fisik vs sistem BOS'],
        criticalCheckpoints: ['Paraf bersama pada lembar penerimaan']
      }
    ]
  },
  {
    id: 'qc_staff',
    title: 'Quality Control (Blend & Tembakau)',
    incumbentName: 'Hendri Irawan (NIP: BK-PP1-016), Bagus Permana, Dedik Anwar, Matsukri, Teguh Lutfiadi',
    department: 'Sekup Quality Control (Divisi Produksi I)',
    directSupervisor: 'Manajer Operasional Produksi I',
    subordinates: [],
    operationalScope: 'Pengujian mutu organoleptik, kadar air (moisture analyzer), homogenitas saos, dan verifikasi label karung seluruh bahan divisi.',
    summary: 'Benteng pertahanan mutu Divisi Produksi I. Berwenang meloloskan atau mereject bahan baku dan produk jadi, memastikan kadar air stabil, dan zero downstream complaint.',
    duties: [
      'Pemeriksaan akhir mutu bahan baku masuk (Tembakau, Krosok, Cengkeh, Saos) di gudang.',
      'Uji laboratorium kadar air tembakau blend per batch molen (toleransi 13.0% - 14.5%).',
      'Pengujian organoleptik kerataan saos casing dan top saos pada drum molen.',
      'Verifikasi akhir label karung (Nama Blend, Tanggal, Berat Netto) vs isi fisik tembakau.',
      'Penerbitan form retur seketika jika ditemukan bahan tidak memenuhi standar mutu.'
    ],
    authorities: [
      'Instruksi penolakan/retur bahan baku reject ke unit asal (sepengetahuan Manajer Ops).',
      'Penghentian sementara putaran molen jika spuyer mampet atau semprotan saos tidak rata.',
      'Permintaan penggantian label karung yang salah sebelum karung masuk gudang.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kelolosan bahan reject atau penyimpangan kadar air tembakau blend.',
      secondaryResponsibility: 'Tanggung jawab kedua atas pengawasan proses blending.',
      conditions: 'Bahan cacat lolos ke hilir: QC = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Mandor Blend & Mandor Tembakau',
        focusAreas: ['Uji kadar air cepat & homogenitas saos'],
        criticalCheckpoints: ['Form QC Pass per batch molen']
      }
    ]
  },
  {
    id: 'admin_blend',
    title: 'Administrasi Proses & Gudang Blend',
    incumbentName: 'May Yesi Triana Putri (NIP: BK-PP1-019), Junita Ayu, Brilliant Rachma Shakira',
    department: 'Sekup Administrasi Blend',
    directSupervisor: 'Kepala Administrasi 1',
    subordinates: [],
    operationalScope: 'Pencatatan penimbangan awal-akhir blend, penginputan ke Program BOS, pembuatan Surat Jalan, Daftar Timbang, dan dokumen CK-5 Bea Cukai.',
    summary: 'Staf administrasi lini blend. Bertanggung jawab atas input BOS tepat waktu sebelum jam 09.00 WIB, analisa susut per molen, dan keabsahan dokumen pengeluaran tembakau.',
    duties: [
      'Pencatatan hasil penimbangan dari awal proses hingga akhir proses blend.',
      'Penginputan data harian hasil blend ke Program BOS tanpa salah entri.',
      'Penganalisaan data kesusutan blend tiap mesin molen untuk mencegah data susut seragam palsu.',
      'Pembuatan Surat Jalan, Daftar Timbang, dan dokumen CK-5 Bea Cukai untuk pengiriman ke Produksi II SKT/SKM.',
      'Pencatatan pemakaian karung, benang jahit, dan kertas keplek.'
    ],
    authorities: [
      'Permintaan penimbangan ulang kepada mandor jika catatan fisik meragukan.',
      'Permintaan penggantian label jika ditemukan kekeliruan varian blend.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas keakuratan data BOS dan keabsahan dokumen CK-5 Bea Cukai.',
      secondaryResponsibility: 'Tanggung jawab kedua bersama mandor atas tertib administrasi.',
      conditions: 'Salah input bobot di BOS atau keterlambatan laporan: Admin Blend = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Kepala Administrasi 1 & Akuntansi',
        focusAreas: ['Penyerahan data sebelum 09:00 WIB', 'Dokumen CK-5 sah'],
        criticalCheckpoints: ['Buku tanda terima laporan harian']
      }
    ]
  },
  {
    id: 'admin_cengkeh',
    title: 'Administrasi Proses & Gudang Cengkeh',
    incumbentName: 'Ambar Istiqomah (NIP: BK-PP1-006) & Adin Tri Wartono (NIP: BK-PP1-025)',
    department: 'Sekup Administrasi Cengkeh',
    directSupervisor: 'Kepala Administrasi 1',
    subordinates: [],
    operationalScope: 'Pencatatan transaksi bahan baku cengkeh masuk, hasil perajangan cengkeh, mutasi saos cengkeh, dan penginputan Program BOS.',
    summary: 'Staf administrasi lini cengkeh. Mengelola data mutasi cengkeh rajang, susut proses cengkeh, serta sinkronisasi persediaan cengkeh.',
    duties: [
      'Pencatatan data penerimaan cengkeh mentah dari Unit Cengkeh luar.',
      'Pencatatan hasil perajangan cengkeh dan penghitungan susut proses cengkeh.',
      'Penginputan data mutasi persediaan cengkeh ke Program BOS tepat waktu.',
      'Pencocokan fisik cengkeh dengan kartu stok bersama mandor cengkeh.'
    ],
    authorities: [
      'Konfirmasi ke unit pengirim jika timbangan cengkeh berbeda dengan surat jalan.',
      'Pemberian masukan susut cengkeh kepada Kepala Administrasi 1.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas validitas data transfer cengkeh dan entri BOS.',
      secondaryResponsibility: 'Tanggung jawab kedua bersama mandor cengkeh.',
      conditions: 'Salah catat tonase cengkeh: Admin Cengkeh = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Mandor Cengkeh & Gudang Blend',
        focusAreas: ['Rekonsiliasi serah terima cengkeh rajang'],
        criticalCheckpoints: ['Surat jalan intern transfer cengkeh']
      }
    ]
  },
  {
    id: 'admin_tembakau',
    title: 'Administrasi Proses & Gudang Tembakau',
    incumbentName: 'Restika (NIP: BK-PP1-002), Nikmatul Azizah (NIP: BK-PP1-032), Windi Qiroatul Afrilia',
    department: 'Sekup Administrasi Tembakau & Krosok',
    directSupervisor: 'Kepala Administrasi 1',
    subordinates: [],
    operationalScope: 'Pencatatan penerimaan tembakau/krosok bale, data penjemuran/penjumputan, hasil rajang tembakau, dan input BOS.',
    summary: 'Staf administrasi lini tembakau & krosok. Mengawal pencatatan bale masuk, rekap susut mesin rajang, dan dokumen perpindahan bahan ke gudang blend.',
    duties: [
      'Pencatatan jumlah dan berat tembakau bale yang diterima di gudang tembakau.',
      'Pencatatan tembakau yang dikeluarkan untuk penjemuran atau penjumputan gagang.',
      'Penginputan data mutasi tembakau rajang ke Program BOS sebelum jam 09.00 WIB.',
      'Penyusunan berkas stok opname fisik tembakau & krosok.'
    ],
    authorities: [
      'Permintaan penimbangan ulang bale tembakau jika ada perbedaan angka.',
      'Konfirmasi selisih berat ke unit asal tembakau.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kevalidan kartu stok tembakau bale & rajang di BOS.',
      secondaryResponsibility: 'Tanggung jawab kedua atas tertib administrasi gudang tembakau.',
      conditions: 'Selisih stok tembakau tanpa Berita Acara: Admin Tembakau = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Mandor Tembakau & Kepala Administrasi 1',
        focusAreas: ['Rekap susut rajang tembakau harian'],
        criticalCheckpoints: ['Form timbangan tembakau masuk/keluar']
      }
    ]
  },
  {
    id: 'mekanik_operator',
    title: 'Mekanik & Operator Mesin Produksi',
    incumbentName: 'Heri Pribadi (Mekanik), Edward Antonius (KT 2), Nanang W & Dimas A (Primery), Ari K (RC 4), Santoso (Boiler)',
    department: 'Sekup Mesin & Utilitas Produksi I',
    directSupervisor: 'Manajer Operasional Produksi I',
    subordinates: [],
    operationalScope: 'Pemeliharaan preventif dan operasional mesin utama: Molen Blend, Mesin Rajang KT-2 & RC-4, Mesin Primery, dan Boiler Steam saos.',
    summary: 'Punggawa teknis kelancaran mesin dan utilitas Divisi Produksi I. Menjamin zero breakdown, tekanan steam boiler stabil, dan ketajaman pisau mesin rajang.',
    duties: [
      'Pelaksanaan perawatan preventif rutin seluruh mesin produksi dan motor molen.',
      'Pengawasan tekanan dan pasokan uap Boiler Steam untuk proses pemanasan saos.',
      'Penggantian dan pengasahan pisau mesin rajang tembakau KT-2 dan RC-4.',
      'Pemeriksaan rutin nozzle spuyer saos dan pompa bersama mandor.',
      'Pengajuan kebutuhan sparepart mesin yang berada di buffer stok ke administrasi.'
    ],
    authorities: [
      'Penghentian darurat mesin jika terdeteksi getaran abnormal atau bahaya keselamatan.',
      'Pengajuan perbaikan suku cadang ke Divisi Keuangan melalui administrasi.'
    ],
    dualAccountability: {
      primaryResponsibility: 'Tanggung jawab utama atas kesiapan operasi mesin, zero breakdown tak terduga, dan keselamatan K3 mesin.',
      secondaryResponsibility: 'Tanggung jawab kedua bersama mandor lini operasi.',
      conditions: 'Mesin macet karena kelalaian pelumasan/maintenance: Mekanik = Tanggung Jawab Utama.'
    },
    interDepartmentRelations: [
      {
        partnerRole: 'Mandor Blend & Mandor Tembakau',
        focusAreas: ['Kesiapan mesin sebelum jam shift dimulai'],
        criticalCheckpoints: ['Checklist harian preventive maintenance']
      }
    ]
  }
];
