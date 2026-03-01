"use client";

import { useState, useMemo, useEffect } from "react";
import { Trash2, Eye, FileText, Mail, Users, X, Download, Search, TrendingUp, TrendingDown, Filter, Shield, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/adminApi";
import { truncateFilename, formatFileSize } from "@/utils/fileUtils";
import type { AdminUser, AdminUserDetails, CV, Application } from "@/types";

interface AdminTabProps {
  users: AdminUser[];
  isLoading: boolean;
  selectedUser: AdminUserDetails | null;
  onViewUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onExportUsers: () => void;
  onCloseDetails: () => void;
}

export function AdminTab({
  users,
  isLoading,
  selectedUser,
  onViewUser,
  onDeleteUser,
  onExportUsers,
  onCloseDetails
}: AdminTabProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Listen for delete event from modal
  useEffect(() => {
    const handleDelete = (e: any) => {
      onDeleteUser(e.detail);
    };
    window.addEventListener('deleteUser', handleDelete);
    return () => window.removeEventListener('deleteUser', handleDelete);
  }, [onDeleteUser]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(user => 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalCVs = users.reduce((sum, u) => sum + u._count.cvs, 0);
    const totalApps = users.reduce((sum, u) => sum + u._count.applications, 0);
    const adminCount = users.filter(u => u.role === "ADMIN").length;
    
    return {
      totalUsers,
      totalCVs,
      totalApps,
      adminCount,
      avgCVsPerUser: totalUsers > 0 ? (totalCVs / totalUsers).toFixed(1) : "0",
      avgAppsPerUser: totalUsers > 0 ? (totalApps / totalUsers).toFixed(1) : "0"
    };
  }, [users]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.adminCount} admin{stats.adminCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total CVs</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalCVs}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stats.avgCVsPerUser} avg/user
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="text-blue-500" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalApps}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stats.avgAppsPerUser} avg/user
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Mail className="text-cyan-500" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Rate</p>
                <h3 className="text-3xl font-bold mt-2">
                  {stats.totalUsers > 0 ? Math.round((stats.totalApps / stats.totalUsers) * 100) : 0}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1">User engagement</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center">
                <TrendingUp className="text-slate-500" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">User Management</CardTitle>
              <CardDescription>View and manage all platform users</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={onExportUsers} variant="outline" className="gap-2">
                <FileDown size={16} />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {user.avatarUrl && (
                      <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                      {user.role === "ADMIN" && (
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText size={14} className="sm:w-4 sm:h-4" /> {user._count.cvs}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={14} className="sm:w-4 sm:h-4" /> {user._count.applications}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onViewUser(user.id)} className="h-8 text-xs">
                        <Eye size={14} /> View
                      </Button>
                      {user.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirm({ id: user.id, email: user.email })}
                          className="h-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={onCloseDetails} />
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${deleteConfirm.email}? This will permanently delete all their CVs and applications.`}
          confirmText="Delete"
          onConfirm={() => {
            onDeleteUser(deleteConfirm.id);
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}

function UserDetailsModal({ user, onClose }: { user: AdminUserDetails; onClose: () => void }) {
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cvs' | 'applications'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
        <Card className="w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {user.avatarUrl && (
                  <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-2 sm:ring-4 ring-primary/10 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-2xl font-bold truncate">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1 sm:mt-2 flex-wrap">
                    {user.role === "ADMIN" && (
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        <Shield size={10} className="mr-1 sm:mr-1" /> Admin
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                {user.role !== "ADMIN" && (
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)} className="h-8 sm:h-9">
                    <Trash2 size={14} className="sm:mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9">
                  <X size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 border-b bg-muted/30">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">{user.cvs.length}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">CVs Uploaded</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-500">{user.applications.length}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Applications</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-cyan-500">
                {user.applications.filter(a => a.status === 'SENT').length}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Sent</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('cvs')}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'cvs'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              CVs ({user.cvs.length})
              {activeTab === 'cvs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Applications ({user.applications.length})
              {activeTab === 'applications' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500" />
                        Recent CVs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {user.cvs.slice(0, 3).map((cv) => (
                        <div key={cv.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium" title={cv.fileName}>
                              {truncateFilename(cv.fileName, 35)}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {new Date(cv.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {cv.isActive && (
                            <Badge variant="secondary" className="text-[10px] sm:text-xs">Active</Badge>
                          )}
                        </div>
                      ))}
                      {user.cvs.length === 0 && (
                        <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No CVs uploaded</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-500" />
                        Recent Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {user.applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">{app.subject}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {new Date(app.generatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={app.status === 'SENT' ? 'default' : 'secondary'}
                            className="text-[10px] sm:text-xs"
                          >
                            {app.status}
                          </Badge>
                        </div>
                      ))}
                      {user.applications.length === 0 && (
                        <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No applications</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'cvs' && (
              <div className="space-y-2 sm:space-y-3">
                {user.cvs.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <FileText className="mx-auto text-muted-foreground mb-3 sm:mb-4" size={40} />
                    <p className="text-sm sm:text-base text-muted-foreground">No CVs uploaded</p>
                  </div>
                ) : (
                  user.cvs.map((cv) => (
                    <Card key={cv.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCV(cv)}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="text-blue-500" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base font-medium" title={cv.fileName}>
                                {truncateFilename(cv.fileName, 40)}
                              </p>
                              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mt-1">
                                <span>{formatFileSize(cv.fileSize)}</span>
                                <span>•</span>
                                <span className="hidden sm:inline">{new Date(cv.uploadedAt).toLocaleDateString()}</span>
                                <span className="sm:hidden">{new Date(cv.uploadedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                                {cv.isActive && (
                                  <>
                                    <span>•</span>
                                    <span className="text-primary font-medium">Active</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Eye size={14} className="text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-2 sm:space-y-3">
                {user.applications.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Mail className="mx-auto text-muted-foreground mb-3 sm:mb-4" size={40} />
                    <p className="text-sm sm:text-base text-muted-foreground">No applications generated</p>
                  </div>
                ) : (
                  user.applications.map((app) => (
                    <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedApp(app)}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                              <Mail className="text-cyan-500" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base font-medium truncate">{app.subject}</p>
                              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mt-1">
                                <span className="truncate max-w-[120px] sm:max-w-none">{app.recruiterEmail}</span>
                                <span>•</span>
                                <span className="hidden sm:inline">{new Date(app.generatedAt).toLocaleDateString()}</span>
                                <span className="sm:hidden">{new Date(app.generatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge 
                              variant={app.status === 'SENT' ? 'default' : app.status === 'FAILED' ? 'destructive' : 'secondary'}
                              className="text-[10px] sm:text-xs"
                            >
                              {app.status}
                            </Badge>
                            <Eye size={14} className="text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {selectedCV && (
        <CVDetailModal cv={selectedCV} onClose={() => setSelectedCV(null)} />
      )}

      {selectedApp && (
        <ApplicationDetailModal application={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${user.name} (${user.email})? This will permanently delete all their CVs and applications.`}
          confirmText="Delete User"
          onConfirm={() => {
            // This will be handled by parent component
            setShowDeleteConfirm(false);
            onClose();
            // Trigger delete from parent
            window.dispatchEvent(new CustomEvent('deleteUser', { detail: user.id }));
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}


function CVDetailModal({ cv, onClose }: { cv: CV; onClose: () => void }) {
  const handleDownload = () => {
    const downloadUrl = adminService.getDownloadCVUrl(cv.id);
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-blue-500/5 to-transparent p-4 sm:p-6">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="text-blue-500" size={20} />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg truncate">CV Details</CardTitle>
                <CardDescription className="text-xs sm:text-sm">File information and actions</CardDescription>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 sm:h-9">
                <Download size={14} className="sm:mr-1" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9">
                <X size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">File Name</p>
              <p className="font-semibold text-xs sm:text-sm break-words" title={cv.fileName}>{cv.fileName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">File Size</p>
              <p className="font-semibold text-xs sm:text-sm">{formatFileSize(cv.fileSize)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Uploaded</p>
              <p className="font-semibold text-xs sm:text-sm">{new Date(cv.uploadedAt).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
              {cv.isActive ? (
                <Badge className="text-[10px] sm:text-xs">Active</Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] sm:text-xs">Inactive</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ApplicationDetailModal({ application, onClose }: { application: Application; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-cyan-500/5 to-transparent p-4 sm:p-6">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Mail className="text-cyan-500" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg truncate">Application Details</CardTitle>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge 
                    variant={application.status === 'SENT' ? 'default' : application.status === 'FAILED' ? 'destructive' : 'secondary'}
                    className="text-[10px] sm:text-xs"
                  >
                    {application.status}
                  </Badge>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {new Date(application.generatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Key Info Grid */}
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</p>
                <p className="font-semibold text-sm sm:text-base break-words">{application.subject}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Recruiter Email</p>
                <p className="font-semibold text-sm sm:text-base break-all">{application.recruiterEmail || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated At</p>
                <p className="font-semibold text-xs sm:text-sm">{new Date(application.generatedAt).toLocaleString()}</p>
              </div>
              {application.sentAt && (
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Sent At</p>
                  <p className="font-semibold text-xs sm:text-sm">{new Date(application.sentAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Job Description</p>
              <Card>
                <CardContent className="p-3 sm:p-4 max-h-40 sm:max-h-48 overflow-y-auto">
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{application.jobDescription}</p>
                </CardContent>
              </Card>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Cover Letter</p>
                <Card>
                  <CardContent className="p-3 sm:p-4 max-h-48 sm:max-h-64 overflow-y-auto">
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{application.coverLetter}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* CV Used */}
            {application.cv && (
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">CV Used</p>
                <Card>
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="text-blue-500" size={14} />
                      </div>
                      <p className="font-medium text-xs sm:text-sm truncate">{application.cv.fileName}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
