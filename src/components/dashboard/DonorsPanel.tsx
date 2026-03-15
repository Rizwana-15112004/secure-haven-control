import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Search, MapPin, Phone, Calendar, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { mockDonors } from "@/data/mockData";

export function DonorsPanel() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDonors = mockDonors.filter(donor => 
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            Blood Donor Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and locate eligible blood donors for emergency response.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search donors, blood type, location..." 
            className="pl-9 bg-zinc-900/50 border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden group hover:border-red-500/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Registered Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockDonors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Available in database</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden group hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eligible Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {mockDonors.filter(d => d.isEligible).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready to donate now</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">O+ Universal Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {mockDonors.filter(d => d.bloodType === 'O+').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Critical for emergencies</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-950 border-zinc-900">
        <CardContent className="p-0">
          <div className="rounded-md border border-zinc-900">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Name</TableHead>
                  <TableHead className="text-zinc-400">Blood Type</TableHead>
                  <TableHead className="text-zinc-400">Location</TableHead>
                  <TableHead className="text-zinc-400">Contact</TableHead>
                  <TableHead className="text-zinc-400">Last Donation</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor) => (
                    <TableRow key={donor.id} className="border-zinc-800 hover:bg-zinc-900/30 transition-colors">
                      <TableCell className="font-medium text-white">{donor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 font-bold">
                          {donor.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <MapPin className="h-3 w-3" />
                          {donor.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                          <Phone className="h-3 w-3" />
                          {donor.contactNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Calendar className="h-3 w-3" />
                          {donor.lastDonationDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        {donor.isEligible ? (
                          <Badge className="bg-green-600/20 text-green-400 border-green-500/30 flex items-center gap-1 w-fit">
                            <UserCheck className="h-3 w-3" /> Eligible
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-zinc-800 text-zinc-500 flex items-center gap-1 w-fit">
                            <UserX className="h-3 w-3" /> Wait Period
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No matching donors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
