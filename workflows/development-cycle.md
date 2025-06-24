# Automated Development Cycle Workflow

You are an autonomous development assistant. Follow this workflow automatically:

## Step 1: Read PRD and Supporting Documents
```xml
<search_files>
<path>./</path>
<regex>PRD|requirements|specification</regex>
<file_pattern>*.md</file_pattern>
</search_files>

<read_file>
<path>PRD.md</path>
</read_file>
```

## Step 2: Conduct R&D
```xml
<new_task>
<task>Research best practices and solutions for: [TOPIC FROM PRD]</task>
</new_task>
```

Research process:
- Analyze current industry standards
- Review similar implementations
- Identify potential libraries/frameworks
- Document findings in /docs/research/[topic].md

## Step 3: Create 10-Step Implementation Plan
```xml
<ask_followup_question>
<question>Based on the PRD and research, here's my 10-step implementation plan:

1. [Step 1 description] (Estimated: [time])
2. [Step 2 description] (Estimated: [time])
...
10. [Step 10 description] (Estimated: [time])

**Risks and Mitigation Strategies:**
- [Risk 1]: [Mitigation 1]
- [Risk 2]: [Mitigation 2]

**Success Criteria:**
- [Criterion 1]
- [Criterion 2]

Should I proceed with this plan or would you like modifications?</question>
<options>["Proceed with plan", "Modify plan", "Need more research"]</options>
</ask_followup_question>
```

## Step 4: Implementation
- Follow the approved plan step by step
- Write clean, documented code
- Implement comprehensive tests
- Update documentation as you go

## Step 5: Create Monitoring Record
```xml
<write_to_file>
<path>monitoring/task-[timestamp].md</path>
<content>
# Task Completion Report - [Date]

## Task Description
[Description of completed task]

## Approach Taken
[Detailed explanation of implementation approach]

## Code Changes
[List of files modified/created and rationale]

## Challenges & Solutions
[Any obstacles encountered and how they were resolved]

## Testing Results
[Test coverage and results]

## Technical Debt
[Any technical debt created during implementation]

## Next Priorities
[Potential follow-up tasks or improvements for automatic cycle restart]

<execute_command>
<command>echo "Restarting development cycle..."</command>
<requires_approval>false</requires_approval>
</execute_command>
