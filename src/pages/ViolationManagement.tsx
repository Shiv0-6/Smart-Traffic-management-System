import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Clock, Image as ImageIcon, Shield, Eye, Navigation2, MapPin } from 'lucide-react';
import { violationsApi } from '@/db/api';
import type { Violation } from '@/types/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAdmin } from '@/hooks/useAdmin';
import { ViolationDetector } from '@/utils/traffic/violationDetection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ViolationManagement: React.FC = () => {
  const { profile } = useAuth();
  const { isAdmin } = useAdmin();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const detectorRef = useRef(new ViolationDetector());
  const [detectorStats, setDetectorStats] = useState<any>(null);

  const isOperator = profile?.role === 'admin' || profile?.role === 'operator';

  useEffect(() => {
    loadViolations();
    const interval = setInterval(loadViolations, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const stats = detectorRef.current.getStatistics();
      setDetectorStats(stats);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadViolations = async () => {
    try {
      const data = await violationsApi.getAll(100);
      setViolations(data);
    } catch (error: any) {
      toast.error('Failed to load violations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: string) => {
    if (!isOperator || !selectedViolation) return;

    try {
      await violationsApi.updateStatus(selectedViolation.id, status, profile!.id, reviewNotes);
      toast.success(`Violation marked as ${status}`);
      loadViolations();
      setSelectedViolation(null);
      setReviewNotes('');
    } catch (error: any) {
      toast.error('Failed to update violation');
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <CheckCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'destructive';
      case 'reviewed':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'outline';
    }
  };

  const filteredViolations = filterStatus === 'all'
    ? violations
    : violations.filter(v => v.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex @container flex-col gap-4">
        <div className="flex @md:flex-row flex-col @md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-primary" />
              Violation Management
            </h1>
            <p className="text-muted-foreground mt-2">
              {isOperator ? 'Review and manage traffic violations' : 'View traffic violations (read-only)'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Badge className="w-fit bg-gradient-accent text-white border-0 shadow-md">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
            ) : (
              <Badge variant="secondary" className="w-fit shadow-md">
                <Eye className="h-3 w-3 mr-1" />
                View Only
              </Badge>
            )}
            <div className="@md:w-64 w-full">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Violations</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {detectorStats && (
        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Geofencing & Violation Detection
            </CardTitle>
            <CardDescription>
              Real-time violation detection using geofencing and bearing analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 xl:grid-cols-4 grid-cols-2">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-sm text-muted-foreground mb-1">
                  Total Detected
                </div>
                <div className="text-2xl font-bold">
                  {detectorStats.total}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div className="text-sm text-muted-foreground">
                    Red Light
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {detectorStats.redLight}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Stop line crossing
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation2 className="h-4 w-4 text-orange-500" />
                  <div className="text-sm text-muted-foreground">
                    Wrong Way
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {detectorStats.wrongWay}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Bearing &gt; 160°
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">
                  High Severity
                </div>
                <div className="text-2xl font-bold">
                  {detectorStats.bySeverity.high}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-2 grid-cols-1">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <strong>Red Light Detection:</strong> Geofence around stop line. Triggers when signal is RED and vehicle crosses boundary.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Navigation2 className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <strong>Wrong Way Detection:</strong> Uses Turf.bearing to compare vehicle direction vs. lane direction (&gt;160° = violation).
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-3 grid-cols-1">
        <Card className="glass-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {violations.filter(v => v.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {violations.filter(v => v.status === 'reviewed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {violations.filter(v => v.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Violation Records</CardTitle>
          <CardDescription>
            {filteredViolations.length} violation{filteredViolations.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredViolations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No violations found
              </p>
            ) : (
              filteredViolations.map((violation) => (
                <div key={violation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex @container flex-col gap-3">
                    <div className="flex @md:flex-row flex-col @md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-destructive/10 rounded">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-semibold">{violation.location}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {violation.violation_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(violation.status)} className="w-fit">
                        {getStatusIcon(violation.status)}
                        <span className="ml-1 capitalize">{violation.status}</span>
                      </Badge>
                    </div>

                    <div className="grid @md:grid-cols-3 grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Timestamp</p>
                        <p className="font-medium">{new Date(violation.timestamp).toLocaleString()}</p>
                      </div>
                      {violation.vehicle_plate && (
                        <div>
                          <p className="text-muted-foreground text-xs">Vehicle Plate</p>
                          <p className="font-medium">{violation.vehicle_plate}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground text-xs">Created</p>
                        <p className="font-medium">{new Date(violation.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {violation.snapshot_url && (
                      <div className="border rounded p-2 bg-muted/20 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Snapshot available</span>
                      </div>
                    )}

                    {violation.notes && (
                      <div className="p-3 bg-muted/50 rounded text-sm">
                        <p className="text-muted-foreground text-xs mb-1">Notes:</p>
                        <p>{violation.notes}</p>
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedViolation(violation);
                            setReviewNotes(violation.notes || '');
                          }}
                        >
                          {isOperator ? 'Review Details' : 'View Details'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Violation Details</DialogTitle>
                          <DialogDescription>
                            Review and manage violation record
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-muted-foreground">Location</Label>
                              <p className="font-medium">{violation.location}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Type</Label>
                              <p className="font-medium capitalize">{violation.violation_type.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Timestamp</Label>
                              <p className="font-medium">{new Date(violation.timestamp).toLocaleString()}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Status</Label>
                              <Badge variant={getStatusVariant(violation.status)} className="w-fit">
                                {violation.status}
                              </Badge>
                            </div>
                          </div>

                          {violation.snapshot_url && (
                            <div className="border rounded-lg p-4 bg-muted/20 text-center">
                              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Violation snapshot would be displayed here
                              </p>
                            </div>
                          )}

                          {isOperator && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="review-notes">Review Notes</Label>
                                <Textarea
                                  id="review-notes"
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Add notes about this violation..."
                                  rows={4}
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleReview('reviewed')}
                                  className="flex-1"
                                  disabled={violation.status === 'reviewed'}
                                >
                                  Mark as Reviewed
                                </Button>
                                <Button
                                  onClick={() => handleReview('resolved')}
                                  variant="outline"
                                  className="flex-1"
                                  disabled={violation.status === 'resolved'}
                                >
                                  Mark as Resolved
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViolationManagement;
