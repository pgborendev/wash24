export default class ShopModel {

  id:string;
  name: string;
  phone: string;
  email: string;
  address: string;
  bakongId: string;
  logo: File | string | null;

  constructor(data: Partial<ShopModel> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.address = data.address || '';
    this.bakongId = data.bakongId || '';
    this.logo = data.logo || null;
  }

  public toFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('phone', this.phone);
    formData.append('email', this.email);
    formData.append('bakongId', this.bakongId);
    formData.append('address', this.address);
  
    if (this.logo) {
      if (typeof this.logo === 'string' && this.logo.startsWith('data:')) {
        const blob = this.dataURLtoBlob(this.logo);
        formData.append('logo', blob, 'shop-logo.jpg');
      } else if (this.logo instanceof File) {
        formData.append('logo', this.logo);
      }
    }
    
    return formData;
  }

  public dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    return new Blob([u8arr], { type: mime });
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.name.trim()) errors.push('Name is required');
    if (!this.phone.trim()) errors.push('Phone is required');
    if (!this.email.trim()) errors.push('Email is required');
    if (!this.address.trim()) errors.push('Address is required');
    if (!this.bakongId.trim()) errors.push('BakongId is required');
    if (!this.logo) errors.push('Logo is required');
    return errors;
  }
}