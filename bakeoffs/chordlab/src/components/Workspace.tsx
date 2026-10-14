type WorkspaceProps = {
    name: string
}

export function Workspace({name}: WorkspaceProps) {
    return (
        <div>
            <h2>
                {name}
            </h2>
        </div>
    );
}