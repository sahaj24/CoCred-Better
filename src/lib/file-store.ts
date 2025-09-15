
"use client";

import type { UserProfile, StoredFile, Notification, AppEvent } from "@/lib/types";

// This is a simple in-memory store for files with session management.

type UserFileStore = {
  certificates: StoredFile[];
  internship: StoredFile[];
  gradesheets: StoredFile[];
  projects: StoredFile[];
  notifications: Notification[];
};

let fileStore: { [aaparId: string]: UserFileStore } = {};
let userProfiles: { [aaparId: string]: UserProfile } = {};
let events: AppEvent[] = [];
let currentUserAaparId: string | null = null;

// Initialize from localStorage only once.
if (typeof window !== 'undefined') {
    const storedUser = sessionStorage.getItem("currentUserAaparId");
    if (storedUser) {
        currentUserAaparId = storedUser;
    }

    try {
        const storedProfiles = localStorage.getItem("userProfiles");
        if (storedProfiles) {
            userProfiles = JSON.parse(storedProfiles);
        }
    } catch (e) {
        console.error("Failed to parse user profiles from localStorage", e);
        userProfiles = {};
    }
    
    try {
        const storedFiles = localStorage.getItem("fileStore");
        if (storedFiles) {
             const parsedFiles = JSON.parse(storedFiles);
             // As File objects cannot be stringified, we restore the metadata
             // but the 'file' property will be lost. This is a limitation
             // of this simple storage method. For viewing, we rely on session's live data.
             fileStore = parsedFiles;
        }
    } catch (e) {
        console.error("Failed to parse file store from localStorage", e);
        fileStore = {};
    }

     try {
        const storedEvents = localStorage.getItem("events");
        if (storedEvents) {
            events = JSON.parse(storedEvents);
        }
    } catch (e) {
        console.error("Failed to parse events from localStorage", e);
        events = [];
    }


    // Ensure all profiles have a fileStore entry
    Object.keys(userProfiles).forEach(aaparId => {
        if (!fileStore[aaparId]) {
            fileStore[aaparId] = {
                certificates: [],
                internship: [],
                gradesheets: [],
                projects: [],
                notifications: [],
            };
        }
    });
}

function persistToLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
        // Create a version of fileStore without the File objects for persistence
        const serializableFileStore = JSON.parse(JSON.stringify(fileStore, (key, value) => {
            if (key === 'file') {
                return undefined; // Exclude File objects
            }
            return value;
        }));
        localStorage.setItem("userProfiles", JSON.stringify(userProfiles));
        localStorage.setItem("fileStore", JSON.stringify(serializableFileStore));
        localStorage.setItem("events", JSON.stringify(events));
    } catch (e) {
        console.error("Failed to persist data to localStorage", e);
    }
  }
}

function persistSessionStorage() {
    if (typeof window !== 'undefined') {
        if (currentUserAaparId) {
            sessionStorage.setItem("currentUserAaparId", currentUserAaparId);
        } else {
            sessionStorage.removeItem("currentUserAaparId");
        }
    }
}


let listeners: (() => void)[] = [];

function broadcastChange() {
  listeners.forEach(listener => listener());
  persistToLocalStorage();
}

export function registerUser(profile: UserProfile) {
  userProfiles[profile.aaparId] = profile;
  if (!fileStore[profile.aaparId]) {
      fileStore[profile.aaparId] = {
        certificates: [],
        internship: [],
        gradesheets: [],
        projects: [],
        notifications: [],
      };
  }
  broadcastChange();
}

export function setCurrentUser(aaparId: string, password?: string) {
  const user = userProfiles[aaparId];
  if (!user || (password && user.password !== password)) {
    console.error("Attempted to log in with invalid credentials.");
    return false;
  }
  currentUserAaparId = aaparId;
  persistSessionStorage();
  broadcastChange();
  return true;
}

export function logoutUser() {
    currentUserAaparId = null;
    persistSessionStorage();
    broadcastChange();
}

export function getCurrentUserAaparId(): string | null {
    return currentUserAaparId;
}

export function getCurrentUserProfile(): UserProfile | null {
  if (!currentUserAaparId || !userProfiles[currentUserAaparId]) {
    return null;
  }
  return userProfiles[currentUserAaparId];
}

export function getAllUserProfiles(): UserProfile[] {
    return Object.values(userProfiles);
}

export function getProfileByAaparId(aaparId: string): UserProfile | null {
    return userProfiles[aaparId] || null;
}

