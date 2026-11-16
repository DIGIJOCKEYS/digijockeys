'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { UserRound, Mail, Phone, ShieldCheck, LockKeyhole, Eye, EyeOff, Save, RotateCcw, Clock, CheckCircle2, AlertCircle, KeyRound, CalendarDays, Camera, X, LoaderCircle } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/components/shared/ActionToast';
import { compressImage } from '@/lib/images/compressImage';

// ==========================================
// TYPES
// ==========================================

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ==========================================
// INITIAL DATA
// ==========================================

const initialProfile: ProfileData = {
  fullName: 'Administrator',
  email: 'admin@digijockeys.com',
  phone: '',
};

const initialPassword: PasswordData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

// ==========================================
// PROFILE PAGE
// ==========================================

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    ...initialProfile,
  });

  const [password, setPassword] = useState<PasswordData>({
    ...initialPassword,
  });


  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saved, setSaved] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [userId, setUserId] = useState('');
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState('');
  const avatarInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void (async () => {
      const db = createClient();
      const { data: { user } } = await db.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await db.from('profiles').select('full_name,email,phone_number,avatar_path').eq('id', user.id).maybeSingle();
      setProfile({ fullName: data?.full_name ?? user.user_metadata.full_name ?? '', email: data?.email ?? user.email ?? '', phone: data?.phone_number ?? '' });
      setAvatarPath(data?.avatar_path ?? null);
    })();
  }, []);

  // ==========================================
  // PROFILE HANDLERS
  // ==========================================

  const updateProfile = (key: keyof ProfileData, value: string) => {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSaveProfile = async () => {
    if (profileBusy) return;
    if (!profile.fullName.trim()) {
      notify('Full name is required.', 'error');
      return;
    }

    if (!profile.email.trim()) {
      notify('Email address is required.', 'error');
      return;
    }

    setProfileBusy(true);
    const db = createClient();
    const { error } = await db.from('profiles').update({ full_name: profile.fullName.trim(), email: profile.email.trim(), phone_number: profile.phone.trim() || null }).eq('id', userId);
    if (error) { notify(error.message, 'error'); setProfileBusy(false); return; }
    const { error: authError } = await db.auth.updateUser({ email: profile.email.trim(), data: { full_name: profile.fullName.trim() } });
    if (authError) { notify(authError.message, 'error'); setProfileBusy(false); return; }
    setSaved(true);
    notify('Profile details saved.');
    setProfileBusy(false);
  };

  const handleAvatarChange = async (file?: File) => {
    if (!file || !userId) return;
    if (!file.type.startsWith('image/')) { notify('Please choose an image file.', 'error'); return; }
    if (file.size > 12 * 1024 * 1024) { notify('Avatar image must be 12 MB or smaller.', 'error'); return; }
    setAvatarBusy(true);
    setAvatarStatus('Preparing image…');
    const db = createClient();
    try {
      const optimized = await compressImage(file, 512, 0.78);
      setAvatarStatus('Uploading avatar…');
      const path = `profiles/${userId}/avatar-${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await db.storage.from('site-media').upload(path, optimized, { upsert: false, contentType: 'image/webp' });
      if (uploadError) throw uploadError;
      const { error } = await db.from('profiles').update({ avatar_path: path }).eq('id', userId);
      if (error) { await db.storage.from('site-media').remove([path]); throw error; }
      if (avatarPath) await db.storage.from('site-media').remove([avatarPath]);
      const url = db.storage.from('site-media').getPublicUrl(path).data.publicUrl;
      setAvatarPath(path);
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: { avatarUrl: url, fullName: profile.fullName, email: profile.email } }));
      notify('Profile avatar updated successfully.');
    } catch (cause) { notify(cause instanceof Error ? cause.message : 'Unable to upload avatar.', 'error'); }
    finally { setAvatarBusy(false); setAvatarStatus(''); }
  };

  const handleRemoveAvatar = async () => {
    if (!avatarPath || !userId) return;
    setAvatarBusy(true);
    const db = createClient();
    const { error } = await db.from('profiles').update({ avatar_path: null }).eq('id', userId);
    if (error) { notify(error.message, 'error'); setAvatarBusy(false); return; }
    await db.storage.from('site-media').remove([avatarPath]);
    setAvatarPath(null);
    setAvatarBusy(false);
    window.dispatchEvent(new CustomEvent('profile-updated', { detail: { avatarUrl: null, fullName: profile.fullName, email: profile.email } }));
    notify('Profile avatar removed.');
  };

  // ==========================================
  // RESET PROFILE
  // ==========================================

  const handleResetProfile = () => {
    setProfile({ ...initialProfile });
    setSaved(false);
  };

  // ==========================================
  // PASSWORD HANDLERS
  // ==========================================

  const updatePassword = (key: keyof PasswordData, value: string) => {
    setPassword((current) => ({
      ...current,
      [key]: value,
    }));

    setPasswordMessage('');
    setPasswordError('');
  };

  const handleChangePassword = () => {
    setPasswordMessage('');
    setPasswordError('');

    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      setPasswordError('Please complete all password fields.');
      return;
    }

    if (password.newPassword.length < 8) {
      setPasswordError('New password must contain at least 8 characters.');
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (password.currentPassword === password.newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    void createClient().auth.updateUser({ password: password.newPassword }).then(({ error }) => {
      if (error) setPasswordError(error.message);
      else { setPasswordMessage('Password updated successfully.'); setPassword({ ...initialPassword }); }
    });
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader title="My Profile" description="Manage your personal information and account security." />

      {/* PROFILE OVERVIEW */}
      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* AVATAR */}
            <div className="relative w-fit">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-primary text-2xl font-bold text-primary-foreground sm:size-24">
                {avatarPath ? <Image src={createClient().storage.from('site-media').getPublicUrl(avatarPath).data.publicUrl} alt="Profile avatar" width={96} height={96} unoptimized className="size-full object-cover" /> : getInitials(profile.fullName || 'Administrator')}
              </div>

            </div>

            {/* PROFILE INFO */}
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-semibold">{profile.fullName || 'Administrator'}</h2>

                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  <ShieldCheck className="mr-1 size-3" />
                  Administrator
                </Badge>

                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500" />
                  Active Account
                </Badge>
              </div>
            </div>

            {/* UPLOAD BUTTON */}
            <div className="flex flex-wrap gap-2">
              <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={(event) => { void handleAvatarChange(event.target.files?.[0]); event.currentTarget.value = ''; }} />
              <Button variant="outline" size="sm" disabled={avatarBusy} onClick={() => avatarInput.current?.click()}>{avatarBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}{avatarBusy ? avatarStatus : 'Change Avatar'}</Button>
              {avatarPath && <Button variant="ghost" size="sm" disabled={avatarBusy} onClick={() => void handleRemoveAvatar()}>{avatarBusy ? <LoaderCircle className="size-4 animate-spin" /> : <X className="size-4" />}{avatarBusy ? 'Memproses…' : 'Remove'}</Button>}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* PERSONAL INFORMATION */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound className="size-5" />
            </div>

            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* FULL NAME */}
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>

              <Input id="full-name" value={profile.fullName} onChange={(event) => updateProfile('fullName', event.target.value)} placeholder="Enter your full name" />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email Address</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input id="profile-email" type="email" value={profile.email} onChange={(event) => updateProfile('email', event.target.value)} className="pl-9" placeholder="admin@example.com" />
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone Number</Label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input id="profile-phone" type="tel" value={profile.phone} onChange={(event) => updateProfile('phone', event.target.value)} className="pl-9" placeholder="+62 812 xxxx xxxx" />
              </div>
            </div>

            {/* ROLE */}
            <div className="space-y-2">
              <Label htmlFor="profile-role">Account Role</Label>

              <Input id="profile-role" value="Administrator" disabled />

              <p className="text-xs text-muted-foreground">Account role cannot be changed from this page.</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleResetProfile}>
              <RotateCcw className="size-4" />
              Reset
            </Button>

            <Button onClick={handleSaveProfile} disabled={profileBusy}>
              {profileBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
              {profileBusy ? 'Menyimpan…' : 'Save Changes'}
            </Button>
          </div>

          {saved && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              Profile information has been saved.
            </div>
          )}
        </CardContent>
      </Card>

      {/* CHANGE PASSWORD */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LockKeyhole className="size-5" />
            </div>

            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* CURRENT PASSWORD */}
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>

            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={password.currentPassword}
                onChange={(event) => updatePassword('currentPassword', event.target.value)}
                className="pr-10"
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle current password visibility"
              >
                {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>

              <div className="relative">
                <Input id="new-password" type={showNewPassword ? 'text' : 'password'} value={password.newPassword} onChange={(event) => updatePassword('newPassword', event.target.value)} className="pr-10" placeholder="Enter new password" />

                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle new password visibility">
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>

              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={password.confirmPassword}
                  onChange={(event) => updatePassword('confirmPassword', event.target.value)}
                  className="pr-10"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
            <KeyRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div className="space-y-1">
              <p className="text-sm font-medium">Password Requirements</p>

              <p className="text-xs text-muted-foreground">Use at least 8 characters. Choose a password that is difficult to guess.</p>
            </div>
          </div>

          {/* PASSWORD ERROR */}
          {passwordError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {passwordError}
            </div>
          )}

          {/* PASSWORD SUCCESS */}
          {passwordMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              {passwordMessage}
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleChangePassword}>
              <LockKeyhole className="size-4" />
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ACCOUNT INFORMATION */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Overview of your administrator account.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* ACCOUNT ROLE */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Account Role</p>

                <p className="mt-1 text-sm font-medium">Administrator</p>
              </div>
            </div>

            {/* ACCOUNT STATUS */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <CheckCircle2 className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Account Status</p>

                <p className="mt-1 text-sm font-medium">Active</p>
              </div>
            </div>

            {/* CREATED DATE */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <CalendarDays className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Account Created</p>

                <p className="mt-1 text-sm font-medium">November 1, 2026</p>
              </div>
            </div>

            {/* LAST LOGIN */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <Clock className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Last Login</p>

                <p className="mt-1 text-sm font-medium">Not available yet</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER NOTE */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div className="space-y-1">
            <p className="text-sm font-medium">Account Management</p>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Profile details are stored in your administrator profile, and password changes are handled by Supabase Auth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
