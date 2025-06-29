import { Router, Request, Response } from 'express';
import { LLMService } from '@uaip/llm-service';
import { logger } from '@uaip/utils';

const router: Router = Router();
const llmService = LLMService.getInstance();

// Get available models from all providers
router.get('/models', async (req: Request, res: Response) => {
  try {
    const models = await llmService.getAvailableModels();

    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    logger.error('Error getting available models', { 
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to get available models',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
      return;
  }
});

// Get models from a specific provider
router.get('/models/:providerType', async (req: Request, res: Response) => {
  try {
    const { providerType } = req.params;
    const models = await llmService.getModelsFromProvider(providerType);

    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    logger.error('Error getting models from provider', { error, providerType: req.params.providerType });
    res.status(500).json({
      success: false,
      error: 'Failed to get models from provider'
    });
      return;
  }
});

// Generate LLM response
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemPrompt, maxTokens, temperature, model, preferredType } = req.body;

    if (!prompt) {
      res.status(400).json({
        success: false,
        error: 'Prompt is defined in the body'
      });
      return;
      return;
    }

    const response = await llmService.generateResponse({
      prompt,
      systemPrompt,
      maxTokens,
      temperature,
      model
    }, preferredType);

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error('Error generating LLM response', { error, body: req.body });
    res.status(500).json({
      success: false,
      error: 'Failed to generate response'
    });
      return;
  }
});

// Generate agent response
router.post('/agent-response', async (req: Request, res: Response) => {
  try {
    const { agent, messages, context, tools } = req.body;

    if (!agent || !messages) {
      res.status(400).json({
        success: false,
        error: 'Agent and messages are required'
      });
      return;
      return;
    }

    const response = await llmService.generateAgentResponse({
      agent,
      messages,
      context,
      tools
    });

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error('Error generating agent response', { error, body: req.body });
    res.status(500).json({
      success: false,
      error: 'Failed to generate agent response'
    });
      return;
  }
});

// Generate artifact
router.post('/artifact', async (req: Request, res: Response) => {
  try {
    const { type, prompt, language, framework, requirements } = req.body;

    if (!type || !prompt) {
      res.status(400).json({
        success: false,
        error: 'Type and prompt are required'
      });
      return;
      return;
    }

    const response = await llmService.generateArtifact({
      type,
      context: prompt,
      language,
      requirements,
      constraints: []
    });

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error('Error generating artifact', { error, body: req.body });
    res.status(500).json({
      success: false,
      error: 'Failed to generate artifact'
    });
      return;
  }
});

// Analyze context
router.post('/analyze-context', async (req: Request, res: Response) => {
  try {
    const { conversationHistory, currentContext, userRequest, agentCapabilities } = req.body;

    if (!conversationHistory) {
      res.status(400).json({
        success: false,
        error: 'Messages are required'
      });
      return;
      return;
    }

    const response = await llmService.analyzeContext({
      conversationHistory,
      currentContext,
      userRequest,
      agentCapabilities
    });

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error('Error analyzing context', { error, body: req.body });
    res.status(500).json({
      success: false,
      error: 'Failed to analyze context'
    });
      return;
  }
});

// Get provider statistics
router.get('/providers/stats', async (req: Request, res: Response) => {
  try {
    const stats = await llmService.getProviderStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting provider stats', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to get provider statistics'
    });
      return;
  }
});

// Get all configured providers
router.get('/providers', async (req: Request, res: Response) => {
  try {
    const providers = await llmService.getConfiguredProviders();
    const healthResults = await llmService.checkProviderHealth();

    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    logger.error('Error getting configured providers', { 
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to get configured providers',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
      return;
  }
});

// Check provider health
router.get('/providers/health', async (req: Request, res: Response) => {
  try {
    const healthResults = await llmService.checkProviderHealth();

    res.json({
      success: true,
      data: healthResults
    });
  } catch (error) {
    logger.error('Error checking provider health', { 
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to check provider health',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
      return;
  }
});

export default router; 