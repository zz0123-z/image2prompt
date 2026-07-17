import { useState, useEffect } from 'react'
import { Upload, Image, Copy, Check, RefreshCw, AlertCircle, Lock, Shield, Info } from 'lucide-react'

const providerConfigs: Record<string, {
  name: string
  icon: string
  url: string
  tips: string
  footer: string
  model: string
}> = {
  gemini: {
    name: 'Google Gemini',
    icon: '🌐',
    url: 'https://aistudio.google.com/',
    tips: '💡 获取地址：https://aistudio.google.com/ (需海外网络)',
    footer: 'Google Gemini - 多模态模型，功能强大',
    model: 'gemini-1.5-flash-latest'
  },
  qwen: {
    name: '阿里云通义千问',
    icon: '🐬',
    url: 'https://dashscope.console.aliyun.com/',
    tips: '💡 获取地址：https://dashscope.console.aliyun.com/ (国内直连)',
    footer: '阿里云通义千问 Qwen-VL - 国内直连，支持支付宝/微信支付',
    model: 'qwen-vl-plus'
  },
  deepseek: {
    name: 'DeepSeek',
    icon: '🤖',
    url: 'https://platform.deepseek.com/',
    tips: '💡 获取地址：https://platform.deepseek.com/ (国内直连)',
    footer: 'DeepSeek - 国产顶尖模型，性价比极高',
    model: 'deepseek-chat'
  },
  zhipu: {
    name: '智谱AI',
    icon: '🧠',
    url: 'https://open.bigmodel.cn/',
    tips: '💡 获取地址：https://open.bigmodel.cn/ (国内直连)',
    footer: '智谱AI GLM-4V - 图像理解能力强',
    model: 'glm-4-flash'
  }
}

