type StatusMessageProps = {
  tone: 'error' | 'info' | 'success'
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
}

export function StatusMessage({ tone, title, children, action }: StatusMessageProps) {
  return (
    <div className={`status status-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <div>
        <strong>{title}</strong>
        {children ? <p>{children}</p> : null}
      </div>
      {action ? <div className="status-action">{action}</div> : null}
    </div>
  )
}

