// Entity exports for the shared services package
// This file exports all TypeORM entities for use across the monorepo

// Base entity
// export { BaseEntity } from './base.entity.js';

// Core entities
export { Agent } from './agent.entity.js';
export { Operation } from './operation.entity.js';
export { Persona } from './persona.entity.js';

// User System entities
export { UserEntity } from './user.entity.js';
export { RefreshTokenEntity } from './refreshToken.entity.js';
export { PasswordResetTokenEntity } from './passwordResetToken.entity.js';

// Agent System entities
export { AgentCapabilityMetric } from './agentCapabilityMetric.entity.js';
export { ToolUsageRecord } from './toolUsageRecord.entity.js';
export { ConversationContext } from './conversationContext.entity.js';

// Operation System entities
export { OperationState } from './operationState.entity.js';
export { OperationCheckpoint } from './operationCheckpoint.entity.js';
export { StepResult } from './stepResult.entity.js';
export { ApprovalWorkflow } from './approvalWorkflow.entity.js';
export { ApprovalDecision } from './approvalDecision.entity.js';

// Audit System entities
export { AuditEvent } from './auditEvent.entity.js';

// Security System entities
export { SecurityPolicy } from './securityPolicy.entity.js';

// Tool System entities
export { ToolDefinition } from './toolDefinition.entity.js';
export { ToolExecution } from './toolExecution.entity.js';

// Artifact System entities
export { Artifact } from './artifact.entity.js';
export { ArtifactReview } from './artifactReview.entity.js';
export { ArtifactDeployment } from './artifactDeployment.entity.js';

// Persona System entities
export { Discussion } from './discussion.entity.js';
export { DiscussionParticipant } from './discussionParticipant.entity.js';
export { PersonaAnalytics } from './personaAnalytics.entity.js';

// MCP Integration entities
export { MCPServer } from './mcpServer.entity.js';
export { MCPToolCall } from './mcpToolCall.entity.js';

// LLM Integration entities
export { LLMProvider } from './llmProvider.entity.js';

// Knowledge Graph entities
export { KnowledgeItemEntity } from './knowledge-item.entity.js';
export { KnowledgeRelationshipEntity } from './knowledge-relationship.entity.js';

// User LLM Integration entities
export { UserLLMProvider } from './userLLMProvider.entity.js';

// Integration Event entities
export { IntegrationEventEntity } from './integrationEvent.entity.js';

// Entity arrays for TypeORM configuration - kept for backward compatibility
export const getAllEntities = () => {
  // This function is deprecated - entities are now imported directly in typeorm.config.ts
  // Keeping for backward compatibility but not recommended for use
  throw new Error('getAllEntities is deprecated. Entities are now imported directly in TypeORM config.');
}; 