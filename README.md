1️⃣ L3 – Process in Scope
💬 Comment

[L3 – Process] of <Process Name>
[L3 – Process] in this scope

🧠 Meaning

Operate only on data belonging to the current L3 Process.

🔗 Code Section
for process in l3_processes:
    process_df = df[df["L3_Process"] == process]


✔ This line ensures every following operation uses only in-scope data.

2️⃣ Multiple Documents Based on L3 Process
💬 Comment

Create schedule per L3 – Process

🧠 Meaning

One Word document per L3 process.

🔗 Code Section
for process in l3_processes:
    doc = Document(TEMPLATE_PATH)


✔ One loop iteration = one document.

3️⃣ Schedule / Service Name
💬 Comment

Service Schedule A – <Name of Schedule>

🧠 Meaning

Use L3 process name as schedule name.

🔗 Code Section
for para in doc.paragraphs:
    if "Service Schedule A" in para.text:
        para.text = f"Service Schedule A – {process}"

4️⃣ Enterprise Process Hierarchy (L1 / L2 / L3)
💬 Comment

[L1 – Enterprise Process Group]
[L2 – Enterprise Process]
[L3 – Process]

🧠 Meaning

Populate hierarchy into correct Word table columns.

🔗 Code Section
classification_table = doc.tables[0]

if row["Level"] == "L1":
    cells[0].text = row["Attribute_Name"]
elif row["Level"] == "L2":
    cells[1].text = row["Attribute_Name"]
elif row["Level"] == "L3":
    cells[2].text = row["Attribute_Name"]

5️⃣ Attribute Type = Process
💬 Comment

Attribute Type = Process

🧠 Meaning

Select only process rows (not apps, not objectives).

🔗 Code Section
services = process_df[
    (process_df["Level"] == "L3") &
    (process_df["Attribute_Type"] == "Process")
]

6️⃣ Service Description of L3 – Process
💬 Comment

[L3 – Process] of <Process>

🧠 Meaning

Use L3 process rows to populate service description table.

🔗 Code Section
for _, s in services.iterrows():
    cells = service_table.add_row().cells
    cells[0].text = s["Attribute_Name"]
    cells[1].text = s["Description"]
    cells[2].text = s["Provider"]

7️⃣ Service Provider
💬 Comment

Service Provider of <Process>

🧠 Meaning

Take provider from Excel for L3 Process.

🔗 Code Section
cells[2].text = s["Provider"]


(This is part of the Service Description table logic.)

8️⃣ Attribute Type = Applications
💬 Comment

Attribute Type = Applications

🧠 Meaning

Populate applications table using only application rows.

🔗 Code Section
applications = process_df[
    process_df["Attribute_Type"] == "Applications"
]

9️⃣ Applications Table Population
💬 Comment

Applications in scope

🧠 Meaning

Fill NAR ID, Application name, and description.

🔗 Code Section
for _, a in applications.iterrows():
    cells = app_table.add_row().cells
    cells[0].text = str(a["NAR_ID"])
    cells[1].text = a["Attribute_Name"]
    cells[2].text = a["Description"]

🔟 Objective & Description of Process
💬 Comment

Objective & Description of <Process>

🧠 Meaning

Populate overview / objective text based on process.

🔗 Code Section
objective = process_df[
    process_df["Attribute_Type"] == "Objective"
]["Description"].iloc[0]


(Used when inserting paragraph text in Word)

1️⃣1️⃣ Same as Populated Above
💬 Comment

Same as populated above

🧠 Meaning

Reuse previously inserted value; do not read Excel again.

🔗 Code Section
# Value stored earlier in variable (example)
cached_objective = objective
# reused later without Excel lookup


✔ Implemented via variable reuse, not a lookup.

1️⃣2️⃣ Only Populate If Data Exists
💬 Comment (Implicit)

Populate section only if applicable

🧠 Meaning

If no matching Excel rows, Word table remains empty.

🔗 Code Section
for _, a in applications.iterrows():
    ...
# If applications is empty, loop runs zero times
