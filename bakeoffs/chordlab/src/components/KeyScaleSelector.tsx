'use client'

import { ROOTS, Root, SCALES, ScaleId } from '../lib/music'

type KeyScaleSelectorProps = {
  root: Root
  scaleId: ScaleId
  onRootChange: (root: Root) => void
  onScaleChange: (scaleId: ScaleId) => void
}

export function KeyScaleSelector({ root, scaleId, onRootChange, onScaleChange }: KeyScaleSelectorProps) {
  return (
    <div className="explorer-controls">
      <div>
        <label className="field-label" htmlFor="key-root">Key</label>
        <select id="key-root" className="select-input" value={root} onChange={(event) => onRootChange(event.target.value as Root)}>
          {ROOTS.map((rootName) => <option key={rootName} value={rootName}>{rootName}</option>)}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="scale-type">Scale</label>
        <select id="scale-type" className="select-input" value={scaleId} onChange={(event) => onScaleChange(event.target.value as ScaleId)}>
          {SCALES.map((scale) => <option key={scale.id} value={scale.id}>{scale.name}</option>)}
        </select>
      </div>
    </div>
  )
}
