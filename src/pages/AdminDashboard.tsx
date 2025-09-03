import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminHeader } from '@/components/admin/admin-header';
import { dsaTopics } from '@/data/dsaTopics';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Plus
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  progress: number;
  lastActive: string;
  topicsCompleted: number;
  totalTopics: number;
  status: 'active' | 'inactive' | 'struggling';
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@student.com',
    class: '1A',
    progress: 75,
    lastActive: '2 hours ago',
    topicsCompleted: 15,
    totalTopics: 20,
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@student.com',
    class: '1A',
    progress: 90,
    lastActive: '1 hour ago',
    topicsCompleted: 18,
    totalTopics: 20,
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@student.com',
    class: '1A',
    progress: 45,
    lastActive: '1 day ago',
    topicsCompleted: 9,
    totalTopics: 20,
    status: 'struggling'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@student.com',
    class: '1B',
    progress: 60,
    lastActive: '3 hours ago',
    topicsCompleted: 12,
    totalTopics: 20,
    status: 'active'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@student.com',
    class: '1B',
    progress: 30,
    lastActive: '5 days ago',
    topicsCompleted: 6,
    totalTopics: 20,
    status: 'inactive'
  }
];

export default function AdminDashboard() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [teachClass, setTeachClass] = useState('1A');
  const [teachTopicId, setTeachTopicId] = useState<string>(dsaTopics[0]?.id || '');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'overview' | 'class-view' | 'analytics' | 'teach') || 'overview';

  const filteredStudents = mockStudents.filter(student => {
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'struggling': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'struggling': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.status === 'active').length;
  const averageProgress = Math.round(mockStudents.reduce((acc, s) => acc + s.progress, 0) / totalStudents);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor student progress and performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/assignments/create'}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeStudents / totalStudents) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Across all students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
            <p className="text-xs text-muted-foreground">
              Total curriculum topics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student Management */}
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            Monitor and manage student progress across all classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={initialTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="class-view">Class View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="teach">Teach</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="1A">1st Year A</SelectItem>
                    <SelectItem value="1B">1st Year B</SelectItem>
                    <SelectItem value="1C">1st Year C</SelectItem>
                    <SelectItem value="2A">2nd Year A</SelectItem>
                    <SelectItem value="2B">2nd Year B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{student.progress}%</div>
                          <Progress value={student.progress} className="w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {student.topicsCompleted}/{student.totalTopics}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {student.lastActive}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(student.status)}
                            {student.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="class-view" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['1A', '1B', '1C', '2A', '2B'].map((className) => {
                  const classStudents = mockStudents.filter(s => s.class === className);
                  const classProgress = classStudents.length > 0 
                    ? Math.round(classStudents.reduce((acc, s) => acc + s.progress, 0) / classStudents.length)
                    : 0;
                  
                  return (
                    <Card key={className}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {className}
                          <Badge variant="outline">{classStudents.length} students</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold">{classProgress}%</div>
                          <Progress value={classProgress} />
                          <p className="text-sm text-muted-foreground">
                            Average class progress
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>High Performers (80%+)</span>
                        <span>{mockStudents.filter(s => s.progress >= 80).length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average (60-79%)</span>
                        <span>{mockStudents.filter(s => s.progress >= 60 && s.progress < 80).length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Struggling (&lt;60%)</span>
                        <span>{mockStudents.filter(s => s.progress < 60).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active</span>
                        <span>{mockStudents.filter(s => s.status === 'active').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Struggling</span>
                        <span>{mockStudents.filter(s => s.status === 'struggling').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Inactive</span>
                        <span>{mockStudents.filter(s => s.status === 'inactive').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="teach" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-4 md:col-span-1">
                  <div>
                    <div className="text-sm font-medium mb-1">Select Class</div>
                    <Select value={teachClass} onValueChange={setTeachClass}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose class" />
                      </SelectTrigger>
                      <SelectContent>
                        {['1A','1B','1C','2A','2B'].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Select Topic</div>
                    <Select value={teachTopicId} onValueChange={setTeachTopicId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {dsaTopics.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => navigate(`/topic/${teachTopicId}`)}>
                      Start Teaching
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => window.open(`/topic/${teachTopicId}`, '_blank') }>
                      Open in New Tab
                    </Button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Session Preview</CardTitle>
                      <CardDescription>
                        Topic details that students will see
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-lg font-semibold">{dsaTopics.find(t => t.id === teachTopicId)?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Category: {dsaTopics.find(t => t.id === teachTopicId)?.category} · Difficulty: {dsaTopics.find(t => t.id === teachTopicId)?.difficulty}
                        </div>
                        <div className="rounded-md border p-4 text-sm text-muted-foreground bg-muted/30">
                          This is a preview. Click "Start Teaching" to open the interactive visualization and content for this topic.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
