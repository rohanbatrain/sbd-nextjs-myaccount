/**
 * Application-wide constants
 */

export const MODAL_TYPES = {
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete',
    INVITE: 'invite',
    MEMBERS: 'members',
    TRANSFER: 'transfer',
    SEND: 'send',
    REQUEST: 'request',
    DETAILS: 'details',
} as const;

export const USER_ROLES = {
    ADMIN: 'admin',
    MEMBER: 'member',
    CHILD: 'child',
} as const;

export const TRANSACTION_TYPES = {
    ALL: 'all',
    SEND: 'send',
    RECEIVE: 'receive',
} as const;

export const MESSAGE_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
} as const;

export const SECURITY_PRIORITIES = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
} as const;

export const ASSET_TABS = {
    AVATARS: 'avatars',
    BANNERS: 'banners',
    THEMES: 'themes',
} as const;

export const SETTINGS_TABS = {
    GENERAL: 'general',
    NOTIFICATIONS: 'notifications',
    PRIVACY: 'privacy',
    DATA: 'data',
} as const;

// File upload constraints
export const FILE_CONSTRAINTS = {
    PHOTO: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    },
    BANNER: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
        ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
        RECOMMENDED_DIMENSIONS: '1500x500px',
    },
} as const;

// Password constraints
export const PASSWORD_CONSTRAINTS = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
} as const;

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh-token',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        CHANGE_PASSWORD: '/auth/change-password',
    },
    PROFILE: {
        INFO: '/profile/info',
        UPDATE: '/profile/update',
        UPLOAD_PHOTO: '/profile/upload-photo',
        UPLOAD_BANNER: '/profile/upload-banner',
    },
    FAMILY: {
        CREATE: '/family/create',
        MY_FAMILY: '/family/my-family',
        MEMBERS: '/family/members',
        INVITE: '/family/invite',
        LEAVE: '/family/leave',
        TRANSFER_OWNERSHIP: '/family/transfer-ownership',
        REMOVE_MEMBER: '/family/remove-member',
        UPDATE_ROLE: '/family/update-role',
    },
    TENANTS: {
        MY_TENANTS: '/tenants/my-tenants',
        CREATE: '/tenants/create',
        SWITCH: '/tenants/switch',
    },
    TOKENS: {
        MY_TOKENS: '/sbd-tokens/my-tokens',
        MY_TRANSACTIONS: '/sbd-tokens/my-transactions',
        SEND: '/sbd-tokens/send',
        REQUEST: '/sbd-tokens/request',
    },
} as const;

export type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];
export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
export type SecurityPriority = typeof SECURITY_PRIORITIES[keyof typeof SECURITY_PRIORITIES];
export type AssetTab = typeof ASSET_TABS[keyof typeof ASSET_TABS];
export type SettingsTab = typeof SETTINGS_TABS[keyof typeof SETTINGS_TABS];
