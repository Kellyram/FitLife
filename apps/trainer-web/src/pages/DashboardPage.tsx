import { useAuth } from '../context/AuthContext';
import { useTrainerClients } from '../hooks/useTrainerClients';
import { useClientWorkouts } from '../hooks/useClientWorkouts';
import { useTrainerStats } from '../hooks/useTrainerStats';
import { Button } from '@fitlife/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fitlife/ui';
import { Users, TrendingUp, Activity, Calendar, AlertCircle, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch real data
    const { clients, loading: clientsLoading } = useTrainerClients(user?.uid);
    const { workouts, loading: workoutsLoading } = useClientWorkouts({
        trainerId: user?.uid,
    });

    // Calculate statistics
    const stats = useTrainerStats(clients, workouts);

    const isLoading = clientsLoading || workoutsLoading;

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">
                    Welcome back, {user?.displayName?.split(' ')[0] || 'Trainer'}
                </h2>
                <p className="text-muted-foreground">
                    Here's what's happening with your clients today
                </p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-lg text-muted-foreground">Loading dashboard data...</div>
                </div>
            )}

            {!isLoading && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Clients
                                </CardTitle>
                                <Users className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stats.totalClients}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.activeClients} active this week
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Workouts
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stats.workoutsThisWeek}</div>
                                <p className="text-xs text-muted-foreground">
                                    This week
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Adherence
                                </CardTitle>
                                <Activity className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stats.averageAdherence}%</div>
                                <p className="text-xs text-muted-foreground">
                                    Completion rate
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Reviews
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stats.pendingReviews}</div>
                                <p className="text-xs text-muted-foreground">
                                    Pending feedback
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Clients Needing Attention */}
                    {stats.clientsNeedingAttention.length > 0 && (
                        <Card className="mb-6 border-orange-200 dark:border-orange-900/50">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    <CardTitle>Clients Needing Attention</CardTitle>
                                </div>
                                <CardDescription>
                                    These clients haven't worked out in 2+ days
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {stats.clientsNeedingAttention.map((client) => (
                                        <div
                                            key={client.id}
                                            className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 text-sm font-bold">
                                                    {client.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground text-sm">{client.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Last: {client.lastWorkoutDate
                                                            ? new Date(client.lastWorkoutDate).toLocaleDateString()
                                                            : 'Never'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                Nudge
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Client List */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Your Clients</CardTitle>
                                <CardDescription>
                                    Manage and monitor your active clients
                                </CardDescription>
                            </div>
                            <Button size="sm" onClick={() => navigate('/clients')}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {clients.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Users className="w-16 h-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">No clients yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start by inviting your first client to the platform
                                    </p>
                                    <Button onClick={() => navigate('/clients')}>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Invite Client
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {clients.slice(0, 5).map((client) => (
                                        <div
                                            key={client.id}
                                            className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                                            onClick={() => navigate(`/clients/${client.id}`)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                                                    {client.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground text-sm">{client.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {client.totalWorkouts || 0} workouts
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        client.status === 'active'
                                                            ? 'bg-green-500'
                                                            : 'bg-zinc-400'
                                                    }`}
                                                />
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {client.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {clients.length > 5 && (
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2"
                                            onClick={() => navigate('/clients')}
                                        >
                                            View All {clients.length} Clients
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
