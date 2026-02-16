import { Button } from '@fitlife/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fitlife/ui';
import { Dumbbell, Plus } from 'lucide-react';

const TemplatesPage = () => {
    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Workout Templates</h2>
                    <p className="text-muted-foreground">
                        Create and manage reusable workout plans for your clients
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Template
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Templates</CardTitle>
                    <CardDescription>
                        Push templates directly to your clients' apps
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Dumbbell className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">No templates yet</h3>
                        <p className="text-muted-foreground mb-4 max-w-md">
                            Create workout templates that you can push directly to your
                            clients' apps. Include exercises, sets, reps, and rest times.
                        </p>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Template
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TemplatesPage;
