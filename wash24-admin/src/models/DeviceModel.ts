export default class DeviceModel {

  id:string;
  name: string;
  
  constructor(data: Partial<DeviceModel> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
  }

  public toFormData(): FormData {
    const formData = new FormData();
    return formData;
  }

  
  validate(): string[] {
    const errors: string[] = [];
    return errors;
  }
}