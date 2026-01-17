
import { create } from 'zustand';

export interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  heroImageUrl: string;
}

interface ProductStore {
  formData: ProductFormData;
  isLoading: boolean;
  isUploading: boolean;
  setField: (field: keyof ProductFormData, value: any) => void;
  setFormData: (data: Partial<ProductFormData>) => void;
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  resetForm: () => void;
}

const initialFormData: ProductFormData = {
  title: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: '',
  heroImageUrl: '',
};

export const useProductStore = create<ProductStore>((set) => ({
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
