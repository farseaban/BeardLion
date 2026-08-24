import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Zap, Atom, Waves } from 'lucide-react';

export default function QuantumSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [particlePosition, setParticlePosition] = useState(50);
  const [waveCollapsed, setWaveCollapsed] = useState(false);
  const [entangledState, setEntangledState] = useState({ spin1: null, spin2: null });
  const [superpositionActive, setSuperpositionActive] = useState(false);

  const progress = ((currentSlide + 1) / 7) * 100;

  // 파동함수 애니메이션
  useEffect(() => {
    if (currentSlide === 2 && !waveCollapsed) {
      const interval = setInterval(() => {
        setParticlePosition(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentSlide, waveCollapsed]);

  const resetStates = useCallback(() => {
    setQuizAnswer(null);
    setWaveCollapsed(false);
    setEntangledState({ spin1: null, spin2: null });
    setSuperpositionActive(false);
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlide < 6) {
      setCurrentSlide(currentSlide + 1);
      resetStates();
    }
  }, [currentSlide, resetStates]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      resetStates();
    }
  }, [currentSlide, resetStates]);

  // 키보드 네비게이션
  // nextSlide/prevSlide 내부에 동일한 경계 검사가 있으므로 여기서는 중복 검사하지 않는다.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slides = [
    // 슬라이드 0: 타이틀
    {
      title: "양자역학의 세계로",
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <Atom className="w-32 h-32 text-blue-400 animate-pulse" />
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            양자역학
          </h1>
          <p className="text-2xl text-gray-300">미시세계의 신비로운 법칙</p>
          <div className="mt-8 p-6 bg-blue-900/30 rounded-lg border border-blue-500/50">
            <p className="text-lg text-center">클릭하거나 → 키를 눌러 탐험을 시작하세요</p>
          </div>
        </div>
      )
    },

    // 슬라이드 1: 양자역학이란?
    {
      title: "양자역학이란?",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 rounded-xl border border-purple-500/30">
            <h2 className="text-3xl font-bold mb-4 text-purple-300">정의</h2>
            <p className="text-xl leading-relaxed">
              원자, 전자, 광자와 같은 <span className="text-yellow-300 font-bold">극미세 입자들의 행동</span>을
              설명하는 물리학 이론입니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-900/40 p-6 rounded-lg border border-blue-400/30 hover:scale-105 transition-transform cursor-pointer">
              <Waves className="w-12 h-12 mb-3 text-blue-400" />
              <h3 className="font-bold text-lg mb-2">파동성</h3>
              <p className="text-sm text-gray-300">입자가 파동처럼 행동</p>
            </div>

            <div className="bg-purple-900/40 p-6 rounded-lg border border-purple-400/30 hover:scale-105 transition-transform cursor-pointer">
              <Atom className="w-12 h-12 mb-3 text-purple-400" />
              <h3 className="font-bold text-lg mb-2">입자성</h3>
              <p className="text-sm text-gray-300">파동이 입자처럼 행동</p>
            </div>

            <div className="bg-pink-900/40 p-6 rounded-lg border border-pink-400/30 hover:scale-105 transition-transform cursor-pointer">
              <Zap className="w-12 h-12 mb-3 text-pink-400" />
              <h3 className="font-bold text-lg mb-2">불확정성</h3>
              <p className="text-sm text-gray-300">정확한 예측 불가능</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
            <p className="text-sm italic text-gray-300">
              💡 고전물리학으로는 설명할 수 없는 현상들을 이해하기 위해 탄생했습니다.
            </p>
          </div>
        </div>
      )
    },

    // 슬라이드 2: 파동함수
    {
      title: "파동함수와 관측의 역설",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">🌊 슈뢰딩거의 파동함수 (Ψ)</h2>
            <p className="text-lg mb-4">
              입자의 위치는 관측 전까지 <span className="text-yellow-300 font-bold">확률적으로만 존재</span>합니다.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border-2 border-purple-500">
            <h3 className="text-xl font-bold mb-4 text-center">
              {waveCollapsed ? "📍 관측 완료: 입자 발견!" : "👁️ 관측하지 않은 상태"}
            </h3>

            <div className="relative h-40 bg-gray-900 rounded-lg mb-4 overflow-hidden">
              {!waveCollapsed && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30"></div>
                  </div>
                </>
              )}

              <div
                className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${
                  waveCollapsed ? 'bg-red-500 animate-pulse' : 'bg-blue-400'
                }`}
                style={{
                  left: `${particlePosition}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>

            <button
              onClick={() => setWaveCollapsed(!waveCollapsed)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              {waveCollapsed ? "🔄 리셋" : "👁️ 관측하기"}
            </button>
          </div>

          <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>핵심:</strong> 관측 행위 자체가 입자의 상태를 결정합니다.
              이것이 '파동함수의 붕괴'입니다.
            </p>
          </div>
        </div>
      )
    },

    // 슬라이드 3: 양자 중첩
    {
      title: "양자 중첩 (Superposition)",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 p-6 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">🐱 슈뢰딩거의 고양이</h2>
            <p className="text-lg">
              관측하기 전까지 입자는 <span className="text-yellow-300 font-bold">여러 상태를 동시에</span> 가질 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div
              className={`p-8 rounded-xl border-2 transition-all cursor-pointer ${
                superpositionActive
                  ? 'bg-purple-900/30 border-purple-500 blur-sm'
                  : 'bg-gray-800 border-gray-600 hover:border-purple-400'
              }`}
              onClick={() => !superpositionActive && setSuperpositionActive(true)}
            >
              <div className="text-6xl mb-4 text-center">😺</div>
              <h3 className="text-2xl font-bold text-center text-green-400">살아있는 고양이</h3>
            </div>

            <div
              className={`p-8 rounded-xl border-2 transition-all cursor-pointer ${
                superpositionActive
                  ? 'bg-purple-900/30 border-purple-500 blur-sm'
                  : 'bg-gray-800 border-gray-600 hover:border-purple-400'
              }`}
              onClick={() => !superpositionActive && setSuperpositionActive(true)}
            >
              <div className="text-6xl mb-4 text-center">💀</div>
              <h3 className="text-2xl font-bold text-center text-red-400">죽은 고양이</h3>
            </div>
          </div>

          {superpositionActive && (
            <div className="bg-purple-900/50 border-2 border-purple-400 p-6 rounded-xl animate-pulse">
              <p className="text-xl text-center font-bold text-purple-200">
                📦 상자 안의 고양이는 관측 전까지<br/>
                <span className="text-yellow-300">살아있으면서 동시에 죽어있습니다!</span>
              </p>
              <button
                onClick={() => setSuperpositionActive(false)}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                상자 열기 (중첩 해제)
              </button>
            </div>
          )}

          <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm">
              💡 <strong>실제 의미:</strong> 양자 컴퓨터의 큐비트(qubit)는 0과 1을 동시에 나타낼 수 있습니다.
            </p>
          </div>
        </div>
      )
    },

    // 슬라이드 4: 양자 얽힘
    {
      title: "양자 얽힘 (Entanglement)",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 p-6 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">🔗 아인슈타인의 '유령 같은 원격작용'</h2>
            <p className="text-lg">
              두 입자가 얽히면, 하나를 관측하는 순간 다른 입자의 상태가 <span className="text-yellow-300 font-bold">즉시 결정</span>됩니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">입자 A (지구)</h3>
              <button
                onClick={() => {
                  const spin = Math.random() > 0.5 ? '↑' : '↓';
                  setEntangledState({
                    spin1: spin,
                    spin2: spin === '↑' ? '↓' : '↑'
                  });
                }}
                disabled={entangledState.spin1 !== null}
                className={`w-32 h-32 rounded-full text-6xl font-bold transition-all transform hover:scale-110 ${
                  entangledState.spin1
                    ? 'bg-blue-600 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-blue-500 cursor-pointer'
                }`}
              >
                {entangledState.spin1 || '?'}
              </button>
              <p className="mt-4 text-sm text-gray-400">클릭해서 관측</p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">입자 B (안드로메다)</h3>
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl font-bold transition-all ${
                entangledState.spin2
                  ? 'bg-pink-600 animate-pulse'
                  : 'bg-gray-700'
              }`}>
                {entangledState.spin2 || '?'}
              </div>
              <p className="mt-4 text-sm text-gray-400">
                {entangledState.spin2 ? '즉시 결정됨!' : '미결정 상태'}
              </p>
            </div>
          </div>

          {entangledState.spin1 && (
            <div className="bg-pink-900/30 border-2 border-pink-500 p-6 rounded-xl">
              <p className="text-center text-lg">
                ⚡ <strong>놀라운 사실:</strong> 거리와 상관없이 정보가 <span className="text-yellow-300">순간적으로</span> 전달됩니다!<br/>
                (단, 빛보다 빠른 정보 전송은 아닙니다)
              </p>
              <button
                onClick={() => setEntangledState({ spin1: null, spin2: null })}
                className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                🔄 다시 실험하기
              </button>
            </div>
          )}
        </div>
      )
    },

    // 슬라이드 5: 퀴즈
    {
      title: "🎯 이해도 체크 퀴즈",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">다음 중 양자역학의 핵심 원리가 아닌 것은?</h2>
          </div>

          <div className="space-y-4">
            {[
              { id: 1, text: "파동-입자 이중성", correct: false },
              { id: 2, text: "불확정성 원리", correct: false },
              { id: 3, text: "결정론적 인과율", correct: true },
              { id: 4, text: "양자 중첩", correct: false }
            ].map(option => (
              <button
                key={option.id}
                onClick={() => setQuizAnswer(option.id)}
                disabled={quizAnswer !== null}
                className={`w-full p-6 rounded-xl border-2 text-left text-lg font-semibold transition-all transform hover:scale-102 ${
                  quizAnswer === null
                    ? 'bg-gray-800 border-gray-600 hover:border-blue-400 cursor-pointer'
                    : quizAnswer === option.id
                      ? option.correct
                        ? 'bg-green-900/50 border-green-500 animate-pulse'
                        : 'bg-red-900/50 border-red-500'
                      : option.correct && quizAnswer !== null
                        ? 'bg-green-900/30 border-green-600'
                        : 'bg-gray-800 border-gray-700 opacity-50'
                }`}
              >
                {option.text}
                {quizAnswer !== null && option.correct && ' ✅'}
                {quizAnswer === option.id && !option.correct && ' ❌'}
              </button>
            ))}
          </div>

          {quizAnswer !== null && (
            <div className={`p-6 rounded-xl border-2 ${
              quizAnswer === 3
                ? 'bg-green-900/30 border-green-500'
                : 'bg-red-900/30 border-red-500'
            }`}>
              <p className="text-lg font-bold mb-2">
                {quizAnswer === 3 ? '🎉 정답입니다!' : '😅 아쉽습니다!'}
              </p>
              <p className="text-sm">
                <strong>해설:</strong> 양자역학은 확률론적이며, 고전물리학의 결정론적 인과율과 다릅니다.
                관측 전까지 상태가 확정되지 않습니다.
              </p>
              <button
                onClick={() => setQuizAnswer(null)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                다시 풀기
              </button>
            </div>
          )}
        </div>
      )
    },

    // 슬라이드 6: 응용
    {
      title: "양자역학의 현대적 응용",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-6 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">🚀 미래를 여는 기술들</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-xl border border-blue-500/30 hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">💻</div>
              <h3 className="text-xl font-bold mb-3 text-blue-300">양자 컴퓨터</h3>
              <p className="text-sm text-gray-300">
                큐비트 중첩으로 기존 컴퓨터보다 수백만 배 빠른 계산
              </p>
              <div className="mt-3 text-xs text-blue-200">
                예: IBM Q, Google Sycamore
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 p-6 rounded-xl border border-green-500/30 hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">🔐</div>
              <h3 className="text-xl font-bold mb-3 text-green-300">양자 암호통신</h3>
              <p className="text-sm text-gray-300">
                얽힘 현상을 이용한 절대 안전한 통신
              </p>
              <div className="mt-3 text-xs text-green-200">
                예: QKD (Quantum Key Distribution)
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 p-6 rounded-xl border border-pink-500/30 hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">🔬</div>
              <h3 className="text-xl font-bold mb-3 text-pink-300">양자 센서</h3>
              <p className="text-sm text-gray-300">
                초고감도 측정 장비 (중력파, 자기장 등)
              </p>
              <div className="mt-3 text-xs text-pink-200">
                예: 원자시계, 양자 레이더
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 p-6 rounded-xl border border-yellow-500/30 hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">⚕️</div>
              <h3 className="text-xl font-bold mb-3 text-yellow-300">의료 영상</h3>
              <p className="text-sm text-gray-300">
                MRI, PET 스캔 등 진단 기술
              </p>
              <div className="mt-3 text-xs text-yellow-200">
                예: 양자점 이미징
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-xl border-2 border-purple-500/50">
            <p className="text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              양자역학은 더 이상 이론이 아닌, 우리 삶을 변화시키는 현실입니다! 🌟
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-8">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">
          {currentSlide + 1} / {slides.length}
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <h1 className="text-3xl font-bold">{slides[currentSlide].title}</h1>
        </div>

        <div className="p-12 min-h-[600px]">
          {slides[currentSlide].content}
        </div>

        <div className="bg-gray-900/50 p-6 flex justify-between items-center border-t border-purple-500/30">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentSlide === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>이전</span>
          </button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  resetStates();
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-purple-500 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentSlide === slides.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
            }`}
          >
            <span>다음</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 text-center text-sm text-gray-400">
        💡 팁: 화살표 키(← →)로도 슬라이드를 이동할 수 있습니다
      </div>
    </div>
  );
}
