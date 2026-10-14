import { useEffect, useState } from 'react'
import { Workspace } from './Workspace'

type WorkspaceItem = {
    id: string,
    name: string,
    created_at: string
}

export function WorkspacesPanel() {
    const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=> {
        fetch("/api/workspaces")
        .then((response) => (response.ok ? response.json() : null))
        .then((body) => setWorkspaces(body?.workspaces ?? []))
        .catch(() => setWorkspaces([]))
        .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return <p>Loading workspaces...</p>

    return (
        <div>
            {workspaces.length === 0 ? (
                <p>No workspaces created yet.</p>
            ) : (
                workspaces.map((workspace) => (
                    <Workspace 
                        key={workspace.id}
                        name={workspace.name}
                    />
                ))
            )}
        </div>
    )
}