export function findUserByEmail(email: string): UserProfile | null {
    return Object.values(userProfiles).find(p => p.email === email) || null;
}

export function updateUserPassword(email: string, newPassword: string): boolean {
    const user = findUserByEmail(email);
    if (!user) {
        return false;
    }
    userProfiles[user.aaparId].password = newPassword;
    broadcastChange();
    return true;
}


export function addFile(type: string, file: File) {
  if (!currentUserAaparId) return;
  
  const newFile: StoredFile = {
    id: `${Date.now()}-${Math.random()}`,
    name: file.name,
    date: new Date().toISOString().split('T')[0],
    file: file,
    status: 'pending',
    signature: null,
    qrCode: null,
    eventKey: null,
  };

  const userStore = fileStore[currentUserAaparId];
  if (userStore) {
    if (userStore[type as keyof UserFileStore]) {
        (userStore[type as keyof UserFileStore] as StoredFile[]).push(newFile);
    } else {
        (userStore as any)[type] = [newFile];
    }
  }
  
  broadcastChange();
}

export function issueFileToStudent(aaparId: string, type: string, file: File, key: string) {
    if (!aaparId || !fileStore[aaparId]) return;

    const newFile: StoredFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        file: file,
        status: 'approved', // Documents issued by authority are auto-approved
        signature: type !== 'certificates' ? key : null,
        qrCode: null, // Placeholder for QR code
        eventKey: type === 'certificates' ? key : null,
    };

    const userStore = fileStore[aaparId];
    if (userStore) {
        if (userStore[type as keyof UserFileStore]) {
            (userStore[type as keyof UserFileStore] as StoredFile[]).push(newFile);
        } else {
            (userStore as any)[type] = [newFile];
        }
        addNotification(aaparId, `A new document "${file.name}" has been issued to you by an authority.`);
    }

    broadcastChange();
}

export function getFiles(aaparId: string, type: string): StoredFile[] {
  if (!fileStore[aaparId]) return [];
  const files = fileStore[aaparId][type as keyof UserFileStore];
  return Array.isArray(files) ? files : [];
}


export function removeFile(type: string, id: string) {
  if (!currentUserAaparId || !fileStore[currentUserAaparId] || !fileStore[currentUserAaparId][type as keyof UserFileStore]) return;

  const fileList = fileStore[currentUserAaparId][type as keyof UserFileStore] as StoredFile[];
  fileStore[currentUserAaparId][type as keyof UserFileStore] = fileList.filter(f => f.id !== id) as any;
  broadcastChange();
}

export function updateFileStatus(studentAaparId: string, fileType: string, fileId: string, status: 'approved' | 'rejected') {
    if (!fileStore[studentAaparId] || !fileStore[studentAaparId][fileType as keyof UserFileStore]) return;

    const fileList = fileStore[studentAaparId][fileType as keyof UserFileStore] as StoredFile[];
    const fileIndex = fileList.findIndex(f => f.id === fileId);

    if (fileIndex > -1) {
        fileList[fileIndex].status = status;
        const fileName = fileList[fileIndex].name;
        const message = status === 'approved' 
            ? `Your document "${fileName}" has been verified.`
            : `Your document "${fileName}" has been rejected.`;
        
        addNotification(studentAaparId, message);
        broadcastChange();
    }
}

export function addNotification(aaparId: string, message: string) {
    if (!fileStore[aaparId]) return;

    const newNotification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        read: false,
        date: new Date().toISOString(),
    };
    fileStore[aaparId].notifications.unshift(newNotification);
    broadcastChange();
}

export function getNotifications(aaparId: string): Notification[] {
    if (!aaparId || !fileStore[aaparId]) return [];
    return fileStore[aaparId].notifications;
}

export function markNotificationsAsRead(aaparId: string) {
    if (!fileStore[aaparId]) return;
    fileStore[aaparId].notifications.forEach(n => n.read = true);
    broadcastChange();
}


export function subscribe(listener: () => void) {
  listeners.push(listener);
  return function unsubscribe() {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function addEvent(event: Omit<AppEvent, 'id'>) {
    const newEvent: AppEvent = {
        ...event,
        id: `${Date.now()}-${Math.random()}`,
    };
    events.push(newEvent);
    broadcastChange();
}

export function getEvents(): AppEvent[] {
    return events;
}

export function getEventByKey(key: string): AppEvent | undefined {
    return events.find(event => event.key === key);
}

export function removeEvent(eventId: string) {
    events = events.filter(event => event.id !== eventId);
    broadcastChange();
}
