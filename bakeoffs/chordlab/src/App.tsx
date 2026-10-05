import './index.css'
import PianoKeyboard from './components/PianoKeyboard'

function App() {
  

  return (
    <>
      <div className='min-h-screen bg-slate-50 text-slate-900'>
        <header className='flex items-center justify-between border-b bg-white px-6 py-4'>
          <h1 className='text-xl font-bold'>
            ChordLab
          </h1>
          <nav className='flex gap-2'>
            <button className='rounded-2xl bg-violet-100 px-3 py-2 text-violet-700'>
              Build
            </button>
            <button className='rounded-2xl bg-violet-100 px-3 py-2 text-violet-700'>
              Progressions
            </button>
          </nav>
        </header>
        <main>
          <PianoKeyboard></PianoKeyboard>
        </main>
      </div>
    </>
  )
}

export default App
