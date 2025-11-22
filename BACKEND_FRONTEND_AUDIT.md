# Backend-Frontend Consistency Audit

## Authentication & Security Routes

### ✅ Implemented
- [x] `/auth/register` - Registration page exists
- [x] `/auth/login` - Login page exists
- [x] `/auth/logout` - Handled in AuthContext
- [x] `/auth/change-password` - In Security page
- [x] `/auth/2fa/setup` - In Security page
- [x] `/auth/2fa/verify` - In Security page
- [x] `/auth/2fa/status` - In Security page
- [x] `/auth/2fa/disable` - In Security page
- [x] `/auth/refresh` - Handled in api-client interceptor

### ❌ Missing Frontend Implementation
- [ ] `/auth/verify-email` - Email verification page
- [ ] `/auth/resend-verification-email` - Resend verification UI
- [ ] `/auth/forgot-password` - Forgot password page
- [ ] `/auth/reset-password` - Reset password page
- [ ] `/auth/2fa/reset` - 2FA reset flow
- [ ] `/auth/2fa/backup-codes` - **Backup codes generation**
- [ ] `/auth/2fa/backup-codes/regenerate` - **Backup codes regeneration**
- [ ] `/auth/2fa/backup-codes/verify` - **Backup code verification**
- [ ] `/auth/permanent-tokens` - **API tokens CRUD** (partially done)
- [ ] `/auth/permanent-tokens/create` - Create permanent token
- [ ] `/auth/permanent-tokens/revoke` - Revoke permanent token
- [ ] `/auth/permanent-tokens/list` - List all tokens
- [ ] `/auth/login-history` - **Login history page**
- [ ] `/auth/sessions/active` - **Active sessions list**
- [ ] `/auth/sessions/revoke` - **Revoke session**
- [ ] `/auth/security-dashboard` - **Security dashboard**
- [ ] `/auth/trusted-ip/status` - Trusted IP status
- [ ] `/auth/trusted-ip/setup` - Trusted IP setup
- [ ] `/auth/trusted-ip/disable` - Trusted IP disable
- [ ] `/auth/trusted-user-agent/status` - Trusted UA status
- [ ] `/auth/trusted-user-agent/setup` - Trusted UA setup
- [ ] `/auth/trusted-user-agent/disable` - Trusted UA disable

## Profile Routes

### ✅ Implemented
- [x] `/profile/info` - Profile info displayed
- [x] `/profile/update` - Profile update form

### ❌ Missing
- [ ] Profile photo upload endpoint integration
- [ ] Banner upload endpoint integration

## Avatar/Banner/Theme Routes

### ❌ Missing Frontend Implementation
- [ ] `/avatars/rented` - List rented avatars
- [ ] `/avatars/owned` - List owned avatars
- [ ] `/avatars/current` - Get current avatar
- [ ] `/avatars/set-current` - Set current avatar
- [ ] `/banners/rented` - List rented banners
- [ ] `/banners/owned` - List owned banners
- [ ] `/banners/current` - Get current banner
- [ ] `/banners/set-current` - Set current banner
- [ ] `/themes/rented` - List rented themes
- [ ] `/themes/owned` - List owned themes

## Family Routes

### ✅ Implemented
- [x] `/family/create` - Create family
- [x] `/family/my-family` - View family
- [x] `/family/members` - List members
- [x] `/family/invite` - Invite members
- [x] `/family/purchase-requests` - View requests
- [x] `/family/purchase-requests/approve` - Approve request
- [x] `/family/purchase-requests/reject` - Reject request

### ❌ Missing
- [ ] `/family/leave` - Leave family
- [ ] `/family/transfer-ownership` - Transfer ownership
- [ ] `/family/remove-member` - Remove member
- [ ] `/family/update-role` - Update member role
- [ ] `/family/settings` - Family settings

## SBD Tokens Routes

### ✅ Implemented
- [x] `/sbd-tokens/my-tokens` - View balance
- [x] `/sbd-tokens/my-transactions` - Transaction history
- [x] `/sbd-tokens/send` - Send tokens

### ❌ Missing
- [ ] `/sbd-tokens/request` - Request tokens
- [ ] `/sbd-tokens/transaction/{id}` - Transaction details
- [ ] `/sbd-tokens/transaction/{id}/note` - Add note to transaction

## Tenant Routes

### ✅ Implemented
- [x] `/tenants/my-tenants` - List tenants
- [x] `/tenants/create` - Create tenant
- [x] `/tenants/switch` - Switch tenant (in TenantSwitcher)

### ❌ Missing
- [ ] `/tenants/{id}` - Get tenant details
- [ ] `/tenants/{id}/update` - Update tenant
- [ ] `/tenants/{id}/delete` - Delete tenant
- [ ] `/tenants/{id}/members` - List members
- [ ] `/tenants/{id}/invite` - Invite member
- [ ] `/tenants/{id}/remove-member` - Remove member

## Priority Implementation List

### Phase 2A: Critical Security Features
1. **Backup Codes** (High Priority)
   - Generate backup codes
   - Display backup codes
   - Download backup codes
   - Verify backup code

2. **Login History & Sessions** (High Priority)
   - View login history
   - View active sessions
   - Revoke sessions
   - Session details (device, location, IP)

3. **Security Dashboard** (High Priority)
   - Security score
   - Recent security events
   - Security recommendations
   - Vulnerability alerts

4. **Password Reset Flow** (High Priority)
   - Forgot password page
   - Reset password page
   - Email verification page

### Phase 2B: Account Management
5. **Email Verification**
   - Email verification page
   - Resend verification email

6. **API Tokens Management**
   - Create permanent token
   - List all tokens
   - Revoke token
   - Token details

7. **Trusted IP/UA Management**
   - Trusted IP setup/status/disable
   - Trusted UA setup/status/disable

### Phase 2C: Personalization
8. **Avatar/Banner/Theme Management**
   - List owned/rented items
   - Set current item
   - Purchase/rent items

9. **Profile Enhancements**
   - Photo upload
   - Banner upload
   - Profile visibility settings

### Phase 2D: Family & Tenant
10. **Family Advanced Features**
    - Leave family
    - Transfer ownership
    - Remove member
    - Update roles
    - Family settings

11. **Tenant Management**
    - Tenant details
    - Update tenant
    - Delete tenant
    - Member management

### Phase 2E: Financial
12. **SBD Tokens Advanced**
    - Request tokens
    - Transaction details
    - Transaction notes
    - Export transactions

## Implementation Strategy

1. **Start with Phase 2A** (Critical Security)
   - These are essential for production readiness
   - High user value
   - Security best practices

2. **Continue with Phase 2B** (Account Management)
   - Complete the authentication flow
   - Enable full account recovery

3. **Then Phase 2C** (Personalization)
   - Enhance user experience
   - Visual customization

4. **Finally Phase 2D & 2E** (Advanced Features)
   - Power user features
   - Complete feature parity

## Notes
- All routes support multi-tenancy via `X-Tenant-ID` header
- All routes require authentication except register/login/verify-email
- Rate limiting is enforced on all endpoints
- Comprehensive logging and audit trails exist
