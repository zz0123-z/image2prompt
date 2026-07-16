import express, { type Request, type Response } from 'express'

const router = express.Router()

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { provider, apiKey, imageBase64, prompt } = req.body

    if (!provider || !apiKey || !imageBase64 || !prompt) {
      return res.status(400).json({ success: false, error: '缺少必要参数' })
    }

    const providers: Record<string, { url: string; model: string }> = {
      gemini: {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        model: 'gemini-1.5-flash-latest'
      },
      qwen: {
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen-vl-plus'
      },
      deepseek: {
        url: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat'
      },
      zhipu: {
        url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4-flash'
      }
    }

    const config = providers[provider]
    if (!config) {
      return res.status(400).json({ success: false, error: '不支持的API提供商' })
    }

    let requestBody: any
    let headers: Record<string, string> = { 'Content-Type': 'application/json' }

    switch (provider) {
      case 'gemini':
        requestBody = {
          contents: [{
            parts: [
              { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] } },
              { text: prompt }
            ]
          }]
        }
        break
      case 'qwen':
        headers.Authorization = `Bearer ${apiKey}`
        requestBody = {
          model: config.model,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageBase64 } },
              { type: 'text', text: prompt }
            ]
          }],
          max_tokens: 4096
        }
        break
      case 'deepseek':
        headers.Authorization = `Bearer ${apiKey}`
        requestBody = {
          model: config.model,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageBase64 } },
              { type: 'text', text: prompt }
            ]
          }],
          max_tokens: 4096
        }
        break
      case 'zhipu':
        headers.Authorization = `Bearer ${apiKey}`
        requestBody = {
          model: config.model,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageBase64 } },
              { type: 'text', text: prompt }
            ]
          }],
          max_tokens: 4096
        }
        break
      default:
        return res.status(400).json({ success: false, error: '不支持的API提供商' })
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: data.error?.message || data.message || 'API调用失败' })
    }

    let resultText = ''
    switch (provider) {
      case 'gemini':
        resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        break
      case 'qwen':
        resultText = data.choices?.[0]?.message?.content || ''
        break
      case 'deepseek':
        resultText = data.choices?.[0]?.message?.content || ''
        break
      case 'zhipu':
        resultText = data.choices?.[0]?.message?.content || ''
        break
    }

    res.json({ success: true, data: resultText })
  } catch (error) {
    console.error('分析错误:', error)
    res.status(500).json({ success: false, error: '服务器内部错误' })
  }
})

router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { provider, apiKey } = req.body

    if (!provider || !apiKey) {
      return res.status(400).json({ success: false, error: '缺少必要参数' })
    }

    const providers: Record<string, { url: string; model: string }> = {
      gemini: {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        model: 'gemini-1.5-flash-latest'
      },
      qwen: {
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen-turbo'
      },
      deepseek: {
        url: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat'
      },
      zhipu: {
        url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4-flash'
      }
    }

    const config = providers[provider]
    if (!config) {
      return res.status(400).json({ success: false, error: '不支持的API提供商' })
    }

    let requestBody: any
    let headers: Record<string, string> = { 'Content-Type': 'application/json' }

    switch (provider) {
      case 'gemini':
        requestBody = {
          contents: [{ parts: [{ text: 'hello' }] }]
        }
        break
      case 'qwen':
        headers.Authorization = `Bearer ${apiKey}`
        requestBody = {
          model: config.model,
          messages: [{ role: 'user', content: 'hello' }],
          max_tokens: 10
        }
        break
      case 'deepseek':
        headers.Authorization = `Bearer ${apiKey}`
        requestBody = {
          model: config.model,
          messages: [{ role: 'user', content: 'hello' }],
          max_tokens: 10
        }
        break
      case 'zhipu':
        headers.Authorization = `Bearer ${apiKey}`
        requestBody = {
          model: config.model,
          messages: [{ role: 'user', content: 'hello' }],
          max_tokens: 10
        }
        break
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (!response.ok || data.error || data.code) {
      return res.status(200).json({ success: false, valid: false, message: data.error?.message || data.message || '密钥无效' })
    }

    res.json({ success: true, valid: true, message: '密钥验证成功' })
  } catch (error) {
    console.error('验证错误:', error)
    res.status(200).json({ success: false, valid: false, message: '网络请求失败' })
  }
})

export default router