export default function Home() {
  const [currentProvider, setCurrentProvider] = useState('qwen')
  const [apiKey, setApiKey] = useState('')
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [currentImageBase64, setCurrentImageBase64] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [compositionalAnalysis, setCompositionalAnalysis] = useState('')
  const [lightingAnalysis, setLightingAnalysis] = useState('')
  const [styleAnalysis, setStyleAnalysis] = useState('')
  const [fullPrompt, setFullPrompt] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')

  useEffect(() => {
    const savedKey = localStorage.getItem('aiApiKey')
    const savedProvider = localStorage.getItem('aiProvider')
    if (savedKey) setApiKey(savedKey)
    if (savedProvider) setCurrentProvider(savedProvider)
  }, [])

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('aiApiKey', apiKey)
      localStorage.setItem('aiProvider', currentProvider)
      showToast('密钥已保存到本地')
    } else {
      localStorage.removeItem('aiApiKey')
      showToast('已清除密钥')
    }
  }

  const validateApiKey = async () => {
    if (!apiKey) {
      showError('请先输入API密钥')
      return
    }
    showToast('正在验证密钥...')
    try {
      const config = providerConfigs[currentProvider]
      const result = await callApi(config, apiKey, 'hello', null)
      if (result.success) {
        showToast('✅ 密钥验证成功！')
      } else {
        showError(result.error || '密钥验证失败')
      }
    } catch (err) {
      showError('网络请求失败')
    }
  }

  const showToast = (message: string) => {
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(''), 5000)
  }

  const callApi = async (
    config: typeof providerConfigs[string],
    key: string,
    prompt: string,
    imageBase64?: string
  ): Promise<{ success: boolean; data?: string; error?: string }> => {
    try {
      let url = ''
      let requestBody: any
      let headers: Record<string, string> = { 'Content-Type': 'application/json' }

      switch (currentProvider) {
        case 'gemini':
          url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${key}`
          const parts: any[] = [{ text: prompt }]
          if (imageBase64) {
            parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] } })
          }
          requestBody = { contents: [{ parts }] }
          break
        case 'qwen':
          url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
          headers.Authorization = `Bearer ${key}`
          const qwenContent: any[] = [{ type: 'text', text: prompt }]
          if (imageBase64) {
            qwenContent.unshift({ type: 'image_url', image_url: { url: imageBase64 } })
          }
          requestBody = {
            model: config.model,
            messages: [{ role: 'user', content: qwenContent }],
            max_tokens: 4096
          }
          break
        case 'deepseek':
          url = 'https://api.deepseek.com/v1/chat/completions'
          headers.Authorization = `Bearer ${key}`
          const deepseekContent: any[] = [{ type: 'text', text: prompt }]
          if (imageBase64) {
            deepseekContent.unshift({ type: 'image_url', image_url: { url: imageBase64 } })
          }
          requestBody = {
            model: config.model,
            messages: [{ role: 'user', content: deepseekContent }],
            max_tokens: 4096
          }
          break
        case 'zhipu':
          url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
          headers.Authorization = `Bearer ${key}`
          const zhipuContent: any[] = [{ type: 'text', text: prompt }]
          if (imageBase64) {
            zhipuContent.unshift({ type: 'image_url', image_url: { url: imageBase64 } })
          }
          requestBody = {
            model: config.model,
            messages: [{ role: 'user', content: zhipuContent }],
            max_tokens: 4096
          }
          break
        default:
          return { success: false, error: '不支持的API提供商' }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok || data.error || data.code) {
        return { success: false, error: data.error?.message || data.message || 'API调用失败' }
      }

      let resultText = ''
      switch (currentProvider) {
        case 'gemini':
          resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
          break
        case 'qwen':
        case 'deepseek':
        case 'zhipu':
          resultText = data.choices?.[0]?.message?.content || ''
          break
      }

      return { success: true, data: resultText }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : '网络请求失败' }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processImage(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const processImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setCurrentImage(result)
      setCurrentImageBase64(result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return
    setCurrentImage(urlInput)
    setCurrentImageBase64(urlInput)
    setError('')
    setUrlInput('')
  }

  const analyzeImage = async () => {
    if (!apiKey) {
      showError('请先输入API密钥')
      return
    }
    if (!currentImageBase64) {
      showError('请先上传或输入图片')
      return
    }

    setLoading(true)
    setError('')
    setCompositionalAnalysis('')
    setLightingAnalysis('')
    setStyleAnalysis('')
    setFullPrompt('')

    const prompt = `请分析这张图片并输出以下四个部分，每个部分用对应的标签包裹：

[COMPOSITION]
描述图片的构图方式，包括主体位置、画面布局、视觉引导线、留白处理等

[LIGHTING]
描述图片的光线特点，包括光源方向、光影对比、明暗分布、氛围营造等

[STYLE]
描述图片的艺术风格，包括色彩搭配、纹理质感、表现手法、整体氛围等

[FULL_PROMPT]
基于以上分析，生成一个完整的Midjourney提示词，包含所有关键元素，格式专业`

    try {
      const config = providerConfigs[currentProvider]
      const result = await callApi(config, apiKey, prompt, currentImageBase64)

      if (!result.success) {
        throw new Error(result.error || '分析失败')
      }

      const resultText = result.data as string
      parseResult(resultText)
    } catch (err) {
      showError(err instanceof Error ? err.message : '分析失败')
    } finally {
      setLoading(false)
    }
  }

  const parseResult = (text: string) => {
    const extractSection = (tag: string) => {
      const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[|$)`, 'i')
      const match = text.match(regex)
      return match ? match[1].trim() : ''
    }

    setCompositionalAnalysis(extractSection('COMPOSITION'))
    setLightingAnalysis(extractSection('LIGHTING'))
    setStyleAnalysis(extractSection('STYLE'))
    setFullPrompt(extractSection('FULL_PROMPT'))
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      showError('复制失败')
    }
  }

  const copyAll = () => {
    const allText = `构图分析: ${compositionalAnalysis}\n\n光线分析: ${lightingAnalysis}\n\n风格分析: ${styleAnalysis}\n\n完整提示词: ${fullPrompt}`
    copyToClipboard(allText, 'all')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-3">
            <Image className="w-10 h-10" />
            Image2Prompt
          </h1>
          <p className="text-blue-500">AI图像反推提示词工具 - 输入图片，获取专业的Midjourney提示词</p>
        </header>

        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-blue-700">API密钥管理</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(providerConfigs) as Array<keyof typeof providerConfigs>).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentProvider(key)
                  localStorage.setItem('aiProvider', key)
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-all border-2 flex items-center gap-2 ${
                  currentProvider === key
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-blue-600 border-blue-200 hover:border-blue-300'
                }`}
              >
                <span>{providerConfigs[key].icon}</span>
                <span className="text-sm">{providerConfigs[key].name}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入您的API密钥..."
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <button
                onClick={() => setApiKey('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <button
              onClick={saveApiKey}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <SaveIcon /> 保存密钥
            </button>
            <button
              onClick={validateApiKey}
              className="px-6 py-3 border border-blue-300 text-blue-600 hover:bg-blue-50 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> 验证密钥
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-600">
                <p className="font-medium mb-1">🔒 安全说明：</p>
                <ul className="space-y-1 text-blue-500">
                  <li>• 密钥仅存储在浏览器本地(localStorage)，不会上传到服务器</li>
                  <li>• 所有API调用均使用您提供的密钥进行授权</li>
                  <li>• API调用费用及额度消耗完全由您自行承担</li>
                  <li>• 请妥善保管您的API密钥，不要分享给他人</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-blue-500">{providerConfigs[currentProvider].tips}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            上传图片
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
              >
                {currentImage ? (
                  <div className="relative">
                    <img src={currentImage} alt="上传的图片" className="max-h-48 mx-auto rounded-lg object-contain" />
                    <button
                      onClick={() => {
                        setCurrentImage(null)
                        setCurrentImageBase64('')
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Image className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                    <p className="text-blue-600 mb-2">拖拽图片到这里上传</p>
                    <p className="text-blue-400 text-sm">或</p>
                    <label className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all">
                      选择本地文件
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className="text-sm text-blue-600">
                <p className="font-medium mb-2">或者通过URL上传：</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    placeholder="输入图片URL..."
                    className="flex-1 px-4 py-2 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={handleUrlSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                  >
                    加载
                  </button>
                </div>
              </div>

              <button
                onClick={analyzeImage}
                disabled={loading || !apiKey || !currentImageBase64}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    开始分析
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {(compositionalAnalysis || lightingAnalysis || styleAnalysis || fullPrompt) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-700">构图分析</h3>
                <button
                  onClick={() => copyToClipboard(compositionalAnalysis, 'composition')}
                  className="p-2 rounded-lg hover:bg-blue-100 transition-all text-blue-500"
                  title="复制"
                >
                  {copied === 'composition' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{compositionalAnalysis}</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-700">光线分析</h3>
                <button
                  onClick={() => copyToClipboard(lightingAnalysis, 'lighting')}
                  className="p-2 rounded-lg hover:bg-blue-100 transition-all text-blue-500"
                  title="复制"
                >
                  {copied === 'lighting' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{lightingAnalysis}</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-700">风格分析</h3>
                <button
                  onClick={() => copyToClipboard(styleAnalysis, 'style')}
                  className="p-2 rounded-lg hover:bg-blue-100 transition-all text-blue-500"
                  title="复制"
                >
                  {copied === 'style' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{styleAnalysis}</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-700">完整提示词</h3>
                <button
                  onClick={() => copyToClipboard(fullPrompt, 'prompt')}
                  className="p-2 rounded-lg hover:bg-blue-100 transition-all text-blue-500"
                  title="复制"
                >
                  {copied === 'prompt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-800 font-mono text-sm leading-relaxed">{fullPrompt}</p>
              </div>
            </div>
          </div>
        )}

        {(compositionalAnalysis || lightingAnalysis || styleAnalysis || fullPrompt) && (
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                <span className="text-blue-600">提示：您可以点击每个模块的复制按钮单独复制内容</span>
              </div>
              <button
                onClick={copyAll}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                复制全部内容
              </button>
            </div>
          </div>
        )}

        <footer className="text-center text-blue-400 text-sm py-4">
          {providerConfigs[currentProvider].footer}
        </footer>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(121, 195, 238, 0.15);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

function SaveIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
