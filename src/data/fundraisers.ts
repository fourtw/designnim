import type { Fundraiser } from '../types'

export const initialFundraisers: Fundraiser[] = [
  {
    id: 'harapan',
    name: 'Panti Jompo Harapan',
    location: 'Bandung, Jawa Barat',
    description:
      'Fokus pada perawatan medis rutin dan rehabilitasi fisik lansia dengan kebutuhan obat-obatan mingguan.',
    targetAmount: 10,
    raisedAmount: 4,
    targetToken: 'MATIC',
    impactFocus: 'Obat-obatan & alat kesehatan',
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format',
    walletAddress: '0x1234567890aBCdEf1234567890abcdef12345678',
  },
  {
    id: 'sejahtera',
    name: 'Rumah Lansia Sejahtera',
    location: 'Yogyakarta, DI Yogyakarta',
    description:
      'Menggalang dana untuk program nutrisi dan dapur sehat agar lansia mendapatkan menu seimbang harian.',
    targetAmount: 500,
    raisedAmount: 100,
    targetToken: 'USDT',
    impactFocus: 'Nutrisi & dapur sehat',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format',
    walletAddress: '0x234567890abCdef1234567890abCDef123456789',
  },
  {
    id: 'bahagia',
    name: 'Panti Werdha Bahagia',
    location: 'Denpasar, Bali',
    description:
      'Renovasi ruang aktivitas lansia untuk kegiatan seni, musik, dan terapi kognitif agar mereka tetap aktif.',
    targetAmount: 250,
    raisedAmount: 90,
    targetToken: 'USDT',
    impactFocus: 'Renovasi & kegiatan sosial',
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format',
    walletAddress: '0x34567890AbcdEF1234567890abCDef1234567890',
  },
  {
    id: 'nusantara',
    name: 'Nusantara Care Home',
    location: 'Makassar, Sulawesi Selatan',
    description:
      'Pengadaan kendaraan jemput antar lansia dan perbaikan aksesibilitas kursi roda di seluruh area panti.',
    targetAmount: 30,
    raisedAmount: 12,
    targetToken: 'MATIC',
    impactFocus: 'Mobilitas & aksesibilitas',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format',
    walletAddress: '0x4567890Abcdef1234567890aBCDef1234567890a',
  },
] satisfies Fundraiser[]


