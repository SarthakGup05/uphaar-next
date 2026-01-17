
import { create } from 'zustand';

export interface HeroFormData {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  align: 'left' | 'center' | 'right';
  isActive: boolean;
  order: number;
}

interface HeroStore {
  formData: HeroFormData;
  isLoading: boolean;
  isUploading: boolean;
  setField: (field: keyof HeroFormData, value: any) => void;
  setFormData: (data: Partial<HeroFormData>) => void;
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  resetForm: () => void;
}

const initialFormData: HeroFormData = {
  title: '',
  subtitle: '',
  image: '', // Will be mapped to 'image' in DB
  cta: 'Shop Now',
  align: 'center',
  isActive: true,
  order: 0,
};

export const useHeroStore = create<HeroStore>((set) => ({
  formData: initialFormData,
  isLoading: false,
  isUploading: false,
  setField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setUploading: (uploading) => set({ isUploading: uploading }),
  resetForm: () => set({ formData: initialFormData }),
}));
