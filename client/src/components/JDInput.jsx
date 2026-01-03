

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase } from "lucide-react"



export default /**
 * Active: 2026-01-03
 * Function: JDInput
 */
function JDInput({ value, onChange }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5" />
          <span>Job Description</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste the job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[400px] resize-none"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Include the complete job posting with requirements, responsibilities, and qualifications.
        </p>
      </CardContent>
    </Card>
  )
}
