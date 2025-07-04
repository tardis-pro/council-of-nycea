import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import {
  PersonaTrait,
  ConversationalStyle,
  PersonaStatus,
  PersonaVisibility,
  PersonaValidation,
  PersonaUsageStats,
  PersonaTone,
  PersonaStyle,
  PersonaEnergyLevel
} from '@uaip/types';

// Related entities will be referenced by string to avoid circular dependencies

/**
 * Enhanced Persona Entity with comprehensive persona features and hybrid support
 * Implements the enhanced persona model from the TypeORM migration plan
 */
@Entity('personas')
@Index(['name'], { unique: true })
@Index(['status', 'visibility'])
@Index(['createdBy', 'organizationId'])
@Index(['tags'], { where: 'tags IS NOT NULL' })
@Index(['dominantExpertise'])
export class Persona extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 255 })
  role: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  background: string;

  @Column({ name: 'system_prompt', type: 'text' })
  systemPrompt: string;

  // Basic traits and expertise
  @Column({ type: 'jsonb', default: '[]' })
  traits: PersonaTrait[];

  @Column({ type: 'jsonb', default: '[]' })
  expertise: string[];

  // Advanced persona features
  @Column({ type: 'enum', enum: PersonaTone, nullable: true })
  tone?: PersonaTone;

  @Column({ type: 'enum', enum: PersonaStyle, nullable: true })
  style?: PersonaStyle;

  @Column({ name: 'energy_level', type: 'enum', enum: PersonaEnergyLevel, nullable: true })
  energyLevel?: PersonaEnergyLevel;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  chattiness?: number;

  @Column({ name: 'empathy_level', type: 'decimal', precision: 3, scale: 2, nullable: true })
  empathyLevel?: number;

  // Hybrid persona support
  @Column({ name: 'parent_personas', type: 'jsonb', nullable: true })
  parentPersonas?: string[];

  @Column({ name: 'hybrid_traits', type: 'jsonb', nullable: true })
  hybridTraits?: string[];

  @Column({ name: 'dominant_expertise', nullable: true })
  dominantExpertise?: string;

  @Column({ name: 'personality_blend', type: 'jsonb', nullable: true })
  personalityBlend?: Record<string, number>;

  // Conversational style
  @Column({ name: 'conversational_style', type: 'jsonb', nullable: true })
  conversationalStyle?: ConversationalStyle;

  // Status and visibility
  @Column({ type: 'enum', enum: PersonaStatus, default: PersonaStatus.DRAFT })
  status: PersonaStatus;

  @Column({ type: 'enum', enum: PersonaVisibility, default: PersonaVisibility.PRIVATE })
  visibility: PersonaVisibility;

  @Column({ name: 'created_by', type: 'varchar' })
  createdBy: string;

  @Column({ name: 'organization_id', type: 'varchar', nullable: true })
  organizationId?: string;

  @Column({ name: 'team_id', type: 'varchar', nullable: true })
  teamId?: string;

  @Column({ default: 1 })
  version: number;

  @Column({ name: 'parent_persona_id', type: 'varchar', nullable: true })
  parentPersonaId?: string;

  @Column({ type: 'jsonb', default: '[]' })
  tags: string[];

  // Analytics and validation
  @Column({ type: 'jsonb', nullable: true })
  validation?: PersonaValidation;

  @Column({ name: 'usage_stats', type: 'jsonb', nullable: true })
  usageStats?: PersonaUsageStats;

  @Column({ type: 'jsonb', nullable: true })
  configuration?: Record<string, any>;

  @Column({ type: 'jsonb', default: '[]' })
  capabilities: string[];

  @Column({ type: 'jsonb', nullable: true })
  restrictions?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Performance and quality metrics
  @Column({ name: 'quality_score', type: 'decimal', precision: 3, scale: 2, nullable: true })
  qualityScore?: number;

  @Column({ name: 'consistency_score', type: 'decimal', precision: 3, scale: 2, nullable: true })
  consistencyScore?: number;

  @Column({ name: 'user_satisfaction', type: 'decimal', precision: 3, scale: 2, nullable: true })
  userSatisfaction?: number;

  @Column({ name: 'total_interactions', default: 0 })
  totalInteractions: number;

  @Column({ name: 'successful_interactions', default: 0 })
  successfulInteractions: number;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @Column({ name: 'last_updated_by', type: 'varchar', nullable: true })
  lastUpdatedBy?: string;

  // Relationships
  @OneToMany('DiscussionParticipant', 'persona')
  discussionParticipants: any[];

  @OneToMany('PersonaAnalytics', 'persona')
  analytics: any[];
} 