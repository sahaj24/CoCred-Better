
export type UserProfile = {
  name: string;
  email: string;
  dob: string; // ISO date string
  aaparId: string;
  imageUrl: string; // data URL
  signatureUrl:string; // data URL
  password?: string;
};

export type StoredFile = {
  id: string;
  name: string;
  date: string;
  file: File;
  status: 'pending' | 'approved' | 'rejected';
  signature: string | null;
  qrCode: string | null;
  eventKey: string | null;
};

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  date: string;
};

export type AppEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  key: string;
  organizer: string;
  devopsLink: string;
};
