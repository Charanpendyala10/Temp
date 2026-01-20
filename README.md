1. WHAT IS THE ACTUAL PROBLEM?

You have:

Support Excel files → contain case details

Incident Excel files → contain incident details

You want to:

Compare support cases with incidents using case ID

Find support cases that do NOT have incidents

Filter only important priorities (P1 / P2)

Get a clean result Excel

Automatically send this result by email

You want:

Power Query to run locally

No SharePoint dependency for data

Power Automate only to send emails

No repeating setup every time

🟢 2. FINAL DESIGN (BIG PICTURE)

We agreed on this architecture:

Local folders → raw input data

Local Excel (Power Query) → comparison & filtering

OneDrive → only to sync final output

Power Automate + Outlook → email

OneDrive is only a bridge, nothing more.

🟢 3. REQUIRED FOLDER STRUCTURE (LOCAL)

You created (or must create):

Automation
 ├─ support          ← put support Excel files here
 ├─ incident         ← put incident Excel files here
 └─ automation.xlsx  ← main Power Query file


Important rule:
👉 Both support and incident folders MUST contain at least one Excel file
Otherwise Power Query shows an empty table.

🟢 4. WHAT automation.xlsx IS

automation.xlsx is your logic file

It contains:

Power Query connections

Merge logic

Filters

You build this once

You never recreate it

🟢 5. POWER QUERY — SUPPORT DATA (FROM SCRATCH)

Now let’s recall the exact steps cleanly.

Step 5.1 — Open automation.xlsx

Open Excel

Open automation.xlsx

Step 5.2 — Connect to support folder

Go to Data

Click Get Data

Click From File

Click From Folder

Select the support folder

Click OK

Click Transform Data

👉 Power Query Editor opens

Step 5.3 — See the file list

You now see a table with columns like:

Name

Extension

Date modified

Folder Path

Content

If this table is empty → folder has no Excel files (this caused confusion earlier).

Step 5.4 — Pick the latest support file

Sort Date modified → Descending

Go to Home → Keep Rows → Keep Top Rows

Enter 1 → OK

Now only one row remains.

Step 5.5 — Open the Excel file (Binary step)

Go to the Content column

Click the word “Binary” inside the cell
(this was the step you couldn’t find earlier)

A new dialog opens.

Step 5.6 — Select the sheet (THIS is where OK is)

Select Sheet1$ (or the correct sheet)

Click OK (or Load)

Now the actual support data appears.

Step 5.7 — FIX COLUMN NAMES (VERY IMPORTANT)

At first you see:

Column1, Column2, Column3


This happens because headers are not promoted yet.

Click Home

Click Use First Row as Headers

Now real column names appear.

Step 5.8 — Rename query

On the right panel

Rename query to:

Latest_Support

🟢 6. POWER QUERY — INCIDENT DATA (SAME PROCESS)

Repeat exact same steps for the incident folder:

Data → Get Data → From Folder

Select incident folder

Transform Data

Sort by Date modified

Keep Top 1 row

Click Binary

Select sheet → OK

Click Use First Row as Headers

Rename query to:

Latest_Incident

🟢 7. MERGE (THIS REPLACES VLOOKUP)

Now you have two clean queries.

Merge steps:

Click Home → Merge Queries

First table: Latest_Support

Second table: Latest_Incident

Click:

case ID (support)

GCP tickets (case ID from file 1) (incident)

Join type: Left Outer

Click OK

🟢 8. EXPAND + FILTER (YOU WERE RIGHT ABOUT FILTER)
Expand:

Click expand icon on merged column

Select Incident Reference Number

Click OK

Filter missing incidents:

On Incident Reference Number

Filter → select (null) only

Filter priority (optional but typical):

On Priority

Select P1 and P2

Now the table shows exactly what you want.

🟢 9. LOAD RESULT

Click Home → Close & Load

Load as Table

New worksheet

Save the file

This is your final automation result.

🟢 10. WHAT YOU DO EVERY NEXT TIME

This is VERY simple:

Put new support file into support folder

Put new incident file into incident folder

Open automation.xlsx

Click Data → Refresh All

Done

No rebuilding. No re-merging. No re-filtering.

🟢 WHY YOU GOT CONFUSED (IMPORTANT)

You got confused because:

Files were not present initially

Binary appears only when files exist

Headers must be promoted manually

Power Query does not assume anything

All of this is normal.

🟢 ONE-LINE SUMMARY (REMEMBER THIS)

Put files in folders → Power Query reads latest → Promote headers → Merge → Filter → Load → Refresh only next time
