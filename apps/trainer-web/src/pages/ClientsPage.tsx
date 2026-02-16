import { Button } from '@fitlife/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fitlife/ui';
import { Users, UserPlus, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrainerClients } from '../hooks/useTrainerClients';
import { useClientWorkouts } from '../hooks/useClientWorkouts';

const ClientsPage = () => {
    const { user } = useAuth();
    const { clients, loading } = useTrainerClients(user?.uid);

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Clients</h2>
                    <p className="text-muted-foreground">
                        Manage your client roster
                    </p>
                </div>
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Client
                </Button>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="h-6 w-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </CardContent>
                </Card>
            ) : clients.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Client List</CardTitle>
                        <CardDescription>
                            All your active and pending clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-foreground">No clients yet</h3>
                            <p className="text-muted-foreground mb-4 max-w-md">
                                Invite your first client to start tracking their fitness journey.
                                They'll receive an email invitation to join your training program.
                            </p>
                            <Button>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Send Invitation
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client List</CardTitle>
                            <CardDescription>
                                Managing {clients.length} client{clients.length !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {clients.map((client) => (
                                    <ClientCard key={client.id} client={client} trainerId={user?.uid || ''} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

function ClientCard({ client, trainerId }: { client: any; trainerId: string }) {
    const { workouts } = useClientWorkouts({ clientId: client.id });
    const lastWorkoutDate = workouts.length > 0 ? new Date(workouts[0].date).toLocaleDateString() : 'Never';

    return (
        <div className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            {workouts.length} workouts
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Last: {lastWorkoutDate}
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Streak: {client.workoutStreak || 0} days
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                </div>
            </div>
        </div>
    );
}

export default ClientsPage;
