export interface HrStaffRecord {
  id: number;
  nip: string;
  nama: string;
  status: 'TETAP' | 'PKWT 3' | 'PKWT 4';
  jabatan: string;
  level: string;
  sekup: 'Operasional' | 'Administrasi';
  statusAktif: 'Aktif';
  email: string;
  telp: string;
  mappedRoleId: 
    | 'mgr_ops'
    | 'ka_pengolahan2'
    | 'ka_admin1'
    | 'ka_gudang_pers1'
    | 'mandor_blend'
    | 'mandor_tembakau'
    | 'mandor_cengkeh'
    | 'mandor_gudang_tbk'
    | 'qc_staff'
    | 'admin_blend'
    | 'admin_cengkeh'
    | 'admin_tembakau'
    | 'mekanik_operator';
}

export const HR_STAFF_MASTER_DATA: HrStaffRecord[] = [
  { id: 1, nip: 'BK-PP1-001', nama: 'Lalu Mahendra Ali Akbar', status: 'TETAP', jabatan: 'Manajer Operasional Produksi I', level: '25 - (B)', sekup: 'Operasional', statusAktif: 'Aktif', email: 'loehendra@gmail.com', telp: '81999507119', mappedRoleId: 'mgr_ops' },
  { id: 2, nip: 'BK-PP1-002', nama: 'Restika', status: 'TETAP', jabatan: 'Administrasi Proses Tembakau & Krosok', level: '5 -', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'Charesty660@gmail.com', telp: '083833851161', mappedRoleId: 'admin_tembakau' },
  { id: 3, nip: 'BK-PP1-003', nama: 'Agustin Wulandari', status: 'TETAP', jabatan: 'Kepala Administrasi 1', level: '15 A', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'chuecakecookies@gmail.com', telp: '088230373946', mappedRoleId: 'ka_admin1' },
  { id: 4, nip: 'BK-PP1-004', nama: 'Ogik Indrawan', status: 'PKWT 4', jabatan: 'Mandor Proses Blend', level: '5 -', sekup: 'Operasional', statusAktif: 'Aktif', email: 'ogikindra78@gmail.com', telp: '89668871268', mappedRoleId: 'mandor_blend' },
  { id: 5, nip: 'BK-PP1-005', nama: 'Teguh Andrias', status: 'TETAP', jabatan: 'Mandor Gudang (Kecil) Tembakau & Krosok', level: '5 -', sekup: 'Operasional', statusAktif: 'Aktif', email: 'teguhandreas007@gmail.com', telp: '085736512387', mappedRoleId: 'mandor_gudang_tbk' },
  { id: 6, nip: 'BK-PP1-006', nama: 'Ambar Istiqomah', status: 'TETAP', jabatan: 'Administrasi Proses Cengkeh', level: '7 B', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'Ambaristi71@gmail.com', telp: '081217183042', mappedRoleId: 'admin_cengkeh' },
  { id: 7, nip: 'BK-PP1-007', nama: 'Yulia Wardana', status: 'TETAP', jabatan: 'Plt. Kepala Gudang (Kecil) Persediaan 1', level: '9 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'Yuliawardana1981@gmail.com', telp: '81238883662', mappedRoleId: 'ka_gudang_pers1' },
  { id: 8, nip: 'BK-PP1-008', nama: 'Edward Antonius Effendy', status: 'PKWT 3', jabatan: 'Operator Mesin KT 2', level: '5 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'edwardeffendy469@gmail.com', telp: '85234698761', mappedRoleId: 'mekanik_operator' },
  { id: 9, nip: 'BK-PP1-009', nama: 'Bagus Permana', status: 'TETAP', jabatan: 'Quality Control Tembakau', level: '5 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'bagusning@gmail.com', telp: '085234341500', mappedRoleId: 'qc_staff' },
  { id: 10, nip: 'BK-PP1-010', nama: 'Nanang Widiyatmoko', status: 'TETAP', jabatan: 'Operator Mesin Primery', level: '5 B', sekup: 'Operasional', statusAktif: 'Aktif', email: 'nanang.bembi@gmail.com', telp: '089602437333', mappedRoleId: 'mekanik_operator' },
  { id: 11, nip: 'BK-PP1-011', nama: 'Ari Kurniawan', status: 'TETAP', jabatan: 'Operator RC 4', level: '5 B', sekup: 'Operasional', statusAktif: 'Aktif', email: 'ari02111986@gmail.com', telp: '085606355550', mappedRoleId: 'mekanik_operator' },
  { id: 12, nip: 'BK-PP1-012', nama: 'Dimas Ardiansyah', status: 'TETAP', jabatan: 'Operator Mesin Primery', level: '3 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'dimaskaryabubut@gmail.com', telp: '085715451699', mappedRoleId: 'mekanik_operator' },
  { id: 13, nip: 'BK-PP1-013', nama: 'Santoso Sapto Atmojo', status: 'TETAP', jabatan: 'Operator Mesin Boiler', level: '7 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'mojova7@gmail.com', telp: '081232014618', mappedRoleId: 'mekanik_operator' },
  { id: 14, nip: 'BK-PP1-014', nama: 'Yayan Rudianto', status: 'TETAP', jabatan: 'Mandor Proses Tembakau', level: '9 B', sekup: 'Operasional', statusAktif: 'Aktif', email: 'yeyevandalism87@gmail.com', telp: '082244535900', mappedRoleId: 'mandor_tembakau' },
  { id: 15, nip: 'BK-PP1-015', nama: 'Indah Nurmala', status: 'TETAP', jabatan: 'Plt. Kepala Mandor Proses Cengkeh', level: '9 -', sekup: 'Operasional', statusAktif: 'Aktif', email: 'indahnurmala189@gmail.com', telp: '081231090889', mappedRoleId: 'mandor_cengkeh' },
  { id: 16, nip: 'BK-PP1-016', nama: 'Hendri Irawan', status: 'TETAP', jabatan: 'Quality Control Blend', level: '5 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'bedrylizer@gmail.com', telp: '081216412545', mappedRoleId: 'qc_staff' },
  { id: 17, nip: 'BK-PP1-017', nama: 'Dedik Anwar', status: 'TETAP', jabatan: 'Quality Control Tembakau', level: '5 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'dedikanwar15@gmail.com', telp: '085100394715', mappedRoleId: 'qc_staff' },
  { id: 18, nip: 'BK-PP1-018', nama: 'Teguh Lutfiadi', status: 'TETAP', jabatan: 'Quality Control Tembakau', level: '3 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'teguh.lutfiadi@gmail.com', telp: '8975737711', mappedRoleId: 'qc_staff' },
  { id: 19, nip: 'BK-PP1-019', nama: 'May Yesi Triana Putri', status: 'PKWT 4', jabatan: 'Adminsitrasi Proses Blend', level: '5 A', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'mayyesitriana09@gmail.com', telp: '85738906063', mappedRoleId: 'admin_blend' },
  { id: 20, nip: 'BK-PP1-020', nama: 'Surya Ning Sasi', status: 'PKWT 4', jabatan: 'Mandor Proses Blend', level: '7 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'sasisuryaningsasi@gmail.com', telp: '89517588816', mappedRoleId: 'mandor_blend' },
  { id: 21, nip: 'BK-PP1-021', nama: 'Andhik Dharmabakti', status: 'PKWT 4', jabatan: 'Plt. Kepala Pengolahan 2 (Cengkeh & Blend)', level: '15 -', sekup: 'Operasional', statusAktif: 'Aktif', email: 'andhik.dharmabakti.nenoharan@gmail.com', telp: '81256564657', mappedRoleId: 'ka_pengolahan2' },
  { id: 22, nip: 'BK-PP1-022', nama: 'Windi Qiroatul Afrilia', status: 'PKWT 4', jabatan: 'Administrasi Gudang (Kecil) Persediaan Tembakau & Krosok', level: '5 / A', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'afriliawindy0@gmail.com', telp: '83890916190', mappedRoleId: 'admin_tembakau' },
  { id: 23, nip: 'BK-PP1-023', nama: 'Adi Tri Vianto', status: 'TETAP', jabatan: 'Mandor Proses Tembakau', level: '7 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'aditrivianto@gmail.com', telp: '82257227650', mappedRoleId: 'mandor_tembakau' },
  { id: 24, nip: 'BK-PP1-024', nama: 'Suyanto', status: 'TETAP', jabatan: 'Plt. Kepala Gudang (Kecil) Persediaan 3', level: '9 -', sekup: 'Operasional', statusAktif: 'Aktif', email: 'calistaayufadila@gmail.com', telp: '087859738475', mappedRoleId: 'ka_gudang_pers1' },
  { id: 25, nip: 'BK-PP1-025', nama: 'Adin Tri Wartono', status: 'PKWT 4', jabatan: 'Administrasi Gudang (Kecil) Cengkeh', level: '3 A', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'adintri1264@gmail.com', telp: '816505687', mappedRoleId: 'admin_cengkeh' },
  { id: 26, nip: 'BK-PP1-026', nama: 'Doni Irwan Himawan', status: 'TETAP', jabatan: 'Mandor Proses Cengkeh', level: '5 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'pakdoni543@gmail.com', telp: '082139808680', mappedRoleId: 'mandor_cengkeh' },
  { id: 27, nip: 'BK-PP1-027', nama: 'Matsukri', status: 'TETAP', jabatan: 'Quality Control Tembakau', level: '9 -', sekup: 'Operasional', statusAktif: 'Aktif', email: 'matsukri153@gmail.com', telp: '081944946991', mappedRoleId: 'qc_staff' },
  { id: 28, nip: 'BK-PP1-028', nama: 'Heri Pribadi', status: 'TETAP', jabatan: 'Mekanik', level: '9 A', sekup: 'Operasional', statusAktif: 'Aktif', email: 'rafiulharis12@gmail.com', telp: '085767628441', mappedRoleId: 'mekanik_operator' },
  { id: 29, nip: 'BK-PP1-029', nama: 'Denny Karisma Gianto', status: 'PKWT 4', jabatan: 'Plt. Kepala Gudang (Kecil) Tembakau & Krosok', level: '9 -', sekup: 'Operasional', statusAktif: 'Aktif', email: 'karisma.denny@yahoo.co.id', telp: '81229133609', mappedRoleId: 'ka_gudang_pers1' },
  { id: 30, nip: 'BK-PP1-030', nama: 'Junita Ayu', status: 'PKWT 4', jabatan: 'Adminsitrasi Proses Blend', level: '5 -', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'junitariesandi@gmail.com', telp: '81333118216', mappedRoleId: 'admin_blend' },
  { id: 31, nip: 'BK-PP1-031', nama: 'Brilliant Rachma Shakira', status: 'PKWT 4', jabatan: 'Administrasi Gudang (Kecil) Blend', level: '7 B', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'brilliantrs33@gmail.com', telp: '89516209408', mappedRoleId: 'admin_blend' },
  { id: 32, nip: 'BK-PP1-032', nama: 'Nikmatul Azizah', status: 'TETAP', jabatan: 'Administrasi Proses Tembakau & Krosok', level: '3 -', sekup: 'Administrasi', statusAktif: 'Aktif', email: 'nikmatul342@gmail.com', telp: '08567033576', mappedRoleId: 'admin_tembakau' }
];
