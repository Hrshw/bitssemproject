import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Main Card with Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Vite + React + Tailwind
            </h1>
            <p className="text-xl text-purple-200 font-medium">
              Modern Development Stack ✨
            </p>
          </div>

          {/* Interactive Counter Card */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-white mb-2">Interactive Counter</h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
                <p className="text-6xl font-black text-white mb-4">{count}</p>
              </div>
              <button
                onClick={() => setCount((count) => count + 1)}
                className="bg-white text-purple-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-200 hover:bg-purple-50"
              >
                Increment Counter
              </button>
            </div>
          </div>

          {/* Tech Stack Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vite Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-white space-y-3">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="text-2xl font-bold">Vite</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Lightning-fast build tool with instant HMR
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">v7.2.4</span>
                </div>
              </div>
            </div>

            {/* React Card */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-white space-y-3">
                <div className="text-4xl mb-2">⚛️</div>
                <h3 className="text-2xl font-bold">React</h3>
                <p className="text-cyan-100 text-sm leading-relaxed">
                  Modern UI library with hooks and components
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">v19.2.0</span>
                </div>
              </div>
            </div>

            {/* Tailwind Card */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-white space-y-3">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="text-2xl font-bold">Tailwind</h3>
                <p className="text-pink-100 text-sm leading-relaxed">
                  Utility-first CSS framework for rapid UI development
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">v4.1.18</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-sm text-purple-200 font-medium">Fast HMR</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm text-purple-200 font-medium">Tree Shaking</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm text-purple-200 font-medium">Type Safe</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm text-purple-200 font-medium">Optimized</p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-center text-purple-200 text-sm">
              Edit <code className="bg-purple-900/50 text-cyan-300 px-2 py-1 rounded font-mono text-xs">src/App.jsx</code> and save to test Hot Module Replacement
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default App
