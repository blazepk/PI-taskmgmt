stateDiagram-v2
[*] --> Pending: Create Task

    Pending --> InProgress: Start Work
    Pending --> Deleted: Delete Task

    InProgress --> Completed: Complete Task
    InProgress --> Pending: Put on Hold
    InProgress --> Deleted: Delete Task

    Completed --> InProgress: Reopen Task
    Completed --> Deleted: Delete Task

    Deleted --> [*]

    note right of Pending
        Initial state for new tasks
        Can be edited
        Shows due date warning
    end note

    note right of InProgress
        Active tasks
        Can track time spent
        Can add progress updates
    end note

    note right of Completed
        Finished tasks
        Completion date recorded
        Can be archived
    end note
