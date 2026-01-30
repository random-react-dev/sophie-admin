import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

export default async function SubmissionsPage() {
  const submissions = await getSubmissions(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Submissions
        </h1>
        <p className="text-muted-foreground">
          Latest landing page form submissions.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              Showing the latest {submissions.length} submissions
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {submissions.length}
          </Badge>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No submissions yet.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {submission.email}
                      </TableCell>
                      <TableCell>{submission.form_type}</TableCell>
                      <TableCell>
                        {formatValue(submission.data?.language) || "-"}
                      </TableCell>
                      <TableCell>
                        {formatValue(submission.data?.level) || "-"}
                      </TableCell>
                      <TableCell>
                        {formatValue(submission.data?.goal) || "-"}
                      </TableCell>
                      <TableCell>
                        {formatValue(submission.data?.location) || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
