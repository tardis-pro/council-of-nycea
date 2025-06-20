// Re-export types needed by entities
export { SecurityLevel } from '@uaip/types';

// Database Services
export { DatabaseService } from './databaseService.js';
export { TypeOrmService, typeormService } from './typeormService.js';

// All Database-related exports (TypeORM, services, types)
export * from './database/index.js';

// TypeORM Entities

// Agent Intelligence Services  
export { AgentIntelligenceService } from './agentIntelligenceService.js';
export { CapabilityDiscoveryService } from './capabilityDiscoveryService.js';
export { SecurityValidationService } from './securityValidationService.js';

// Communication Services
export { EventBusService } from './eventBusService.js';

// State Management Services
export { StateManagerService } from './stateManagerService.js';

// Workflow Services
export { StepExecutorService } from './stepExecutorService.js';
export { CompensationService } from './compensationService.js';
export { ResourceManagerService } from './resourceManagerService.js';

// Persona and Discussion Services - NEW
export { PersonaService } from './personaService.js';
export { DiscussionService } from './discussionService.js';

// Tool Services - NEW
export type { 
} from './database/toolDatabase.js';
export type { 
  
  ToolRelationship,
  ToolRecommendation,
  UsagePattern
} from './database/toolGraphDatabase.js';

// Knowledge Graph Services - NEW
export * from './knowledge-graph/index.js';

// Agent Memory Services - NEW
export * from './agent-memory/index.js'; 
// export { EnhancedAgentIntelligenceService } from './enhanced-agent-intelligence.service.js';